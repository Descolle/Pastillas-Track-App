/** Hora en formato 24 h `HH:mm` (siempre dos dígitos en hora y minuto). */
export function formatTimeHM(date: Date): string {
  const h = date.getHours();
  const m = date.getMinutes();
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

export function defaultTimeDate(hour = 8, minute = 0): Date {
  const d = new Date();
  d.setHours(hour, minute, 0, 0);
  return d;
}

/** Interpreta `H:mm` o `HH:mm` con minutos 0–59 y hora 0–23. */
export function parseTimeHMToDate(str: string): Date | null {
  const trimmed = str.trim();
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
  const d = new Date();
  d.setHours(hour, minute, 0, 0);
  return d;
}

/** Dosis: número finito > 0 (acepta coma o punto decimal, p. ej. 0,5). */
export function parseDosisPositiva(texto: string): number | null {
  const t = texto.trim().replace(",", ".");
  if (!t) return null;
  const n = Number(t);
  if (!Number.isFinite(n) || n <= 0) return null;
  return Math.round(n * 1000) / 1000;
}

export function formatDosisForDisplay(n: number): string {
  return new Intl.NumberFormat("es", {
    maximumFractionDigits: 3,
    minimumFractionDigits: 0,
  }).format(n);
}

export function timeHMToMinutes(str: string): number | null {
  const parsed = parseTimeHMToDate(str);
  if (!parsed) return null;
  return parsed.getHours() * 60 + parsed.getMinutes();
}

export function compareTimeHM(a: string, b: string): number {
  const aMinutes = timeHMToMinutes(a);
  const bMinutes = timeHMToMinutes(b);

  if (aMinutes !== null && bMinutes !== null) {
    return aMinutes - bMinutes;
  }
  if (aMinutes === null && bMinutes === null) {
    return a.localeCompare(b);
  }
  return aMinutes === null ? 1 : -1;
}
