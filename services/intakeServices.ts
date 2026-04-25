import { supabase } from "@/lib/supabase";

function getToday() {
  return new Date().toISOString().split("T")[0];
}

export async function markAsTaken(scheduleId: string, userId: string) {
  const now = new Date().toISOString();
  const today = getToday();

  console.log("🔥 markAsTaken START:", { scheduleId, userId, now, today });

  const { error } = await supabase
    .from("intakes")
    .insert({
      schedule_id: scheduleId,
      user_id: userId,
      taken_at: now,
      status: "taken"
    });

  if (error) {
    console.log("🔥 markAsTaken ERROR:", error);
    throw error;
  }

  console.log("🔥 markAsTaken SUCCESS");
}
