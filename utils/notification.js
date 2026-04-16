import * as Notifications from "expo-notifications";

export const scheduleNotification = async (hour, minute) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "💊 Hora de tu medicamento",
      body: "No olvides tomar tu pastilla",
    },
    trigger: {
      hour,
      minute,
      repeats: true,
    },
  });
};
