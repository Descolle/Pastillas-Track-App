import { useSettings } from "@/context/SettingsContext";
import React, { useState } from "react";
import { Alert, Modal, Pressable, StyleSheet, TextInput, View } from "react-native";
import { ThemedText } from "./themed-text";

interface MedicationEditModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (dosis?: number, time?: string) => void;
  currentDosis: number;
  currentTime: string;
  editMode: "dosis" | "time";
}

export default function MedicationEditModal({
  visible,
  onClose,
  onSave,
  currentDosis,
  currentTime,
  editMode,
}: MedicationEditModalProps) {
  const { t, theme } = useSettings();
  const [dosisInput, setDosisInput] = useState(currentDosis.toString());
  const [timeInput, setTimeInput] = useState(currentTime);

  const handleSave = () => {
    if (editMode === "dosis") {
      const dosis = parseInt(dosisInput);

      if (isNaN(dosis) || dosis < 0) {
        Alert.alert(t("error"), t("invalidNumber"));
        return;
      }

      if (dosis === 0) {
        Alert.alert(t("delete"), t("deleteMedicationQuestion"), [
          { text: t("cancel"), style: "cancel" },
          {
            text: t("delete"),
            style: "destructive",
            onPress: () => onSave(0),
          },
        ]);
      } else {
        onSave(dosis);
      }
    } else {
      if (!timeInput || timeInput.trim() === "") {
        Alert.alert(t("error"), t("invalidTime"));
        return;
      }

      const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(timeInput.trim())) {
        Alert.alert(t("error"), t("invalidTime"));
        return;
      }

      onSave(undefined, timeInput.trim());
    }
  };

  React.useEffect(() => {
    if (visible) {
      setDosisInput(currentDosis.toString());
      setTimeInput(currentTime);
    }
  }, [visible, currentDosis, currentTime]);

  const dark = theme === "dark";

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable 
        style={modalStyles.overlay} 
        onPress={onClose}
      >
        <Pressable 
          style={[modalStyles.container, dark && modalStyles.containerDark]}
          onPress={(e) => e.stopPropagation()}
        >
          <ThemedText style={modalStyles.title}>
            {editMode === "dosis" ? t("editDose") : t("editTime")}
          </ThemedText>

          {editMode === "dosis" ? (
            <View style={modalStyles.inputContainer}>
              <ThemedText style={modalStyles.label}>
                {t("newDose")} ({t("zeroToDelete")}):
              </ThemedText>
              <TextInput
                style={[modalStyles.input, dark && modalStyles.inputDark]}
                value={dosisInput}
                onChangeText={setDosisInput}
                keyboardType="numeric"
                placeholder={t("newDose")}
                placeholderTextColor="#999"
                autoFocus
              />
              <ThemedText style={modalStyles.hint}>1, 2, 3.5, 10</ThemedText>
            </View>
          ) : (
            <View style={modalStyles.inputContainer}>
              <ThemedText style={modalStyles.label}>{t("newTime")}:</ThemedText>
              <TextInput
                style={[modalStyles.input, dark && modalStyles.inputDark]}
                value={timeInput}
                onChangeText={setTimeInput}
                placeholder="HH:MM"
                placeholderTextColor="#999"
                autoFocus
              />
              <ThemedText style={modalStyles.hint}>{t("timeFormat")}</ThemedText>
            </View>
          )}

          <View style={modalStyles.buttonContainer}>
            <Pressable
              style={[modalStyles.button, modalStyles.cancelButton]}
              onPress={onClose}
            >
              <ThemedText style={modalStyles.cancelButtonText}>
                {t("cancel")}
              </ThemedText>
            </Pressable>

            <Pressable
              style={[modalStyles.button, modalStyles.saveButton]}
              onPress={handleSave}
            >
              <ThemedText style={modalStyles.saveButtonText}>
                {t("save")}
              </ThemedText>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  container: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  containerDark: {
    backgroundColor: "#1F2327",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 8,
    color: "#111111",
  },
  inputDark: {
    borderColor: "#4B5563",
    color: "#FFFFFF",
  },
  hint: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
  },
  saveButton: {
    backgroundColor: "#007AFF",
  },
  cancelButtonText: {
    color: "#333",
    fontWeight: "500",
  },
  saveButtonText: {
    color: "#ffffff",
    fontWeight: "500",
  },
});


