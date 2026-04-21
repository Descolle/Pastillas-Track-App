import { useState } from "react";
import { Alert, Pressable, ScrollView, TextInput, View } from "react-native";
import { router } from "expo-router";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/context/AuthContext";

const CONFIRMATION_TEXT = "ELIMINAR";

export default function DeleteAccountScreen() {
  const { deleteAccount, user } = useAuth();
  const [confirmation, setConfirmation] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (loading) return;

    if (confirmation.trim().toUpperCase() !== CONFIRMATION_TEXT) {
      Alert.alert(
        "Confirmacion invalida",
        `Escribe ${CONFIRMATION_TEXT} para continuar.`,
      );
      return;
    }

    try {
      setLoading(true);
      await deleteAccount();
      Alert.alert(
        "Cuenta eliminada",
        "Tu cuenta y tus datos principales fueron eliminados.",
      );
      router.replace("/sign-in");
    } catch (error: any) {
      Alert.alert(
        "No se pudo eliminar la cuenta",
        error?.message ?? "Intentalo nuevamente en unos minutos.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <ThemedText type="title">Eliminar cuenta</ThemedText>

        <ThemedText style={{ marginTop: 16 }}>
          Esta accion elimina tu acceso y los datos asociados a
          {user?.email ? ` ${user.email}` : " tu cuenta"}.
        </ThemedText>

        <View
          style={{
            marginTop: 20,
            padding: 16,
            borderRadius: 12,
            backgroundColor: "#FFF4F4",
          }}
        >
          <ThemedText type="defaultSemiBold">Que se eliminara</ThemedText>
          <ThemedText style={{ marginTop: 10 }}>
            Perfil, medicamentos, horarios, intakes y pagos asociados por
            cascada en la base de datos.
          </ThemedText>
          <ThemedText style={{ marginTop: 10 }}>
            La accion es permanente y cierra tu sesion.
          </ThemedText>
        </View>

        <ThemedText style={{ marginTop: 20 }}>
          Para confirmar, escribe {CONFIRMATION_TEXT}.
        </ThemedText>

        <TextInput
          autoCapitalize="characters"
          value={confirmation}
          onChangeText={setConfirmation}
          placeholder={CONFIRMATION_TEXT}
          style={{
            marginTop: 12,
            borderBottomWidth: 1,
            padding: 10,
          }}
        />

        <Pressable
          onPress={handleDelete}
          style={{
            marginTop: 24,
            backgroundColor: "#B00020",
            padding: 14,
            borderRadius: 12,
          }}
        >
          <ThemedText style={{ color: "#fff", textAlign: "center" }}>
            {loading ? "Eliminando..." : "Eliminar cuenta"}
          </ThemedText>
        </Pressable>

        <Pressable
          onPress={() => router.back()}
          style={{
            marginTop: 12,
            backgroundColor: "#F2F2F7",
            padding: 14,
            borderRadius: 12,
          }}
        >
          <ThemedText style={{ textAlign: "center" }}>Cancelar</ThemedText>
        </Pressable>
      </ScrollView>
    </ThemedView>
  );
}
