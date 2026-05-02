import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, TextInput, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { supabase } from "@/lib/supabase";

const REMEMBER_ME_KEY = "remember_me_credentials";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

  const handleUpdatePassword = async () => {
    if (password.length < 6) {
      Alert.alert("Error", "La contrasena debe tener al menos 6 caracteres");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contrasenas no coinciden");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      await AsyncStorage.removeItem(REMEMBER_ME_KEY);
      await supabase.auth.signOut();

      Alert.alert(
        "Contrasena actualizada",
        "Ya puedes iniciar sesion con tu nueva contrasena.",
        [{ text: "OK", onPress: () => router.replace("/sign-in") }],
      );
    } catch (error: any) {
      Alert.alert("Error", error.message || "No se pudo actualizar");
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
          Nueva contrasena
        </ThemedText>

        <ThemedText style={{ color: "rgba(255,255,255,0.82)", marginTop: 10 }}>
          Crea una nueva contrasena para volver a entrar a tu cuenta.
        </ThemedText>

        <TextInput
          placeholder="Nueva contrasena"
          placeholderTextColor="#6B7280"
          value={password}
          secureTextEntry
          onChangeText={setPassword}
          style={inputStyle}
        />

        <TextInput
          placeholder="Confirmar contrasena"
          placeholderTextColor="#6B7280"
          value={confirmPassword}
          secureTextEntry
          onChangeText={setConfirmPassword}
          style={inputStyle}
        />

        <Pressable
          onPress={handleUpdatePassword}
          disabled={loading}
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
            {loading ? "Guardando..." : "Guardar nueva contrasena"}
          </ThemedText>
        </Pressable>
      </View>
    </ThemedView>
  );
}
