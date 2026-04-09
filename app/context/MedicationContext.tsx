import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

export type Pastilla = {
  id: string;
  nombre: string;
  cantidad: number;
  tiempo: string;
  tomada: boolean;
  notificationId?: string;
};

type ContextType = {
  pastillas: Pastilla[];
  setPastillas: React.Dispatch<React.SetStateAction<Pastilla[]>>;
};

const MedicationContext = createContext<ContextType | null>(null);

export const useMedication = () => {
  const context = useContext(MedicationContext);
  if (!context) throw new Error("useMedication must be used inside provider");
  return context;
};

export const MedicationProvider = ({ children }: any) => {
  const [pastillas, setPastillas] = useState<Pastilla[]>([]);

  // 🔄 Cargar datos al iniciar
  useEffect(() => {
    const cargar = async () => {
      const data = await AsyncStorage.getItem("pastillas");
      if (data) setPastillas(JSON.parse(data));
    };
    cargar();
  }, []);

  // 💾 Guardar automáticamente
  useEffect(() => {
    const guardar = async () => {
      await AsyncStorage.setItem("pastillas", JSON.stringify(pastillas));
    };
    guardar();
  }, [pastillas]);

  return (
    <MedicationContext.Provider value={{ pastillas, setPastillas }}>
      {children}
    </MedicationContext.Provider>
  );
};
