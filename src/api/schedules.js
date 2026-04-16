import { supabase } from "./supabase";

export const createSchedules = async (medicationId, times) => {
  if (times.length > 10) {
    throw new Error("Demasiados horarios");
  }

  const schedules = times.map((time) => ({
    medication_id: medicationId,
    time,
  }));

  const { error } = await supabase.from("schedules").insert(schedules);

  if (error) throw error;
};
