import { supabase } from "../api/supabase";

// 🔥 Obtener pastillas del día (modelo correcto SaaS)
export async function loadRemotePastillas(userId) {
  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("intakes")
    .select(`
      id,
      taken,
      schedules (
        id,
        time,
        medications (
          id,
          name,
          dosage,
          quantity,
          user_id
        )
      )
    `)
    .eq("date", today)
    .eq("schedules.medications.user_id", userId);

  if (error) {
    console.log("ERROR loadRemotePastillas:", error);
    throw error;
  }

  // 🔄 Transformar a formato app
  return data.map((i) => ({
    id: i.schedules.id, // clave para marcar como tomada
    nombre: i.schedules.medications.name,
    cantidad: i.schedules.medications.quantity,
    tiempo: i.schedules.time,
    tomada: i.taken,
  }));
}

// 🔘 Marcar como tomada
export async function markAsTaken(scheduleId) {
  const today = new Date().toISOString().split("T")[0];

  const { error } = await supabase
    .from("intakes")
    .update({ taken: true })
    .eq("schedule_id", scheduleId)
    .eq("date", today);

  if (error) {
    console.log("ERROR markAsTaken:", error);
    throw error;
  }
}
