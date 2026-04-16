import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";

import { generateTodayIntakes, markIntakeAsTaken } from "../api/intakes";
import { supabase } from "../api/supabase";
import { useAuth } from "../hooks/useAuth";

export default function HomeScreen() {
  const { user } = useAuth();

  const [doses, setDoses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  const loadDoses = async () => {
    if (!user) return;

    try {
      setLoading(true);

      if (!initialized) {
        await generateTodayIntakes(user.id);
        setInitialized(true);
      }

      const today = new Date().toISOString().split("T")[0];

      // 🔥 traer TODAS las dosis del día
      const { data, error } = await supabase
        .from("intakes")
        .select(
          `
          id,
          taken,
          schedule_id,
          schedules (
            time,
            medications (
              name,
              dosage,
              user_id
            )
          )
        `,
        )
        .eq("date", today)
        .eq("schedules.medications.user_id", user.id);

      if (error) throw error;

      setDoses(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleTaken = async (scheduleId) => {
    try {
      await markIntakeAsTaken(scheduleId);
      await loadDoses(); // 🔥 refrescar
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    loadDoses();
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      loadDoses();
    }, [user]),
  );

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View>
      {doses.length === 0 ? (
        <Text>No tienes dosis hoy 💊</Text>
      ) : (
        <FlatList
          data={doses}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={{
                padding: 12,
                borderBottomWidth: 1,
                borderColor: "#ccc",
              }}
            >
              <Text>{item.schedules.medications.name}</Text>
              <Text>{item.schedules.medications.dosage}</Text>
              <Text>{item.schedules.time}</Text>

              <Pressable
                onPress={() => handleTaken(item.schedule_id)}
                disabled={item.taken}
                style={{
                  marginTop: 8,
                  backgroundColor: item.taken ? "#ccc" : "#0A84FF",
                  padding: 8,
                  borderRadius: 6,
                }}
              >
                <Text style={{ color: "#fff", textAlign: "center" }}>
                  {item.taken ? "Tomado ✅" : "Marcar como tomado"}
                </Text>
              </Pressable>
            </View>
          )}
        />
      )}
    </View>
  );
}
