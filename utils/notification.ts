import { getStoredNotificationSound } from "@/context/SettingsContext";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

const CHANNEL_PREFIX = "medicamentos";

let handlerInitialized = false;

function getChannelId(sound: string) {
  return `${CHANNEL_PREFIX}_${sound.replace(".wav", "")}`;
}

export function initNotifications() {
  if (handlerInitialized) return;

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });

  handlerInitialized = true;
}

async function setupChannel(sound: string) {
  if (Platform.OS !== "android") return;

  await Notifications.setNotificationChannelAsync(getChannelId(sound), {
    name: "Medication reminders",
    description: "Reminders to take medications on time",
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    sound,
    enableLights: true,
    lightColor: "#FF0000",
    enableVibrate: true,
  });
}

export async function requestPermissions() {
  const sound = await getStoredNotificationSound();
  await setupChannel(sound);

  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

export async function scheduleNotification(
  nombre: string,
  hora: string,
  sound?: string,
) {
  const selectedSound = sound ?? (await getStoredNotificationSound());
  await setupChannel(selectedSound);

  const [h, m] = hora.split(":").map(Number);

  if (
    !Number.isInteger(h) ||
    !Number.isInteger(m) ||
    h < 0 ||
    h > 23 ||
    m < 0 ||
    m > 59
  ) {
    throw new Error("Invalid time");
  }

  const channelId = getChannelId(selectedSound);

  return await Notifications.scheduleNotificationAsync({
    content: {
      title: "Medication time",
      body: `Time to take: ${nombre}`,
      sound: selectedSound,
      priority: Notifications.AndroidNotificationPriority.HIGH,
      ...(Platform.OS === "android"
        ? {
            channelId,
            android: {
              channelId,
              priority: Notifications.AndroidNotificationPriority.HIGH,
              autoCancel: false,
              ongoing: false,
            },
          }
        : {}),
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: h,
      minute: m,
    },
  });
}

export async function cancelNotification(id: string) {
  await Notifications.cancelScheduledNotificationAsync(id);
}
