import { supabase } from "@/lib/supabase";
import { logError } from "@/services/observability";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type Pastilla = {
  id: string;
  nombre: string;
  cantidad: number;
  time: string; // ✅ FIX
  tomada: boolean;
  notificationId?: string;
  updatedAt?: string;
};

const LOCAL_STORAGE_KEY = "pastillas";
const LAST_RESET_KEY = "pastillas_last_reset_date";

function localDateKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function isPastilla(x: unknown): x is Pastilla {
  if (x === null || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.id === "string" &&
    typeof o.nombre === "string" &&
    typeof o.cantidad === "number" &&
    typeof o.time === "string" &&
    typeof o.tomada === "boolean"
  );
}

function parsePastillas(raw: string): Pastilla[] {
  try {
    const data = JSON.parse(raw) as unknown;
    if (!Array.isArray(data)) return [];
    return data.filter(isPastilla);
  } catch {
    return [];
  }
}

function resetTomadas(pastillas: Pastilla[]): Pastilla[] {
  return pastillas.map((p) =>
    p.tomada ? { ...p, tomada: false } : p
  );
}

export async function loadLocalPastillas(): Promise<Pastilla[]> {
  const raw = await AsyncStorage.getItem(LOCAL_STORAGE_KEY);
  const loaded = raw ? parsePastillas(raw) : [];

  const today = localDateKey();
  const lastReset = await AsyncStorage.getItem(LAST_RESET_KEY);

  const normalized =
    lastReset === today ? loaded : resetTomadas(loaded);

  await AsyncStorage.setItem(LAST_RESET_KEY, today);

  if (lastReset !== today) {
    await saveLocalPastillas(normalized);
  }

  return normalized;
}

export async function saveLocalPastillas(pastillas: Pastilla[]) {
  await AsyncStorage.setItem(
    LOCAL_STORAGE_KEY,
    JSON.stringify(pastillas)
  );
}

export async function checkDailyResetLocal(current: Pastilla[]) {
  const today = localDateKey();
  const lastReset = await AsyncStorage.getItem(LAST_RESET_KEY);

  if (lastReset === today) return current;

  await AsyncStorage.setItem(LAST_RESET_KEY, today);

  const normalized = resetTomadas(current);
  await saveLocalPastillas(normalized);

  return normalized;
}

//
// 🔥 LOAD DESDE SUPABASE (CORRECTO)
//
export async function loadRemotePastillas(
  userId: string
): Promise<Pastilla[]> {
  try {
    const today = new Date().toISOString().split("T")[0];

    const { data, error } = await supabase
      .from("intakes")
      .select(`
        taken,
        schedules (
          time,
          medications (
            id,
            name,
            dosage,
            user_id
          )
        )
      `)
      .eq("date", today)
      .eq("schedules.medications.user_id", userId);

    if (error) {
      logError("loadRemotePastillas error", { error: error.message });
      return [];
    }

    return (data ?? []).map((i: any) => ({
      id: i.schedules.medications.id,
      nombre: i.schedules.medications.name,
      cantidad: i.schedules.medications.dosage,
      time: i.schedules.time,
      tomada: i.taken,
      updatedAt: new Date().toISOString(),
    }));
  } catch (error) {
    logError("loadRemotePastillas unexpected error", { error });
    return [];
  }
}

//
// 🔥 MARCAR COMO TOMADA
//
export async function markAsTaken(
  scheduleId: string
) {
  const today = new Date().toISOString().split("T")[0];

  const { error } = await supabase
    .from("intakes")
    .update({ taken: true })
    .eq("schedule_id", scheduleId)
    .eq("date", today);

  if (error) {
    logError("markAsTaken error", { error: error.message });
    throw error;
  }
}

//
// 🔥 INSERT EVENT (para estadísticas futuras)
//
export async function insertMedicationEvent(
  userId: string | null,
  medicationId: string,
  eventType: "taken" | "untaken"
) {
  if (!userId) return;

  const { error } = await supabase
    .from("medication_events")
    .insert({
      user_id: userId,
      medication_id: medicationId,
      event_type: eventType,
    });

  if (error) {
    logError("insertMedicationEvent error", {
      error: error.message,
    });
  }
}
