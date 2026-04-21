import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Alert, Pressable, ScrollView, TextInput, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/context/AuthContext";
import { useMedication } from "@/context/MedicationContext";
import { useThemeColor } from "@/hooks/use-theme-color";

import { scheduleNotification } from "@/utils/notification";

import { createMedicationWithSchedule } from "@/services/medicationService";

import { generateTodayIntakes } from "@/api/intakes";

export default function CreateMedication() {
  const { user } = useAuth();
  const { refreshRemote } = useMedication();

  const textColor = useThemeColor({}, "text");
  const cardBg = useThemeColor(
    { light: "#FFFFFF", dark: "#2C2C2E" },
    "background",
  );

  const [name, setName] = useState("");
  const [dose, setDose] = useState("");
  const [time, setTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const formatTime = (date: Date) => {
    const h = String(date.getHours()).padStart(2, "0");
    const m = String(date.getMinutes()).padStart(2, "0");
    return `${h}:${m}`;
  };

  const handleSave = async () => {
    if (!user) {
      return Alert.alert("Error", "Debes iniciar sesión");
    }

    if (!CreateMedication) {
      return Alert.alert(
        "Límite alcanzado",
        "Plan FREE permite solo 3 medicamentos.\nActualiza a PRO 🚀",
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

      await scheduleNotification(name, timeStr);

      await createMedicationWithSchedule(
        user.id,
        name.trim(),
        Number(dose),
        timeStr,
      );

      await generateTodayIntakes(user.id);

      await refreshRemote();

      Alert.alert("✅ Guardado", "Medicamento creado correctamente");

      setName("");
      setDose("");
      setTime(new Date());
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "No se pudo guardar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={{ flex: 1 }} lightColor="#F2F2F7">
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <ThemedText type="title" style={{ marginBottom: 20 }}>
          💊 RecuerdaMed - Crear Pastilla
        </ThemedText>

        {/* Nombre */}
        <View
          style={{
            backgroundColor: cardBg,
            padding: 16,
            borderRadius: 16,
            marginBottom: 16,
          }}
        >
          <ThemedText>Nombre</ThemedText>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Ej: Paracetamol"
            placeholderTextColor="#999"
            style={{ color: textColor, marginTop: 8 }}
          />
        </View>

        {/* Dosis */}
        <View
          style={{
            backgroundColor: cardBg,
            padding: 16,
            borderRadius: 16,
            marginBottom: 16,
          }}
        >
          <ThemedText>Dosis</ThemedText>
          <TextInput
            value={dose}
            onChangeText={setDose}
            placeholder="Ej: 1"
            keyboardType="numeric"
            placeholderTextColor="#999"
            style={{ color: textColor, marginTop: 8 }}
          />
        </View>

        {/* Hora */}
        <View
          style={{
            backgroundColor: cardBg,
            padding: 16,
            borderRadius: 16,
            marginBottom: 16,
          }}
        >
          <ThemedText>Hora</ThemedText>

          <Pressable onPress={() => setShowPicker(true)}>
            <ThemedText style={{ marginTop: 8, fontSize: 16 }}>
              {formatTime(time)}
            </ThemedText>
          </Pressable>

          {showPicker && (
            <DateTimePicker
              value={time}
              mode="time"
              is24Hour
              display="default"
              onChange={(e, selected) => {
                setShowPicker(false);
                if (selected) setTime(selected);
              }}
            />
          )}
        </View>

        {/* Botón */}
        <Pressable
          onPress={handleSave}
          disabled={loading}
          style={{
            backgroundColor: loading ? "#999" : "#007AFF",
            padding: 16,
            borderRadius: 16,
            alignItems: "center",
          }}
        >
          <ThemedText style={{ color: "#fff", fontWeight: "bold" }}>
            {loading ? "Guardando..." : "Guardar medicamento"}
          </ThemedText>
        </Pressable>
      </ScrollView>
    </ThemedView>
  );
}
