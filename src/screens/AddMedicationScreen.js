import { useState } from "react";
import { Alert, Button, TextInput, View } from "react-native";
import { createMedication } from "../api/medications";
import { createSchedules } from "../api/schedules";
import { useAuth } from "../hooks/useAuth";

export default function AddMedicationScreen({ navigation }) {
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [quantity, setQuantity] = useState("");
  const [times, setTimes] = useState([]); // ["08:00", "20:00"]

  const handleAdd = async () => {
    if (!user) {
      Alert.alert("Error", "Usuario no autenticado");
      return;
    }

    if (!name || !dosage || !quantity) {
      Alert.alert("Error", "Completa todos los campos");
      return;
    }

    try {
      // 1. Crear medicamento
      const med = await createMedication(user.id, {
        name,
        dosage,
        quantity: parseInt(quantity),
      });

      // ⚠️ IMPORTANTE: supabase devuelve array
      const medicationId = med[0].id;

      // 2. Crear horarios
      if (times.length > 0) {
        await createSchedules(medicationId, times);
      }

      Alert.alert("Éxito", "Medicamento agregado 💊");

      // 3. Limpiar formulario
      setName("");
      setDosage("");
      setQuantity("");
      setTimes([]);

      // 4. Volver a Home
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View>
      <TextInput placeholder="Nombre" value={name} onChangeText={setName} />
      <TextInput placeholder="Dosis" value={dosage} onChangeText={setDosage} />
      <TextInput
        placeholder="Cantidad"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
      />

      <Button title="Agregar medicamento" onPress={handleAdd} />
    </View>
  );
}
