import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Button, FlatList, Text, TextInput, View } from "react-native";

type Pastilla = {
  id: string;
  nombre: string;
  cantidad: number;
  tiempo: string;
  tomada: boolean;
};

export default function App() {
  const [pastillas, setPastillas] = useState<Pastilla[]>([]);
  const [nombre, setNombre] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [tiempo, setTiempo] = useState("");
  const [editandoId, setEditandoId] = useState<string | null>(null);

  // ✅ Cargar datos guardados
  useEffect(() => {
    cargarPastillas();
  }, []);

  const cargarPastillas = async () => {
    const data = await AsyncStorage.getItem("pastillas");
    const ultimaFecha = await AsyncStorage.getItem("ultimaFecha");
    const hoy = new Date().toLocaleDateString();

    if (data) {
      let pastillasGuardadas: Pastilla[] = JSON.parse(data);

      if (ultimaFecha !== hoy) {
        pastillasGuardadas = pastillasGuardadas.map((p) => ({
          ...p,
          tomada: false,
        }));

        await AsyncStorage.setItem(
          "pastillas",
          JSON.stringify(pastillasGuardadas),
        );
        await AsyncStorage.setItem("ultimaFecha", hoy);
      }

      setPastillas(pastillasGuardadas);
    } else {
      await AsyncStorage.setItem("ultimaFecha", hoy);
    }
  };

  // ✅ Guardar datos
  const guardarPastillas = async (nuevasPastillas: Pastilla[]) => {
    await AsyncStorage.setItem("pastillas", JSON.stringify(nuevasPastillas));
  };

  // ✅ Agregar pastilla
  const agregarPastilla = () => {
    if (!nombre.trim() || !cantidad.trim() || !tiempo.trim()) {
      alert("Completa todos los campos");
      return;
    }

    const cantidadNumero = Number(cantidad);

    if (isNaN(cantidadNumero) || cantidadNumero <= 0) {
      alert("La cantidad debe ser un número válido");
      return;
    }

    if (editandoId) {
      const nuevasPastillas = pastillas.map((p) =>
        p.id === editandoId
          ? { ...p, nombre, cantidad: cantidadNumero, tiempo }
          : p,
      );

      setPastillas(nuevasPastillas);
      guardarPastillas(nuevasPastillas);
      setEditandoId(null);
    } else {
      const nuevaPastilla: Pastilla = {
        id: Date.now().toString(),
        nombre,
        cantidad: cantidadNumero,
        tiempo,
        tomada: false,
      };

      const nuevasPastillas = [...pastillas, nuevaPastilla];
      setPastillas(nuevasPastillas);
      guardarPastillas(nuevasPastillas);
    }

    setNombre("");
    setCantidad("");
    setTiempo("");
  };

  // ✅ Marcar como tomada
  const marcarTomada = (id: string) => {
    const nuevasPastillas = pastillas.map((p) =>
      p.id === id ? { ...p, tomada: !p.tomada } : p,
    );
    setPastillas(nuevasPastillas);
    guardarPastillas(nuevasPastillas);
  };

  //Eliminar Pastilla
  const eliminarPastilla = (id: string) => {
    const nuevasPastillas = pastillas.filter((p) => p.id !== id);
    setPastillas(nuevasPastillas);
    guardarPastillas(nuevasPastillas);
  };

  //Modificar Pastilla
  const editarPastilla = (pastilla: Pastilla) => {
    setNombre(pastilla.nombre);
    setCantidad(pastilla.cantidad.toString());
    setTiempo(pastilla.tiempo);
    setEditandoId(pastilla.id);
  };
  const total = pastillas.length;
  const tomadas = pastillas.filter((p) => p.tomada).length;
  const pendientes = total - tomadas;
  const pastillasOrdenadas = [...pastillas].sort((a, b) =>
    a.tiempo.localeCompare(b.tiempo),
  );

  return (
    <View style={{ padding: 20, backgroundColor: "white", flex: 1 }}>
      <Text style={{ fontSize: 24, marginBottom: 10, color: "black" }}>
        💊 Registro de Pastillas
      </Text>
      <Text>
        📊 Total: {total} | ✅ Tomadas: {tomadas} | ❌ Pendientes: {pendientes}
      </Text>
      <TextInput
        placeholder="Nombre del medicamento"
        value={nombre}
        onChangeText={setNombre}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          marginBottom: 10,
          borderRadius: 5,
          color: "black",
        }}
        placeholderTextColor="#888"
      />

      <TextInput
        placeholder="Cantidad (ej: 2)"
        value={cantidad}
        onChangeText={setCantidad}
        keyboardType="numeric"
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          marginBottom: 10,
          borderRadius: 5,
          color: "black",
        }}
        placeholderTextColor="#888"
      />

      <TextInput
        placeholder="Tiempo (ej: mañana, 08:00)"
        value={tiempo}
        onChangeText={setTiempo}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          marginBottom: 10,
          borderRadius: 5,
          color: "black",
        }}
        placeholderTextColor="#888"
      />

      <Button title="Agregar pastilla" onPress={agregarPastilla} />

      <FlatList
        data={pastillasOrdenadas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ marginVertical: 10 }}>
            <Text style={{ color: "black" }}>
              💊 {item.nombre} | {item.cantidad} | ⏰ {item.tiempo}
            </Text>
            <Text style={{ color: "black" }}>
              {item.tomada ? "✅ Tomada" : "❌ Pendiente"}
            </Text>

            <Button title="Marcar" onPress={() => marcarTomada(item.id)} />
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
