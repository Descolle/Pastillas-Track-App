import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { getTodayStats } from "../../src/api/stats";
import { supabase } from "../../src/api/supabase";
import { useAuth } from "../../src/hooks/useAuth";

export default function Dashboard() {
  const { user } = useAuth();

  const [stats, setStats] = useState(null);
  const [nextDose, setNextDose] = useState(null);
  const [loading, setLoading] = useState(true);

  const border = useThemeColor({ light: "#C6C6C8", dark: "#3A3A3C" }, "icon");
  const cardBg = useThemeColor(
    { light: "#FFFFFF", dark: "#2C2C2E" },
    "background",
  );

  useEffect(() => {
    const load = async () => {
      if (!user) return;

      try {
        const today = new Date().toISOString().split("T")[0];

        // 🔥 stats
        const statsData = await getTodayStats(user.id);
        setStats(statsData);

        // 🔥 próxima dosis real
        const { data, error } = await supabase
          .from("intakes")
          .select(
            `
            taken,
            schedules (
              time,
              medications (
                name,
                user_id
              )
            )
          `,
          )
          .eq("date", today)
          .eq("schedules.medications.user_id", user.id);

        if (error) throw error;

        const now = new Date();

        const next = data
          .filter((i) => !i.taken)
          .map((i) => {
            const time = i.schedules.time;
            const [h, m] = time.split(":");

            const d = new Date();
            d.setHours(Number(h));
            d.setMinutes(Number(m));
            d.setSeconds(0);

            return {
              name: i.schedules.medications.name,
              time,
              date: d,
            };
          })
          .filter((d) => d.date >= now)
          .sort((a, b) => a.date.getTime() - b.date.getTime())[0];

        setNextDose(next || null);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user]);

  if (loading || !stats) {
    return (
      <ThemedView style={[styles.centered, styles.flex]} lightColor="#F2F2F7">
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.flex} lightColor="#F2F2F7">
      <View style={styles.inner}>
        <ThemedText type="title" style={styles.title}>
          💊 Resumen
        </ThemedText>

        {/* 📊 Stats */}
        <View
          style={[
            styles.card,
            { borderColor: border, backgroundColor: cardBg },
          ]}
        >
          <ThemedText type="subtitle">Hoy</ThemedText>

          <ThemedText style={styles.statLine}>
            Total: <ThemedText type="defaultSemiBold">{stats.total}</ThemedText>
          </ThemedText>

          <ThemedText style={styles.statLine}>
            Tomadas:{" "}
            <ThemedText type="defaultSemiBold">{stats.taken}</ThemedText>
          </ThemedText>

          <ThemedText style={styles.statLine}>
            Pendientes:{" "}
            <ThemedText type="defaultSemiBold">{stats.pending}</ThemedText>
          </ThemedText>

          <ThemedText style={styles.statLine}>
            Cumplimiento:{" "}
            <ThemedText type="defaultSemiBold">{stats.percentage}%</ThemedText>
          </ThemedText>
        </View>

        {/* ⏰ Próxima dosis */}
        <View
          style={[
            styles.card,
            { borderColor: border, backgroundColor: cardBg },
          ]}
        >
          <ThemedText type="subtitle">Próxima dosis</ThemedText>

          <ThemedText style={styles.next}>
            {nextDose
              ? `${nextDose.name} · ${nextDose.time}`
              : "Nada pendiente 🎉"}
          </ThemedText>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  inner: {
    flex: 1,
    padding: 20,
  },
  title: {
    marginBottom: 20,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 14,
  },
  statLine: {
    marginTop: 8,
    fontSize: 16,
  },
  next: {
    marginTop: 10,
    fontSize: 17,
    lineHeight: 24,
  },
});
