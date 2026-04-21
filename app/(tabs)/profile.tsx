import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { Pressable, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export default function Profile() {
  const { profile, user, signOut } = useAuth();
  const router = useRouter();

  const calcularEdad = (fecha?: string) => {
    if (!fecha) return null;

    const hoy = new Date();
    const nacimiento = new Date(fecha);

    if (isNaN(nacimiento.getTime())) return null;

    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }

    return edad;
  };

  const generoMap: Record<string, string> = {
    male: "Hombre",
    female: "Mujer",
    male_trans: "Hombre trans",
    female_trans: "Mujer trans",
    other: "Otro",
  };

  const edad = calcularEdad(profile?.fecha_nacimiento);

  return (
    <ThemedView style={{ flex: 1, padding: 20 }}>
      <ThemedText type="title">RecuerdaMed</ThemedText>

      {!profile ? (
        <ThemedText style={{ marginTop: 20 }}>Cargando perfil...</ThemedText>
      ) : (
        <>
          <View style={{ marginTop: 20 }}>
            <ThemedText style={{ opacity: 0.6 }}>Cuenta</ThemedText>

            <ThemedText style={{ marginTop: 6, fontSize: 20 }}>
              {profile.nombre} {profile.apellido}
            </ThemedText>

            <ThemedText style={{ opacity: 0.6 }}>{user?.email}</ThemedText>
          </View>

          <View style={{ marginTop: 20 }}>
            {edad !== null && <ThemedText>{edad} anos</ThemedText>}

            {profile.genero && (
              <ThemedText>
                {generoMap[profile.genero] || profile.genero}
              </ThemedText>
            )}

            <ThemedText style={{ marginTop: 6 }}>
              Plan: {profile.plan || "free"}
            </ThemedText>
          </View>

          <Pressable
            onPress={() => router.push("/edit-profile")}
            style={{
              marginTop: 30,
              backgroundColor: "#007AFF",
              padding: 14,
              borderRadius: 12,
            }}
          >
            <ThemedText style={{ color: "#fff", textAlign: "center" }}>
              Editar perfil
            </ThemedText>
          </Pressable>

          <Pressable
            onPress={() => router.push("/legal")}
            style={{
              marginTop: 20,
              backgroundColor: "#F2F2F7",
              padding: 14,
              borderRadius: 12,
            }}
          >
            <ThemedText style={{ textAlign: "center" }}>
              Privacidad y datos
            </ThemedText>
          </Pressable>

          <Pressable
            onPress={() => router.push("/delete-account")}
            style={{
              marginTop: 12,
              backgroundColor: "#FFE5E5",
              padding: 14,
              borderRadius: 12,
            }}
          >
            <ThemedText style={{ textAlign: "center", color: "#B00020" }}>
              Eliminar cuenta
            </ThemedText>
          </Pressable>

          {profile.plan !== "pro" && (
            <ThemedText style={{ marginTop: 20, opacity: 0.7 }}>
              PRO quedo deshabilitado temporalmente mientras actualizamos las
              compras para cumplir con Google Play.
            </ThemedText>
          )}
        </>
      )}

      <Pressable
        onPress={signOut}
        style={{
          marginTop: 20,
          backgroundColor: "red",
          padding: 14,
          borderRadius: 12,
        }}
      >
        <ThemedText style={{ color: "#fff", textAlign: "center" }}>
          Cerrar sesion
        </ThemedText>
      </Pressable>
    </ThemedView>
  );
}
