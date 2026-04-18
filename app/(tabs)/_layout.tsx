import { useAuth } from "@/context/AuthContext";
import { Redirect, Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
  const { user, loading } = useAuth();

  // 🔥 ESPERAR AUTH
  if (loading) return null;

  // 🔥 BLOQUEO REAL
  if (!user) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: "Inicio" }} />
      <Tabs.Screen name="create" options={{ title: "Crear" }} />
      <Tabs.Screen name="stats" options={{ title: "Estadísticas" }} />
      <Tabs.Screen name="profile" options={{ title: "Perfil" }} />
    </Tabs>
  );
}
