import * as Notifications from "expo-notifications";

export const requestPermissions = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
};

export const scheduleNotification = async (nombre: string, tiempo: string) => {
  const parts = tiempo.trim().split(":");
  if (parts.length !== 2) {
    throw new Error("Hora inválida");
  }
  const hour = Number(parts[0]);
  const minute = Number(parts[1]);
  if (
    !Number.isInteger(hour) ||
    !Number.isInteger(minute) ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59
  ) {
    throw new Error("Hora inválida");
  }

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: "💊 Hora de tu medicamento",
      body: `Tomar ${nombre}`,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });

  return id;
};

export const cancelNotification = async (id: string) => {
  await Notifications.cancelScheduledNotificationAsync(id);
};
