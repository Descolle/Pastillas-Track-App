import { useState } from "react";
import { Alert, Pressable, StyleSheet, TextInput, View } from "react-native";
import { Redirect } from "expo-router";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/context/AuthContext";
import { useThemeColor } from "@/hooks/use-theme-color";

export default function SignInScreen() {
  const { session, signIn, signUp } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const textColor = useThemeColor({}, "text");
  const borderColor = useThemeColor({ light: "#D0D0D0", dark: "#444" }, "icon");
  const cardColor = useThemeColor({ light: "#FFFFFF", dark: "#1E1E1E" }, "background");

  if (session) {
    return <Redirect href="/(tabs)" />;
  }

  const submit = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Completa los campos", "Email y contraseña son obligatorios.");
      return;
    }
    setLoading(true);
    try {
      if (isRegister) {
        await signUp(email.trim(), password);
        Alert.alert("Cuenta creada", "Si tu proyecto usa confirmación por email, revisa tu bandeja.");
      } else {
        await signIn(email.trim(), password);
      }
    } catch (error) {
      Alert.alert("Error de autenticación", String(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.root} lightColor="#F2F2F7">
      <View style={[styles.card, { backgroundColor: cardColor, borderColor }]}>
        <ThemedText type="title" style={styles.title}>
          Pastillas SaaS
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Inicia sesión para sincronizar tus recordatorios entre dispositivos.
        </ThemedText>

        <TextInput
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="email@dominio.com"
          placeholderTextColor="#8E8E93"
          style={[styles.input, { color: textColor, borderColor }]}
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Contraseña"
          placeholderTextColor="#8E8E93"
          style={[styles.input, { color: textColor, borderColor }]}
        />

        <Pressable style={styles.primaryBtn} onPress={submit} disabled={loading}>
          <ThemedText style={styles.primaryText}>
            {loading ? "Procesando..." : isRegister ? "Crear cuenta" : "Entrar"}
          </ThemedText>
        </Pressable>

        <Pressable onPress={() => setIsRegister((prev) => !prev)} style={styles.linkWrap}>
          <ThemedText type="link">
            {isRegister
              ? "¿Ya tienes cuenta? Inicia sesión"
              : "¿No tienes cuenta? Regístrate"}
          </ThemedText>
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  card: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 18,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 18,
    opacity: 0.9,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
  },
  primaryBtn: {
    backgroundColor: "#0A84FF",
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 6,
  },
  primaryText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
  },
  linkWrap: {
    marginTop: 12,
    alignSelf: "center",
  },
});
