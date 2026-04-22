import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Pressable, TextInput, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { supabase } from "@/lib/supabase";

const REMEMBER_ME_KEY = "remember_me_credentials";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const inputStyle = {
    marginTop: 18,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    color: "#111111",
    fontSize: 16,
  } as const;

  // Load saved credentials on component mount
  useEffect(() => {
    const loadSavedCredentials = async () => {
      try {
        const saved = await AsyncStorage.getItem(REMEMBER_ME_KEY);
        if (saved) {
          const credentials = JSON.parse(saved);
          setEmail(credentials.email || "");
          setPassword(credentials.password || "");
          setRememberMe(true);
          
          // Auto-login if credentials are saved
          await handleAutoLogin(credentials.email, credentials.password);
        }
      } catch (error) {
        console.log("Error loading saved credentials:", error);
      }
    };

    loadSavedCredentials();
  }, []);

  const handleAutoLogin = async (savedEmail: string, savedPassword: string) => {
    if (!savedEmail || !savedPassword) return;

    try {
      setLoading(true);
      const { error, data } = await supabase.auth.signInWithPassword({
        email: savedEmail.trim(),
        password: savedPassword,
      });

      if (error) throw error;

      console.log("Auto-login successful:", data);
      router.replace("/(tabs)");
    } catch (err: any) {
      console.log("Auto-login failed:", err.message);
      // Clear invalid credentials
      await AsyncStorage.removeItem(REMEMBER_ME_KEY);
      setRememberMe(false);
    } finally {
      setLoading(false);
    }
  };

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

      // Save credentials if remember me is checked
      if (rememberMe) {
        try {
          await AsyncStorage.setItem(REMEMBER_ME_KEY, JSON.stringify({
            email: email.trim(),
            password: password,
          }));
        } catch (error) {
          console.log("Error saving credentials:", error);
        }
      } else {
        // Clear credentials if remember me is unchecked
        try {
          await AsyncStorage.removeItem(REMEMBER_ME_KEY);
        } catch (error) {
          console.log("Error clearing credentials:", error);
        }
      }
      
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

        {/* Remember Me Checkbox */}
        <Pressable
          onPress={() => setRememberMe(!rememberMe)}
          style={{
            marginTop: 16,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: 20,
              height: 20,
              borderWidth: 2,
              borderColor: rememberMe ? "#FFFFFF" : "rgba(255,255,255,0.5)",
              borderRadius: 4,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: rememberMe ? "#FFFFFF" : "transparent",
            }}
          >
            {rememberMe && (
              <ThemedText style={{ color: "#123B6A", fontSize: 12, fontWeight: "bold" }}>
                ×
              </ThemedText>
            )}
          </View>
          <ThemedText
            style={{
              marginLeft: 8,
              color: "rgba(255,255,255,0.9)",
              fontSize: 14,
            }}
          >
            Recordarme
          </ThemedText>
        </Pressable>

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
