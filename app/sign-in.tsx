import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { Alert, Pressable, TextInput } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    try {
      setLoading(true);

      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      Alert.alert("Cuenta creada", "Ahora puedes iniciar sesión");
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <ThemedText type="title">💊 Pastillas App</ThemedText>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{ marginTop: 20, borderBottomWidth: 1, padding: 8 }}
      />

      <TextInput
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ marginTop: 20, borderBottomWidth: 1, padding: 8 }}
      />

      <Pressable
        onPress={handleLogin}
        style={{ marginTop: 30, backgroundColor: "#007AFF", padding: 12 }}
      >
        <ThemedText style={{ color: "#fff", textAlign: "center" }}>
          {loading ? "Cargando..." : "Iniciar sesión"}
        </ThemedText>
      </Pressable>

      <Pressable onPress={handleRegister} style={{ marginTop: 20 }}>
        <ThemedText style={{ textAlign: "center" }}>Crear cuenta</ThemedText>
      </Pressable>
    </ThemedView>
  );
}
