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
// 🔥 TRACK DAILY ADHERENCE
//
export async function trackDailyAdherence(
  userId: string,
  date: string,
  totalMedications: number,
  takenMedications: number
): Promise<void> {
  try {
    const adherencePercentage = totalMedications > 0 
      ? Math.round((takenMedications / totalMedications) * 100 * 100) / 100
      : 0;

    // Check if adherence record already exists for this date
    const { data: existingRecord } = await supabase
      .from("adherence_history")
      .select("id")
      .eq("user_id", userId)
      .eq("date", date)
      .single();

    if (existingRecord) {
      // Update existing record
      const { error: updateError } = await supabase
        .from("adherence_history")
        .update({
          total_medications: totalMedications,
          taken_medications: takenMedications,
          adherence_percentage: adherencePercentage,
        })
        .eq("id", existingRecord.id);

      if (updateError) {
        logError("trackDailyAdherence update error", { error: updateError.message });
        throw updateError;
      }
    } else {
      // Create new adherence record
      const { error: insertError } = await supabase
        .from("adherence_history")
        .insert({
          user_id: userId,
          schedule_id: null, // This tracks overall daily adherence
          date,
          total_medications: totalMedications,
          taken_medications: takenMedications,
          adherence_percentage: adherencePercentage,
        });

      if (insertError) {
        logError("trackDailyAdherence insert error", { error: insertError.message });
        throw insertError;
      }
    }

    console.log("📊 Adherence tracked:", {
      userId,
      date,
      totalMedications,
      takenMedications,
      adherencePercentage: `${adherencePercentage}%`
    });
  } catch (error) {
    logError("trackDailyAdherence unexpected error", { error });
    throw error;
  }
}

//
// 🔥 GET ADHERENCE HISTORY
//
export async function getAdherenceHistory(
  userId: string,
  days: number = 30 // Default to last 30 days
): Promise<AdherenceHistory[]> {
  try {
    const { data, error } = await supabase
      .from("adherence_history")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false })
      .limit(days);

    if (error) {
      logError("getAdherenceHistory error", { error: error.message });
      return [];
    }

    console.log("📊 Adherence history:", { userId, days, recordsCount: data?.length });

    return (data ?? []).map((record: any) => ({
      date: record.date,
      totalMedications: record.total_medications,
      takenMedications: record.taken_medications,
      adherencePercentage: record.adherence_percentage,
    }));
  } catch (error) {
    logError("getAdherenceHistory unexpected error", { error });
    return [];
  }
}

//
// 🔥 GET WEEKLY ADHERENCE SUMMARY
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
      .limit(7); // Last 7 days

    if (error) {
      logError("getWeeklyAdherenceSummary error", { error: error.message });
      return { week: "", adherence: [] };
    }

    const weeklyData = (data ?? []).map((record: any) => ({
      week: new Date(record.date).toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'short' 
      }),
      adherence: record.adherence_percentage || 0,
    }));

    console.log("📊 Weekly adherence summary:", { userId, records: weeklyData.length });

    return { week: "", adherence: weeklyData };
  } catch (error) {
    logError("getWeeklyAdherenceSummary error", { error });
    return { week: "", adherence: [] };
  }
}
