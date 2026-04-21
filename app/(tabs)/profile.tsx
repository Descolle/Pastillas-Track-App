import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { Pressable, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { purchaseProduct } from "@/services/payments";

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

  const generoMap: any = {
    male: "Hombre",
    female: "Mujer",
    male_trans: "Hombre trans",
    female_trans: "Mujer trans",
    other: "Otro",
  };

  const edad = calcularEdad(profile?.fecha_nacimiento);

  return (
    <ThemedView style={{ flex: 1, padding: 20 }}>
      <ThemedText type="title">👤 RecuerdaMed</ThemedText>

      {!profile ? (
        <ThemedText style={{ marginTop: 20 }}>Cargando perfil...</ThemedText>
      ) : (
        <>
          {/* 👤 CUENTA */}
          <View style={{ marginTop: 20 }}>
            <ThemedText style={{ opacity: 0.6 }}>Cuenta</ThemedText>

            <ThemedText style={{ marginTop: 6, fontSize: 20 }}>
              {profile.nombre} {profile.apellido}
            </ThemedText>

            <ThemedText style={{ opacity: 0.6 }}>{user?.email}</ThemedText>
          </View>

          {/* 📊 INFO */}
          <View style={{ marginTop: 20 }}>
            {edad !== null && <ThemedText>🎂 {edad} años</ThemedText>}

            {profile.genero && (
              <ThemedText>
                ⚧ {generoMap[profile.genero] || profile.genero}
              </ThemedText>
            )}

            <ThemedText style={{ marginTop: 6 }}>
              💎 Plan: {profile.plan || "free"}
            </ThemedText>
          </View>

          {/* ✏️ EDIT */}
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

          {/* 💰 PRO */}
          {profile.plan !== "pro" && (
            <Pressable
              onPress={() => purchaseProduct("plan_pro")}
              style={{
                marginTop: 20,
                backgroundColor: "gold",
                padding: 14,
                borderRadius: 12,
              }}
            >
              <ThemedText style={{ textAlign: "center" }}>
                Activar PRO 🚀 ($7.000 CLP)
              </ThemedText>
            </Pressable>
          )}
        </>
      )}

      {/* 🚪 LOGOUT */}
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
          Cerrar sesión
        </ThemedText>
      </Pressable>
    </ThemedView>
  );
}
