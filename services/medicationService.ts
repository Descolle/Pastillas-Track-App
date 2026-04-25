import { supabase } from "@/lib/supabase";
import { logError } from "@/services/observability";
import { trackDailyAdherence } from "./adherenceService";

export type Pastilla = {
  id: string;
  nombre: string;
  cantidad: number;
  time: string;
  tomada: boolean;
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

    // schedules + meds
    const { data: schedules, error: sError } = await supabase
      .from("schedules")
      .select(`
        id,
        time,
        dosage,
        medications (
          name
        )
      `)
      .eq("user_id", userId);

    if (sError) throw sError;

    // intakes del día
    const { data: intakes, error: iError } = await supabase
      .from("intakes")
      .select(`
        schedule_id,
        status,
        taken_at
      `)
      .gte("taken_at", start)
      .lte("taken_at", end);

    if (iError) throw iError;

    const takenMap = new Map<string, boolean>();

    (intakes ?? []).forEach((i: any) => {
      if (i.status === "taken") {
        takenMap.set(i.schedule_id, true);
      }
    });

    const result: Pastilla[] = (schedules ?? []).map((s: any) => ({
      id: s.id,
      nombre: s.medications?.name ?? "Sin nombre",
      cantidad: Number(s.dosage ?? 1),
      time: s.time,
      tomada: takenMap.get(s.id) ?? false,
    }));

    // stats
    const total = result.length;
    const taken = result.filter((p) => p.tomada).length;
    const today = new Date().toISOString().split("T")[0];

    await trackDailyAdherence(userId, today, total, taken);

    return result;
  } catch (error) {
    logError("loadRemotePastillas error", { error });
    return [];
  }
}

export async function createMedicationWithSchedule(
  userId: string,
  name: string,
  times: { time: string; dosage: number }[],
) {
  try {
    // 1. crear medicamento
    const { data: med, error: medError } = await supabase
      .from("medications")
      .insert({ name, user_id: userId })
      .select()
      .single();

    if (medError) throw medError;

    // 2. crear schedules
    const rows = times.map((t) => ({
      user_id: userId,
      medication_id: med.id,
      time: t.time,
      dosage: t.dosage,
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
