import SettingsModal from "@/components/SettingsModal";
import { ThemedText } from "@/components/themed-text";
import { useAuth } from "@/context/AuthContext";
import { useMedication } from "@/context/MedicationContext";
import {
  type NotificationSound,
  useSettings,
} from "@/context/SettingsContext";
import { rescheduleMedicationNotifications } from "@/services/notificationService";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const { user, loading } = useAuth();
  const { pastillas } = useMedication();
  const { t } = useSettings();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [settingsVisible, setSettingsVisible] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/sign-in");
    }
  }, [user, loading, router]);

  const handleSoundChange = async (sound: NotificationSound) => {
    await rescheduleMedicationNotifications(pastillas, sound);
  };

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: true,
          headerTitle: () => (
            <View
              style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
            >
              <MaterialIcons
                name="medication"
                size={24}
                color="#FFFFFF"
                style={{ marginRight: 8 }}
              />
              <ThemedText
                style={{ color: "#FFFFFF", fontWeight: "bold", fontSize: 20 }}
              >
                RecuerdaMed
              </ThemedText>
            </View>
          ),
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: "#123B6A",
          },
          headerTintColor: "#FFFFFF",
          headerTitleStyle: {
            color: "#FFFFFF",
            fontWeight: "bold",
            fontSize: 20,
          },
          headerShadowVisible: false,
          headerRight: () => (
            <Pressable
              onPress={() => setSettingsVisible(true)}
              style={{ marginRight: 16, padding: 4 }}
            >
              <MaterialIcons name="settings" size={24} color="#FFFFFF" />
            </Pressable>
          ),
          tabBarActiveTintColor: "#007AFF",
          tabBarInactiveTintColor: "#8E8E93",
          tabBarStyle: {
            height: 64 + insets.bottom,
            paddingTop: 6,
            paddingBottom: 8 + insets.bottom,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: t("home"),
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="home-filled" size={size} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="create"
          options={{
            title: t("create"),
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons
                name="add-circle-outline"
                size={size}
                color={color}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: t("profile"),
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="person-outline" size={size} color={color} />
            ),
          }}
        />

        <Tabs.Screen name="stats" options={{ href: null }} />
        <Tabs.Screen name="account" options={{ href: null }} />
      </Tabs>

      <SettingsModal
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
        onSoundChange={handleSoundChange}
      />
    </>
  );
}
