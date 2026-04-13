import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TextInput,
  View,
} from "react-native";
import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useMedication, type Pastilla } from "@/context/MedicationContext";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useMedicationHomeStyles } from "@/styles/homeStyles";
import {
  compareTimeHM,
  defaultTimeDate,
  formatDosisForDisplay,
  formatTimeHM,
  parseDosisPositiva,
  parseTimeHMToDate,
} from "@/utils/medication-form";
import {
  cancelNotification,
  requestPermissions,
  scheduleNotification,
} from "@/utils/notification";

export default function Home() {
  const { pastillas, setPastillas, hydrated } = useMedication();
  const styles = useMedicationHomeStyles();
  const textColor = useThemeColor({}, "text");
  const tintColor = useThemeColor({}, "tint");
  const iconMuted = useThemeColor({}, "icon");
  const placeholderColor = useThemeColor(
    { light: "#8E8E93", dark: "#8E8E93" },
    "icon",
  );

  const [nombre, setNombre] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [horaSeleccionada, setHoraSeleccionada] = useState(() =>
    defaultTimeDate(8, 0),
  );
  const [tiempoWeb, setTiempoWeb] = useState("08:00");
  const [mostrarHoraAndroid, setMostrarHoraAndroid] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);

  const aviso = (titulo: string, mensaje: string) =>
    Alert.alert(titulo, mensaje);

  const tiempoParaGuardar = (): string | null => {
    if (Platform.OS === "web") {
      const d = parseTimeHMToDate(tiempoWeb);
      return d ? formatTimeHM(d) : null;
    }
    return formatTimeHM(horaSeleccionada);
  };

  const reiniciarFormulario = () => {
    setNombre("");
    setCantidad("");
    setHoraSeleccionada(defaultTimeDate(8, 0));
    setTiempoWeb("08:00");
    setEditandoId(null);
  };

  const onCambioHora = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === "android") {
      setMostrarHoraAndroid(false);
    }
    if (event.type === "set" && date) {
      setHoraSeleccionada(date);
    }
  };

  const guardarPastilla = async () => {
    if (!nombre.trim()) {
      aviso("Faltan datos", "Indica el nombre del medicamento.");
      return;
    }

    const dosis = parseDosisPositiva(cantidad);
    if (dosis === null) {
      aviso(
        "Cantidad no válida",
        "Indica un número mayor que 0. Puedes usar medias dosis (por ejemplo 0,5).",
      );
      return;
    }

    const tiempoStr = tiempoParaGuardar();
    if (tiempoStr === null) {
      aviso(
        "Hora no válida",
        'En la web escribe la hora como "08:30" (24 h).',
      );
      return;
    }

    const permiso = await requestPermissions();
    if (!permiso) {
      aviso(
        "Notificaciones",
        "Activa las notificaciones para recibir recordatorios.",
      );
      return;
    }

    try {
      if (editandoId) {
        const nuevas = await Promise.all(
          pastillas.map(async (p) => {
            if (p.id === editandoId) {
              if (p.notificationId) {
                await cancelNotification(p.notificationId);
              }

              const newNotificationId = await scheduleNotification(
                nombre.trim(),
                tiempoStr,
              );

              return {
                ...p,
                nombre: nombre.trim(),
                cantidad: dosis,
                tiempo: tiempoStr,
                notificationId: newNotificationId,
              };
            }
            return p;
          }),
        );

        setPastillas(nuevas);
        setEditandoId(null);
      } else {
        const notificationId = await scheduleNotification(
          nombre.trim(),
          tiempoStr,
        );

        const nueva: Pastilla = {
          id: Date.now().toString(),
          nombre: nombre.trim(),
          cantidad: dosis,
          tiempo: tiempoStr,
          tomada: false,
          notificationId,
        };

        setPastillas((prev) => [...prev, nueva]);
      }

      reiniciarFormulario();
    } catch {
      aviso(
        "No se pudo programar",
        "Revisa la hora e inténtalo de nuevo.",
      );
    }
  };

  const marcarTomada = (id: string) => {
    setPastillas((prev) =>
      prev.map((p) => (p.id === id ? { ...p, tomada: !p.tomada } : p)),
    );
  };

  const eliminarPastilla = (id: string) => {
    Alert.alert("Eliminar", "¿Quitar este recordatorio?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          const pastilla = pastillas.find((p) => p.id === id);

          if (pastilla?.notificationId) {
            await cancelNotification(pastilla.notificationId);
          }

          setPastillas((prev) => prev.filter((p) => p.id !== id));
        },
      },
    ]);
  };

  const editarPastilla = (p: Pastilla) => {
    setNombre(p.nombre);
    setCantidad(formatDosisForDisplay(p.cantidad));
    const parsed = parseTimeHMToDate(p.tiempo);
    if (parsed) {
      setHoraSeleccionada(parsed);
      setTiempoWeb(formatTimeHM(parsed));
    } else {
      setHoraSeleccionada(defaultTimeDate(8, 0));
      setTiempoWeb(p.tiempo);
    }
    setEditandoId(p.id);
  };

  const pastillasOrdenadas = [...pastillas].sort((a, b) =>
    compareTimeHM(a.tiempo, b.tiempo),
  );

  const inputStyle = [styles.input, { color: textColor }];

  const campoHora =
    Platform.OS === "web" ? (
      <>
        <ThemedText style={styles.fieldLabel}>Hora (24 h)</ThemedText>
        <TextInput
          placeholder="08:30"
          placeholderTextColor={placeholderColor}
          value={tiempoWeb}
          onChangeText={setTiempoWeb}
          style={inputStyle}
          keyboardType="numbers-and-punctuation"
        />
        <ThemedText style={styles.timeHint}>
          Formato HH:mm (ej. 09:05).
        </ThemedText>
      </>
    ) : Platform.OS === "ios" ? (
      <>
        <ThemedText style={styles.fieldLabel}>Hora</ThemedText>
        <View style={styles.timeIosWrap}>
          <DateTimePicker
            value={horaSeleccionada}
            mode="time"
            display="spinner"
            minuteInterval={1}
            onChange={onCambioHora}
          />
        </View>
      </>
    ) : (
      <>
        <ThemedText style={styles.fieldLabel}>Hora</ThemedText>
        <Pressable
          style={({ pressed }) => [
            styles.input,
            styles.timeAndroidPressable,
            pressed && { opacity: 0.85 },
          ]}
          onPress={() => setMostrarHoraAndroid(true)}
        >
          <ThemedText style={{ fontSize: 16 }}>
            {formatTimeHM(horaSeleccionada)}
          </ThemedText>
        </Pressable>
        <ThemedText style={styles.timeHint}>Toca para cambiar la hora.</ThemedText>
        {mostrarHoraAndroid ? (
          <DateTimePicker
            value={horaSeleccionada}
            mode="time"
            display="default"
            is24Hour
            onChange={onCambioHora}
          />
        ) : null}
      </>
    );

  const FormHeader = (
    <View style={styles.formBlock}>
      <ThemedText type="title" style={styles.title}>
        💊 Pastillas
      </ThemedText>

      <ThemedText style={styles.fieldLabel}>Nombre</ThemedText>
      <TextInput
        placeholder="Ej. Vitamina D"
        placeholderTextColor={placeholderColor}
        value={nombre}
        onChangeText={setNombre}
        style={inputStyle}
        autoCapitalize="sentences"
      />

      <ThemedText style={styles.fieldLabel}>Cantidad (dosis)</ThemedText>
      <TextInput
        placeholder="Ej. 1 o 0,5"
        placeholderTextColor={placeholderColor}
        value={cantidad}
        onChangeText={setCantidad}
        keyboardType="decimal-pad"
        style={inputStyle}
      />
      
      {campoHora}

      <Pressable
        style={({ pressed }) => [
          styles.primaryButton,
          pressed && { opacity: 0.88 },
        ]}
        onPress={guardarPastilla}
      >
        <ThemedText style={styles.primaryButtonText}>
          {editandoId ? "Actualizar" : "Guardar recordatorio"}
        </ThemedText>
      </Pressable>

      {editandoId ? (
        <Pressable
          style={{ marginTop: 10, alignSelf: "center", padding: 8 }}
          onPress={reiniciarFormulario}
        >
          <ThemedText type="link">Cancelar edición</ThemedText>
        </Pressable>
      ) : null}

      <ThemedText type="subtitle" style={{ marginTop: 24, marginBottom: 8 }}>
        Recordatorios
      </ThemedText>
    </View>
  );

  return (
    <ThemedView style={styles.flex1} lightColor="#F2F2F7">
      {!hydrated ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <KeyboardAvoidingView
          style={styles.flex1}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <FlatList
            data={pastillasOrdenadas}
            keyExtractor={(item) => item.id}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.listContent}
            ListHeaderComponent={FormHeader}
            ListEmptyComponent={
              <ThemedText style={styles.empty}>
                Aún no hay pastillas. Añade la primera arriba.
              </ThemedText>
            }
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={styles.cardTopRow}>
                  <ThemedText
                    type="defaultSemiBold"
                    style={styles.cardTitle}
                    numberOfLines={2}
                  >
                    {item.nombre}
                  </ThemedText>
                  <View style={styles.cardActions}>
                    <Pressable
                      style={({ pressed }) => [
                        styles.actionIconHit,
                        pressed && { opacity: 0.65 },
                      ]}
                      onPress={() => marcarTomada(item.id)}
                      accessibilityRole="button"
                      accessibilityLabel={
                        item.tomada
                          ? "Marcar como no tomada"
                          : "Marcar como tomada"
                      }
                    >
                      <MaterialIcons
                        name="check"
                        size={28}
                        color={item.tomada ? tintColor : iconMuted}
                      />
                    </Pressable>
                    <Pressable
                      style={({ pressed }) => [
                        styles.actionIconHit,
                        pressed && { opacity: 0.65 },
                      ]}
                      onPress={() => editarPastilla(item)}
                      accessibilityRole="button"
                      accessibilityLabel="Editar recordatorio"
                    >
                      <MaterialIcons
                        name="edit"
                        size={24}
                        color={textColor}
                      />
                    </Pressable>
                    <Pressable
                      style={({ pressed }) => [
                        styles.actionIconHit,
                        pressed && { opacity: 0.65 },
                      ]}
                      onPress={() => eliminarPastilla(item.id)}
                      accessibilityRole="button"
                      accessibilityLabel="Eliminar recordatorio"
                    >
                      <MaterialIcons name="close" size={26} color="#C62828" />
                    </Pressable>
                  </View>
                </View>
                <ThemedText style={styles.cardMeta}>
                  {formatDosisForDisplay(item.cantidad)} dosis · {item.tiempo}
                  {item.tomada ? " · Tomada" : ""}
                </ThemedText>
              </View>
            )}
          />
        </KeyboardAvoidingView>
      )}
    </ThemedView>
  );
}
