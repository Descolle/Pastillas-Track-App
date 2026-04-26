import { useGlobalStyles } from "@/hooks/use-styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";

const TERMS_AGREEMENT_KEY = "terms_agreed";

export default function TermsScreen() {
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const styles = useGlobalStyles();

  // 🔥 estilos locales (override)
  const localStyles = {
    cardWhite: {
      backgroundColor: "#FFFFFF",
    },
    textBlack: {
      color: "#000000",
    },
  };

  useEffect(() => {
    checkTermsAgreement();
  }, []);

  const checkTermsAgreement = async () => {
    try {
      const hasAgreed = await AsyncStorage.getItem(TERMS_AGREEMENT_KEY);
      if (hasAgreed === "true") {
        router.replace("/sign-in");
      }
    } catch (error) {
      console.error("Error checking terms agreement:", error);
    }
  };

  const handleAgree = async () => {
    if (!agreed) {
      Alert.alert(
        "Términos y Condiciones",
        "Debes aceptar los términos y condiciones para continuar.",
      );
      return;
    }

    try {
      setLoading(true);
      await AsyncStorage.setItem(TERMS_AGREEMENT_KEY, "true");
      router.replace("/sign-in");
    } catch (error) {
      console.error("Error saving terms agreement:", error);
      Alert.alert(
        "Error",
        "No se pudo guardar tu aceptación. Por favor intenta de nuevo.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#0B2440" }}>
      <ScrollView
        style={styles.flex1}
        contentContainerStyle={styles.paddingLarge}
        showsVerticalScrollIndicator={false}
      >
        {/* CARD PRINCIPAL */}
        <View style={[styles.card, styles.margin, localStyles.cardWhite]}>
          <Text style={[styles.title, localStyles.textBlack]}>
            Términos y Condiciones
          </Text>

          <View style={styles.gap}>
            <Text style={[styles.body, localStyles.textBlack]}>
              Al usar RecuerdaMed, aceptas nuestros términos de servicio y
              política de privacidad...
              {"\n\n"}
              <Text style={[styles.subtitle, localStyles.textBlack]}>
                2. Descripción del Servicio
              </Text>
              {"\n\n"}
              Pastillas Track es una aplicación móvil diseñada para ayudar a los
              usuarios...
              {"\n\n"}
              <Text style={[styles.subtitle, localStyles.textBlack]}>
                3. Responsabilidades del Usuario
              </Text>
              {"\n\n"}
              Usted es responsable de:
              {"\n"}• Proporcionar información médica precisa
              {"\n"}• Consultar siempre a un profesional de la salud
              {"\n"}• Seguir las indicaciones médicas
              {"\n"}• No modificar dosis sin supervisión profesional
              {"\n\n"}
              <Text style={[styles.subtitle, localStyles.textBlack]}>
                4. Privacidad y Datos
              </Text>
              {"\n\n"}
              Nos comprometemos a proteger su información médica...
              {"\n\n"}
              <Text style={[styles.subtitle, localStyles.textBlack]}>
                5. Limitaciones de Responsabilidad
              </Text>
              {"\n\n"}
              Pastillas Track es una herramienta de apoyo...
              {"\n\n"}
              <Text style={[styles.subtitle, localStyles.textBlack]}>
                6. Uso del Servicio
              </Text>
              {"\n\n"}• La aplicación es gratuita...
              {"\n\n"}
              <Text style={[styles.subtitle, localStyles.textBlack]}>
                7. Contacto y Soporte
              </Text>
              {"\n\n"}
              Email: soporte@pastillastrack.com
              {"\n\n"}
              Al hacer clic en Acepto, usted confirma que ha leído...
            </Text>
          </View>

          {/* INFO */}
          <View style={[styles.gap, styles.margin]}>
            <View style={styles.row}>
              <View
                style={[
                  styles.cardCompact,
                  { flex: 1, marginRight: 8 },
                  localStyles.cardWhite,
                ]}
              >
                <Text style={[styles.small, localStyles.textBlack]}>
                  Última actualización: {new Date().toLocaleDateString()}
                </Text>
              </View>
            </View>

            <View style={styles.row}>
              <Text style={[styles.caption, localStyles.textBlack]}>
                {agreed
                  ? "✅ Has aceptado los términos"
                  : "Debes aceptar los términos para continuar"}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* CARD INFERIOR */}
      <View style={[styles.padding, styles.margin]}>
        <View style={[styles.card, localStyles.cardWhite]}>
          <View style={styles.row}>
            <Pressable
              style={[
                styles.cardCompact,
                {
                  width: 24,
                  height: 24,
                  justifyContent: "center",
                  alignItems: "center",
                  borderWidth: agreed ? 0 : 2,
                  borderColor: agreed ? "#007AFF" : "#C6C6C8",
                  borderRadius: 4,
                  backgroundColor: "#FFFFFF",
                },
              ]}
              onPress={() => setAgreed(!agreed)}
            >
              <Text
                style={{
                  color: agreed ? "#007AFF" : "#000000",
                  fontSize: 16,
                }}
              >
                {agreed ? "✓" : ""}
              </Text>
            </Pressable>

            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={[styles.body, localStyles.textBlack]}>
                He leído y acepto los términos y condiciones
              </Text>
            </View>
          </View>

          <View style={styles.gap}>
            <View style={styles.row}>
              <Pressable
                style={[
                  styles.button,
                  {
                    backgroundColor: agreed ? "#007AFF" : "#C6C6C8",
                    opacity: loading ? 0.6 : 1,
                  },
                ]}
                onPress={handleAgree}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading
                    ? "Procesando..."
                    : agreed
                      ? "Continuar al Login"
                      : "Acepto"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
