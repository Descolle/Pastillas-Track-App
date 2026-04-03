import { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Pastilla = {
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

  // 🔄 Cargar desde storage
  useEffect(() => {
    const cargar = async () => {
      const data = await AsyncStorage.getItem("pastillas");
      if (data) setPastillas(JSON.parse(data));
    };
    cargar();
  }, []);

  // 💾 Guardar en storage
  useEffect(() => {
    AsyncStorage.setItem("pastillas", JSON.stringify(pastillas));
  }, [pastillas]);

  return (
    <MedicationContext.Provider value={{ pastillas, setPastillas }}>
      {children}
    </MedicationContext.Provider>
  );
};
