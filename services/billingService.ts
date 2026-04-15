import * as Linking from "expo-linking";

import { getPublicEnv } from "@/lib/env";
import { supabase } from "@/lib/supabase";

type BillingSessionResponse = {
  url: string;
};

async function requireBillingApiUrl() {
  const { billingApiUrl } = getPublicEnv();
  if (!billingApiUrl) {
    throw new Error("Falta EXPO_PUBLIC_BILLING_API_URL en app.json > expo.extra.");
  }
  return billingApiUrl;
}

export async function openBillingPortal() {
  const billingApiUrl = await requireBillingApiUrl();
  const session = await supabase.auth.getSession();
  const token = session.data.session?.access_token;
  if (!token) throw new Error("Sesión no encontrada.");

  const response = await fetch(`${billingApiUrl}/billing/portal`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("No se pudo abrir el portal de suscripción.");
  }
  const data = (await response.json()) as BillingSessionResponse;
  await Linking.openURL(data.url);
}

export async function startCheckout(planTier: "pro") {
  const billingApiUrl = await requireBillingApiUrl();
  const session = await supabase.auth.getSession();
  const token = session.data.session?.access_token;
  if (!token) throw new Error("Sesión no encontrada.");

  const response = await fetch(`${billingApiUrl}/billing/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ planTier }),
  });
  if (!response.ok) {
    throw new Error("No se pudo iniciar el checkout.");
  }
  const data = (await response.json()) as BillingSessionResponse;
  await Linking.openURL(data.url);
}
