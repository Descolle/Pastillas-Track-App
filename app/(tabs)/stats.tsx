import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

import { getWeeklyStats } from "@/src/api/stats";

// 📊 gráfico simple sin librerías externas
const Bar = ({ value }: { value: number }) => {
  return (
    <View
      style={{
        width: 20,
        height: Math.max(10, value * 1.5),
        backgroundColor: "#007AFF",
        borderRadius: 6,
        marginHorizontal: 4,
      }}
    />
  );
};

export default function StatsScreen() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      if (!user) return;

      try {
        const data = await getWeeklyStats(user.id);
        setStats(data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user]);

  if (loading) {
    return (
      <ThemedView style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator />
      </ThemedView>
    );
  }

  if (!stats) {
    return (
      <ThemedView style={{ flex: 1, justifyContent: "center" }}>
        <ThemedText>No hay datos aún</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={{ flex: 1, padding: 20 }} lightColor="#F2F2F7">
      {/* 📊 TÍTULO */}
      <ThemedText type="title" style={{ marginBottom: 20 }}>
        📊 Estadísticas
      </ThemedText>

      {/* ✅ % CUMPLIMIENTO */}
      <View
        style={{
          backgroundColor: "#fff",
          padding: 20,
          borderRadius: 16,
          marginBottom: 20,
        }}
      >
        <ThemedText>Cumplimiento semanal</ThemedText>
        <ThemedText style={{ fontSize: 32, fontWeight: "bold" }}>
          {stats.percentage}%
        </ThemedText>
      </View>

      {/* 🔥 STREAK */}
      <View
        style={{
          backgroundColor: "#fff",
          padding: 20,
          borderRadius: 16,
          marginBottom: 20,
        }}
      >
        <ThemedText>Racha actual</ThemedText>
        <ThemedText style={{ fontSize: 28 }}>🔥 {stats.streak} días</ThemedText>
      </View>

      {/* 📈 GRÁFICO */}
      <View
        style={{
          backgroundColor: "#fff",
          padding: 20,
          borderRadius: 16,
        }}
      >
        <ThemedText style={{ marginBottom: 10 }}>Últimos 7 días</ThemedText>

        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-end",
            justifyContent: "center",
            height: 120,
          }}
        >
          {stats.daily.map((d: any, i: number) => (
            <Bar key={i} value={d.percentage} />
          ))}
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            marginTop: 8,
          }}
        >
          {stats.daily.map((d: any, i: number) => (
            <ThemedText key={i} style={{ fontSize: 10 }}>
              {d.day}
            </ThemedText>
          ))}
        </View>
      </View>
    </ThemedView>
  );
}
