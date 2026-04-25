import { supabase } from "@/lib/supabase";
import { logError } from "@/services/observability";
import { trackDailyAdherence } from "../services/adherenceService";

export type Pastilla = {
  id: string; // schedule_id
  nombre: string;
  cantidad: number;
  time: string;
  tomada: boolean;
  days_of_week: number[]; // 0=domingo, 6=sábado
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

    // Query schedules directly with medication info (new schema)
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
      logError("loadRemotePastillas schedules error", { error: schedulesError.message });
      return [];
    }

    console.log("📦 SCHEDULES DATA:", schedulesData);
    console.log("📦 SCHEDULES LENGTH:", schedulesData?.length);

    // Get today's intakes to check taken status (using taken_at timestamp)
    const { data: intakesData, error: intakesError } = await supabase
      .from("intakes")
      .select("schedule_id, status, taken_at")
      .eq("date", today); // Filter by date portion of taken_at

    if (intakesError) {
      logError("loadRemotePastillas intakes error", { error: intakesError.message });
      return [];
    }

    console.log("📦 INTAKES DATA:", intakesData);
    console.log("📦 INTAKES LENGTH:", intakesData?.length);

    // Create a map of taken status for today
    const takenStatusMap = new Map();
    (intakesData ?? []).forEach((intake: any) => {
      takenStatusMap.set(intake.schedule_id, intake.status === 'taken');
    });

    // Map schedules to Pastilla format
    const medications: Pastilla[] = [];
    
    (schedulesData ?? []).forEach((schedule: any) => {
      if (schedule.medications) {
        medications.push({
          id: schedule.id,
          nombre: schedule.medications.name ?? "Sin nombre",
          cantidad: Number(schedule.medications.dosage ?? 0),
          time: schedule.time ?? "--:--",
          tomada: takenStatusMap.get(schedule.id) ?? false, // Default to false if no intake exists for today
          days_of_week: schedule.days_of_week ?? [0,1,2,3,4,5,6], // Default to all days
        });
      }
    });

    // Track daily adherence for historical records
    const totalMedications = medications.length;
    const takenMedications = Array.from(takenStatusMap.values()).filter(Boolean).length;
    
    if (totalMedications > 0) {
      await trackDailyAdherence(userId, today, totalMedications, takenMedications);
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

    // 2. schedule (new schema with user_id and days_of_week)
    const { data: schedule, error: schedError } = await supabase
      .from("schedules")
      .insert({
        user_id: userId,
        medication_id: med.id,
        time,
        days_of_week: [0,1,2,3,4,5,6], // Default to all days
      })
      .select()
      .single();

    if (schedError) throw schedError;

    // 3. Create intake for today (new schema with taken_at and status)
    const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD format in local timezone
    const { error: intakeError } = await supabase
      .from("intakes")
      .insert({
        schedule_id: schedule.id,
        taken_at: null, // Not taken yet
        status: 'missed', // Default status
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
    .update({ 
      taken_at: new Date().toISOString(), // Current timestamp
      status: 'taken' 
    })
    .eq("schedule_id", scheduleId)
    .eq("date", today); // Filter by date portion of taken_at

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
