import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Platform, Pressable, TextInput, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import DateTimePicker from "@react-native-community/datetimepicker";

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

      // 🔥 1. Crear usuario en auth
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (error) throw error;

      const userId = data.user?.id;

      if (!userId) {
        throw new Error("No se pudo obtener el usuario");
      }

      // 🔥 2. Crear profile
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
      if (!fechaNacimiento) {
        Alert.alert("Error", "Selecciona tu fecha de nacimiento");
        return;
      }
      Alert.alert("Cuenta creada", "Ahora puedes iniciar sesión");

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
    <ThemedView style={{ flex: 1, padding: 20 }}>
      <ThemedText type="title">📝 Crear cuenta</ThemedText>

      <TextInput
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
        style={{ marginTop: 20, borderBottomWidth: 1, padding: 8 }}
      />

      <TextInput
        placeholder="Apellido"
        value={apellido}
        onChangeText={setApellido}
        style={{ marginTop: 10, borderBottomWidth: 1, padding: 8 }}
      />

      <TextInput
        placeholder="Correo"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={{ marginTop: 10, borderBottomWidth: 1, padding: 8 }}
      />

      <TextInput
        placeholder="Confirmar correo"
        value={confirmEmail}
        onChangeText={setConfirmEmail}
        autoCapitalize="none"
        style={{ marginTop: 10, borderBottomWidth: 1, padding: 8 }}
      />

      <TextInput
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ marginTop: 10, borderBottomWidth: 1, padding: 8 }}
      />

      <View style={{ marginTop: 20 }}>
        <ThemedText style={{ marginBottom: 10 }}>
          Fecha de nacimiento
        </ThemedText>

        <Pressable
          onPress={() => setShowPicker(true)}
          style={{
            padding: 12,
            borderWidth: 1,
            borderRadius: 10,
          }}
        >
          <ThemedText>
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
            maximumDate={new Date()} // no futuras
          />
        )}
      </View>

      <View style={{ marginTop: 20 }}>
        <ThemedText style={{ marginBottom: 10 }}>Género</ThemedText>
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
                  borderWidth: 1,
                  borderColor: genero === g ? "#007AFF" : "#ccc",
                  backgroundColor: genero === g ? "#007AFF" : "transparent",
                }}
              >
                <ThemedText
                  style={{
                    color: genero === g ? "#fff" : "#000",
                  }}
                >
                  {g}
                </ThemedText>
              </Pressable>
            ),
          )}
        </View>
      </View>

      <Pressable
        onPress={handleSignUp}
        style={{
          marginTop: 30,
          backgroundColor: "#007AFF",
          padding: 14,
          borderRadius: 10,
        }}
      >
        <ThemedText style={{ color: "#fff", textAlign: "center" }}>
          {loading ? "Creando..." : "Crear cuenta"}
        </ThemedText>
      </Pressable>

      <Pressable
        onPress={() => router.push("/sign-in")}
        style={{ marginTop: 20 }}
      >
        <ThemedText style={{ textAlign: "center" }}>Volver</ThemedText>
      </Pressable>
    </ThemedView>
  );
}
