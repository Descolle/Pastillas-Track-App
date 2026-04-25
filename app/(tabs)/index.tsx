import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
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
import { type Pastilla } from "@/services/medicationService";
import MedicationEditModal from "../../components/MedicationEditModal";

export default function Home() {
  const { user } = useAuth();
  const { pastillas, hydrated, refreshRemote, trackMedicationToggle, removePastillaById, updatePastillaById } = useMedication();
  const styles = useHomeScreenStyles();
  
  // Debug logging
  console.log("🏠 Home - User:", user?.id);
  console.log("🏠 Home - Hydrated:", hydrated);
  console.log("🏠 Home - Pastillas count:", pastillas.length);
  console.log("🏠 Home - Pastillas data:", pastillas);
  
  // Modal state
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<Pastilla | null>(null);
  const [editMode, setEditMode] = useState<"dosis" | "time">("dosis");

  const marcarTomada = async (id: string) => {
    try {
      const item = pastillas.find(p => p.id === id);
      if (item) {
        await trackMedicationToggle(id, !item.tomada);
      }
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
            await removePastillaById(id);
            await refreshRemote();
          } catch {
            Alert.alert("Offline", "Se eliminará luego");
          }
        },
      },
    ]);
  };

  const editar = (item: Pastilla) => {
    Alert.alert(
      "Editar medicamento",
      "¿Qué quieres editar?",
      [
        { text: "Dosis", onPress: () => openEditModal(item, "dosis") },
        { text: "Hora", onPress: () => openEditModal(item, "time") },
        { text: "Eliminar", onPress: () => eliminar(item.id), style: "destructive" },
        { text: "Cancelar", style: "cancel" },
      ]
    );
  };

  const openEditModal = (item: Pastilla, mode: "dosis" | "time") => {
    setEditingItem(item);
    setEditMode(mode);
    setEditModalVisible(true);
  };

  const handleModalSave = async (dosis?: number, time?: string) => {
    if (!editingItem) return;

    try {
      if (dosis !== undefined) {
        // Dosis editing
        if (dosis === 0) {
          // Delete medication
          await eliminar(editingItem.id);
        } else {
          // Update dosis
          await updatePastillaById(editingItem.id, { ...editingItem, cantidad: dosis });
          await refreshRemote();
          Alert.alert("Éxito", "Dosis actualizada");
        }
      } else if (time !== undefined) {
        // Time editing
        await updatePastillaById(editingItem.id, { ...editingItem, time });
        await refreshRemote();
        Alert.alert("Éxito", "Hora actualizada");
      }
    } catch {
      Alert.alert("Offline", "Se actualizará luego");
    } finally {
      setEditModalVisible(false);
      setEditingItem(null);
    }
  };

  const handleModalClose = () => {
    setEditModalVisible(false);
    setEditingItem(null);
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

      <MedicationEditModal
        visible={editModalVisible}
        onClose={handleModalClose}
        onSave={handleModalSave}
        currentDosis={editingItem?.cantidad || 1}
        currentTime={editingItem?.time || "08:00"}
        editMode={editMode}
      />
    </ThemedView>
  );
}
