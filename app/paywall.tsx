import { View } from "react-native";

import { ThemedText } from "@/components/themed-text";

export default function Paywall() {
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <ThemedText type="title">RecuerdaMed PRO</ThemedText>

      <ThemedText style={{ marginTop: 20 }}>
        Estamos migrando el sistema de compras para cumplir con la version
        vigente de Google Play Billing.
      </ThemedText>

      <ThemedText style={{ marginTop: 12 }}>
        Mientras tanto, la app puede publicarse como version gratuita y luego
        reactivar PRO cuando la integracion este actualizada.
      </ThemedText>
    </View>
  );
}
