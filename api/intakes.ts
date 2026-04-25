import { supabase } from "./supabase";

// Generar intakes del día
export const generateTodayIntakes = async (userId: string) => {
  // Fix timezone issue: use local date instead of UTC
  const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD format in local timezone

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
    .eq("date(taken_at)", today); // Extract date from timestamp

  if (existingError) throw existingError;

  const existingIds = new Set(existing.map((i: any) => i.schedule_id));

  const newIntakes = schedules
    .filter((s: any) => !existingIds.has(s.id))
    .map((s: any) => ({
      schedule_id: s.id,
      taken_at: null, // New schema: null when not taken
      status: 'missed', // New schema: default status
    }));

  if (newIntakes.length === 0) return;

  const { error: insertError } = await supabase
    .from("intakes")
    .insert(newIntakes);

  if (insertError) throw insertError;
};

// Marcar como tomado
export const markIntakeAsTaken = async (scheduleId: string) => {
  // Fix timezone issue: use local date instead of UTC
  const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD format in local timezone

  const { error } = await supabase
    .from("intakes")
    .update({ 
      taken_at: new Date().toISOString(), // New schema: timestamp when taken
      status: 'taken' // New schema: status enum
    })
    .eq("schedule_id", scheduleId)
    .eq("date(taken_at)", today); // Extract date from timestamp

  if (error) throw error;
};
