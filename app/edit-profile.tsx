import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, TextInput, View } from "react-native";

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
            ✏️ Editar perfil
          </ThemedText>

          <ThemedText
            style={{ color: "rgba(255,255,255,0.82)", marginTop: 10 }}
          >
            Actualiza tu información personal y preferencias.
          </ThemedText>

          {/* Nombre */}
          <View
            style={{
              marginTop: 22,
              backgroundColor: "#FDF1E3",
              borderRadius: 20,
              padding: 18,
            }}
          >
            <ThemedText type="defaultSemiBold" style={{ color: "#000000" }}>
              Nombre
            </ThemedText>
            <TextInput
              value={nombre}
              onChangeText={setNombre}
              placeholder="Ej: Juan"
              style={{
                marginTop: 10,
                backgroundColor: "#FFFFFF",
                borderRadius: 14,
                paddingVertical: 14,
                paddingHorizontal: 16,
                color: "#111111",
                fontSize: 16,
              }}
            />
          </View>

          {/* Apellido */}
          <View
            style={{
              marginTop: 14,
              backgroundColor: "#FDF1E3",
              borderRadius: 20,
              padding: 18,
            }}
          >
            <ThemedText type="defaultSemiBold" style={{ color: "#000000" }}>
              Apellido
            </ThemedText>
            <TextInput
              value={apellido}
              onChangeText={setApellido}
              placeholder="Ej: Pérez"
              style={{
                marginTop: 10,
                backgroundColor: "#FFFFFF",
                borderRadius: 14,
                paddingVertical: 14,
                paddingHorizontal: 16,
                color: "#111111",
                fontSize: 16,
              }}
            />
          </View>

          {/* Fecha nacimiento */}
          <View
            style={{
              marginTop: 14,
              backgroundColor: "#FDF1E3",
              borderRadius: 20,
              padding: 18,
            }}
          >
            <ThemedText type="defaultSemiBold" style={{ color: "#000000" }}>
              Fecha nacimiento
            </ThemedText>
            <TextInput
              value={fecha}
              onChangeText={setFecha}
              placeholder="YYYY-MM-DD"
              style={{
                marginTop: 10,
                backgroundColor: "#FFFFFF",
                borderRadius: 14,
                paddingVertical: 14,
                paddingHorizontal: 16,
                color: "#111111",
                fontSize: 16,
              }}
            />
          </View>

          {/* Género */}
          <View
            style={{
              marginTop: 14,
              backgroundColor: "#FDF1E3",
              borderRadius: 20,
              padding: 18,
            }}
          >
            <ThemedText type="defaultSemiBold" style={{ color: "#000000" }}>
              Género
            </ThemedText>
            <View style={{ marginTop: 10 }}>
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
                  <ThemedText style={{ color: "#000000" }}>
                    {g.label}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
          </View>

          <Pressable
            onPress={handleSave}
            disabled={loading}
            style={{
              marginTop: 28,
              backgroundColor: loading ? "#ccc" : "#FFFFFF",
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
              {loading ? "Guardando..." : "Guardar cambios"}
            </ThemedText>
          </Pressable>
        </View>

        <View style={{ marginTop: 20 }}>
          <Pressable
            onPress={() => router.push("/delete-account")}
            style={{
              marginTop: 12,
              backgroundColor: "#FCE8E6",
              padding: 14,
              borderRadius: 16,
            }}
          >
            <ThemedText style={{ color: "#FFFFFF", textAlign: "center", fontWeight: "600" }}>
              Eliminar cuenta
            </ThemedText>
          </Pressable>
        </View>
      </ScrollView>
    </ThemedView>
  );
}
