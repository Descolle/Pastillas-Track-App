import { supabase } from "@/api/supabase";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/context/AuthContext";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function Dashboard() {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    total: 0,
    taken: 0,
    pending: 0,
    nextDose: null as null | { name: string; time: string },
  });

  const [loading, setLoading] = useState(true);

  const border = useThemeColor({ light: "#C6C6C8", dark: "#3A3A3C" }, "icon");
  const cardBg = useThemeColor(
    { light: "#FFFFFF", dark: "#2C2C2E" },
    "background",
  );

  useEffect(() => {
    const loadStats = async () => {
      if (!user) return;

      try {
        const today = new Date().toISOString().split("T")[0];

        // 🔥 traer intakes + relaciones
        const { data, error } = await supabase
          .from("intakes")
          .select(
            `
            taken,
            date,
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

        const total = data.length;
        const taken = data.filter((i) => i.taken).length;
        const pending = total - taken;

        // 🔥 próxima dosis
        const now = new Date();

        const next = data
          .filter((i) => !i.taken)
          .map((i) => {
            const time = i.schedules.time;
            const [h, m] = time.split(":");

            const doseDate = new Date();
            doseDate.setHours(Number(h));
            doseDate.setMinutes(Number(m));
            doseDate.setSeconds(0);

            return {
              name: i.schedules.medications.name,
              time,
              date: doseDate,
            };
          })
          .filter((d) => d.date >= now)
          .sort((a, b) => a.date.getTime() - b.date.getTime())[0];

        setStats({
          total,
          taken,
          pending,
          nextDose: next ? { name: next.name, time: next.time } : null,
        });
      } catch (err) {
        console.log("Error loading stats:", err);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [user]);

  if (loading) {
    return (
      <ThemedView style={[styles.centered, styles.flex]} lightColor="#F2F2F7">
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  const percentage =
    stats.total > 0 ? Math.round((stats.taken / stats.total) * 100) : 0;

  return (
    <ThemedView style={styles.flex} lightColor="#F2F2F7">
      <View style={styles.inner}>
        <ThemedText type="title" style={styles.title}>
          💊 Resumen
        </ThemedText>

        {/* 📊 Card Estadísticas */}
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
            <ThemedText type="defaultSemiBold">{percentage}%</ThemedText>
          </ThemedText>
        </View>

        {/* ⏰ Card Próxima dosis */}
        <View
          style={[
            styles.card,
            { borderColor: border, backgroundColor: cardBg },
          ]}
        >
          <ThemedText type="subtitle">Próxima dosis</ThemedText>

          <ThemedText style={styles.next}>
            {stats.nextDose
              ? `${stats.nextDose.name} · ${stats.nextDose.time}`
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
