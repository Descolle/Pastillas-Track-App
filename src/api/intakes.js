import { supabase } from "./supabase";

export const markAsTaken = async (scheduleId) => {
  const today = new Date().toISOString().split("T")[0];

  const { data } = await supabase
    .from("intakes")
    .select("*")
    .eq("schedule_id", scheduleId)
    .eq("date", today)
    .single();

  if (data) {
    await supabase.from("intakes").update({ taken: true }).eq("id", data.id);
  } else {
    await supabase.from("intakes").insert([
      {
        schedule_id: scheduleId,
        date: today,
        taken: true,
      },
    ]);
  }
};
