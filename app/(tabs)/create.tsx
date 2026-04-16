import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Alert, Pressable, ScrollView, TextInput, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useMedication } from "@/context/MedicationContext";
import { useThemeColor } from "@/hooks/use-theme-color";
import { scheduleNotification } from "@/utils/notification";

export default function CreateMedication() {
  const { setPastillas } = useMedication();

  const textColor = useThemeColor({}, "text");
  const cardBg = useThemeColor(
    { light: "#FFFFFF", dark: "#2C2C2E" },
    "background",
  );

  const [name, setName] = useState("");
  const [dose, setDose] = useState("");
  const [time, setTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const formatTime = (date: Date) => {
    const h = String(date.getHours()).padStart(2, "0");
    const m = String(date.getMinutes()).padStart(2, "0");
    return `${h}:${m}`;
  };

  const handleSave = async () => {
    if (!name.trim()) {
      return Alert.alert("Error", "El nombre es obligatorio");
    }

    if (!dose || Number(dose) <= 0) {
      return Alert.alert("Error", "Dosis inválida");
    }

    try {
      const timeStr = formatTime(time);

      const notificationId = await scheduleNotification(name, timeStr);

      const nueva = {
        id: Date.now().toString(),
        nombre: name.trim(),
        cantidad: Number(dose),
        tiempo: timeStr,
        tomada: false,
        notificationId,
      };

      setPastillas((prev) => [...prev, nueva]);

      Alert.alert("✅ Guardado", "Medicamento creado correctamente");

      // reset
      setName("");
      setDose("");
      setTime(new Date());
    } catch (err) {
      Alert.alert("Error", "No se pudo guardar");
    }
  };

  return (
    <ThemedView style={{ flex: 1 }} lightColor="#F2F2F7">
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <ThemedText type="title" style={{ marginBottom: 20 }}>
          ➕ Nuevo medicamento
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
          style={{
            backgroundColor: "#007AFF",
            padding: 16,
            borderRadius: 16,
            alignItems: "center",
          }}
        >
          <ThemedText style={{ color: "#fff", fontWeight: "bold" }}>
            Guardar medicamento
          </ThemedText>
        </Pressable>
      </ScrollView>
    </ThemedView>
  );
}
