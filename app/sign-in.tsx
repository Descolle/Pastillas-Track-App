import { router } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, TextInput, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { supabase } from "@/lib/supabase";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const inputStyle = {
    marginTop: 18,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    color: "#111111",
    fontSize: 16,
  } as const;

  const handleLogin = async () => {
    if (loading) return;

    try {
      setLoading(true);

      const { error, data } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) throw error;

      console.log("Login successful:", data);
      console.log("Session:", data.session);
      console.log("User:", data.user);

      // Add a small delay to ensure session is properly set
      await new Promise(resolve => setTimeout(resolve, 500));
      
      router.replace("/(tabs)");
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView
      style={{ flex: 1, justifyContent: "center", padding: 24 }}
      lightColor="#123B6A"
      darkColor="#0B2440"
    >
      <View
        style={{
          backgroundColor: "rgba(255,255,255,0.08)",
          borderRadius: 24,
          padding: 24,
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.18)",
        }}
      >
        <ThemedText type="title" style={{ color: "#FFFFFF" }}>
          RecuerdaMed
        </ThemedText>

        <ThemedText style={{ color: "rgba(255,255,255,0.82)", marginTop: 10 }}>
          Ingresa para revisar tus medicamentos y recordatorios del dia.
        </ThemedText>

        <TextInput
          placeholder="Email"
          placeholderTextColor="#6B7280"
          value={email}
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={setEmail}
          style={inputStyle}
        />

        <TextInput
          placeholder="Contrasena"
          placeholderTextColor="#6B7280"
          value={password}
          secureTextEntry
          onChangeText={setPassword}
          style={inputStyle}
        />

        <Pressable
          onPress={handleLogin}
          style={{
            marginTop: 28,
            backgroundColor: "#FFFFFF",
            paddingVertical: 15,
            borderRadius: 14,
          }}
        >
          <ThemedText
            style={{
              color: "#123B6A",
              textAlign: "center",
              fontWeight: "700",
            }}
          >
            {loading ? "Ingresando..." : "Iniciar sesion"}
          </ThemedText>
        </Pressable>

        <Pressable
          onPress={() => router.push("/sign-up")}
          style={{ marginTop: 18 }}
        >
          <ThemedText style={{ textAlign: "center", color: "#FFFFFF" }}>
            No tienes cuenta? Crear cuenta
          </ThemedText>
        </Pressable>
      </View>
    </ThemedView>
  );
}
