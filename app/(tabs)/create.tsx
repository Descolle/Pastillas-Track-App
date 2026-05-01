import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Alert, Pressable, ScrollView, TextInput, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/context/AuthContext";
import { useMedication } from "@/context/MedicationContext";
import { useSettings } from "@/context/SettingsContext";
import {
  createMedicationWithSchedule,
  loadRemotePastillas,
} from "@/services/medicationService";
import { scheduleMedicationNotification } from "@/services/notificationService";

export default function CreateMedication() {
  const { user } = useAuth();
  const { refreshRemote, canCreateMedication } = useMedication();
  const { t, theme } = useSettings();

  const [name, setName] = useState("");
  const [dose, setDose] = useState("");
  const [time, setTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputStyle = {
    marginTop: 10,
    backgroundColor: theme === "dark" ? "#111827" : "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    color: theme === "dark" ? "#FFFFFF" : "#111111",
    fontSize: 16,
  } as const;

  const formatTime = (date: Date) => {
    const h = String(date.getHours()).padStart(2, "0");
    const m = String(date.getMinutes()).padStart(2, "0");
    return `${h}:${m}`;
  };

  const handleSave = async () => {
    if (!user) {
      return Alert.alert(t("error"), t("mustSignIn"));
    }

    if (!canCreateMedication) {
      return Alert.alert(t("limitReached"), t("planLimitReached"));
    }

    if (!name.trim()) {
      return Alert.alert(t("error"), t("nameRequired"));
    }

    if (!dose || Number(dose) <= 0) {
      return Alert.alert(t("error"), t("invalidDose"));
    }

    try {
      setLoading(true);

      const timeStr = formatTime(time);

      await createMedicationWithSchedule(
        user.id,
        name.trim(),
        Number(dose),
        timeStr,
      );

      const newMedication = (await loadRemotePastillas(user.id)).find(
        (p) => p.nombre === name.trim() && p.time === timeStr,
      );

      if (newMedication) {
        await scheduleMedicationNotification(newMedication.id, name, timeStr);
      }

      await refreshRemote();

      Alert.alert(t("saved"), t("medicationCreated"));

      setName("");
      setDose("");
      setTime(new Date());
    } catch (error: any) {
      console.log("CREATE ERROR:", error);
      Alert.alert(t("error"), error?.message || t("couldNotSave"));
    } finally {
      setLoading(false);
    }
  };

  const surface = theme === "dark" ? "#1F2937" : "#EDF5FF";
  const fieldSurface = theme === "dark" ? "#273548" : "#FFF7E8";
  const textColor = theme === "dark" ? "#FFFFFF" : "#000000";

  return (
    <ThemedView style={{ flex: 1 }} lightColor="#F7F3EC">
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <View
          style={{
            backgroundColor: surface,
            borderRadius: 24,
            padding: 24,
            borderWidth: 1,
            borderColor: theme === "dark" ? "#344055" : "#CFE1FA",
          }}
        >
          <ThemedText type="title" style={{ color: textColor }}>
            {t("newMedication")}
          </ThemedText>

          <ThemedText style={{ marginTop: 10, opacity: 0.72, color: textColor }}>
            {t("newMedicationDescription")}
          </ThemedText>

          <View
            style={{
              marginTop: 22,
              backgroundColor: fieldSurface,
              borderRadius: 20,
              padding: 18,
            }}
          >
            <ThemedText type="defaultSemiBold" style={{ color: textColor }}>
              {t("name")}
            </ThemedText>

            <TextInput
              value={name}
              onChangeText={setName}
              placeholder={t("exampleMedicine")}
              placeholderTextColor="#6B7280"
              style={inputStyle}
            />
          </View>

          <View
            style={{
              marginTop: 14,
              backgroundColor: fieldSurface,
              borderRadius: 20,
              padding: 18,
            }}
          >
            <ThemedText type="defaultSemiBold" style={{ color: textColor }}>
              {t("dose")}
            </ThemedText>

            <TextInput
              value={dose}
              onChangeText={setDose}
              placeholder={t("exampleDose")}
              keyboardType="numeric"
              placeholderTextColor="#6B7280"
              style={inputStyle}
            />
          </View>

          <View
            style={{
              marginTop: 14,
              backgroundColor: fieldSurface,
              borderRadius: 20,
              padding: 18,
            }}
          >
            <ThemedText type="defaultSemiBold" style={{ color: textColor }}>
              {t("time")}
            </ThemedText>

            <Pressable onPress={() => setShowPicker(true)} style={inputStyle}>
              <ThemedText style={{ color: textColor }}>
                {formatTime(time)}
              </ThemedText>
            </Pressable>

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
              {loading ? t("saving") : t("saveMedication")}
            </ThemedText>
          </Pressable>
        </View>
      </ScrollView>
    </ThemedView>
  );
}
