import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { StyleSheet } from "react-native";
import { useMedication } from "../../context/MedicationContext";

export default function Dashboard() {
  const { pastillas } = useMedication();

  const total = pastillas.length;
  const tomadas = pastillas.filter((p) => p.tomada).length;
  const pendientes = total - tomadas;

  const siguiente = pastillas
    .filter((p) => !p.tomada)
    .sort((a, b) => a.tiempo.localeCompare(b.tiempo))[0];

  return (
    <View>
      <ThemedView style={styles.container}>
        <ThemedText type="title">💊 Resumen</ThemedText>

        <ThemedText>📊 Total: {total}</ThemedText>
        <ThemedText>✅ Tomadas: {tomadas}</ThemedText>
        <ThemedText>❌ Pendientes: {pendientes}</ThemedText>

        <ThemedText>
          ⏰ Próxima:{" "}
          {siguiente
            ? `${siguiente.nombre} - ${siguiente.tiempo}`
            : "Nada pendiente 🎉"}
        </ThemedText>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
});
