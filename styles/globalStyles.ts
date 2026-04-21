import { StyleSheet } from "react-native";
import { useThemeColor } from "@/hooks/use-theme-color";

// Theme-aware style creator
export const createStyles = () => {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const tintColor = useThemeColor({}, "tint");
  const borderColor = useThemeColor({ light: "#C6C6C8", dark: "#3A3A3C" }, "icon");
  const cardBackground = useThemeColor({ light: "#FFFFFF", dark: "#2C2C2E" }, "background");
  const mutedColor = useThemeColor({ light: "#666666", dark: "#9BA1A6" }, "icon");

  return StyleSheet.create({
    // Layout
    container: {
      flex: 1,
      backgroundColor,
    },
    flex1: {
      flex: 1,
    },
    center: {
      justifyContent: "center",
      alignItems: "center",
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
    },
    spaceBetween: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    // Spacing
    padding: {
      padding: 16,
    },
    paddingSmall: {
      padding: 8,
    },
    paddingLarge: {
      padding: 24,
    },
    margin: {
      margin: 16,
    },
    marginSmall: {
      margin: 8,
    },
    marginLarge: {
      margin: 24,
    },
    gap: {
      gap: 16,
    },
    gapSmall: {
      gap: 8,
    },
    gapLarge: {
      gap: 24,
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
    buttonDanger: {
      backgroundColor: "#FF3B30",
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 24,
      alignItems: "center",
      justifyContent: "center",
      minHeight: 48,
    },
    buttonDangerText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "600",
    },

    // Inputs
    input: {
      borderWidth: 1,
      borderColor: borderColor,
      borderRadius: 8,
      padding: 16,
      fontSize: 16,
      color: textColor,
      backgroundColor: cardBackground,
    },
    inputFocused: {
      borderColor: tintColor,
      borderWidth: 2,
    },
    inputError: {
      borderColor: "#FF3B30",
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
    listItemLast: {
      borderBottomWidth: 0,
    },

    // Status
    success: {
      color: "#34C759",
    },
    warning: {
      color: "#FF9500",
    },
    error: {
      color: "#FF3B30",
    },
    info: {
      color: tintColor,
    },

    // Loading
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor,
    },

    // Modals
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      backgroundColor: cardBackground,
      borderRadius: 16,
      padding: 24,
      margin: 20,
      maxWidth: 400,
      width: "100%",
    },

    // Tabs
    tabBar: {
      flexDirection: "row",
      backgroundColor: cardBackground,
      borderTopWidth: 1,
      borderTopColor: borderColor,
    },
    tabItem: {
      flex: 1,
      paddingVertical: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    tabItemActive: {
      borderTopWidth: 2,
      borderTopColor: tintColor,
    },

    // Forms
    formGroup: {
      marginBottom: 16,
    },
    formLabel: {
      fontSize: 16,
      fontWeight: "600",
      color: textColor,
      marginBottom: 8,
    },
    formError: {
      fontSize: 14,
      color: "#FF3B30",
      marginTop: 4,
    },

    // Specific to medication app
    medicationCard: {
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
    medicationCardTopRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    medicationName: {
      fontSize: 18,
      fontWeight: "600",
      color: textColor,
      flex: 1,
    },
    medicationDetails: {
      fontSize: 14,
      color: mutedColor,
      marginBottom: 8,
    },
    medicationTaken: {
      textDecorationLine: "line-through",
      opacity: 0.6,
    },
    medicationIcon: {
      padding: 8,
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

    // Profile
    profileCard: {
      backgroundColor: cardBackground,
      borderRadius: 12,
      padding: 20,
      margin: 16,
      alignItems: "center",
    },
    profileAvatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: tintColor,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 16,
    },
    profileName: {
      fontSize: 24,
      fontWeight: "bold",
      color: textColor,
      marginBottom: 4,
    },
    profileEmail: {
      fontSize: 16,
      color: mutedColor,
      marginBottom: 16,
    },
  });
};

// Hook for using styles
export const useGlobalStyles = () => {
  return createStyles();
};

// Export individual style creators for specific components
export const useHomeStyles = () => {
  const styles = useGlobalStyles();
  return {
    ...styles,
    // Home-specific styles can be added here
  };
};

export const useProfileStyles = () => {
  const styles = useGlobalStyles();
  return {
    ...styles,
    // Profile-specific styles can be added here
  };
};

export const useMedicationStyles = () => {
  const styles = useGlobalStyles();
  return {
    ...styles,
    // Medication-specific styles can be added here
  };
};
