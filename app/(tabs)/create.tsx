import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/context/AuthContext";
import { useMedication } from "@/context/MedicationContext";
import { createMedicationWithSchedule } from "@/services/medicationService";
import { scheduleNotification } from "@/utils/notification";

export default function CreateMedication() {
  const { user } = useAuth();
  const { refreshRemote, canCreateMedication } = useMedication();

  const [name, setName] = useState("");
  const [dose, setDose] = useState("");
  const [time, setTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputStyle = {
    marginTop: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    color: "#111111",
    fontSize: 16,
  } as const;

  const formatTime = (date: Date) => {
    const h = String(date.getHours()).padStart(2, "0");
    const m = String(date.getMinutes()).padStart(2, "0");
    return `${h}:${m}`;
  };

  const handleSave = async () => {
    if (!user) {
      return Alert.alert("Error", "Debes iniciar sesión");
    }

    if (!canCreateMedication) {
      return Alert.alert(
        "Límite alcanzado",
        "Tu plan actual ya alcanzó el máximo de medicamentos."
      );
    }

    if (!name.trim()) {
      return Alert.alert("Error", "El nombre es obligatorio");
    }

    if (!dose || Number(dose) <= 0) {
      return Alert.alert("Error", "Dosis inválida");
    }

    try {
      setLoading(true);

      const timeStr = formatTime(time);

      // 🔥 CREACIÓN CORRECTA (ARRAY)
      await createMedicationWithSchedule(
        user.id,
        name.trim(),
        [
          {
            time: timeStr,
            dosage: Number(dose),
          },
        ]
      );

      // 🔔 notificación
      await scheduleNotification(name, timeStr);

      // 🔄 refrescar datos
      await refreshRemote();

      Alert.alert("Guardado", "Medicamento creado correctamente");

      // limpiar
      setName("");
      setDose("");
      setTime(new Date());
    } catch (error: any) {
      console.log("CREATE ERROR:", error);
      Alert.alert("Error", error?.message || "No se pudo guardar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={{ flex: 1 }} lightColor="#F7F3EC">
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <View
          style={{
            backgroundColor: "#EDF5FF",
            borderRadius: 24,
            padding: 24,
            borderWidth: 1,
            borderColor: "#CFE1FA",
          }}
        >
          <ThemedText type="title" style={{ color: "#000000" }}>
            Nuevo Medicamento
          </ThemedText>

          <ThemedText
            style={{ marginTop: 10, opacity: 0.72, color: "#000000" }}
          >
            Agrega un medicamento con su dosis y horario para recordarlo cada
            día.
          </ThemedText>

          {/* NOMBRE */}
          <View
            style={{
              marginTop: 22,
              backgroundColor: "#FDF1E3",
              borderRadius: 20,
              padding: 18,
            }}
          >
            <ThemedText type="defaultSemiBold" style={{ color: "#000000" }}>
              Nombre
            </ThemedText>

            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Ej: Paracetamol"
              placeholderTextColor="#6B7280"
              style={inputStyle}
            />
          </View>

          {/* DOSIS */}
          <View
            style={{
              marginTop: 14,
              backgroundColor: "#FFF7E8",
              borderRadius: 20,
              padding: 18,
            }}
          >
            <ThemedText type="defaultSemiBold" style={{ color: "#000000" }}>
              Dosis
            </ThemedText>

            <TextInput
              value={dose}
              onChangeText={setDose}
              placeholder="Ej: 1"
              keyboardType="numeric"
              placeholderTextColor="#6B7280"
              style={inputStyle}
            />
          </View>

          {/* HORA */}
          <View
            style={{
              marginTop: 14,
              backgroundColor: "#FFF7E8",
              borderRadius: 20,
              padding: 18,
            }}
          >
            <ThemedText type="defaultSemiBold" style={{ color: "#000000" }}>
              Horario
            </ThemedText>

            <Pressable
              onPress={() => setShowPicker(true)}
              style={{
                marginTop: 10,
                backgroundColor: "#FFFFFF",
                borderRadius: 14,
                paddingVertical: 14,
                paddingHorizontal: 16,
              }}
            >
              <ThemedText style={{ color: "#000000" }}>
                {formatTime(time)}
              </ThemedText>
            </Pressable>

            <ThemedText
              style={{ marginTop: 8, opacity: 0.65, color: "#000000" }}
            >
              Se usará para programar el recordatorio diario.
            </ThemedText>

            {showPicker && (
              <DateTimePicker
                value={time}
                mode="time"
                is24Hour
                display="default"
                onChange={(_event, selected) => {
                  setShowPicker(false);
                  if (selected) setTime(selected);
                }}
              />
            )}
          </View>

          {/* BOTÓN */}
          <Pressable
            onPress={handleSave}
            disabled={loading}
            style={{
              marginTop: 24,
              backgroundColor: "#CFE1FA",
              paddingVertical: 15,
              borderRadius: 16,
            }}
          >
            <ThemedText
              style={{
                color: "#173B67",
                textAlign: "center",
                fontWeight: "700",
              }}
            >
              {loading ? "Guardando..." : "Guardar medicamento"}
            </ThemedText>
          </Pressable>
        </View>
      </ScrollView>
    </ThemedView>
  );
}
