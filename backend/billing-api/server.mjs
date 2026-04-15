import express from "express";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const app = express();
app.use((req, res, next) => {
  if (req.path === "/billing/webhook") return next();
  return express.json()(req, res, next);
});

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL ?? "",
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
);

const priceByTier = {
  pro: process.env.STRIPE_PRICE_PRO ?? "",
};

async function getUserFromToken(authHeader) {
  const token = authHeader?.replace("Bearer ", "");
  if (!token) return null;
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error) return null;
  return data.user;
}

app.post("/billing/checkout", async (req, res) => {
  try {
    const user = await getUserFromToken(req.headers.authorization);
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    const tier = req.body.planTier;
    const price = priceByTier[tier];
    if (!price) return res.status(400).json({ error: "Unknown tier" });

    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: profile?.stripe_customer_id ?? undefined,
      customer_email: user.email ?? undefined,
      line_items: [{ price, quantity: 1 }],
      success_url: process.env.STRIPE_SUCCESS_URL ?? "https://example.com/success",
      cancel_url: process.env.STRIPE_CANCEL_URL ?? "https://example.com/cancel",
      metadata: { userId: user.id, planTier: tier },
    });
    return res.json({ url: session.url });
  } catch (error) {
    return res.status(500).json({ error: String(error) });
  }
});

app.post("/billing/portal", async (req, res) => {
  try {
    const user = await getUserFromToken(req.headers.authorization);
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single();
    if (!profile?.stripe_customer_id) {
      return res.status(400).json({ error: "No stripe customer for user" });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: process.env.STRIPE_PORTAL_RETURN_URL ?? "https://example.com/account",
    });
    return res.json({ url: session.url });
  } catch (error) {
    return res.status(500).json({ error: String(error) });
  }
});

app.post("/billing/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const signature = req.headers["stripe-signature"];
  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET ?? "",
    );

    if (event.type === "customer.subscription.updated") {
      const subscription = event.data.object;
      const userId = subscription.metadata?.userId;
      const planTier = subscription.metadata?.planTier ?? "free";
      if (userId) {
        await supabaseAdmin.rpc("apply_subscription_update", {
          p_user_id: userId,
          p_plan_tier: planTier,
          p_subscription_status: subscription.status,
          p_stripe_customer_id: subscription.customer,
        });
      }
    }

    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object;
      const userId = subscription.metadata?.userId;
      if (userId) {
        await supabaseAdmin.rpc("apply_subscription_update", {
          p_user_id: userId,
          p_plan_tier: "free",
          p_subscription_status: "canceled",
          p_stripe_customer_id: subscription.customer,
        });
      }
    }

    return res.sendStatus(200);
  } catch (error) {
    return res.status(400).send(`Webhook Error: ${String(error)}`);
  }
});

const port = Number(process.env.PORT ?? 4000);
app.listen(port, () => {
  console.log(`Billing API running on :${port}`);
});
