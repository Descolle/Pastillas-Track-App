import { useState } from "react";
import { Alert, Pressable, TextInput } from "react-native";
import { router } from "expo-router";

import { supabase } from "@/lib/supabase";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (loading) return;

    try {
      setLoading(true);

      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) throw error;

      router.replace("/(tabs)");
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <ThemedText type="title">💊 RecuerdaMed</ThemedText>

      <TextInput
        placeholder="Email"
        value={email}
        autoCapitalize="none"
        onChangeText={setEmail}
        style={{ marginTop: 20, borderBottomWidth: 1, padding: 10 }}
      />

      <TextInput
        placeholder="Contraseña"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
        style={{ marginTop: 20, borderBottomWidth: 1, padding: 10 }}
      />

      <Pressable
        onPress={handleLogin}
        style={{
          marginTop: 30,
          backgroundColor: "#007AFF",
          padding: 14,
          borderRadius: 10,
        }}
      >
        <ThemedText style={{ color: "#fff", textAlign: "center" }}>
          {loading ? "Ingresando..." : "Iniciar sesión"}
        </ThemedText>
      </Pressable>

      {/* 🔥 IR A REGISTRO */}
      <Pressable onPress={() => router.push("/sign-up")} style={{ marginTop: 20 }}>
        <ThemedText style={{ textAlign: "center" }}>
          ¿No tienes cuenta? Crear cuenta
        </ThemedText>
      </Pressable>
    </ThemedView>
  );
}
