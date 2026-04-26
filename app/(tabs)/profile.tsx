import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/context/AuthContext";
import { getWeeklyAdherence } from "@/services/adherenceService";

type WeeklyStats = {
  date: string;
  day: string;
  percentage: number;
}[];

const Bar = ({ value }: { value: number }) => {
  return (
    <View
      style={{
        width: 20,
        height: Math.max(10, value * 1.5),
        backgroundColor: "#7CA8F8",
        borderRadius: 6,
        marginHorizontal: 4,
      }}
    />
  );
};

export default function Profile() {
  const { profile, user, signOut } = useAuth();
  const router = useRouter();

  const [stats, setStats] = useState<WeeklyStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      if (!user?.id) {
        setStats(null);
        setStatsLoading(false);
        return;
      }

      try {
        setStatsLoading(true);

        const data = await getWeeklyAdherence(user.id);

        setStats(data);
      } catch (error) {
        console.log("profile stats error:", error);
        setStats(null);
      } finally {
        setStatsLoading(false);
      }
    };

    loadStats();
  }, [user]);

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
    <ThemedView style={{ flex: 1 }} lightColor="#F7F3EC">
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <ThemedText type="title" style={{ color: "#fdfafa" }}>
          PERFIL
        </ThemedText>

        {!profile ? (
          <ThemedText style={{ marginTop: 20, color: "#000000" }}>
            Cargando perfil...
          </ThemedText>
        ) : (
          <>
            {/* PROFILE CARD */}
            <View
              style={{
                backgroundColor: "#FFF7E8",
                padding: 20,
                borderRadius: 22,
                marginTop: 20,
                borderWidth: 1,
                borderColor: "#F0D9A7",
              }}
            >
              <View
                style={{
                  width: 68,
                  height: 68,
                  borderRadius: 34,
                  backgroundColor: "#F6B26B",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                }}
              >
                <MaterialIcons name="person" size={34} color="#FFFFFF" />
              </View>

              <ThemedText type="subtitle" style={{ color: "#000000" }}>
                {profile.nombre} {profile.apellido}
              </ThemedText>

              <ThemedText style={{ opacity: 0.65, color: "#000000" }}>
                {user?.email}
              </ThemedText>

              <View style={{ marginTop: 16, gap: 6 }}>
                {edad !== null && (
                  <ThemedText style={{ color: "#000000" }}>
                    {edad} años
                  </ThemedText>
                )}

                {profile.genero && (
                  <ThemedText style={{ color: "#000000" }}>
                    {generoMap[profile.genero] || profile.genero}
                  </ThemedText>
                )}

                <ThemedText style={{ color: "#000000" }}>
                  Plan: {profile.plan || "free"}
                </ThemedText>
              </View>
            </View>

            {/* STATS CARD */}
            <View
              style={{
                backgroundColor: "#EDF5FF",
                padding: 20,
                borderRadius: 22,
                marginTop: 16,
                borderWidth: 1,
                borderColor: "#CFE1FA",
              }}
            >
              <ThemedText type="subtitle" style={{ color: "#000000" }}>
                Tu progreso
              </ThemedText>

              {statsLoading ? (
                <View style={{ paddingVertical: 24 }}>
                  <ActivityIndicator />
                </View>
              ) : !stats ? (
                <ThemedText style={{ marginTop: 12, color: "#000000" }}>
                  Aún no hay estadísticas disponibles.
                </ThemedText>
              ) : (
                <>
                  {/* SUMMARY */}
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 12,
                      marginTop: 16,
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        backgroundColor: "#FFFFFF",
                        padding: 16,
                        borderRadius: 16,
                      }}
                    >
                      <ThemedText style={{ opacity: 0.7, color: "#000000" }}>
                        Cumplimiento semanal
                      </ThemedText>

                      <ThemedText
                        style={{
                          fontSize: 30,
                          fontWeight: "700",
                          color: "#000000",
                        }}
                      >
                        {Math.round(
                          stats.reduce((acc, d) => acc + d.percentage, 0) /
                            stats.length,
                        )}
                        %
                      </ThemedText>
                    </View>
                  </View>

                  {/* CHART */}
                  <View style={{ marginTop: 20 }}>
                    <ThemedText
                      type="defaultSemiBold"
                      style={{ color: "#000000" }}
                    >
                      Últimos 7 días
                    </ThemedText>

                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "flex-end",
                        justifyContent: "space-around",
                        height: 120,
                        marginTop: 14,
                      }}
                    >
                      {stats.map((day) => (
                        <Bar key={day.date} value={day.percentage} />
                      ))}
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-around",
                        marginTop: 8,
                      }}
                    >
                      {stats.map((day) => (
                        <ThemedText
                          key={day.date}
                          style={{ fontSize: 10, color: "#000000" }}
                        >
                          {day.day}
                        </ThemedText>
                      ))}
                    </View>
                  </View>
                </>
              )}
            </View>

            {/* ACTIONS */}
            <Pressable
              onPress={() => router.push("/edit-profile")}
              style={{
                marginTop: 20,
                backgroundColor: "#CFE1FA",
                padding: 14,
                borderRadius: 16,
              }}
            >
              <ThemedText style={{ textAlign: "center", color: "#173B67" }}>
                Editar perfil
              </ThemedText>
            </Pressable>

            <Pressable
              onPress={() => router.push("/legal")}
              style={{
                marginTop: 12,
                backgroundColor: "#FFFFFF",
                padding: 14,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: "#E9E0D5",
              }}
            >
              <ThemedText style={{ textAlign: "center", color: "#000000" }}>
                Privacidad y datos
              </ThemedText>
            </Pressable>

            <Pressable
              onPress={signOut}
              style={{
                marginTop: 20,
                backgroundColor: "#E7EEF7",
                padding: 14,
                borderRadius: 16,
              }}
            >
              <ThemedText style={{ textAlign: "center", color: "#000000" }}>
                Cerrar sesión
              </ThemedText>
            </Pressable>
          </>
        )}
      </ScrollView>
    </ThemedView>
  );
}
