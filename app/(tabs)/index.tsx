import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
} from "../../services/medicationService";

import { generateTodayIntakes } from "@/api/intakes";

export default function Home() {
  const { user } = useAuth();

  const styles = useMedicationHomeStyles();
  const tintColor = useThemeColor({}, "tint");
  const iconMuted = useThemeColor({}, "icon");

  const [pastillas, setPastillas] = useState<Pastilla[]>([]);
  const [loading, setLoading] = useState(true);

  const STORAGE_KEY = "pastillas_local";

  // 🔥 cargar local + remoto
  useEffect(() => {
    const load = async () => {
      if (!user) return;

      try {
        setLoading(true);

        // 1️⃣ cargar LOCAL primero
        const local = await AsyncStorage.getItem(STORAGE_KEY);
        if (local) {
          setPastillas(JSON.parse(local));
        }

        // 2️⃣ generar intakes (backend)
        await generateTodayIntakes(user.id);

        // 3️⃣ cargar REMOTO
        const remote = await loadRemotePastillas(user.id);

        setPastillas(remote);

        // 4️⃣ guardar en LOCAL
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(remote));
      } catch (err) {
        console.log("⚠️ Offline mode:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user]);

  // 🔄 guardar siempre en local
  const updateLocal = async (data: Pastilla[]) => {
    setPastillas(data);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const marcarTomada = async (id: string) => {
    try {
      await markAsTaken(id);

      const updated = pastillas.map((p) =>
        p.id === id ? { ...p, tomada: true } : p,
      );

      await updateLocal(updated);
    } catch (err) {
      Alert.alert("Offline", "Se marcará cuando vuelva internet");
    }
  };

  const eliminar = async (id: string) => {
    Alert.alert("Eliminar", "¿Seguro?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteMedication(id);

            const updated = pastillas.filter((p) => p.id !== id);
            await updateLocal(updated);
          } catch {
            Alert.alert("Offline", "Se eliminará luego");
          }
        },
      },
    ]);
  };

  const actualizar = async (item: Pastilla, nuevaDosis: number) => {
    try {
      await updateMedication(item.id, item.nombre, nuevaDosis, item.time);

      const updated = pastillas.map((p) =>
        p.id === item.id ? { ...p, cantidad: nuevaDosis } : p,
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

  return (
    <ThemedView style={styles.flex1}>
      <FlatList
        data={pastillas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardTopRow}>
              <ThemedText>{item.nombre}</ThemedText>

              <Pressable onPress={() => marcarTomada(item.id)}>
                <MaterialIcons
                  name="check"
                  size={28}
                  color={item.tomada ? tintColor : iconMuted}
                />
              </Pressable>
            </View>

            <ThemedText>
              {item.cantidad} dosis · {item.time}
            </ThemedText>

            <Pressable onPress={() => editar(item)}>
              <MaterialIcons name="edit" size={22} />
            </Pressable>

            <Pressable onPress={() => eliminar(item.id)}>
              <MaterialIcons name="delete" size={22} color="red" />
            </Pressable>
          </View>
        )}
      />
    </ThemedView>
  );
}
