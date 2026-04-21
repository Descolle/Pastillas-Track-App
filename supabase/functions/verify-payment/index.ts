// @ts-ignore - Deno modules not available in main TS config
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-ignore - Deno modules not available in main TS config
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// @ts-ignore - Deno types not available in main TS config
serve(async (req: Request) => {
  try {
    // 🔐 solo permitir POST
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
      });
    }

    const { userId, productId, transactionId } = await req.json();

    if (!userId || !transactionId) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 },
      );
    }

    // cliente admin (service role)
    // @ts-ignore - Deno global not available in main TS config
    const supabase = createClient(
      // @ts-ignore - Deno global not available in main TS config
      Deno.env.get("SUPABASE_URL")!,
      // @ts-ignore - Deno global not available in main TS config
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // 1. verificar si ya existe la transacción
    const { data: existingPayment, error: existingError } = await supabase
      .from("payments")
      .select("id")
      .eq("transaction_id", transactionId)
      .maybeSingle();

    if (existingError) throw existingError;

    if (existingPayment) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "Payment already processed",
        }),
        { status: 200 },
      );
    }

    // 💾 2. guardar pago
    const { error: insertError } = await supabase.from("payments").insert({
      user_id: userId,
      product_id: productId,
      transaction_id: transactionId,
      platform: "android",
    });

    if (insertError) throw insertError;

    // 🚀 3. activar plan PRO
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ plan: "pro" })
      .eq("id", userId);

    if (updateError) throw updateError;

    return new Response(
      JSON.stringify({
        success: true,
        upgraded: true,
      }),
      { status: 200 },
    );
  } catch (error) {
    console.error("verify-payment error:", error);

    return new Response(
      JSON.stringify({
        error: (error as Error).message || "Unknown error",
      }),
      { status: 500 },
    );
  }
});
