import { scheduleNotification } from "@/utils/notification";
import { useState } from "react";
import { Alert, Button, TextInput, View } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { createMedicationWithSchedule } from "@/services/medicationService";

export default function AddMedicationScreen({ navigation }) {
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [times, setTimes] = useState([
    { time: "08:00", dosage: 1 },
  ]);

  const handleAdd = async () => {
    if (!user) {
      Alert.alert("Error", "Usuario no autenticado");
      return;
    }

    if (!name || times.length === 0) {
      Alert.alert("Error", "Completa los datos");
      return;
    }

    try {
      // 🔥 CREACIÓN REAL (UNIFICADA)
      await createMedicationWithSchedule(user.id, name, times);

      // 🔔 notificaciones
      for (const t of times) {
        await scheduleNotification(name, t.time);
      }

      Alert.alert("Éxito", "Medicamento agregado 💊");

      navigation.goBack();
    } catch (error) {
      console.log("CREATE ERROR:", error);
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Nombre"
        value={name}
        onChangeText={setName}
      />

      {times.map((t, i) => (
        <View key={i} style={{ marginVertical: 10 }}>
          <TextInput
            value={t.time}
            onChangeText={(val) => {
              const copy = [...times];
              copy[i].time = val;
              setTimes(copy);
            }}
            placeholder="Hora (08:00)"
          />

          <TextInput
            value={String(t.dosage)}
            keyboardType="numeric"
            onChangeText={(val) => {
              const copy = [...times];
              copy[i].dosage = Number(val) || 1;
              setTimes(copy);
            }}
            placeholder="Cantidad"
          />
        </View>
      ))}

      <Button
        title="Agregar horario"
        onPress={() =>
          setTimes([...times, { time: "12:00", dosage: 1 }])
        }
      />

      <Button title="Guardar" onPress={handleAdd} />
    </View>
  );
}
