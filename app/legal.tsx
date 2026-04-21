import type { ReactNode } from "react";
import { router } from "expo-router";
import { Pressable, ScrollView, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <View
      style={{
        marginTop: 20,
        padding: 16,
        borderRadius: 12,
        backgroundColor: "#F2F2F7",
      }}
    >
      <ThemedText type="subtitle">{title}</ThemedText>
      <View style={{ marginTop: 12 }}>{children}</View>
    </View>
  );
}

export default function LegalScreen() {
  return (
    <ThemedView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <ThemedText type="title">Privacidad y datos</ThemedText>

        <ThemedText style={{ marginTop: 12 }}>
          RecuerdaMed usa tus datos para crear la cuenta, sincronizar tus
          medicamentos y enviar recordatorios. No vende tus datos personales.
        </ThemedText>

        <Section title="Datos que procesa la app">
          <ThemedText>Correo electronico para autenticacion.</ThemedText>
          <ThemedText>
            Nombre, apellido, fecha de nacimiento y genero para el perfil.
          </ThemedText>
          <ThemedText>
            Medicamentos, horarios y estado de toma para el seguimiento diario.
          </ThemedText>
        </Section>

        <Section title="Para que se usan">
          <ThemedText>
            Crear y mantener tu cuenta sincronizada con Supabase.
          </ThemedText>
          <ThemedText>
            Mostrar tus recordatorios y el resumen diario de adherencia.
          </ThemedText>
          <ThemedText>
            Permitir soporte, seguridad basica y continuidad del servicio.
          </ThemedText>
        </Section>

        <Section title="Control de tu cuenta">
          <ThemedText>
            Puedes editar tu perfil desde esta app y tambien eliminar tu cuenta
            desde la opcion dedicada.
          </ThemedText>
          <ThemedText>
            Al eliminar la cuenta se borra tu acceso y los datos vinculados en
            la base principal.
          </ThemedText>
        </Section>

        <Section title="Publicacion web requerida por Google Play">
          <ThemedText>
            Los documentos listos para publicar quedaron en la carpeta docs/.
            Activa GitHub Pages o subelos a tu hosting y usa esas URLs en
            Google Play Console.
          </ThemedText>
        </Section>

        <Pressable
          onPress={() => router.back()}
          style={{
            marginTop: 24,
            backgroundColor: "#007AFF",
            padding: 14,
            borderRadius: 12,
          }}
        >
          <ThemedText style={{ color: "#fff", textAlign: "center" }}>
            Volver
          </ThemedText>
        </Pressable>
      </ScrollView>
    </ThemedView>
  );
}
