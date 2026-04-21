import { ThemedText } from "@/components/themed-text";
import { purchaseProduct } from "@/services/payments";
import { Pressable, View } from "react-native";

export default function Paywall() {
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <ThemedText type="title">🚀 RecuerdaMed PRO</ThemedText>

      <ThemedText style={{ marginTop: 20 }}>
        🔓 Medicamentos ilimitados
      </ThemedText>

      <ThemedText>📊 Estadísticas completas</ThemedText>
      <ThemedText>🔔 Notificaciones avanzadas</ThemedText>

      <ThemedText style={{ marginTop: 20, fontSize: 18 }}>
        $7.000 CLP (pago único)
      </ThemedText>

      <Pressable
        onPress={() => purchaseProduct("plan_pro")}
        style={{
          marginTop: 30,
          backgroundColor: "gold",
          padding: 16,
          borderRadius: 12,
        }}
      >
        <ThemedText style={{ textAlign: "center" }}>Activar PRO</ThemedText>
      </Pressable>
    </View>
  );
}
