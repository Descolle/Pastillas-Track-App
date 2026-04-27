import { scheduleNotification } from "@/utils/notification";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";

const getKey = (medicationId: string) => `notif_${medicationId}`;

// 🔔 SCHEDULE
export async function scheduleMedicationNotification(
  medicationId: string,
  nombre: string,
  hora: string
) {
  try {
    // 🔥 cancelar anterior si existe
    const existingId = await AsyncStorage.getItem(getKey(medicationId));

    if (existingId) {
      console.log("🔕 Cancelling existing notification:", existingId);
      await Notifications.cancelScheduledNotificationAsync(existingId);
    }

    // 🔔 crear nueva
    const notificationId = await scheduleNotification(nombre, hora);

    // 💾 guardar persistente
    await AsyncStorage.setItem(getKey(medicationId), notificationId);

    console.log("🔔 Scheduled:", { medicationId, notificationId });

    return notificationId;
  } catch (error) {
    console.log("🔴 schedule error:", error);
    throw error;
  }
}

// 🔕 CANCEL
export async function cancelMedicationNotification(medicationId: string) {
  try {
    const notificationId = await AsyncStorage.getItem(getKey(medicationId));

    if (notificationId) {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      await AsyncStorage.removeItem(getKey(medicationId));

      console.log("🔕 Cancelled:", { medicationId, notificationId });
    } else {
      console.log("⚠️ No notification found for:", medicationId);
    }
  } catch (error) {
    console.log("🔴 cancel error:", error);
    throw error;
  }
}

// 🔥 CLEAR ALL (logout)
export async function clearAllMedicationNotifications() {
  try {
    const keys = await AsyncStorage.getAllKeys();

    const notifKeys = keys.filter((k) => k.startsWith("notif_"));

    const entries = await AsyncStorage.multiGet(notifKeys);

    for (const [, notificationId] of entries) {
      if (notificationId) {
        await Notifications.cancelScheduledNotificationAsync(notificationId);
      }
    }

    await AsyncStorage.multiRemove(notifKeys);

    console.log("🧹 All notifications cleared");
  } catch (error) {
    console.log("🔴 clear all error:", error);
  }
}
