import { Stack } from "expo-router";
import { useEffect } from "react";

import { AuthProvider, useAuth } from "@/context/AuthContext";
import { MedicationProvider } from "@/context/MedicationContext";
import { requestPermissions } from "@/utils/notification";

// 🔒 navegación protegida
function AppStack() {
  const { loading, user } = useAuth();

  if (loading) return null;

  return (
    <MedicationProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {!user ? (
          <>
            <Stack.Screen name="sign-in" />
            <Stack.Screen name="sign-up" />
          </>
        ) : (
          <Stack.Screen name="(tabs)" />
        )}
      </Stack>
    </MedicationProvider>
  );
}

// 🌍 raíz de la app
export default function RootLayout() {
  useEffect(() => {
    requestPermissions();
    console.log("🔥 ROOT MOUNTED");
  }, []);

  return (
    <AuthProvider>
      <AppStack />
    </AuthProvider>
  );
}
