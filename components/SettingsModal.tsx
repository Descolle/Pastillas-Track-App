import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import {
  NOTIFICATION_SOUNDS,
  type AppLanguage,
  type AppTheme,
  type NotificationSound,
  useSettings,
} from "@/context/SettingsContext";
import { previewNotificationSound } from "@/utils/notification";

type SettingsModalProps = {
  visible: boolean;
  onClose: () => void;
  onSoundChange: (sound: NotificationSound) => Promise<void>;
};

export default function SettingsModal({
  visible,
  onClose,
  onSoundChange,
}: SettingsModalProps) {
  const {
    language,
    theme,
    notificationSound,
    setLanguage,
    setTheme,
    setNotificationSound,
    t,
  } = useSettings();

  const selectLanguage = async (nextLanguage: AppLanguage) => {
    await setLanguage(nextLanguage);
  };

  const selectTheme = async (nextTheme: AppTheme) => {
    await setTheme(nextTheme);
  };

  const selectSound = async (sound: NotificationSound) => {
    await setNotificationSound(sound);
    await previewNotificationSound(sound);
    await onSoundChange(sound);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.container,
            theme === "dark" ? styles.containerDark : undefined,
          ]}
        >
          <View style={styles.header}>
            <View style={styles.headerTitle}>
              <MaterialIcons
                name="settings"
                size={22}
                color={theme === "dark" ? "#FFFFFF" : "#173B67"}
              />
              <TextLabel primary>{t("settings")}</TextLabel>
            </View>

            <Pressable onPress={onClose} style={styles.iconButton}>
              <MaterialIcons
                name="close"
                size={22}
                color={theme === "dark" ? "#FFFFFF" : "#111111"}
              />
            </Pressable>
          </View>

          <View style={styles.section}>
            <SectionTitle icon="language" text={t("language")} />
            <View style={styles.segmented}>
              <SegmentButton
                active={language === "es"}
                label={t("spanish")}
                onPress={() => selectLanguage("es")}
              />
              <SegmentButton
                active={language === "en"}
                label={t("english")}
                onPress={() => selectLanguage("en")}
              />
            </View>
          </View>

          <View style={styles.section}>
            <SectionTitle icon="brightness-6" text={t("appearance")} />
            <Pressable
              onPress={() => selectTheme(theme === "dark" ? "light" : "dark")}
              style={[
                styles.themeSwitch,
                theme === "dark" ? styles.themeSwitchDark : undefined,
              ]}
            >
              <View
                style={[
                  styles.themeKnob,
                  theme === "dark" ? styles.themeKnobDark : undefined,
                ]}
              >
                <MaterialIcons
                  name={theme === "dark" ? "dark-mode" : "light-mode"}
                  size={20}
                  color={theme === "dark" ? "#FFFFFF" : "#F6A500"}
                />
              </View>

              <View style={styles.themeLabels}>
                <MaterialIcons name="light-mode" size={18} color="#F6A500" />
                <MaterialIcons name="dark-mode" size={18} color="#FFFFFF" />
              </View>
            </Pressable>
          </View>

          <View style={styles.section}>
            <SectionTitle icon="music-note" text={t("notificationTone")} />
            <View style={styles.soundList}>
              {NOTIFICATION_SOUNDS.map((sound) => (
                <Pressable
                  key={sound.value}
                  onPress={() => selectSound(sound.value)}
                  style={[
                    styles.soundButton,
                    notificationSound === sound.value
                      ? styles.soundButtonActive
                      : undefined,
                  ]}
                >
                  <MaterialIcons
                    name={
                      notificationSound === sound.value
                        ? "radio-button-checked"
                        : "radio-button-unchecked"
                    }
                    size={20}
                    color={
                      notificationSound === sound.value ? "#173B67" : "#6B7280"
                    }
                  />
                  <TextLabel>{sound.label}</TextLabel>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function TextLabel({
  children,
  primary,
  color,
}: {
  children: string;
  primary?: boolean;
  color?: string;
}) {
  const { theme } = useSettings();

  return (
    <Text
      style={[
        styles.text,
        primary ? styles.primaryText : undefined,
        theme === "dark" ? styles.textDark : undefined,
        color ? { color } : undefined,
      ]}
    >
      {children}
    </Text>
  );
}

function SectionTitle({ icon, text }: { icon: any; text: string }) {
  const { theme } = useSettings();

  return (
    <View style={styles.sectionTitle}>
      <MaterialIcons
        name={icon}
        size={18}
        color={theme === "dark" ? "#D7E7FF" : "#173B67"}
      />
      <TextLabel primary>{text}</TextLabel>
    </View>
  );
}

function SegmentButton({
  active,
  label,
  onPress,
}: {
  active: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.segmentButton, active ? styles.segmentButtonActive : null]}
    >
      <TextLabel color="#111111">{label}</TextLabel>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    justifyContent: "center",
    padding: 20,
  },
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    gap: 18,
  },
  containerDark: {
    backgroundColor: "#1F2327",
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerTitle: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {
    padding: 6,
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  segmented: {
    backgroundColor: "#EEF2F7",
    borderRadius: 10,
    flexDirection: "row",
    padding: 4,
  },
  segmentButton: {
    alignItems: "center",
    borderRadius: 8,
    flex: 1,
    paddingVertical: 10,
  },
  segmentButtonActive: {
    backgroundColor: "#CFE1FA",
  },
  themeSwitch: {
    width: 78,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#93C5FD",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  themeSwitchDark: {
    backgroundColor: "#24364F",
  },
  themeKnob: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  themeKnobDark: {
    alignSelf: "flex-end",
    backgroundColor: "#111827",
  },
  themeLabels: {
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    left: 10,
    position: "absolute",
    right: 10,
    top: 10,
  },
  soundList: {
    gap: 8,
  },
  soundButton: {
    alignItems: "center",
    borderColor: "#E5E7EB",
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: "row",
    gap: 10,
    padding: 12,
  },
  soundButtonActive: {
    backgroundColor: "#EDF5FF",
    borderColor: "#9DC1F6",
  },
  text: {
    color: "#111111",
    fontSize: 15,
  },
  textDark: {
    color: "#FFFFFF",
  },
  primaryText: {
    fontWeight: "700",
  },
});
