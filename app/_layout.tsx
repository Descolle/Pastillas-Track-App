import { MedicationProvider } from "../context/MedicationContext";
import * as Notifications from "expo-notifications";
import { Stack } from "expo-router";

// 🔔 Config global
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {
  return (
    <MedicationProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </MedicationProvider>
  );
}
