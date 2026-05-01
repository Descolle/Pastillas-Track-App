import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/context/AuthContext";
import { useSettings } from "@/context/SettingsContext";
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
  const { t, theme } = useSettings();
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
        setStats(await getWeeklyAdherence(user.id));
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
    male: t("male"),
    female: t("female"),
    male_trans: t("maleTrans"),
    female_trans: t("femaleTrans"),
    other: t("other"),
  };

  const edad = calcularEdad(profile?.fecha_nacimiento);
  const cardBg = theme === "dark" ? "#1F2937" : "#FFF7E8";
  const statsBg = theme === "dark" ? "#273548" : "#EDF5FF";
  const textColor = theme === "dark" ? "#FFFFFF" : "#000000";

  return (
    <ThemedView style={{ flex: 1 }} lightColor="#F7F3EC">
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <ThemedText type="title">{t("profileTitle")}</ThemedText>

        {!profile ? (
          <ThemedText style={{ marginTop: 20 }}>{t("loadingProfile")}</ThemedText>
        ) : (
          <>
            <View
              style={{
                backgroundColor: cardBg,
                padding: 20,
                borderRadius: 22,
                marginTop: 20,
                borderWidth: 1,
                borderColor: theme === "dark" ? "#344055" : "#F0D9A7",
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

              <ThemedText type="subtitle" style={{ color: textColor }}>
                {profile.nombre} {profile.apellido}
              </ThemedText>

              <ThemedText style={{ opacity: 0.65, color: textColor }}>
                {user?.email}
              </ThemedText>

              <View style={{ marginTop: 16, gap: 6 }}>
                {edad !== null && (
                  <ThemedText style={{ color: textColor }}>
                    {edad} {t("years")}
                  </ThemedText>
                )}

                {profile.genero && (
                  <ThemedText style={{ color: textColor }}>
                    {generoMap[profile.genero] || profile.genero}
                  </ThemedText>
                )}

                <ThemedText style={{ color: textColor }}>
                  {t("plan")}: {profile.plan || "free"}
                </ThemedText>
              </View>
            </View>

            <View
              style={{
                backgroundColor: statsBg,
                padding: 20,
                borderRadius: 22,
                marginTop: 16,
                borderWidth: 1,
                borderColor: theme === "dark" ? "#344055" : "#CFE1FA",
              }}
            >
              <ThemedText type="subtitle" style={{ color: textColor }}>
                {t("weeklyProgress")}
              </ThemedText>

              {statsLoading ? (
                <View style={{ paddingVertical: 24 }}>
                  <ActivityIndicator />
                </View>
              ) : !stats ? (
                <ThemedText style={{ marginTop: 12, color: textColor }}>
                  {t("noStats")}
                </ThemedText>
              ) : (
                <>
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
                        backgroundColor: theme === "dark" ? "#111827" : "#FFFFFF",
                        padding: 16,
                        borderRadius: 16,
                      }}
                    >
                      <ThemedText style={{ opacity: 0.7, color: textColor }}>
                        {t("weeklyAdherence")}
                      </ThemedText>

                      <ThemedText
                        style={{
                          fontSize: 30,
                          fontWeight: "700",
                          color: textColor,
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

                  <View style={{ marginTop: 20 }}>
                    <ThemedText
                      type="defaultSemiBold"
                      style={{ color: textColor }}
                    >
                      {t("lastSevenDays")}
                    </ThemedText>

                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "flex-end",
                        justifyContent: "space-around",
                        height: 170,
                        marginTop: 18,
                        paddingTop: 12,
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
                          style={{ fontSize: 10, color: textColor }}
                        >
                          {day.day}
                        </ThemedText>
                      ))}
                    </View>
                  </View>
                </>
              )}
            </View>

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
                {t("editProfile")}
              </ThemedText>
            </Pressable>

            <Pressable
              onPress={() => router.push("/legal")}
              style={{
                marginTop: 12,
                backgroundColor: theme === "dark" ? "#111827" : "#FFFFFF",
                padding: 14,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: theme === "dark" ? "#344055" : "#E9E0D5",
              }}
            >
              <ThemedText style={{ textAlign: "center", color: textColor }}>
                {t("privacyData")}
              </ThemedText>
            </Pressable>

            <Pressable
              onPress={signOut}
              style={{
                marginTop: 20,
                backgroundColor: theme === "dark" ? "#273548" : "#E7EEF7",
                padding: 14,
                borderRadius: 16,
              }}
            >
              <ThemedText style={{ textAlign: "center", color: textColor }}>
                {t("signOut")}
              </ThemedText>
            </Pressable>
          </>
        )}
      </ScrollView>
    </ThemedView>
  );
}
