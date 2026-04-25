import { supabase } from "@/lib/supabase";

function getToday() {
  return new Date().toISOString().split("T")[0]; // YYYY-MM-DD
}

/**
 * ✅ Marcar una dosis como tomada (UPSERT seguro)
 */
export async function markAsTaken(scheduleId: string) {
  const now = new Date().toISOString();
  const today = getToday();

  const { error } = await supabase
    .from("intakes")
    .upsert(
      {
        schedule_id: scheduleId,
        taken_at: now,
        taken_date: today,
        status: "taken",
      },
      {
        onConflict: "schedule_id,taken_date",
      }
    );

  if (error) {
    console.log("❌ markAsTaken error:", error);
    throw error;
  }
}

/**
 * 🔄 (opcional) Desmarcar como tomada
 */
export async function unmarkAsTaken(scheduleId: string) {
  const today = getToday();

  const { error } = await supabase
    .from("intakes")
    .delete()
    .eq("schedule_id", scheduleId)
    .eq("taken_date", today);

  if (error) {
    console.log("❌ unmarkAsTaken error:", error);
    throw error;
  }
}
