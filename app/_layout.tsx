import { Stack } from "expo-router";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { MedicationProvider } from "@/context/MedicationContext";

function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
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
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <MedicationProvider>
        <AppNavigator />
      </MedicationProvider>
    </AuthProvider>
  );
}
