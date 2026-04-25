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

//
// 🧠 HELPERS (CLAVE)
//
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

//
// 🔥 LOAD DESDE SUPABASE
//
export async function loadRemotePastillas(userId: string): Promise<Pastilla[]> {
  try {
    const { start, end } = getTodayRange();

    // 📅 schedules + meds
    const { data: schedulesData, error: schedulesError } = await supabase
      .from("schedules")
      .select(`
        id,
        time,
        days_of_week,
        medications (
          id,
          name,
          dosage
        )
      `)
      .eq("user_id", userId);

    if (schedulesError) {
      logError("loadRemotePastillas schedules error", {
        error: schedulesError.message,
      });
      return [];
    }

    // 💊 intakes SOLO del usuario (join)
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

    if (intakesError) {
      logError("loadRemotePastillas intakes error", {
        error: intakesError.message,
      });
      return [];
    }

    // 🧠 map de tomadas
    const takenMap = new Map<string, boolean>();

    (intakesData ?? []).forEach((i: any) => {
      if (i.status === "taken") {
        takenMap.set(i.schedule_id, true);
      }
    });

    // 💊 construir lista
    const medications: Pastilla[] = (schedulesData ?? []).map((schedule: any) => ({
      id: schedule.id,
      nombre: schedule.medications?.name ?? "Sin nombre",
      cantidad: Number(schedule.medications?.dosage ?? 0),
      time: schedule.time ?? "--:--",
      tomada: takenMap.get(schedule.id) ?? false,
      days_of_week: schedule.days_of_week ?? [0,1,2,3,4,5,6],
    }));

    // 📊 adherencia
    const total = medications.length;
    const taken = medications.filter((m) => m.tomada).length;

    if (total > 0) {
      const today = new Date().toISOString().split("T")[0];
      await trackDailyAdherence(userId, today, total, taken);
    }

    return medications;
  } catch (error) {
    logError("loadRemotePastillas unexpected error", { error });
    return [];
  }
}

//
// 🔥 CREAR MEDICAMENTO + SCHEDULE
//
export async function createMedicationWithSchedule(
  userId: string,
  nombre: string,
  dosis: number,
  time: string,
) {
  try {
    const { data: med, error: medError } = await supabase
      .from("medications")
      .insert({
        name: nombre,
        dosage: dosis,
        user_id: userId,
      })
      .select()
      .single();

    if (medError) throw medError;

    const { data: schedule, error: schedError } = await supabase
      .from("schedules")
      .insert({
        user_id: userId,
        medication_id: med.id,
        time,
        days_of_week: [0,1,2,3,4,5,6],
      })
      .select()
      .single();

    if (schedError) throw schedError;

    console.log("✅ CREATED:", { med, schedule });

    return { med, schedule };
  } catch (error) {
    logError("createMedicationWithSchedule error", { error });
    throw error;
  }
}

//
// 🔥 MARCAR COMO TOMADA (UPSERT REAL)
//
export async function markAsTaken(scheduleId: string, userId: string) {
  try {
    const now = new Date().toISOString();

    // 🔥 UPSERT (clave para evitar bugs)
    const { error } = await supabase
      .from("intakes")
      .upsert(
        {
          schedule_id: scheduleId,
          taken_at: now,
          status: "taken",
        },
        {
          onConflict: "schedule_id", // ⚠️ requiere unique index
        }
      );

    if (error) throw error;
  } catch (error: any) {
    logError("markAsTaken error", { error: error.message });
    throw error;
  }
}

//
// 📊 EVENTOS
//
export async function insertMedicationEvent(
  userId: string | null,
  medicationId: string,
  eventType: "taken" | "untaken",
) {
  if (!userId) return;

  const { error } = await supabase.from("medication_events").insert({
    user_id: userId,
    medication_id: medicationId,
    event_type: eventType,
  });

  if (error) {
    logError("insertMedicationEvent error", {
      error: error.message,
    });
  }
}

//
// 🗑 DELETE
//
export async function deleteMedication(scheduleId: string) {
  try {
    await supabase.from("intakes").delete().eq("schedule_id", scheduleId);

    const { data: sched } = await supabase
      .from("schedules")
      .select("medication_id")
      .eq("id", scheduleId)
      .single();

    if (!sched) return;

    await supabase.from("schedules").delete().eq("id", scheduleId);
    await supabase.from("medications").delete().eq("id", sched.medication_id);
  } catch (error) {
    logError("deleteMedication error", { error });
    throw error;
  }
}

//
// ✏️ UPDATE
//
export async function updateMedication(
  scheduleId: string,
  nombre: string,
  dosis: number,
  time: string,
) {
  try {
    const { data: sched } = await supabase
      .from("schedules")
      .select("medication_id")
      .eq("id", scheduleId)
      .single();

    if (!sched) throw new Error("Schedule not found");

    await supabase
      .from("medications")
      .update({
        name: nombre,
        dosage: dosis,
      })
      .eq("id", sched.medication_id);

    await supabase
      .from("schedules")
      .update({ time })
      .eq("id", scheduleId);
  } catch (error) {
    logError("updateMedication error", { error });
    throw error;
  }
}
