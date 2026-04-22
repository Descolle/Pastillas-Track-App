import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  View
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/context/AuthContext";
import { useMedication } from "@/context/MedicationContext";
import { useHomeScreenStyles } from "@/hooks/use-styles";
import {
  deleteMedication,
  markAsTaken,
  updateMedication,
  type Pastilla,
} from "@/services/medicationService";

export default function Home() {
  const { user } = useAuth();
  const { pastillas, hydrated, refreshRemote } = useMedication();
  const styles = useHomeScreenStyles();

  const marcarTomada = async (id: string) => {
    try {
      await markAsTaken(id);
      await refreshRemote();
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
            await refreshRemote();
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
      await refreshRemote();
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

  if (!hydrated) {
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
        )}
      />
    </ThemedView>
  );
}
