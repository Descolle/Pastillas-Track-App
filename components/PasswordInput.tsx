import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type TextStyle,
  type ViewStyle,
} from "react-native";

type PasswordInputProps = Omit<TextInputProps, "secureTextEntry"> & {
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  iconColor?: string;
};

export default function PasswordInput({
  containerStyle,
  inputStyle,
  iconColor = "#374151",
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      <TextInput
        {...props}
        secureTextEntry={!visible}
        style={[styles.input, inputStyle]}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={visible ? "Ocultar contrasena" : "Mostrar contrasena"}
        hitSlop={8}
        onPress={() => setVisible((current) => !current)}
        style={styles.button}
      >
        <MaterialIcons
          name={visible ? "visibility" : "visibility-off"}
          size={22}
          color={iconColor}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
  },
  input: {
    flex: 1,
  },
  button: {
    alignItems: "center",
    alignSelf: "stretch",
    justifyContent: "center",
    paddingHorizontal: 14,
  },
});
