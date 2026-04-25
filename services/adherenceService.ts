import { supabase } from "@/lib/supabase";
import { logError } from "@/services/observability";

export interface DailyAdherence {
  date: string;
  totalMedications: number;
  takenMedications: number;
  adherencePercentage: number;
}

export interface AdherenceHistory {
  date: string;
  totalMedications: number;
  takenMedications: number;
  adherencePercentage: number;
}

export interface WeeklyAdherenceSummary {
  week: string;
  adherence: number;
}

//
// 🔥 TRACK DAILY ADHERENCE (UPSERT REAL)
//
export async function trackDailyAdherence(
  userId: string,
  date: string,
  totalMedications: number,
  takenMedications: number
) {
  try {
    const { error } = await supabase
      .from("adherence_history")
      .upsert(
        {
          user_id: userId,
          date,
          total: totalMedications,   // ✅ FIX
          taken: takenMedications,   // ✅ FIX
        },
        {
          onConflict: "user_id,date",
        }
      );

    if (error) throw error;

  } catch (error) {
    logError("trackDailyAdherence error", { error });
  }
}
//
// 🔥 GET HISTORY
//
export async function getAdherenceHistory(
  userId: string,
  days: number = 30
): Promise<AdherenceHistory[]> {
  try {
    const { data, error } = await supabase
      .from("adherence_history")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false })
      .limit(days);

    if (error) {
      logError("getAdherenceHistory error", {
        error: error.message,
      });
      return [];
    }

    return (data ?? []).map((r: any) => ({
      date: r.date,
      totalMedications: r.total_medications,
      takenMedications: r.taken_medications,
      adherencePercentage: r.adherence_percentage,
    }));
  } catch (error) {
    logError("getAdherenceHistory unexpected error", { error });
    return [];
  }
}

//
// 🔥 WEEKLY SUMMARY
//
export async function getWeeklyAdherenceSummary(
  userId: string
): Promise<{ week: string; adherence: number }[]> {
  try {
    const { data, error } = await supabase
      .from("adherence_history")
      .select("date, adherence_percentage")
      .eq("user_id", userId)
      .order("date", { ascending: false })
      .limit(7);

    if (error) {
      logError("getWeeklyAdherenceSummary error", {
        error: error.message,
      });
      return [];
    }

    return (data ?? []).map((r: any) => ({
      week: new Date(r.date).toLocaleDateString("es-CL", {
        weekday: "short",
      }),
      adherence: r.adherence_percentage ?? 0,
    }));
  } catch (error) {
    logError("getWeeklyAdherenceSummary error", { error });
    return [];
  }
}
