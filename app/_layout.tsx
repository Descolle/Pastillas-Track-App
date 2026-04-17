import { Stack } from "expo-router";

import { AuthProvider, useAuth } from "@/context/AuthContext";
import { MedicationProvider } from "@/context/MedicationContext";

function AppStack() {
  const { loading, user } = useAuth();

  // 🔥 loader real
  if (loading) return null;

  return (
    <MedicationProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* 👇 NO LOGEADO */}
        {!user ? (
          <Stack.Screen name="sign-in" />
        ) : (
          <Stack.Screen name="(tabs)" />
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
