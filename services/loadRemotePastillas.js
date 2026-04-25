import { supabase } from "../api/supabase";

function getToday() {
  return new Date().toISOString().split("T")[0]; // YYYY-MM-DD
}

// 🔥 Obtener pastillas del día
export async function loadRemotePastillas(userId) {
  const today = getToday();

  // 1️⃣ schedules + medications
  const { data: schedules, error: schedulesError } = await supabase
    .from("schedules")
    .select(`
      id,
      time,
      medications (
        id,
        name,
        dosage
      )
    `)
    .eq("user_id", userId);

  if (schedulesError) {
    console.log("ERROR schedules:", schedulesError);
    throw schedulesError;
  }

  // 2️⃣ intakes SOLO de hoy (🔥 CLAVE)
  const { data: intakes, error: intakesError } = await supabase
    .from("intakes")
    .select("schedule_id, status")
    .eq("taken_date", today);

  if (intakesError) {
    console.log("ERROR intakes:", intakesError);
    throw intakesError;
  }

  // 3️⃣ map de tomadas
  const takenMap = new Map();

  (intakes ?? []).forEach((i) => {
    if (i.status === "taken") {
      takenMap.set(i.schedule_id, true);
    }
  });

  // 4️⃣ transformar formato app
  return (schedules ?? []).map((s) => ({
    id: s.id,
    nombre: s.medications?.name ?? "Sin nombre",
    cantidad: Number(s.medications?.dosage ?? 0),
    tiempo: s.time,
    tomada: takenMap.get(s.id) ?? false,
  }));
}

// 🔘 Marcar como tomada (FIX REAL)
export async function markAsTaken(scheduleId) {
  const now = new Date().toISOString();
  const today = getToday();

  const { error } = await supabase
    .from("intakes")
    .upsert(
      {
        schedule_id: scheduleId,
        taken_at: now,
        taken_date: today, // 🔥 CLAVE
        status: "taken",
      },
      {
        onConflict: "schedule_id,taken_date", // 🔥 CORRECTO
      }
    );

  if (error) {
    console.log("ERROR markAsTaken:", error);
    throw error;
  }
}
