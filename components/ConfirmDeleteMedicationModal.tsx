import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import { useSettings } from "@/context/SettingsContext";

type ConfirmDeleteMedicationModalProps = {
  visible: boolean;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ConfirmDeleteMedicationModal({
  visible,
  loading = false,
  onCancel,
  onConfirm,
}: ConfirmDeleteMedicationModalProps) {
  const { theme, t } = useSettings();
  const dark = theme === "dark";

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, dark && styles.containerDark]}>
          <View style={styles.iconCircle}>
            <MaterialIcons name="delete-outline" size={28} color="#C62828" />
          </View>

          <Text style={[styles.title, dark && styles.textDark]}>
            {t("deleteConfirmTitle")}
          </Text>

          <Text style={[styles.message, dark && styles.messageDark]}>
            ¿Está seguro que quiere{" "}
            <Text style={styles.deleteWord}>ELIMINAR</Text> esta pastilla?
          </Text>

          <View style={styles.actions}>
            <Pressable
              disabled={loading}
              onPress={onCancel}
              style={[styles.button, styles.cancelButton]}
            >
              <Text style={styles.cancelText}>{t("cancel")}</Text>
            </Pressable>

            <Pressable
              disabled={loading}
              onPress={onConfirm}
              style={[styles.button, styles.deleteButton, loading && styles.disabled]}
            >
              <Text style={styles.deleteText}>
                {loading ? "Eliminando..." : t("delete")}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  container: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    elevation: 5,
    maxWidth: 400,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    width: "100%",
  },
  containerDark: {
    backgroundColor: "#1F2327",
  },
  iconCircle: {
    alignItems: "center",
    backgroundColor: "#FDECEC",
    borderRadius: 24,
    height: 48,
    justifyContent: "center",
    marginBottom: 14,
    width: 48,
  },
  title: {
    color: "#111111",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
    textAlign: "center",
  },
  textDark: {
    color: "#FFFFFF",
  },
  message: {
    color: "#374151",
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
    textAlign: "center",
  },
  messageDark: {
    color: "#D1D5DB",
  },
  deleteWord: {
    color: "#C62828",
    fontWeight: "800",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  button: {
    alignItems: "center",
    borderRadius: 8,
    flex: 1,
    minHeight: 48,
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  cancelButton: {
    backgroundColor: "#F3F4F6",
  },
  deleteButton: {
    backgroundColor: "#C62828",
  },
  disabled: {
    opacity: 0.65,
  },
  cancelText: {
    color: "#333333",
    fontWeight: "600",
  },
  deleteText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
