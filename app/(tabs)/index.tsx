import { useState } from "react";
import { Alert, Button, FlatList, Text, TextInput, View } from "react-native";

import { useMedication } from "../../context/MedicationContext";
import {
  cancelNotification,
  requestPermissions,
  scheduleNotification,
} from "../../utils/notification";

export default function Home() {
  const { pastillas, setPastillas } = useMedication();

  const [nombre, setNombre] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [tiempo, setTiempo] = useState("");
  const [editandoId, setEditandoId] = useState<string | null>(null);

  // ➕ AGREGAR / EDITAR
  const guardarPastilla = async () => {
    if (!nombre || !cantidad || !tiempo) {
      alert("Completa todos los campos");
      return;
    }

    const permiso = await requestPermissions();
    if (!permiso) {
      alert("Debes permitir notificaciones");
      return;
    }

    // 🔁 EDITAR
    if (editandoId) {
      const nuevas = await Promise.all(
        pastillas.map(async (p) => {
          if (p.id === editandoId) {
            // cancelar notificación anterior
            if (p.notificationId) {
              await cancelNotification(p.notificationId);
            }

            const newNotificationId = await scheduleNotification(
              nombre,
              tiempo,
            );

            return {
              ...p,
              nombre,
              cantidad: Number(cantidad),
              tiempo,
              notificationId: newNotificationId,
            };
          }
          return p;
        }),
      );

      setPastillas(nuevas);
      setEditandoId(null);
    } else {
      // ➕ NUEVA
      const notificationId = await scheduleNotification(nombre, tiempo);

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

    // limpiar inputs
    setNombre("");
    setCantidad("");
    setTiempo("");
  };

  // ✅ MARCAR
  const marcarTomada = (id: string) => {
    const nuevas = pastillas.map((p) =>
      p.id === id ? { ...p, tomada: !p.tomada } : p,
    );
    setPastillas(nuevas);
  };

  // ❌ ELIMINAR
  const eliminarPastilla = (id: string) => {
    Alert.alert("Eliminar", "¿Seguro?", [
      { text: "Cancelar" },
      {
        text: "Eliminar",
        onPress: async () => {
          const pastilla = pastillas.find((p) => p.id === id);

          if (pastilla?.notificationId) {
            await cancelNotification(pastilla.notificationId);
          }

          const nuevas = pastillas.filter((p) => p.id !== id);
          setPastillas(nuevas);
        },
      },
    ]);
  };

  // ✏️ EDITAR
  const editarPastilla = (p: any) => {
    setNombre(p.nombre);
    setCantidad(p.cantidad.toString());
    setTiempo(p.tiempo);
    setEditandoId(p.id);
  };

  const pastillasOrdenadas = [...pastillas].sort((a, b) =>
    a.tiempo.localeCompare(b.tiempo),
  );

  return (
    <View style={{ padding: 20, flex: 1, backgroundColor: "white" }}>
      <Text style={{ fontSize: 24 }}>💊 Pastillas</Text>

      <TextInput
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
        style={{ borderWidth: 1, marginVertical: 5, padding: 10 }}
      />

      <TextInput
        placeholder="Cantidad"
        value={cantidad}
        onChangeText={setCantidad}
        keyboardType="numeric"
        style={{ borderWidth: 1, marginVertical: 5, padding: 10 }}
      />

      <TextInput
        placeholder="Hora (08:00)"
        value={tiempo}
        onChangeText={setTiempo}
        style={{ borderWidth: 1, marginVertical: 5, padding: 10 }}
      />

      <Button
        title={editandoId ? "Actualizar" : "Guardar"}
        onPress={guardarPastilla}
      />

      <FlatList
        data={pastillasOrdenadas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ marginVertical: 10 }}>
            <Text>
              {item.nombre} - {item.cantidad} - {item.tiempo}
            </Text>

            <Button
              title={item.tomada ? "Desmarcar" : "Tomada"}
              onPress={() => marcarTomada(item.id)}
            />

            <Button title="Editar" onPress={() => editarPastilla(item)} />

            <Button
              title="Eliminar"
              onPress={() => eliminarPastilla(item.id)}
            />
          </View>
        )}
      />
    </View>
  );
}
