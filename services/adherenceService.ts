import { supabase } from "@/lib/supabase";
import { logError } from "@/services/observability";

//
// 🔥 TRACK DAILY ADHERENCE (UPSERT)
//
export async function trackDailyAdherence(
  userId: string,
  date: string,
  total: number,
  taken: number,
) {
  try {
    const adherencePercentage =
      total === 0 ? 0 : Math.round((taken / total) * 100);

    const { error } = await supabase.from("adherence_history").upsert(
      {
        user_id: userId,
        date,
        total,
        taken,
        adherence_percentage: adherencePercentage,
      },
      {
        onConflict: "user_id,date",
      },
    );

    if (error) throw error;
  } catch (error) {
    logError("trackDailyAdherence error", { error });
  }
}

//
// 📊 WEEKLY ADHERENCE (7 DÍAS COMPLETOS)
//
export async function getWeeklyAdherence(userId: string) {
  try {
    const today = new Date();

    const start = new Date();
    start.setDate(today.getDate() - 6);

    const startDate = start.toISOString().split("T")[0];
    const endDate = today.toISOString().split("T")[0];

    const { data, error } = await supabase
      .from("adherence_history")
      .select("date, adherence_percentage")
      .eq("user_id", userId)
      .gte("date", startDate)
      .lte("date", endDate);

    if (error) throw error;

    // 🔥 map para acceso rápido
    const map = new Map<string, number>();

    (data ?? []).forEach((row) => {
      map.set(row.date, row.adherence_percentage ?? 0);
    });

    // 🔥 asegurar 7 días SIEMPRE
    const result = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);

      const date = d.toISOString().split("T")[0];

      result.push({
        date,
        day: d.toLocaleDateString("es-CL", { weekday: "short" }),
        percentage: map.get(date) ?? 0,
      });
    }

    return result;
  } catch (error) {
    logError("getWeeklyAdherence error", { error });
    return [];
  }
}
