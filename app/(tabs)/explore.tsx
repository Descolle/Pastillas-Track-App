import { ActivityIndicator, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useMedication } from "@/context/MedicationContext";
import { useThemeColor } from "@/hooks/use-theme-color";
import { compareTimeHM } from "@/utils/medication-form";

export default function Dashboard() {
  const { pastillas, hydrated } = useMedication();
  const border = useThemeColor({ light: "#C6C6C8", dark: "#3A3A3C" }, "icon");
  const cardBg = useThemeColor({ light: "#FFFFFF", dark: "#2C2C2E" }, "background");

  const total = pastillas.length;
  const tomadas = pastillas.filter((p) => p.tomada).length;
  const pendientes = total - tomadas;

  const siguiente = pastillas
    .filter((p) => !p.tomada)
    .sort((a, b) => compareTimeHM(a.tiempo, b.tiempo))[0];

  if (!hydrated) {
    return (
      <ThemedView style={[styles.centered, styles.flex]} lightColor="#F2F2F7">
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.flex} lightColor="#F2F2F7">
      <View style={styles.inner}>
        <ThemedText type="title" style={styles.title}>
          💊 Resumen
        </ThemedText>

        <View style={[styles.card, { borderColor: border, backgroundColor: cardBg }]}>
          <ThemedText type="subtitle">Hoy</ThemedText>
          <ThemedText style={styles.statLine}>
            Total: <ThemedText type="defaultSemiBold">{total}</ThemedText>
          </ThemedText>
          <ThemedText style={styles.statLine}>
            Tomadas: <ThemedText type="defaultSemiBold">{tomadas}</ThemedText>
          </ThemedText>
          <ThemedText style={styles.statLine}>
            Pendientes:{" "}
            <ThemedText type="defaultSemiBold">{pendientes}</ThemedText>
          </ThemedText>
        </View>

        <View style={[styles.card, { borderColor: border, backgroundColor: cardBg }]}>
          <ThemedText type="subtitle">Próxima dosis</ThemedText>
          <ThemedText style={styles.next}>
            {siguiente
              ? `${siguiente.nombre} · ${siguiente.tiempo}`
              : "Nada pendiente"}
          </ThemedText>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  inner: {
    flex: 1,
    padding: 20,
  },
  title: {
    marginBottom: 20,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 14,
  },
  statLine: {
    marginTop: 8,
    fontSize: 16,
  },
  next: {
    marginTop: 10,
    fontSize: 17,
    lineHeight: 24,
  },
});
