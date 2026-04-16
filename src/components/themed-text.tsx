import { useThemeColor } from "@/hooks/use-theme-color";
import { Text, TextProps } from "react-native";

export type ThemedTextProps = TextProps & {
  type?: "default" | "title" | "subtitle" | "link";
};

export function ThemedText({
  style,
  type = "default",
  ...props
}: ThemedTextProps) {
  const color = useThemeColor({}, "text");

  return (
    <Text
      style={[
        { color },
        type === "title" && { fontSize: 28, fontWeight: "bold" },
        type === "subtitle" && { fontSize: 20, fontWeight: "600" },
        type === "link" && { color: "#007AFF" },
        style,
      ]}
      {...props}
    />
  );
}
