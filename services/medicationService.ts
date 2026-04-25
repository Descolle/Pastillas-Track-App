import { supabase } from "@/lib/supabase";
import { logError } from "@/services/observability";
import { trackDailyAdherence } from "../services/adherenceService";

export type Pastilla = {
  id: string;
  nombre: string;
  cantidad: number;
  time: string;
  tomada: boolean;
  days_of_week: number[];
};

function getTodayRange() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  return {
    start: start.toISOString(),
    end: end.toISOString(),
  };
}

export async function loadRemotePastillas(userId: string): Promise<Pastilla[]> {
  try {
    const { start, end } = getTodayRange();

    const { data: schedulesData, error: schedulesError } = await supabase
      .from("schedules")
      .select(`
        id,
        time,
        dosage,
        days_of_week,
        medications (
          name
        )
      `)
      .eq("user_id", userId);

    if (schedulesError) throw schedulesError;

    const { data: intakesData, error: intakesError } = await supabase
      .from("intakes")
      .select(`
        schedule_id,
        status,
        taken_at,
        schedules!inner (
          user_id
        )
      `)
      .eq("schedules.user_id", userId)
      .gte("taken_at", start)
      .lte("taken_at", end);

    if (intakesError) throw intakesError;

    const takenMap = new Map<string, boolean>();

    (intakesData ?? []).forEach((i: any) => {
      if (i.status === "taken") {
        takenMap.set(i.schedule_id, true);
      }
    });

    const medications: Pastilla[] = (schedulesData ?? []).map(
      (schedule: any) => ({
        id: schedule.id,
        nombre: schedule.medications?.name ?? "Sin nombre",
        cantidad: Number(schedule.dosage ?? 1),
        time: schedule.time ?? "--:--",
        tomada: takenMap.get(schedule.id) ?? false,
        days_of_week:
          schedule.days_of_week ?? [0, 1, 2, 3, 4, 5, 6],
      }),
    );

    const total = medications.length;
    const taken = medications.filter((m) => m.tomada).length;

    if (total > 0) {
      const today = new Date().toISOString().split("T")[0];
      await trackDailyAdherence(userId, today, total, taken);
    }

    return medications;
  } catch (error) {
    logError("loadRemotePastillas error", { error });
    return [];
  }
}

export async function createMedicationWithSchedule(
  userId: string,
  nombre: string,
  times: { time: string; dosage: number }[],
) {
  try {
    const { data: med, error: medError } = await supabase
      .from("medications")
      .insert({
        name: nombre,
        user_id: userId,
      })
      .select()
      .single();

    if (medError) throw medError;

    const rows = times.map((t) => ({
      user_id: userId,
      medication_id: med.id,
      time: t.time,
      dosage: t.dosage,
      days_of_week: [0, 1, 2, 3, 4, 5, 6],
    }));

    const { error: schedError } = await supabase
      .from("schedules")
      .insert(rows);

    if (schedError) throw schedError;

    return med;
  } catch (error) {
    logError("createMedicationWithSchedule error", { error });
    throw error;
  }
}

export async function markAsTaken(scheduleId: string) {
  try {
    const now = new Date().toISOString();

    const { error } = await supabase
      .from("intakes")
      .upsert(
        {
          schedule_id: scheduleId,
          taken_at: now,
          status: "taken",
        },
        {
          onConflict: "schedule_id,taken_date",
        },
      );

    if (error) throw error;
  } catch (error: any) {
    logError("markAsTaken error", { error: error.message });
    throw error;
  }
}
