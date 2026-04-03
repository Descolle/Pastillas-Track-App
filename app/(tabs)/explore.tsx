import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useMedication } from "@/context/MedicationContext";
import { StyleSheet } from "react-native";

export default function Dashboard() {
  const { pastillas } = useMedication();

  const total = pastillas.length;
  const tomadas = pastillas.filter((p) => p.tomada).length;
  const pendientes = total - tomadas;

  const siguiente = pastillas
    .filter((p) => !p.tomada)
    .sort((a, b) => a.tiempo.localeCompare(b.tiempo))[0];

  return (
    <ParallaxScrollView>
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
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
});
