/* import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

const CHANNEL_ID = "medicamentos";

export async function requestPermissions() {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

async function setupChannel() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: "Medicamentos",
      importance: Notifications.AndroidImportance.MAX,
    });
  }
}

export async function scheduleNotification(nombre: string, tiempo: string) {
  await setupChannel();

  const [hour, minute] = tiempo.split(":").map(Number);

  return await Notifications.scheduleNotificationAsync({
    content: {
      title: "💊 RecuerdaMed",
      body: `Tomar ${nombre}`,
    },
    trigger: {
      hour,
      minute,
      repeats: true,
    },
  });
}

export async function cancelNotification(id: string) {
  await Notifications.cancelScheduledNotificationAsync(id);
}
*/

export async function requestPermissions() {
  return true;
}

export async function scheduleNotification(nombre: string, tiempo: string) {
  console.log("🔔 (mock) Notificación:", nombre, tiempo);
  return null;
}

export async function cancelNotification() {
  return;
}
