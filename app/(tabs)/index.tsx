import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";

import { generateTodayIntakes } from "@/api/intakes";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/context/AuthContext";
import { useHomeScreenStyles } from "@/hooks/use-styles";
import {
  deleteMedication,
  loadRemotePastillas,
  markAsTaken,
  updateMedication,
  type Pastilla,
} from "@/services/medicationService";

export default function Home() {
  const { user } = useAuth();
  const styles = useHomeScreenStyles();

  const [pastillas, setPastillas] = useState<Pastilla[]>([]);
  const [loading, setLoading] = useState(true);

  const STORAGE_KEY = "pastillas_local";

  useEffect(() => {
    const load = async () => {
      if (!user) {
        setPastillas([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const local = await AsyncStorage.getItem(STORAGE_KEY);
        if (local) setPastillas(JSON.parse(local));

        await generateTodayIntakes(user.id);
        const remote = await loadRemotePastillas(user.id);

        console.log("Setting pastillas:", remote);
        setPastillas(remote);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(remote));
      } catch (error) {
        console.log("Offline mode:", error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user]);

  const updateLocal = async (data: Pastilla[]) => {
    setPastillas(data);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const marcarTomada = async (id: string) => {
    try {
      await markAsTaken(id);

      const updated = pastillas.map((p) =>
        p.id === id ? { ...p, tomada: true } : p
      );

      await updateLocal(updated);
    } catch {
      Alert.alert("Offline", "Se marcará cuando vuelva internet");
    }
  };

  const eliminar = (id: string) => {
    Alert.alert("Eliminar", "¿Seguro?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteMedication(id);
            await updateLocal(pastillas.filter((p) => p.id !== id));
          } catch {
            Alert.alert("Offline", "Se eliminará luego");
          }
        },
      },
    ]);
  };

  const actualizar = async (item: Pastilla, dosis: number) => {
    try {
      await updateMedication(item.id, item.nombre, dosis, item.time);

      const updated = pastillas.map((p) =>
        p.id === item.id ? { ...p, cantidad: dosis } : p
      );

      await updateLocal(updated);
    } catch {
      Alert.alert("Offline", "Se actualizará luego");
    }
  };

  const editar = (item: Pastilla) => {
    Alert.alert("Editar", "Dosis", [
      { text: "1", onPress: () => actualizar(item, 1) },
      { text: "2", onPress: () => actualizar(item, 2) },
      { text: "Cancelar", style: "cancel" },
    ]);
  };

  if (loading) {
    return (
      <ThemedView style={styles.flex1}>
        <ActivityIndicator />
      </ThemedView>
    );
  }

  console.log("Rendering with pastillas:", pastillas, "Loading:", loading);

  return (
    <ThemedView style={styles.flex1}>
      {/* Debug info */}
      <View style={{ padding: 16, backgroundColor: '#f0f0f0' }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
          Medicamentos: {pastillas.length} | Loading: {loading ? 'Yes' : 'No'}
        </Text>
        {pastillas.length > 0 && (
          <Text style={{ fontSize: 12, marginTop: 4 }}>
            First item: {JSON.stringify(pastillas[0])}
          </Text>
        )}
      </View>
      
      <FlatList
        data={pastillas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          console.log("Rendering item:", item);
          return (
          <View style={styles.medicationCard}>
            <View style={styles.medicationCardTopRow}>
              <View style={styles.medicationInfoBlock}>
                <ThemedText
                  style={[
                    styles.medicationName,
                    item.tomada && styles.medicationTaken,
                  ]}
                >
                  {item.nombre}
                </ThemedText>
              </View>

              <View style={styles.medicationMetricBlock}>
                <ThemedText style={styles.medicationMetricLabel}>
                  Dosis
                </ThemedText>
                <ThemedText style={styles.medicationMetricValue}>
                  {item.cantidad}
                </ThemedText>
              </View>

              <View style={styles.medicationMetricBlock}>
                <ThemedText style={styles.medicationMetricLabel}>
                  Hora
                </ThemedText>
                <ThemedText style={styles.medicationMetricValue}>
                  {item.time}
                </ThemedText>
              </View>

              <View style={styles.medicationActions}>
                <Pressable onPress={() => marcarTomada(item.id)}>
                  <MaterialIcons name="check" size={22} />
                </Pressable>

                <Pressable onPress={() => editar(item)}>
                  <MaterialIcons name="edit" size={20} />
                </Pressable>

                <Pressable onPress={() => eliminar(item.id)}>
                  <MaterialIcons name="delete" size={20} />
                </Pressable>
              </View>
            </View>
          </View>
          );
        }}
      />
    </ThemedView>
  );
}
