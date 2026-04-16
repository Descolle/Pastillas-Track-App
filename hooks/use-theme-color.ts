import { useColorScheme } from "react-native";

const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    tint: "#007AFF",
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: "#0A84FF",
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
