import { supabase } from "../lib/supabase";
import { logError } from "./observability";
import { trackDailyAdherence } from "./adherenceService";

export async function loadRemotePastillas(userId) {
  try {
    const today = new Date().toISOString().split("T")[0];

    // schedules
    const { data: schedules, error: sError } = await supabase
      .from("schedules")
      .select(`
        id,
        time,
        dosage,
        medications (
          name
        )
      `)
      .eq("user_id", userId);

    if (sError) throw sError;

    // intakes SOLO HOY + USER
    const { data: intakes, error: iError } = await supabase
      .from("intakes")
      .select(`
        schedule_id,
        status
      `)
      .eq("user_id", userId)
      .eq("date(taken_at)", today);

    if (iError) throw iError;

    const takenMap = new Map<string, boolean>();

    (intakes ?? []).forEach((i: any) => {
      if (i.status === "taken") {
        takenMap.set(i.schedule_id, true);
      }
    });

    const result = (schedules ?? []).map((s: any) => ({
      id: s.id,
      nombre: s.medications?.name ?? "Sin nombre",
      cantidad: Number(s.dosage ?? 1),
      time: s.time,
      tomada: takenMap.get(s.id) ?? false,
    }));

    // 🔥 adherencia (esto ya no rompe si RLS está bien)
    const total = result.length;
    const taken = result.filter((p) => p.tomada).length;

    await trackDailyAdherence(userId, today, total, taken);

    return result;
  } catch (error) {
    logError("loadRemotePastillas error", { error });
    return [];
  }
}
