import { AuthProvider, useAuth } from "@/context/AuthContext";
import { MedicationProvider } from "@/context/MedicationContext";
import { SettingsProvider } from "@/context/SettingsContext";
import { useTermsAgreement } from "@/hooks/use-terms-agreement";
import { supabase } from "@/lib/supabase";
import { initNotifications, requestPermissions } from "@/utils/notification";
import * as Linking from "expo-linking";
import { router, Stack } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

function getLinkParams(url: string) {
  const params = new URLSearchParams();
  const query = url.includes("?") ? url.split("?")[1].split("#")[0] : "";
  const fragment = url.includes("#") ? url.split("#")[1] : "";

  for (const part of [query, fragment]) {
    if (!part) continue;
    const searchParams = new URLSearchParams(part);
    searchParams.forEach((value, key) => params.set(key, value));
  }

  return params;
}

function AppStack() {
  const { loading, user } = useAuth();
  const { termsChecked, loading: termsLoading } = useTermsAgreement();

  // 🔥 SOLO UNA VEZ
  useEffect(() => {
    initNotifications();
    requestPermissions();
  }, []);

  useEffect(() => {
    const handleRecoveryLink = async (url: string) => {
      if (!url.includes("reset-password")) return;

      const params = getLinkParams(url);
      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");
      const code = params.get("code");

      try {
        if (accessToken && refreshToken) {
          await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
        } else if (code) {
          await supabase.auth.exchangeCodeForSession(code);
        }
      } finally {
        router.replace("/reset-password" as never);
      }
    };

    Linking.getInitialURL().then((url) => {
      if (url) handleRecoveryLink(url);
    });

    const subscription = Linking.addEventListener("url", ({ url }) => {
      handleRecoveryLink(url);
    });

    return () => subscription.remove();
  }, []);

  // ⏳ loading global (evita flicker / errores)
  if (loading || termsLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <MedicationProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="forgot-password" />
        <Stack.Screen name="reset-password" />

        {/* 🧾 Terms SIEMPRE primero */}
        {!termsChecked && <Stack.Screen name="terms" />}

        {/* 🔐 Auth */}
        {!user && (
          <>
            <Stack.Screen name="sign-in" />
            <Stack.Screen name="sign-up" />
          </>
        )}

        {/* 📱 App */}
        {user && termsChecked && (
          <>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="delete-account" />
            <Stack.Screen name="paywall" />
          </>
        )}
      </Stack>
    </MedicationProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <AppStack />
      </SettingsProvider>
    </AuthProvider>
  );
}
