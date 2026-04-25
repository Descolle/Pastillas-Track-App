/**
 * 🔥 PARSE: string → "HH:mm:ss" (formato DB)
 * Acepta "8:00" o "08:00"
 */
export function parseTimeHM(input: string): string | null {
  const trimmed = input.trim();
  const match = /^(\d{1,2}):(\d{1,2})$/.exec(trimmed);
  if (!match) return null;

  const hour = Number(match[1]);
  const minute = Number(match[2]);

  if (
    !Number.isInteger(hour) ||
    !Number.isInteger(minute) ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59
  ) {
    return null;
  }

  return `${hour.toString().padStart(2, "0")}:${minute
    .toString()
    .padStart(2, "0")}:00`;
}

/**
 * 🎨 FORMAT: "HH:mm:ss" → "HH:mm" (UI)
 */
export function formatTimeHM(time: string): string {
  if (!time) return "--:--";
  return time.slice(0, 5);
}

/**
 * ⏱ Convierte "HH:mm" o "HH:mm:ss" → minutos (para cálculos)
 */
export function timeHMToMinutes(time: string): number | null {
  if (!time) return null;

  const [h, m] = time.split(":");
  const hour = Number(h);
  const minute = Number(m);

  if (
    !Number.isInteger(hour) ||
    !Number.isInteger(minute) ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59
  ) {
    return null;
  }

  return hour * 60 + minute;
}

/**
 * 🔀 Comparar horarios (ordenar)
 */
export function compareTimeHM(a: string, b: string): number {
  return a.localeCompare(b);
}

/**
 * 🧪 Dosis: número válido > 0 (soporta coma o punto)
 */
export function parseDosisPositiva(texto: string): number | null {
  const t = texto.trim().replace(",", ".");
  if (!t) return null;

  const n = Number(t);
  if (!Number.isFinite(n) || n <= 0) return null;

  return Math.round(n * 1000) / 1000;
}

/**
 * 🎨 Formatear dosis para UI
 */
export function formatDosisForDisplay(n: number): string {
  return new Intl.NumberFormat("es", {
    maximumFractionDigits: 3,
    minimumFractionDigits: 0,
  }).format(n);
}

/**
 * 🧠 Devuelve próxima dosis basada en lista de horarios
 */
export function getNextDose(times: string[]): string | null {
  if (!times || times.length === 0) return null;

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const sorted = [...times].sort(compareTimeHM);

  for (const time of sorted) {
    const minutes = timeHMToMinutes(time);
    if (minutes !== null && minutes >= currentMinutes) {
      return time;
    }
  }

  // si ya pasaron todas → devuelve la primera del día siguiente
  return sorted[0];
}
