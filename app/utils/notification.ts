import * as Notifications from "expo-notifications";

export const requestPermissions = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
};

export const scheduleNotification = async (
  nombre: string,
  tiempo: string
) => {
  const [hour, minute] = tiempo.split(":").map(Number);

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: "💊 Hora de tu medicamento",
      body: `Es momento de tomar: ${nombre}`,
    },
    trigger: {
      hour,
      minute,
      repeats: true,
    },
  });

  return id;
};
