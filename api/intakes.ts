import { supabase } from "./supabase";

// Generar intakes del día
export const generateTodayIntakes = async (userId: string) => {
  const today = new Date().toISOString().split("T")[0];

  const { data: schedules, error: schedulesError } = await supabase
    .from("schedules")
    .select(`
      id,
      medications!inner(user_id)
    `)
    .eq("medications.user_id", userId);

  if (schedulesError) throw schedulesError;

  if (!schedules || schedules.length === 0) return;

  const { data: existing, error: existingError } = await supabase
    .from("intakes")
    .select("schedule_id")
    .eq("date", today);

  if (existingError) throw existingError;

  const existingIds = new Set(existing.map((i: any) => i.schedule_id));

  const newIntakes = schedules
    .filter((s: any) => !existingIds.has(s.id))
    .map((s: any) => ({
      schedule_id: s.id,
      date: today,
      taken: false,
    }));

  if (newIntakes.length === 0) return;

  const { error: insertError } = await supabase
    .from("intakes")
    .insert(newIntakes);

  if (insertError) throw insertError;
};

// Marcar como tomado
export const markIntakeAsTaken = async (scheduleId: string) => {
  const today = new Date().toISOString().split("T")[0];

  const { error } = await supabase
    .from("intakes")
    .update({ taken: true })
    .eq("schedule_id", scheduleId)
    .eq("date", today);

  if (error) throw error;
};
