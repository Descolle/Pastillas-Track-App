import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

const CHANNEL_ID = "medicamentos";

let handlerInitialized = false;

// 🎵 Available loud notification sounds
const LOUD_SOUNDS = [
  "pill_reminder_1.wav",
  "pill_reminder_2.wav", 
  "pill_reminder_3.wav"
];

// 🎲 Get random loud sound
function getRandomLoudSound(): string {
  const randomIndex = Math.floor(Math.random() * LOUD_SOUNDS.length);
  return LOUD_SOUNDS[randomIndex];
}

// 🔊 inicializar handler SOLO cuando la app esté lista
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

// 📱 canal Android - Configured for maximum volume
async function setupChannel() {
  if (Platform.OS !== "android") return;

  await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: "Recordatorios de Medicamentos",
    description: "Recordatorios para tomar medicamentos a tiempo",
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    sound: "pill_reminder_1.wav", // Default loud sound
    enableLights: true,
    lightColor: "#FF0000",
    enableVibrate: true,
  });
}

// ✅ permisos
export async function requestPermissions() {
  await setupChannel();

  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

// ⏰ programar notificación diaria con sonido alto
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

  // 🎲 Select random loud sound
  const selectedSound = getRandomLoudSound();

  return await Notifications.scheduleNotificationAsync({
    content: {
      title: "💊 ¡HORA DE TU MEDICAMENTO!",
      body: `Es hora de tomar: ${nombre}`,
      sound: selectedSound,
      priority: Notifications.AndroidNotificationPriority.HIGH,
      ...(Platform.OS === "android" ? { 
        channelId: CHANNEL_ID,
        // Additional Android-specific settings for louder notifications
        android: {
          channelId: CHANNEL_ID,
          priority: Notifications.AndroidNotificationPriority.HIGH,
          autoCancel: false,
          ongoing: false,
        }
      } : {}),
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: h,
      minute: m,
    },
  });
}

// ❌ cancelar
export async function cancelNotification(id: string) {
  await Notifications.cancelScheduledNotificationAsync(id);
}
