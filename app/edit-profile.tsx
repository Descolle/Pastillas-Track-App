import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Pressable, TextInput, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export default function EditProfile() {
  const { profile, refreshProfile } = useAuth();
  const router = useRouter();

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [genero, setGenero] = useState("");
  const [fecha, setFecha] = useState("");

  const [loading, setLoading] = useState(false);

  // 🔥 cargar datos actuales
  useEffect(() => {
    if (profile) {
      setNombre(profile.nombre || "");
      setApellido(profile.apellido || "");
      setGenero(profile.genero || "");
      setFecha(profile.fecha_nacimiento || "");
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      if (!profile) return;

      setLoading(true);

      const { error } = await supabase
        .from("profiles")
        .update({
          nombre,
          apellido,
          genero,
          fecha_nacimiento: fecha,
        })
        .eq("id", profile.id);

      if (error) throw error;

      await refreshProfile(); // 🔥 CLAVE

      Alert.alert("Éxito", "Perfil actualizado");
      router.back();
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={{ flex: 1, padding: 20 }}>
      <ThemedText type="title">✏️ Editar perfil</ThemedText>

      {/* Nombre */}
      <TextInput
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
        style={{ marginTop: 20, borderBottomWidth: 1, padding: 8 }}
      />

      {/* Apellido */}
      <TextInput
        placeholder="Apellido"
        value={apellido}
        onChangeText={setApellido}
        style={{ marginTop: 20, borderBottomWidth: 1, padding: 8 }}
      />

      {/* Fecha nacimiento */}
      <TextInput
        placeholder="Fecha nacimiento (YYYY-MM-DD)"
        value={fecha}
        onChangeText={setFecha}
        style={{ marginTop: 20, borderBottomWidth: 1, padding: 8 }}
      />

      {/* Género */}
      <View style={{ marginTop: 20 }}>
        <ThemedText style={{ marginBottom: 10 }}>Género</ThemedText>

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
          {[
            { label: "Hombre", value: "male" },
            { label: "Mujer", value: "female" },
            { label: "Hombre trans", value: "male_trans" },
            { label: "Mujer trans", value: "female_trans" },
            { label: "Otro", value: "other" },
          ].map((g) => (
            <Pressable
              key={g.value}
              onPress={() => setGenero(g.value)}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 14,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: genero === g.value ? "#007AFF" : "#ccc",
                backgroundColor: genero === g.value ? "#007AFF" : "transparent",
              }}
            >
              <ThemedText
                style={{
                  color: genero === g.value ? "#fff" : "#000",
                }}
              >
                {g.label}
              </ThemedText>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Guardar */}
      <Pressable
        onPress={handleSave}
        style={{
          marginTop: 30,
          backgroundColor: "#007AFF",
          padding: 14,
          borderRadius: 12,
        }}
      >
        <ThemedText style={{ color: "#fff", textAlign: "center" }}>
          {loading ? "Guardando..." : "Guardar cambios"}
        </ThemedText>
      </Pressable>
    </ThemedView>
  );
}
