import { AuthProvider, useAuth } from "@/context/AuthContext";
import { MedicationProvider } from "@/context/MedicationContext";
import { SettingsProvider } from "@/context/SettingsContext";
import { useTermsAgreement } from "@/hooks/use-terms-agreement";
import { initNotifications, requestPermissions } from "@/utils/notification";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

function AppStack() {
  const { loading, user } = useAuth();
  const { termsChecked, loading: termsLoading } = useTermsAgreement();

  // 🔥 SOLO UNA VEZ
  useEffect(() => {
    initNotifications();
    requestPermissions();
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
