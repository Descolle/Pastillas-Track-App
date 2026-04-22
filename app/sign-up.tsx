import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { supabase } from "@/lib/supabase";

export default function SignUp() {
  const router = useRouter();
  const [fechaNacimiento, setFechaNacimiento] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [genero, setGenero] = useState("");
  const [loading, setLoading] = useState(false);

  const inputStyle = {
    marginTop: 14,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    color: "#111111",
    fontSize: 16,
  } as const;

  const handleSignUp = async () => {
    if (
      !nombre ||
      !apellido ||
      !email ||
      !confirmEmail ||
      !password ||
      !fechaNacimiento ||
      !genero
    ) {
      Alert.alert("Error", "Completa todos los campos");
      return;
    }

    if (email !== confirmEmail) {
      Alert.alert("Error", "Los correos no coinciden");
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (error) throw error;

      const userId = data.user?.id;

      if (!userId) {
        throw new Error("No se pudo obtener el usuario");
      }

      const { error: profileError } = await supabase.from("profiles").upsert({
        id: userId,
        email,
        nombre,
        apellido,
        fecha_nacimiento: fechaNacimiento
          ? fechaNacimiento.toISOString().split("T")[0]
          : null,
        genero,
      });

      if (profileError) throw profileError;

      Alert.alert("Cuenta creada", "Ahora puedes iniciar sesion");
      router.replace("/sign-in");
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const onChangeDate = (_event: any, selectedDate?: Date) => {
    setShowPicker(false);

    if (selectedDate) {
      setFechaNacimiento(selectedDate);
    }
  };

  return (
    <ThemedView
      style={{ flex: 1 }}
      lightColor="#123B6A"
      darkColor="#0B2440"
    >
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 40 }}>
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
            Crear cuenta
          </ThemedText>

          <ThemedText
            style={{ color: "rgba(255,255,255,0.82)", marginTop: 10 }}
          >
            Completa tus datos para empezar a registrar tus medicamentos.
          </ThemedText>

          <TextInput
            placeholder="Nombre"
            placeholderTextColor="#6B7280"
            value={nombre}
            onChangeText={setNombre}
            style={inputStyle}
          />

          <TextInput
            placeholder="Apellido"
            placeholderTextColor="#6B7280"
            value={apellido}
            onChangeText={setApellido}
            style={inputStyle}
          />

          <TextInput
            placeholder="Correo"
            placeholderTextColor="#6B7280"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            style={inputStyle}
          />

          <TextInput
            placeholder="Confirmar correo"
            placeholderTextColor="#6B7280"
            value={confirmEmail}
            onChangeText={setConfirmEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            style={inputStyle}
          />

          <TextInput
            placeholder="Contrasena"
            placeholderTextColor="#6B7280"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={inputStyle}
          />

          <View style={{ marginTop: 22 }}>
            <ThemedText style={{ color: "#FFFFFF", marginBottom: 10 }}>
              Fecha de nacimiento
            </ThemedText>

            <Pressable
              onPress={() => setShowPicker(true)}
              style={{
                paddingVertical: 12,
                paddingHorizontal: 14,
                backgroundColor: "#FFFFFF",
                borderRadius: 14,
              }}
            >
              <ThemedText style={{ color: "#111111" }}>
                {fechaNacimiento
                  ? fechaNacimiento.toLocaleDateString()
                  : "Seleccionar fecha"}
              </ThemedText>
            </Pressable>

            {showPicker && (
              <DateTimePicker
                value={fechaNacimiento || new Date(2000, 0, 1)}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={onChangeDate}
                maximumDate={new Date()}
              />
            )}
          </View>

          <View style={{ marginTop: 22 }}>
            <ThemedText style={{ color: "#FFFFFF", marginBottom: 10 }}>
              Genero
            </ThemedText>

            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
              {["Hombre", "Mujer", "Hombre trans", "Mujer trans", "Otro"].map(
                (g) => (
                  <Pressable
                    key={g}
                    onPress={() => setGenero(g)}
                    style={{
                      paddingVertical: 8,
                      paddingHorizontal: 14,
                      borderRadius: 20,
                      borderWidth: 1.5,
                      borderColor:
                        genero === g ? "#FFFFFF" : "rgba(255,255,255,0.45)",
                      backgroundColor:
                        genero === g ? "rgba(255,255,255,0.18)" : "transparent",
                    }}
                  >
                    <ThemedText style={{ color: "#FFFFFF" }}>{g}</ThemedText>
                  </Pressable>
                ),
              )}
            </View>
          </View>

          <Pressable
            onPress={handleSignUp}
            style={{
              marginTop: 30,
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
              {loading ? "Creando..." : "Crear cuenta"}
            </ThemedText>
          </Pressable>

          <Pressable
            onPress={() => router.push("/sign-in")}
            style={{ marginTop: 18 }}
          >
            <ThemedText style={{ textAlign: "center", color: "#FFFFFF" }}>
              Volver a iniciar sesion
            </ThemedText>
          </Pressable>
        </View>
      </ScrollView>
    </ThemedView>
  );
}
