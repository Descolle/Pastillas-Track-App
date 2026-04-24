import { supabase } from "@/lib/supabase";
import { logError } from "@/services/observability";

export type Pastilla = {
  id: string; // schedule_id
  nombre: string;
  cantidad: number;
  time: string;
  tomada: boolean;
};

//
// 🔥 LOAD DESDE SUPABASE
//
export async function loadRemotePastillas(userId: string): Promise<Pastilla[]> {
  try {
    // Use consistent local date format to prevent duplicates
    const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD format in local timezone
    console.log("🔍 loadRemotePastillas - userId:", userId);
    console.log("🔍 loadRemotePastillas - today:", today);

    const { data, error } = await supabase
      .from("intakes")
      .select(
        `
        schedule_id,
        taken,
        date,
        schedules (
          id,
          time,
          medications (
            id,
            name,
            dosage,
            user_id
          )
        )
      `,
      )
      .eq("date", today) // Single consistent date
      .eq("schedules.medications.user_id", userId);

    if (error) {
      logError("loadRemotePastillas error", { error: error.message });
      return [];
    }

    console.log("📦 RAW DATA:", data);
    console.log("📦 DATA LENGTH:", data?.length);

    return (data ?? []).map((i: any) => ({
      id: i.schedule_id, // 🔥 IMPORTANTE
      nombre: i.schedules?.medications?.name ?? "Sin nombre",
      cantidad: Number(i.schedules?.medications?.dosage ?? 0),
      time: i.schedules?.time ?? "--:--",
      tomada: i.taken ?? false,
    }));
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
    // 1. medicamento
    const { data: med, error: medError } = await supabase
      .from("medications")
      .insert({
        name: nombre,
        dosage: dosis, // ✅ SOLO ESTO
        user_id: userId,
      })
      .select()
      .single();

    if (medError) throw medError;

    // 2. schedule
    const { data: schedule, error: schedError } = await supabase
      .from("schedules")
      .insert({
        medication_id: med.id,
        time,
      })
      .select()
      .single();

    if (schedError) throw schedError;

    // 3. Create intake for today
    const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD format in local timezone
    const { error: intakeError } = await supabase
      .from("intakes")
      .insert({
        schedule_id: schedule.id,
        date: today,
        taken: false,
      });

    if (intakeError) throw intakeError;

    console.log("✅ CREATED:", { med, schedule });
  } catch (error) {
    logError("createMedicationWithSchedule error", { error });
    throw error;
  }
}

//
// 🔥 MARCAR COMO TOMADA
//
export async function markAsTaken(scheduleId: string) {
  // Use consistent local date format
  const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD format in local timezone

  const { error } = await supabase
    .from("intakes")
    .update({ taken: true })
    .eq("schedule_id", scheduleId)
    .eq("date", today);

  if (error) {
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

export async function deleteMedication(scheduleId: string) {
  try {
    // 1. eliminar intake
    await supabase.from("intakes").delete().eq("schedule_id", scheduleId);

    // 2. obtener medication_id
    const { data: sched } = await supabase
      .from("schedules")
      .select("medication_id")
      .eq("id", scheduleId)
      .single();

    if (!sched) return;

    // 3. eliminar schedule
    await supabase.from("schedules").delete().eq("id", scheduleId);

    // 4. eliminar medicamento
    await supabase.from("medications").delete().eq("id", sched.medication_id);
  } catch (error) {
    logError("deleteMedication error", { error });
    throw error;
  }
}
export async function updateMedication(
  scheduleId: string,
  nombre: string,
  dosis: number,
  time: string,
) {
  try {
    // 1. obtener medication_id
    const { data: sched } = await supabase
      .from("schedules")
      .select("medication_id")
      .eq("id", scheduleId)
      .single();

    if (!sched) throw new Error("Schedule not found");

    // 2. actualizar medication
    await supabase
      .from("medications")
      .update({
        name: nombre,
        dosage: dosis,
      })
      .eq("id", sched.medication_id);

    // 3. actualizar schedule
    await supabase
      .from("schedules")
      .update({
        time,
      })
      .eq("id", scheduleId);
  } catch (error) {
    logError("updateMedication error", { error });
    throw error;
  }
}
