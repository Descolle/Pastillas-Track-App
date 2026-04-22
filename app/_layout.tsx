import { AuthProvider, useAuth } from "@/context/AuthContext";
import { MedicationProvider } from "@/context/MedicationContext";
import { useTermsAgreement } from "@/hooks/use-terms-agreement";
import { initNotifications, requestPermissions } from "@/utils/notification";
import { Stack } from "expo-router";
import { useEffect } from "react";

function AppStack() {
  const { loading, user } = useAuth();
  const { termsChecked, loading: termsLoading } = useTermsAgreement();

  useEffect(() => {
    requestPermissions();
  }, []);
  
useEffect(() => {
  initNotifications(); // 👈 IMPORTANTE
  requestPermissions();
}, []);

  return (
    <MedicationProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* ⚠️ SIEMPRE define todas las pantallas */}
        <Stack.Screen name="terms" />
        <Stack.Screen name="sign-in" />
        <Stack.Screen name="sign-up" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="delete-account" />
        <Stack.Screen name="paywall" />
      </Stack>
    </MedicationProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppStack />
    </AuthProvider>
  );
}
