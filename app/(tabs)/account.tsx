import { Alert, Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/context/AuthContext";
import { useMedication } from "@/context/MedicationContext";
import { startCheckout, openBillingPortal } from "@/services/billingService";

export default function AccountScreen() {
  const { user, profile, signOut, refreshProfile } = useAuth();
  const { planTier, limits } = useMedication();

  const upgrade = async () => {
    try {
      await startCheckout("pro");
    } catch (error) {
      Alert.alert("Billing no disponible", String(error));
    }
  };

  const openPortal = async () => {
    try {
      await openBillingPortal();
    } catch (error) {
      Alert.alert("Portal no disponible", String(error));
    }
  };

  return (
    <ThemedView style={styles.root} lightColor="#F2F2F7">
      <View style={styles.card}>
        <ThemedText type="title">Cuenta</ThemedText>
        <ThemedText style={styles.row}>Email: {user?.email ?? "N/A"}</ThemedText>
        <ThemedText style={styles.row}>Plan: {planTier.toUpperCase()}</ThemedText>
        <ThemedText style={styles.row}>
          Límite de recordatorios: {limits.maxMedications}
        </ThemedText>
        <ThemedText style={styles.row}>
          Estado suscripción: {profile?.stripe_subscription_status ?? "no_activa"}
        </ThemedText>
      </View>

      <Pressable style={styles.primary} onPress={upgrade}>
        <ThemedText style={styles.primaryText}>Pasar a Pro</ThemedText>
      </Pressable>

      <Pressable style={styles.secondary} onPress={openPortal}>
        <ThemedText>Gestionar suscripción</ThemedText>
      </Pressable>

      <Pressable
        style={styles.secondary}
        onPress={() => {
          refreshProfile().catch(() => undefined);
        }}
      >
        <ThemedText>Actualizar estado</ThemedText>
      </Pressable>

      <Pressable
        style={styles.signOut}
        onPress={() => {
          signOut().catch((error) => Alert.alert("Error", String(error)));
        }}
      >
        <ThemedText style={styles.signOutText}>Cerrar sesión</ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 18,
  },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#D0D0D0",
    padding: 16,
    marginBottom: 14,
    backgroundColor: "#fff",
  },
  row: {
    marginTop: 8,
  },
  primary: {
    backgroundColor: "#0A84FF",
    borderRadius: 10,
    paddingVertical: 12,
    marginBottom: 10,
  },
  primaryText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
  },
  secondary: {
    borderColor: "#D0D0D0",
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  signOut: {
    marginTop: 10,
    alignSelf: "center",
  },
  signOutText: {
    color: "#C62828",
    fontWeight: "700",
  },
});
