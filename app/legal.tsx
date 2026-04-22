import { router } from "expo-router";
import { Pressable, ScrollView, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export default function LegalScreen() {
  return (
    <ThemedView
      style={{ flex: 1 }}
      lightColor="#123B6A"
      darkColor="#0B2440"
    >
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 40 }}>
        <View
          style={{
            backgroundColor: "rgba(255,255,255,0.08)",
            borderRadius: 24,
            padding: 24,
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.18)",
          }}
        >
          <ThemedText type="title" style={{ color: "#000000" }}>
            Privacidad y datos
          </ThemedText>

          <ThemedText style={{ marginTop: 16, color: "#000000", lineHeight: 24 }}>
            RecuerdaMed usa tus datos para crear la cuenta, sincronizar tus
            medicamentos y enviar recordatorios. No vende tus datos personales.
          </ThemedText>

          <View style={{ marginTop: 24 }}>
            <ThemedText style={{ color: "#000000", fontWeight: "600" }}>
              Datos que procesa la app
            </ThemedText>
            <View style={{ marginTop: 12 }}>
              <ThemedText style={{ color: "#000000", lineHeight: 20 }}>
                • Correo electronico para autenticacion.
              </ThemedText>
              <ThemedText style={{ color: "#000000", lineHeight: 20 }}>
                Nombre, apellido, fecha de nacimiento y genero para el perfil.
              </ThemedText>
              <ThemedText style={{ color: "#000000", lineHeight: 20 }}>
                Medicamentos, horarios y estado de toma para el seguimiento diario.
              </ThemedText>
            </View>
          </View>

          <View style={{ marginTop: 24 }}>
            <ThemedText style={{ color: "#000000", fontWeight: "600" }}>
              Para que se usan
            </ThemedText>
            <View style={{ marginTop: 12 }}>
              <ThemedText style={{ color: "#000000", lineHeight: 20 }}>
                • Crear y mantener tu cuenta sincronizada con Supabase.
              </ThemedText>
              <ThemedText style={{ color: "#000000", lineHeight: 20 }}>
                • Mostrar tus recordatorios y el resumen diario de adherencia.
              </ThemedText>
              <ThemedText style={{ color: "#000000", lineHeight: 20 }}>
                • Permitir soporte, seguridad basica y continuidad del servicio.
              </ThemedText>
            </View>
          </View>

          <View style={{ marginTop: 24 }}>
            <ThemedText style={{ color: "#000000", fontWeight: "600" }}>
              Control de tu cuenta
            </ThemedText>
            <View style={{ marginTop: 12 }}>
              <ThemedText style={{ color: "#000000", lineHeight: 20 }}>
                • Puedes editar tu perfil desde esta app y tambien eliminar tu cuenta
              </ThemedText>
              <ThemedText style={{ color: "#000000", lineHeight: 20 }}>
                desde la opcion dedicada.
              </ThemedText>
              <ThemedText style={{ color: "#000000", lineHeight: 20 }}>
                • Al eliminar la cuenta se borra tu acceso y los datos vinculados en
              </ThemedText>
              <ThemedText style={{ color: "#000000", lineHeight: 20 }}>
                la base principal.
              </ThemedText>
            </View>
          </View>

          <View style={{ marginTop: 24 }}>
            <ThemedText style={{ color: "#000000", fontWeight: "600" }}>
              Publicacion web requerida por Google Play
            </ThemedText>
            <View style={{ marginTop: 12 }}>
              <ThemedText style={{ color: "#000000", lineHeight: 20 }}>
                • Los documentos listos para publicar quedaron en la carpeta docs/.
              </ThemedText>
              <ThemedText style={{ color: "#000000", lineHeight: 20 }}>
                Activa GitHub Pages o subelos a tu hosting y usa esas URLs en
              </ThemedText>
              <ThemedText style={{ color: "#000000", lineHeight: 20 }}>
                Google Play Console.
              </ThemedText>
            </View>
          </View>

          <Pressable
            onPress={() => router.back()}
            style={{
              marginTop: 32,
              backgroundColor: "#007AFF",
              paddingVertical: 16,
              paddingHorizontal: 24,
              borderRadius: 12,
            }}
          >
            <ThemedText style={{ color: "#FFFFFF", textAlign: "center", fontWeight: "600" }}>
              Volver
            </ThemedText>
          </Pressable>
        </View>
      </ScrollView>
    </ThemedView>
  );
}
