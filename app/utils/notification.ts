import * as Notifications from "expo-notifications";

export const requestPermissions = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
};

export const scheduleNotification = async (nombre: string, tiempo: string) => {
  const [hour, minute] = tiempo.split(":").map(Number);

  // ⚠️ Validación básica
  if (isNaN(hour) || isNaN(minute)) {
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
