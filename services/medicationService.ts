import AsyncStorage from "@react-native-async-storage/async-storage";

import { supabase } from "@/lib/supabase";
import { logError } from "@/services/observability";

export type Pastilla = {
  id: string;
  nombre: string;
  cantidad: number;
  tiempo: string;
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
    typeof o.tiempo === "string" &&
    typeof o.tomada === "boolean" &&
    (o.notificationId === undefined || typeof o.notificationId === "string")
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
  return pastillas.map((p) => (p.tomada ? { ...p, tomada: false } : p));
}

export async function loadLocalPastillas(): Promise<Pastilla[]> {
  const raw = await AsyncStorage.getItem(LOCAL_STORAGE_KEY);
  const loaded = raw ? parsePastillas(raw) : [];
  const today = localDateKey();
  const lastReset = await AsyncStorage.getItem(LAST_RESET_KEY);
  const normalized = lastReset === today ? loaded : resetTomadas(loaded);
  await AsyncStorage.setItem(LAST_RESET_KEY, today);
  if (lastReset !== today) {
    await saveLocalPastillas(normalized);
  }
  return normalized;
}

export async function saveLocalPastillas(pastillas: Pastilla[]) {
  await AsyncStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(pastillas));
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

function toDb(pastilla: Pastilla, userId: string) {
  return {
    id: pastilla.id,
    user_id: userId,
    nombre: pastilla.nombre,
    cantidad: pastilla.cantidad,
    tiempo: pastilla.tiempo,
    tomada: pastilla.tomada,
    notification_id: pastilla.notificationId ?? null,
    updated_at: pastilla.updatedAt ?? new Date().toISOString(),
  };
}

function fromDb(row: Record<string, unknown>): Pastilla {
  return {
    id: String(row.id),
    nombre: String(row.nombre),
    cantidad: Number(row.cantidad),
    tiempo: String(row.tiempo),
    tomada: Boolean(row.tomada),
    notificationId:
      typeof row.notification_id === "string" ? String(row.notification_id) : undefined,
    updatedAt: String(row.updated_at),
  };
}

export async function loadRemotePastillas(userId: string): Promise<Pastilla[]> {
  const { data, error } = await supabase
    .from("medications")
    .select("*")
    .eq("user_id", userId)
    .order("tiempo", { ascending: true });
  if (error) {
    throw new Error(error.message);
  }
  return (data ?? []).map((row) => fromDb(row as Record<string, unknown>));
}

async function upsertRemotePastillas(userId: string, pastillas: Pastilla[]) {
  if (pastillas.length === 0) return;
  const payload = pastillas.map((p) => toDb(p, userId));
  const { error } = await supabase.from("medications").upsert(payload, { onConflict: "id" });
  if (error) throw new Error(error.message);
}

export async function syncLocalToRemote(userId: string): Promise<Pastilla[]> {
  const [local, remote] = await Promise.all([loadLocalPastillas(), loadRemotePastillas(userId)]);
  if (local.length === 0 && remote.length === 0) return [];
  const byId = new Map<string, Pastilla>();

  for (const item of remote) {
    byId.set(item.id, item);
  }
  for (const item of local) {
    const existing = byId.get(item.id);
    if (!existing) {
      byId.set(item.id, item);
      continue;
    }
    const existingTime = Date.parse(existing.updatedAt ?? "") || 0;
    const localTime = Date.parse(item.updatedAt ?? "") || 0;
    if (localTime >= existingTime) {
      byId.set(item.id, item);
    }
  }

  const merged = [...byId.values()];
  await Promise.all([upsertRemotePastillas(userId, merged), saveLocalPastillas(merged)]);
  return merged;
}

export async function replaceAllPastillas(userId: string | null, pastillas: Pastilla[]) {
  const stamped = pastillas.map((p) => ({ ...p, updatedAt: new Date().toISOString() }));
  await saveLocalPastillas(stamped);
  if (!userId) return;
  try {
    await upsertRemotePastillas(userId, stamped);
  } catch (error) {
    logError("replaceAllPastillas remote sync error", { error });
  }
}

export async function removePastilla(userId: string | null, id: string) {
  if (!userId) return;
  const { error } = await supabase.from("medications").delete().eq("id", id).eq("user_id", userId);
  if (error) throw new Error(error.message);
}

export async function insertMedicationEvent(
  userId: string | null,
  medicationId: string,
  eventType: "taken" | "untaken",
) {
  if (!userId) return;
  const { error } = await supabase.from("medication_events").insert({
    user_id: userId,
    medication_id: medicationId,
    event_type: eventType,
  });
  if (error) {
    logError("insertMedicationEvent error", { error: error.message });
  }
}
