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
    Alert.alert(
      "Editar medicamento",
      "¿Qué quieres editar?",
      [
        { text: "Dosis", onPress: () => editarDosis(item) },
        { text: "Hora", onPress: () => editarHora(item) },
        { text: "Eliminar", onPress: () => eliminar(item.id), style: "destructive" },
        { text: "Cancelar", style: "cancel" },
      ]
    );
  };

  const editarDosis = (item: Pastilla) => {
    Alert.alert(
      "Editar dosis",
      "Selecciona la nueva dosis:",
      [
        { text: "1", onPress: () => actualizar(item, 1) },
        { text: "2", onPress: () => actualizar(item, 2) },
        { text: "3", onPress: () => actualizar(item, 3) },
        { text: "4", onPress: () => actualizar(item, 4) },
        { text: "5", onPress: () => actualizar(item, 5) },
        { text: "Otro", onPress: () => editarDosisCustom(item) },
        { text: "0 (Eliminar)", onPress: () => eliminar(item.id), style: "destructive" },
        { text: "Cancelar", style: "cancel" },
      ]
    );
  };

  const editarDosisCustom = (item: Pastilla) => {
    Alert.alert(
      "Dosis personalizada",
      "Ingresa un número mayor a 0:",
      [
        { text: "1", onPress: () => actualizar(item, 1) },
        { text: "2", onPress: () => actualizar(item, 2) },
        { text: "3", onPress: () => actualizar(item, 3) },
        { text: "4", onPress: () => actualizar(item, 4) },
        { text: "5", onPress: () => actualizar(item, 5) },
        { text: "6", onPress: () => actualizar(item, 6) },
        { text: "7", onPress: () => actualizar(item, 7) },
        { text: "8", onPress: () => actualizar(item, 8) },
        { text: "9", onPress: () => actualizar(item, 9) },
        { text: "10", onPress: () => actualizar(item, 10) },
        { text: "Cancelar", style: "cancel" },
      ]
    );
  };

  const editarHora = (item: Pastilla) => {
    Alert.alert(
      "Editar hora",
      "Selecciona la nueva hora:",
      [
        { text: "06:00", onPress: () => actualizarHora(item, "06:00") },
        { text: "07:00", onPress: () => actualizarHora(item, "07:00") },
        { text: "08:00", onPress: () => actualizarHora(item, "08:00") },
        { text: "09:00", onPress: () => actualizarHora(item, "09:00") },
        { text: "10:00", onPress: () => actualizarHora(item, "10:00") },
        { text: "11:00", onPress: () => actualizarHora(item, "11:00") },
        { text: "12:00", onPress: () => actualizarHora(item, "12:00") },
        { text: "13:00", onPress: () => actualizarHora(item, "13:00") },
        { text: "14:00", onPress: () => actualizarHora(item, "14:00") },
        { text: "15:00", onPress: () => actualizarHora(item, "15:00") },
        { text: "16:00", onPress: () => actualizarHora(item, "16:00") },
        { text: "17:00", onPress: () => actualizarHora(item, "17:00") },
        { text: "18:00", onPress: () => actualizarHora(item, "18:00") },
        { text: "19:00", onPress: () => actualizarHora(item, "19:00") },
        { text: "20:00", onPress: () => actualizarHora(item, "20:00") },
        { text: "21:00", onPress: () => actualizarHora(item, "21:00") },
        { text: "22:00", onPress: () => actualizarHora(item, "22:00") },
        { text: "Cancelar", style: "cancel" },
      ]
    );
  };

  const actualizarHora = async (item: Pastilla, newTime: string) => {
    try {
      await updateMedication(item.id, item.nombre, item.cantidad, newTime);
      await refreshRemote();
      Alert.alert("Éxito", "Hora actualizada");
    } catch {
      Alert.alert("Offline", "Se actualizará luego");
    }
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
                  <MaterialIcons name="check" size={22} color={item.tomada ? "#4CAF50" : "#000000"} />
                </Pressable>

                <Pressable onPress={() => editar(item)}>
                  <MaterialIcons name="edit" size={20} color={item.tomada ? "#8B451" : "#000000"} />
                </Pressable>

                <Pressable onPress={() => eliminar(item.id)}>
                  <MaterialIcons name="delete" size={20} color={item.tomada ? "#8B451" : "#000000"} />
                </Pressable>
              </View>
            </View>
          </View>
        )}
      />
    </ThemedView>
  );
}
