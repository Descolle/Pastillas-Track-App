import * as Notifications from "expo-notifications";
import { useState } from "react";
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useMedication } from "../context/MedicationContext";
import { styles } from "../styles/homeStyles";
import {
  requestPermissions,
  scheduleNotification,
} from "../utils/notification";

export default function Home() {
  const { pastillas, setPastillas } = useMedication();

  const [nombre, setNombre] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [tiempo, setTiempo] = useState("");
  const [editandoId, setEditandoId] = useState<string | null>(null);

  const agregarPastilla = async () => {
    if (!nombre || !cantidad || !tiempo) return;

    const permiso = await requestPermissions();
    if (!permiso) return;

    const notificationId = await scheduleNotification(nombre, tiempo);

    if (editandoId) {
      setPastillas((prev) =>
        prev.map((p) =>
          p.id === editandoId
            ? {
                ...p,
                nombre,
                cantidad: Number(cantidad),
                tiempo,
                notificationId,
              }
            : p,
        ),
      );
      setEditandoId(null);
    } else {
      const nueva = {
        id: Date.now().toString(),
        nombre,
        cantidad: Number(cantidad),
        tiempo,
        tomada: false,
        notificationId,
      };

      setPastillas((prev) => [...prev, nueva]);
    }

    setNombre("");
    setCantidad("");
    setTiempo("");
  };

  const marcarTomada = (id: string) => {
    setPastillas((prev) =>
      prev.map((p) => (p.id === id ? { ...p, tomada: !p.tomada } : p)),
    );
  };

  const eliminarPastilla = async (id: string) => {
    const pastilla = pastillas.find((p) => p.id === id);

    if (pastilla?.notificationId) {
      await Notifications.cancelScheduledNotificationAsync(
        pastilla.notificationId,
      );
    }

    setPastillas((prev) => prev.filter((p) => p.id !== id));
  };

  const editarPastilla = (p: any) => {
    setNombre(p.nombre);
    setCantidad(p.cantidad.toString());
    setTiempo(p.tiempo);
    setEditandoId(p.id);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💊 Mis Medicamentos</Text>

      {/* FORM */}
      <View style={styles.card}>
        <TextInput
          placeholder="Nombre"
          value={nombre}
          onChangeText={setNombre}
          style={styles.input}
        />

        <TextInput
          placeholder="Cantidad"
          value={cantidad}
          onChangeText={setCantidad}
          keyboardType="numeric"
          style={styles.input}
        />

        <TextInput
          placeholder="Hora (08:00)"
          value={tiempo}
          onChangeText={setTiempo}
          style={styles.input}
        />

        <TouchableOpacity style={styles.button} onPress={agregarPastilla}>
          <Text style={styles.buttonText}>
            {editandoId ? "Actualizar" : "Agregar"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* LISTA */}
      <FlatList
        data={[...pastillas].sort((a, b) => a.tiempo.localeCompare(b.tiempo))}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.itemTitle}>
              {item.nombre} ({item.cantidad})
            </Text>

            <Text style={styles.itemSubtitle}>⏰ {item.tiempo}</Text>

            <View style={styles.row}>
              <TouchableOpacity
                style={[
                  styles.smallButton,
                  { backgroundColor: item.tomada ? "#aaa" : "#4CAF50" },
                ]}
                onPress={() => marcarTomada(item.id)}
              >
                <Text style={styles.smallText}>
                  {item.tomada ? "Desmarcar" : "Tomada"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.smallButton, { backgroundColor: "#2196F3" }]}
                onPress={() => editarPastilla(item)}
              >
                <Text style={styles.smallText}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.smallButton, { backgroundColor: "#f44336" }]}
                onPress={() => eliminarPastilla(item.id)}
              >
                <Text style={styles.smallText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}
