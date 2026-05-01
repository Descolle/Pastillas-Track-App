import { scheduleNotification } from "@/utils/notification";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";

type ScheduledMedicationNotification = {
  notificationId: string;
  medicationName: string;
  time: string;
};

type MedicationReminder = {
  id: string;
  nombre: string;
  time: string;
};

const getKey = (medicationId: string) => `notif_${medicationId}`;

function parseStoredNotification(
  value: string | null,
): ScheduledMedicationNotification | null {
  if (!value) return null;

  try {
    const parsed = JSON.parse(value) as ScheduledMedicationNotification;
    if (parsed.notificationId) return parsed;
  } catch {
    return {
      notificationId: value,
      medicationName: "",
      time: "",
    };
  }

  return null;
}

export async function scheduleMedicationNotification(
  medicationId: string,
  nombre: string,
  hora: string,
  sound?: string,
) {
  try {
    const existing = parseStoredNotification(
      await AsyncStorage.getItem(getKey(medicationId)),
    );

    if (existing?.notificationId) {
      await Notifications.cancelScheduledNotificationAsync(
        existing.notificationId,
      );
    }

    const notificationId = await scheduleNotification(nombre, hora, sound);

    await AsyncStorage.setItem(
      getKey(medicationId),
      JSON.stringify({
        notificationId,
        medicationName: nombre,
        time: hora,
      }),
    );

    return notificationId;
  } catch (error) {
    console.log("schedule notification error:", error);
    throw error;
  }
}

export async function cancelMedicationNotification(medicationId: string) {
  try {
    const stored = parseStoredNotification(
      await AsyncStorage.getItem(getKey(medicationId)),
    );

    if (stored?.notificationId) {
      await Notifications.cancelScheduledNotificationAsync(
        stored.notificationId,
      );
      await AsyncStorage.removeItem(getKey(medicationId));
    }
  } catch (error) {
    console.log("cancel notification error:", error);
    throw error;
  }
}

export async function rescheduleMedicationNotifications(
  medications: MedicationReminder[],
  sound?: string,
) {
  await Promise.all(
    medications.map((medication) =>
      scheduleMedicationNotification(
        medication.id,
        medication.nombre,
        medication.time,
        sound,
      ),
    ),
  );
}

export async function clearAllMedicationNotifications() {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const notifKeys = keys.filter((k) => k.startsWith("notif_"));
    const entries = await AsyncStorage.multiGet(notifKeys);

    for (const [, value] of entries) {
      const stored = parseStoredNotification(value);
      if (stored?.notificationId) {
        await Notifications.cancelScheduledNotificationAsync(
          stored.notificationId,
        );
      }
    }

    await AsyncStorage.multiRemove(notifKeys);
  } catch (error) {
    console.log("clear notifications error:", error);
  }
}
