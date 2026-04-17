import { useAuth } from "@/context/AuthContext";
import { Pressable } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export default function Profile() {
  const { user, signOut } = useAuth();

  return (
    <ThemedView style={{ flex: 1, padding: 20 }}>
      <ThemedText type="title">👤 RecuerdaMed</ThemedText>

      <ThemedText style={{ marginTop: 10, opacity: 0.6 }}>Cuenta</ThemedText>

      <ThemedText style={{ marginTop: 4 }}>{user?.email}</ThemedText>

      <Pressable
        onPress={signOut}
        style={{
          marginTop: 40,
          backgroundColor: "red",
          padding: 14,
          borderRadius: 12,
        }}
      >
        <ThemedText style={{ color: "#fff", textAlign: "center" }}>
          Cerrar sesión
        </ThemedText>
      </Pressable>
    </ThemedView>
  );
}
