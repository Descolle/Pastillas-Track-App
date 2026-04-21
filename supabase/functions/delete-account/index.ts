// @ts-ignore - Deno modules not available in main TS config
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-ignore - Deno modules not available in main TS config
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Origin": "*",
};

// @ts-ignore - Deno types not available in main TS config
serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      headers: corsHeaders,
      status: 405,
    });
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(
      JSON.stringify({ error: "Missing Authorization header" }),
      {
        headers: corsHeaders,
        status: 401,
      },
    );
  }

  try {
    const supabaseUrl =
      // @ts-ignore - Deno global not available in main TS config
      Deno.env.get("SUPABASE_URL") ?? "";
    const serviceRoleKey =
      // @ts-ignore - Deno global not available in main TS config
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    const token = authHeader.replace("Bearer ", "");
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    const {
      data: { user },
      error: userError,
    } = await adminClient.auth.getUser(token);

    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        headers: corsHeaders,
        status: 401,
      });
    }

    const { error: deleteError } = await adminClient.auth.admin.deleteUser(
      user.id,
    );

    if (deleteError) {
      throw deleteError;
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: corsHeaders,
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: (error as Error).message ?? "Unknown error",
      }),
      {
        headers: corsHeaders,
        status: 500,
      },
    );
  }
});
