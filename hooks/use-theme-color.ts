import { useColorScheme } from "react-native";

const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    tint: "#007AFF",
    icon: "#666666",
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: "#0A84FF",
    icon: "#9BA1A6",
  },
};

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light
) {
  const theme = useColorScheme() ?? "light";

  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  }

  return Colors[theme][colorName];
}
