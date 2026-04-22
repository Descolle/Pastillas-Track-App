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

  useEffect(() => {
    checkTermsAgreement();
  }, []);

  const checkTermsAgreement = async () => {
    try {
      const hasAgreed = await AsyncStorage.getItem(TERMS_AGREEMENT_KEY);
      if (hasAgreed === "true") {
        // User already agreed, redirect to login
        router.replace("/sign-in");
      }
    } catch (error) {
      console.error("Error checking terms agreement:", error);
    }
  };

  const handleAgree = async () => {
    if (!agreed) {
      Alert.alert("Términos y Condiciones", "Debes aceptar los términos y condiciones para continuar.");
      return;
    }

    try {
      setLoading(true);
      await AsyncStorage.setItem(TERMS_AGREEMENT_KEY, "true");
      
      // Redirect to login after agreement
      router.replace("/sign-in");
    } catch (error) {
      console.error("Error saving terms agreement:", error);
      Alert.alert("Error", "No se pudo guardar tu aceptación. Por favor intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <ScrollView 
        style={styles.flex1}
        contentContainerStyle={styles.paddingLarge}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.card, styles.margin]}>
          <Text style={[styles.title, { color: '#000000' }]}>
            Términos y Condiciones
          </Text>

          <View style={styles.gap}>
            <Text style={[styles.body, { color: '#000000' }]}>
              <Text style={[styles.subtitle, { color: '#000000' }]}>1. Aceptación de Términos</Text>
              {"\n\n"}
              Al utilizar esta aplicación de seguimiento de medicamentos ("Pastillas Track"), usted acepta y se compromete a cumplir estos términos y condiciones.
              
              {"\n\n"}
              <Text style={[styles.subtitle, { color: '#000000' }]}>2. Descripción del Servicio</Text>
              {"\n\n"}
              Pastillas Track es una aplicación móvil diseñada para ayudar a los usuarios a gestionar y recordar sus medicamentos. La aplicación permite:
              {"\n"}
              • Registrar medicamentos y dosis
              {"\n"}
              • Configurar recordatorios
              {"\n"}
              • Seguir el progreso de tratamiento
              {"\n"}
              • Generar estadísticas de cumplimiento
              
              {"\n\n"}
              <Text style={[styles.subtitle, { color: '#000000' }]}>3. Responsabilidades del Usuario</Text>
              {"\n\n"}
              Usted es responsable de:
              {"\n"}
              • Proporcionar información médica precisa
              {"\n"}
              • Consultar siempre a un profesional de la salud
              {"\n"}
              • Seguir las indicaciones médicas
              {"\n"}
              • No modificar dosis sin supervisión profesional
              
              {"\n\n"}
              <Text style={[styles.subtitle, { color: '#000000' }]}>4. Privacidad y Datos</Text>
              {"\n\n"}
              Nos comprometemos a proteger su información médica:
              {"\n"}
              • Datos encriptados y seguros
              {"\n"}
              • No compartimos información sin consentimiento
              {"\n"}
              • Cumplimiento con regulaciones de salud
              {"\n"}
              • Derecho a eliminar sus datos en cualquier momento
              
              {"\n\n"}
              <Text style={[styles.subtitle, { color: '#000000' }]}>5. Limitaciones de Responsabilidad</Text>
              {"\n\n"}
              Pastillas Track es una herramienta de apoyo y no reemplaza:
              {"\n"}
              • El juicio clínico de profesionales
              {"\n"}
              • Diagnósticos médicos
              {"\n"}
              • Tratamientos prescritos
              {"\n"}
              • Decisiones de salud importantes
              
              {"\n\n"}
              En caso de emergencia médica, contacte inmediatamente a servicios de emergencia.
              
              {"\n\n"}
              <Text style={[styles.subtitle, { color: '#000000' }]}>6. Uso del Servicio</Text>
              {"\n\n"}
              • La aplicación es gratuita con características premium opcionales
              {"\n"}
              • Puede requerir conexión a internet
              {"\n"}
              • Las notificaciones dependen de configuración del dispositivo
              {"\n"}
              • Nos reservamos el derecho a modificar términos con previo aviso
              
              {"\n\n"}
              <Text style={[styles.subtitle, { color: '#000000' }]}>7. Contacto y Soporte</Text>
              {"\n\n"}
              Para preguntas o soporte técnico:
              {"\n"}
              • Email: soporte@pastillastrack.com
              {"\n"}
              • Respuesta dentro de 24-48 horas
              {"\n"}
              • Actualizaciones regulares del servicio
              
              {"\n\n"}
              Al hacer clic en "Acepto", usted confirma que ha leído, entendido y aceptado estos términos y condiciones.
            </Text>
          </View>

          <View style={[styles.gap, styles.margin]}>
            <View style={styles.row}>
              <View style={[styles.cardCompact, { flex: 1, marginRight: 8 }]}>
                <Text style={[styles.small, { color: '#000000' }]}>
                  Última actualización: {new Date().toLocaleDateString()}
                </Text>
              </View>
            </View>

            <View style={styles.row}>
              <Text style={[styles.caption, { color: '#000000' }]}>
                {agreed ? "✅ Has aceptado los términos" : "Debes aceptar los términos para continuar"}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.padding, styles.margin]}>
        <View style={styles.card}>
          <View style={styles.row}>
            <Pressable
              style={[
                styles.cardCompact, 
                { 
                  width: 24, 
                  height: 24, 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  borderWidth: agreed ? 0 : 2,
                  borderColor: agreed ? '#007AFF' : '#C6C6C8',
                  borderRadius: 4
                }
              ]}
              onPress={() => setAgreed(!agreed)}
            >
              <Text style={{ color: agreed ? '#007AFF' : '#000000', fontSize: 16 }}>
                {agreed ? '✓' : ''}
              </Text>
            </Pressable>
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={[styles.body, { color: '#000000' }]}>
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
                    backgroundColor: agreed ? '#007AFF' : '#C6C6C8',
                    opacity: loading ? 0.6 : 1
                  }
                ]}
                onPress={handleAgree}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? "Procesando..." : agreed ? "Continuar al Login" : "Acepto"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
