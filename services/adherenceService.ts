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
): Promise<void> {
  try {
    const adherencePercentage =
      totalMedications > 0
        ? Math.round((takenMedications / totalMedications) * 100)
        : 0;

    // 🔥 UPSERT (evita duplicados y race conditions)
    const { error } = await supabase
      .from("adherence_history")
      .upsert(
        {
          user_id: userId,
          date,
          total_medications: totalMedications,
          taken_medications: takenMedications,
          adherence_percentage: adherencePercentage,
        },
        {
          onConflict: "user_id,date", // ⚠️ requiere índice único
        }
      );

    if (error) {
      logError("trackDailyAdherence upsert error", {
        error: error.message,
      });
      throw error;
    }

    console.log("📊 Adherence tracked:", {
      userId,
      date,
      totalMedications,
      takenMedications,
      adherencePercentage: `${adherencePercentage}%`,
    });
  } catch (error) {
    logError("trackDailyAdherence unexpected error", { error });
    throw error;
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
