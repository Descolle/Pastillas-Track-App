/* import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

const NOTIFICATION_CHANNEL_ID = "medicamentos";

async function ensureAndroidNotificationChannel() {
  if (Platform.OS !== "android") return;

  await Notifications.setNotificationChannelAsync(NOTIFICATION_CHANNEL_ID, {
    name: "Recordatorios de medicamentos",
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
  });
}

export const requestPermissions = async () => {
  await ensureAndroidNotificationChannel();

  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
};

export const scheduleNotification = async (nombre: string, tiempo: string) => {
  await ensureAndroidNotificationChannel();

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
      sound: true,
      ...(Platform.OS === "android"
        ? { channelId: NOTIFICATION_CHANNEL_ID }
        : {}),
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
*/
export async function requestPermissions() {
  return true;
}

export async function scheduleNotification() {
  return null;
}

export async function cancelNotification() {
  return;
}
