import Constants from "expo-constants";

type PublicEnv = {
  supabaseUrl: string;
  supabaseAnonKey: string;
  stripePublishableKey?: string;
  billingApiUrl?: string;
};

function readExtra() {
  return (Constants.expoConfig?.extra ?? {}) as Record<string, string | undefined>;
}

export function getPublicEnv(): PublicEnv {
  const extra = readExtra();
  const supabaseUrl = extra.EXPO_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = extra.EXPO_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Faltan EXPO_PUBLIC_SUPABASE_URL y EXPO_PUBLIC_SUPABASE_ANON_KEY en app.json > expo.extra.",
    );
  }
  return {
    supabaseUrl,
    supabaseAnonKey,
    stripePublishableKey: extra.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    billingApiUrl: extra.EXPO_PUBLIC_BILLING_API_URL,
  };
}
