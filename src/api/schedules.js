import { supabase } from "../../lib/supabase";

export const createSchedules = async (userId, medicationId, times) => {
  const rows = times.map((t) => ({
    user_id: userId,
    medication_id: medicationId,
    time: t.time,
    dosage: t.dosage,
    days_of_week: [0,1,2,3,4,5,6],
  }));

  const { error } = await supabase
    .from("schedules")
    .insert(rows);

  if (error) throw error;
};
