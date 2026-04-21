import { AuthProvider, useAuth } from "@/context/AuthContext";
import { MedicationProvider } from "@/context/MedicationContext";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { requestPermissions } from "@/utils/notification";

function AppStack() {
  const { loading, user } = useAuth();

  useEffect(() => {
    requestPermissions();
  }, []);

  if (loading) return null;

  return (
    <MedicationProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="legal" />
        {!user ? (
          <>
            <Stack.Screen name="sign-in" />
            <Stack.Screen name="sign-up" />
          </>
        ) : (
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
      <AppStack />
    </AuthProvider>
  );
}
