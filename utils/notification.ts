import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

const CHANNEL_ID = "medicamentos";

// 🔊 comportamiento global
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// 📱 canal Android
async function setupChannel() {
  if (Platform.OS !== "android") return;

  await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: "Recordatorios",
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
  });
}

// ✅ permisos
export async function requestPermissions() {
  await setupChannel();

  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

// ⏰ programar notificación diaria
export async function scheduleNotification(nombre: string, hora: string) {
  await setupChannel();

  const [h, m] = hora.split(":").map(Number);

  if (
    !Number.isInteger(h) ||
    !Number.isInteger(m) ||
    h < 0 ||
    h > 23 ||
    m < 0 ||
    m > 59
  ) {
    throw new Error("Hora inválida");
  }

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: "💊 Hora de tu medicamento",
      body: `Tomar ${nombre}`,
      sound: true,
      ...(Platform.OS === "android" ? { channelId: CHANNEL_ID } : {}),
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: h,
      minute: m,
    },
  });

  return id;
}

// ❌ cancelar
export async function cancelNotification(id: string) {
  await Notifications.cancelScheduledNotificationAsync(id);
}
