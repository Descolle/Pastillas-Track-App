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
  loadRemotePastillas,
  markAsTaken,
} from "@/services/medicationService";

import { generateTodayIntakes } from "@/api/intakes";

export default function Home() {
  const { user } = useAuth();

  const styles = useMedicationHomeStyles();
  const tintColor = useThemeColor({}, "tint");
  const iconMuted = useThemeColor({}, "icon");

  const [pastillas, setPastillas] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 CARGA REAL DESDE SUPABASE
  useEffect(() => {
    const load = async () => {
      if (!user) return;

      try {
        setLoading(true);

        // 1. generar intakes del día
        await generateTodayIntakes(user.id);

        // 2. cargar pastillas reales
        const data = await loadRemotePastillas(user.id);
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

  // 🔘 MARCAR COMO TOMADA (REAL DB)
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
            <View style={styles.cardTopRow}>
              <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
                {item.nombre}
              </ThemedText>

              <Pressable onPress={() => marcarTomada(item.id)}>
                <MaterialIcons
                  name="check"
                  size={28}
                  color={item.tomada ? tintColor : iconMuted}
                />
              </Pressable>
            </View>

            <ThemedText style={styles.cardMeta}>
              {item.cantidad} dosis · {item.tiempo}
              {item.tomada ? " · Tomada ✅" : ""}
            </ThemedText>
          </View>
        )}
      />
    </ThemedView>
  );
}
