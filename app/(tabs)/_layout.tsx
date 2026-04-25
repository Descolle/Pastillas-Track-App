import { ThemedText } from "@/components/themed-text";
import { useAuth } from "@/context/AuthContext";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Alert, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/sign-in");
    }
  }, [user, loading]);

  const handleSettingsPress = () => {
    Alert.alert("Configuración", "Próximamente podrás personalizar el sonido de notificaciones y el idioma aquí.");
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerTitle: () => (
          <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
            <MaterialIcons name="medication" size={24} color="#FFFFFF" style={{ marginRight: 8 }} />
            <ThemedText style={{ color: "#FFFFFF", fontWeight: "bold", fontSize: 20 }}>
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
            onPress={handleSettingsPress}
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
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home-filled" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="create"
        options={{
          title: "Crear",
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
          title: "Perfil",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen name="stats" options={{ href: null }} />
      <Tabs.Screen name="account" options={{ href: null }} />
    </Tabs>
  );
}
