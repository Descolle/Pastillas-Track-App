import * as Notifications from "expo-notifications";

export const scheduleNotification = async (time) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "💊 Hora de tu medicamento",
      body: "No olvides tomar tu pastilla",
    },
    trigger: {
      hour: time.hour,
      minute: time.minute,
      repeats: true,
    },
  });
};
