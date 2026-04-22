import { useThemeColor } from "@/hooks/use-theme-color";
import { useMemo } from "react";
import { StyleSheet } from "react-native";

// 🔥 Hook principal (ESTABLE)
export const useGlobalStyles = () => {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const tintColor = useThemeColor({}, "tint");
  const borderColor = useThemeColor(
    { light: "#C6C6C8", dark: "#3A3A3C" },
    "icon"
  );
  const cardBackground = useThemeColor(
    { light: "#FFFFFF", dark: "#2C2C2E" },
    "background"
  );
  const mutedColor = useThemeColor(
    { light: "#666666", dark: "#9BA1A6" },
    "icon"
  );

  // 🔥 MEMO CLAVE → evita romper hooks
  return useMemo(() => {
    return StyleSheet.create({
      // Layout
      flex1: { flex: 1 },
      container: {
        flex: 1,
        backgroundColor,
      },
      center: {
        justifyContent: "center",
        alignItems: "center",
      },
      row: {
        flexDirection: "row",
        alignItems: "center",
      },

      // Spacing
      padding: {
        padding: 16,
      },
      paddingLarge: {
        padding: 24,
      },
      margin: {
        margin: 16,
      },
      gap: {
        gap: 16,
      },

      // Cards
      card: {
        backgroundColor: cardBackground,
        borderRadius: 12,
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      },
      cardCompact: {
        backgroundColor: cardBackground,
        borderRadius: 8,
        padding: 12,
        marginVertical: 4,
        marginHorizontal: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
      },

      // Text
      title: {
        fontSize: 24,
        fontWeight: "bold",
        color: textColor,
        marginBottom: 16,
      },
      subtitle: {
        fontSize: 18,
        fontWeight: "600",
        color: textColor,
        marginBottom: 8,
      },
      body: {
        fontSize: 16,
        color: textColor,
        lineHeight: 24,
      },
      caption: {
        fontSize: 14,
        color: mutedColor,
        lineHeight: 20,
      },
      small: {
        fontSize: 12,
        color: mutedColor,
      },

      // Buttons
      button: {
        backgroundColor: tintColor,
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 24,
        alignItems: "center",
        justifyContent: "center",
        minHeight: 48,
      },
      buttonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
      },
      buttonSecondary: {
        backgroundColor: "transparent",
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderWidth: 1,
        borderColor: tintColor,
        alignItems: "center",
        justifyContent: "center",
        minHeight: 48,
      },
      buttonSecondaryText: {
        color: tintColor,
        fontSize: 16,
        fontWeight: "600",
      },

      // Lists
      list: {
        flex: 1,
        backgroundColor,
      },
      listItem: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: borderColor,
      },

      // Stats
      statsCard: {
        backgroundColor: cardBackground,
        borderRadius: 12,
        padding: 20,
        margin: 16,
        alignItems: "center",
      },
      statsNumber: {
        fontSize: 32,
        fontWeight: "bold",
        color: tintColor,
      },
      statsLabel: {
        fontSize: 14,
        color: mutedColor,
        marginTop: 4,
      },

      // Medication specific
      medicationCard: {
        backgroundColor: cardBackground,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: "#000",
        paddingVertical: 14,
        paddingHorizontal: 16,
        marginVertical: 8,
        marginHorizontal: 16,
      },

      medicationCardTopRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      },

      medicationName: {
        fontSize: 16,
        fontWeight: "600",
        color: textColor,
        flex: 1,
      },

      medicationTaken: {
        textDecorationLine: "line-through",
        opacity: 0.6,
      },
      medicationNameTaken: {
        fontSize: 16,
        fontWeight: "600",
        color: textColor,
        flex: 1,
      },
      buttonTaken: {
        backgroundColor: "#4CAF50",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
      },
      buttonEdit: {
        backgroundColor: "#FF9800",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
      },
      buttonDelete: {
        backgroundColor: "#F44336",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
      },

      medicationInfoBlock: {
        flex: 1,
      },

      medicationMetricBlock: {
        width: 70,
        alignItems: "center",
      },

      medicationMetricLabel: {
        fontSize: 11,
        color: mutedColor,
      },

      medicationMetricValue: {
        fontSize: 14,
        fontWeight: "600",
        color: textColor,
      },

      medicationActions: {
        flexDirection: "row",
        gap: 8,
      },

      medicationIcon: {
        width: 40,
        height: 40,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#000",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
      },
    });
  }, [backgroundColor, textColor, tintColor, borderColor, cardBackground, mutedColor]);
};
