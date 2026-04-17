import { Stack } from "expo-router";

import { AuthProvider, useAuth } from "@/context/AuthContext";
import { MedicationProvider } from "@/context/MedicationContext";

function AppStack() {
  const { loading, user } = useAuth();

  if (loading) return null;

  return (
    <MedicationProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* 🔓 NO autenticado */}
        <Stack.Protected guard={!user}>
          <Stack.Screen name="sign-in" />
          <Stack.Screen name="sign-up" />
        </Stack.Protected>

        {/* 🔐 autenticado */}
        <Stack.Protected guard={!!user}>
          <Stack.Screen name="(tabs)" />
        </Stack.Protected>
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
