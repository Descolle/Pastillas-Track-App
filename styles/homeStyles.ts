import { useMemo } from "react";
import { StyleSheet } from "react-native";

import { useThemeColor } from "@/hooks/use-theme-color";

export function useMedicationHomeStyles() {
  const tint = useThemeColor({}, "tint");
  const onPrimary = useThemeColor({ light: "#FFFFFF", dark: "#11181C" }, "text");
  const border = useThemeColor({ light: "#C6C6C8", dark: "#3A3A3C" }, "icon");
  const inputBg = useThemeColor({ light: "#FFFFFF", dark: "#2C2C2E" }, "background");
  const textMuted = useThemeColor({ light: "#666666", dark: "#9BA1A6" }, "icon");

  return useMemo(
    () =>
      StyleSheet.create({
        flex1: { flex: 1 },
        loadingWrap: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        },
        listContent: {
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: 32,
        },
        formBlock: {
          marginBottom: 20,
        },
        title: {
          marginBottom: 16,
        },
        fieldLabel: {
          fontSize: 13,
          fontWeight: "600",
          marginBottom: 6,
          opacity: 0.85,
        },
        input: {
          borderWidth: 1,
          borderColor: border,
          backgroundColor: inputBg,
          borderRadius: 10,
          paddingHorizontal: 14,
          paddingVertical: 12,
          fontSize: 16,
          marginBottom: 12,
        },
        primaryButton: {
          backgroundColor: tint,
          borderRadius: 10,
          paddingVertical: 14,
          alignItems: "center",
          marginTop: 4,
        },
        primaryButtonText: {
          color: onPrimary,
          fontSize: 16,
          fontWeight: "600",
        },
        card: {
          borderRadius: 12,
          borderWidth: 1,
          borderColor: border,
          backgroundColor: inputBg,
          padding: 16,
          marginBottom: 12,
        },
        cardMeta: {
          fontSize: 15,
          marginTop: 6,
          color: textMuted,
        },
        cardTopRow: {
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 8,
        },
        cardTitle: {
          flex: 1,
          paddingRight: 4,
        },
        cardActions: {
          flexDirection: "row",
          alignItems: "center",
          marginTop: -4,
          marginRight: -6,
        },
        actionIconHit: {
          width: 44,
          height: 44,
          alignItems: "center",
          justifyContent: "center",
        },
        empty: {
          textAlign: "center",
          marginTop: 24,
          opacity: 0.7,
        },
        timeIosWrap: {
          marginBottom: 12,
          alignSelf: "stretch",
        },
        timeAndroidPressable: {
          justifyContent: "center",
        },
        timeHint: {
          fontSize: 13,
          marginTop: 6,
          opacity: 0.65,
        },
      }),
    [tint, onPrimary, border, inputBg, textMuted],
  );
}
