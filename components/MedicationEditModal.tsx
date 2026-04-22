import React, { useState } from "react";
import {
    Alert,
    Modal,
    Pressable,
    StyleSheet,
    TextInput,
    View
} from "react-native";
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
  const [dosisInput, setDosisInput] = useState(currentDosis.toString());
  const [timeInput, setTimeInput] = useState(currentTime);

  const handleSave = () => {
    if (editMode === "dosis") {
      const dosis = parseInt(dosisInput);
      
      if (isNaN(dosis) || dosis < 0) {
        Alert.alert("Error", "Ingresa un número válido mayor o igual a 0");
        return;
      }
      
      if (dosis === 0) {
        Alert.alert(
          "Eliminar medicamento",
          "¿Estás seguro de que quieres eliminar este medicamento?",
          [
            { text: "Cancelar", style: "cancel" },
            {
              text: "Eliminar",
              style: "destructive",
              onPress: () => onSave(0),
            },
          ]
        );
      } else {
        onSave(dosis);
      }
    } else {
      // Time editing
      if (!timeInput || timeInput.trim() === "") {
        Alert.alert("Error", "Ingresa una hora válida");
        return;
      }
      
      // Validate time format HH:MM
      const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(timeInput.trim())) {
        Alert.alert("Error", "Usa el formato HH:MM (ej: 08:30)");
        return;
      }
      
      onSave(undefined, timeInput.trim());
    }
  };

  const resetInputs = () => {
    setDosisInput(currentDosis.toString());
    setTimeInput(currentTime);
  };

  React.useEffect(() => {
    if (visible) {
      resetInputs();
    }
  }, [visible, currentDosis, currentTime]);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={modalStyles.overlay}>
        <View style={modalStyles.container}>
          <ThemedText style={modalStyles.title}>
            {editMode === "dosis" ? "Editar dosis" : "Editar hora"}
          </ThemedText>
          
          {editMode === "dosis" ? (
            <View style={modalStyles.inputContainer}>
              <ThemedText style={modalStyles.label}>
                Nueva dosis (0 para eliminar):
              </ThemedText>
              <TextInput
                style={modalStyles.input}
                value={dosisInput}
                onChangeText={setDosisInput}
                keyboardType="numeric"
                placeholder="Ingresa la dosis"
                placeholderTextColor="#999"
                autoFocus
              />
              <ThemedText style={modalStyles.hint}>
                Ejemplos: 1, 2, 3.5, 10, etc.
              </ThemedText>
            </View>
          ) : (
            <View style={modalStyles.inputContainer}>
              <ThemedText style={modalStyles.label}>
                Nueva hora:
              </ThemedText>
              <TextInput
                style={modalStyles.input}
                value={timeInput}
                onChangeText={setTimeInput}
                placeholder="HH:MM"
                placeholderTextColor="#999"
                autoFocus
              />
              <ThemedText style={modalStyles.hint}>
                Formato: HH:MM (ej: 08:30, 14:45, 22:00)
              </ThemedText>
            </View>
          )}

          <View style={modalStyles.buttonContainer}>
            <Pressable
              style={[modalStyles.button, modalStyles.cancelButton]}
              onPress={onClose}
            >
              <ThemedText style={modalStyles.cancelButtonText}>Cancelar</ThemedText>
            </Pressable>
            
            <Pressable
              style={[modalStyles.button, modalStyles.saveButton]}
              onPress={handleSave}
            >
              <ThemedText style={modalStyles.saveButtonText}>Guardar</ThemedText>
            </Pressable>
          </View>
        </View>
      </View>
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
  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
    color: "#000000",
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: "#000000",
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 8,
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
