import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
import { ActivityIndicator, Alert, FlatList, Pressable, View } from "react-native";

import MedicationEditModal from "@/components/MedicationEditModal";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useMedication } from "@/context/MedicationContext";
import { useSettings } from "@/context/SettingsContext";
import { useHomeScreenStyles } from "@/hooks/use-styles";
import { type Pastilla } from "@/services/medicationService";

export default function Home() {
  const {
    pastillas,
    hydrated,
    refreshRemote,
    trackMedicationToggle,
    removePastillaById,
    updatePastillaById,
  } = useMedication();
  const { t } = useSettings();
  const styles = useHomeScreenStyles();

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<Pastilla | null>(null);
  const [editMode, setEditMode] = useState<"dosis" | "time">("dosis");

  const marcarTomada = async (id: string) => {
    try {
      const item = pastillas.find((p) => p.id === id);
      if (item) {
        await trackMedicationToggle(id, !item.tomada);
      }
    } catch {
      Alert.alert(t("offline"), t("willSyncWhenOnline"));
    }
  };

  const eliminar = (id: string) => {
    Alert.alert(t("deleteConfirmTitle"), t("deleteConfirmBody"), [
      { text: t("cancel"), style: "cancel" },
      {
        text: t("delete"),
        style: "destructive",
        onPress: async () => {
          try {
            await removePastillaById(id);
            await refreshRemote();
          } catch {
            Alert.alert(t("offline"), t("willSyncWhenOnline"));
          }
        },
      },
    ]);
  };

  const editar = (item: Pastilla) => {
    Alert.alert(t("editMedication"), t("whatToEdit"), [
      { text: t("dose"), onPress: () => openEditModal(item, "dosis") },
      { text: t("time"), onPress: () => openEditModal(item, "time") },
      {
        text: t("delete"),
        onPress: () => eliminar(item.id),
        style: "destructive",
      },
      { text: t("cancel"), style: "cancel" },
    ]);
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
        if (dosis === 0) {
          await eliminar(editingItem.id);
        } else {
          await updatePastillaById(editingItem.id, {
            ...editingItem,
            cantidad: dosis,
          });
          await refreshRemote();
          Alert.alert(t("success"), t("doseUpdated"));
        }
      } else if (time !== undefined) {
        await updatePastillaById(editingItem.id, { ...editingItem, time });
        await refreshRemote();
        Alert.alert(t("success"), t("timeUpdated"));
      }
    } catch {
      Alert.alert(t("offline"), t("willSyncWhenOnline"));
    } finally {
      setEditModalVisible(false);
      setEditingItem(null);
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
            {/* Top row - Medication name */}
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
            </View>

            {/* Bottom row - Dosage, Time, and Actions */}
            <View style={styles.medicationCardBottomRow}>
              <View style={styles.medicationMetricBlock}>
                <ThemedText style={styles.medicationMetricLabel}>
                  {t("dose")}
                </ThemedText>
                <ThemedText style={styles.medicationMetricValue}>
                  {item.cantidad}
                </ThemedText>
              </View>

              <View style={styles.medicationMetricBlock}>
                <ThemedText style={styles.medicationMetricLabel}>
                  {t("time")}
                </ThemedText>
                <ThemedText style={styles.medicationMetricValue}>
                  {item.time}
                </ThemedText>
              </View>

              <View style={styles.medicationActions}>
                <Pressable
                  onPress={() => marcarTomada(item.id)}
                  style={styles.medicationIcon}
                  hitSlop={8}
                >
                  <MaterialIcons
                    name="check"
                    size={22}
                    color={item.tomada ? "#4CAF50" : "#000000"}
                  />
                </Pressable>

                <Pressable
                  onPress={() => editar(item)}
                  style={styles.medicationIcon}
                  hitSlop={8}
                >
                  <MaterialIcons name="edit" size={20} color="#000000" />
                </Pressable>

                <Pressable
                  onPress={() => eliminar(item.id)}
                  style={styles.medicationIcon}
                  hitSlop={8}
                >
                  <MaterialIcons name="delete" size={20} color="#000000" />
                </Pressable>
              </View>
            </View>
          </View>
        )}
      />

      <MedicationEditModal
        visible={editModalVisible}
        onClose={() => {
          setEditModalVisible(false);
          setEditingItem(null);
        }}
        onSave={handleModalSave}
        currentDosis={editingItem?.cantidad || 1}
        currentTime={editingItem?.time || "08:00"}
        editMode={editMode}
      />
    </ThemedView>
  );
}
