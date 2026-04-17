import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/context/AuthContext";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useMedicationHomeStyles } from "@/styles/homeStyles";

import {
  deleteMedication,
  loadRemotePastillas,
  markAsTaken,
  updateMedication,
  type Pastilla,
} from "@/services/medicationService";

import { generateTodayIntakes } from "@/api/intakes";

export default function Home() {
  const { user } = useAuth();

  const styles = useMedicationHomeStyles();
  const tintColor = useThemeColor({}, "tint");
  const iconMuted = useThemeColor({}, "icon");

  const [pastillas, setPastillas] = useState<Pastilla[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!user) return;

      try {
        setLoading(true);

        await generateTodayIntakes(user.id);

        const data = await loadRemotePastillas(user.id);
        console.log("📦 Pastillas:", data);

        setPastillas(data);
      } catch (err) {
        console.log(err);
        Alert.alert("Error", "No se pudieron cargar las pastillas");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user]);

  // ✅ Marcar como tomada
  const marcarTomada = async (scheduleId: string) => {
    try {
      await markAsTaken(scheduleId);

      if (user) {
        const updated = await loadRemotePastillas(user.id);
        setPastillas(updated);
      }
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "No se pudo actualizar");
    }
  };

  // ✅ Eliminar
  const eliminar = async (id: string) => {
    Alert.alert("Eliminar", "¿Seguro que quieres eliminar?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteMedication(id);

            if (user) {
              const updated = await loadRemotePastillas(user.id);
              setPastillas(updated);
            }
          } catch {
            Alert.alert("Error", "No se pudo eliminar");
          }
        },
      },
    ]);
  };

  // ✅ Actualizar dosis
  const actualizar = async (item: Pastilla, nuevaDosis: number) => {
    try {
      await updateMedication(item.id, item.nombre, nuevaDosis, item.time);

      if (user) {
        const updated = await loadRemotePastillas(user.id);
        setPastillas(updated);
      }
    } catch {
      Alert.alert("Error", "No se pudo actualizar");
    }
  };

  // ✅ Editar (simple)
  const editar = (item: Pastilla) => {
    Alert.alert("Editar dosis", "Selecciona una opción", [
      { text: "1 dosis", onPress: () => actualizar(item, 1) },
      { text: "2 dosis", onPress: () => actualizar(item, 2) },
      { text: "Cancelar", style: "cancel" },
    ]);
  };

  if (loading) {
    return (
      <ThemedView style={styles.flex1}>
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" />
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.flex1} lightColor="#F2F2F7">
      <FlatList
        data={pastillas}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <ThemedText type="title" style={styles.title}>
            💊 Pastillas de hoy
          </ThemedText>
        }
        ListEmptyComponent={
          <ThemedText style={styles.empty}>
            No tienes recordatorios hoy
          </ThemedText>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* 🔹 FILA PRINCIPAL */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              {/* IZQUIERDA */}
              <View style={{ flex: 1 }}>
                <ThemedText type="defaultSemiBold" style={{ fontSize: 16 }}>
                  {item.nombre}
                </ThemedText>

                {/* 🔸 DOSIS ABAJO */}
                <ThemedText style={{ fontSize: 12, opacity: 0.6 }}>
                  {item.cantidad} dosis
                </ThemedText>
              </View>

              {/* CENTRO → HORA */}
              <ThemedText style={{ marginRight: 10 }}>
                {item.time.slice(0, 5)}
              </ThemedText>

              {/* DERECHA → ICONOS */}
              <View style={{ flexDirection: "row", gap: 10 }}>
                <Pressable onPress={() => marcarTomada(item.id)}>
                  <MaterialIcons
                    name="check-circle"
                    size={24}
                    color={item.tomada ? tintColor : iconMuted}
                  />
                </Pressable>

                <Pressable onPress={() => editar(item)}>
                  <MaterialIcons name="edit" size={22} color="blue" />
                </Pressable>

                <Pressable onPress={() => eliminar(item.id)}>
                  <MaterialIcons name="delete" size={22} color="red" />
                </Pressable>
              </View>
            </View>
          </View>
        )}
      />
    </ThemedView>
  );
}
