import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Pastilla = {
  id: string;
  nombre: string;
  cantidad: number;
  tiempo: string;
  tomada: boolean;
  notificationId?: string;
};

const STORAGE_KEY = "pastillas";
const LAST_RESET_KEY = "pastillas_last_reset_date";

function localDateKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function resetTomadas(pastillas: Pastilla[]): Pastilla[] {
  return pastillas.map((p) => (p.tomada ? { ...p, tomada: false } : p));
}

function isPastilla(x: unknown): x is Pastilla {
  if (x === null || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.id === "string" &&
    typeof o.nombre === "string" &&
    typeof o.cantidad === "number" &&
    typeof o.tiempo === "string" &&
    typeof o.tomada === "boolean" &&
    (o.notificationId === undefined || typeof o.notificationId === "string")
  );
}

function parsePastillas(raw: string): Pastilla[] {
  try {
    const data = JSON.parse(raw) as unknown;
    if (!Array.isArray(data)) return [];
    return data.filter(isPastilla);
  } catch {
    return [];
  }
}

type ContextType = {
  pastillas: Pastilla[];
  setPastillas: React.Dispatch<React.SetStateAction<Pastilla[]>>;
  hydrated: boolean;
};

const MedicationContext = createContext<ContextType | null>(null);

export const useMedication = () => {
  const context = useContext(MedicationContext);
  if (!context) throw new Error("useMedication must be used inside provider");
  return context;
};

export const MedicationProvider = ({ children }: { children: ReactNode }) => {
  const [pastillas, setPastillas] = useState<Pastilla[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await AsyncStorage.getItem(STORAGE_KEY);
        const loaded = data ? parsePastillas(data) : [];
        const today = localDateKey();
        const lastReset = await AsyncStorage.getItem(LAST_RESET_KEY);
        const normalized = lastReset === today ? loaded : resetTomadas(loaded);
        await AsyncStorage.setItem(LAST_RESET_KEY, today);
        setPastillas(normalized);
      } finally {
        setHydrated(true);
      }
    };
    cargar();
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    const checkDailyReset = async () => {
      const today = localDateKey();
      const lastReset = await AsyncStorage.getItem(LAST_RESET_KEY);
      if (lastReset === today) return;

      await AsyncStorage.setItem(LAST_RESET_KEY, today);
      setPastillas((prev) => resetTomadas(prev));
    };

    checkDailyReset();
    const id = setInterval(checkDailyReset, 60_000);
    return () => clearInterval(id);
  }, [hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    const guardar = async () => {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(pastillas));
    };
    guardar();
  }, [pastillas, hydrated]);

  return (
    <MedicationContext.Provider value={{ pastillas, setPastillas, hydrated }}>
      {children}
    </MedicationContext.Provider>
  );
};
