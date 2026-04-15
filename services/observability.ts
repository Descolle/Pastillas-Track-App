type Level = "info" | "warn" | "error";

function formatMessage(level: Level, message: string, data?: unknown) {
  const payload = data ? ` ${JSON.stringify(data)}` : "";
  return `[${level.toUpperCase()}] ${message}${payload}`;
}

export function logInfo(message: string, data?: unknown) {
  console.log(formatMessage("info", message, data));
}

export function logWarn(message: string, data?: unknown) {
  console.warn(formatMessage("warn", message, data));
}

export function logError(message: string, data?: unknown) {
  console.error(formatMessage("error", message, data));
}
