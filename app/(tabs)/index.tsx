import * as Notifications from "expo-notifications";
import { useState } from "react";
import { Button, FlatList, Text, TextInput, View } from "react-native";

import { useMedication } from "@/context/MedicationContext";
import {
  requestPermissions,
  scheduleNotification,
} from "@/utils/notifications";

type Pastilla = {
  id: string;
  nombre: string;
  cantidad: number;
  tiempo: string;
  tomada: boolean;
  notificationId?: string;
};

export default function Home() {
  const { pastillas, setPastillas } = useMedication();

  const [nombre, setNombre] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [tiempo, setTiempo] = useState("");
  const [editandoId, setEditandoId] = useState<string | null>(null);

  const agregarPastilla = async () => {
    if (!nombre || !cantidad || !tiempo) {
      alert("Completa todos los campos");
      return;
    }

    const permiso = await requestPermissions();
    if (!permiso) {
      alert("Debes permitir notificaciones");
      return;
    }

    const notificationId = await scheduleNotification(nombre, tiempo);

    if (editandoId) {
      const actualizadas = pastillas.map((p) =>
        p.id === editandoId
          ? {
              ...p,
              nombre,
              cantidad: Number(cantidad),
              tiempo,
              notificationId,
            }
          : p,
      );

      setPastillas(actualizadas);
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

  const editarPastilla = (p: Pastilla) => {
    setNombre(p.nombre);
    setCantidad(p.cantidad.toString());
    setTiempo(p.tiempo);
    setEditandoId(p.id);
  };

  const pastillasOrdenadas = [...pastillas].sort((a, b) =>
    a.tiempo.localeCompare(b.tiempo),
  );

  return (
    <View style={{ padding: 20, flex: 1 }}>
      <Text style={{ fontSize: 24 }}>💊 Registro</Text>

      <TextInput placeholder="Nombre" value={nombre} onChangeText={setNombre} />
      <TextInput
        placeholder="Cantidad"
        value={cantidad}
        onChangeText={setCantidad}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Hora (08:00)"
        value={tiempo}
        onChangeText={setTiempo}
      />

      <Button title="Guardar" onPress={agregarPastilla} />

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
