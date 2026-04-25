import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { useAuth } from "@/context/AuthContext";
import {
  deleteMedication,
  insertMedicationEvent,
  loadRemotePastillas,
  type Pastilla,
} from "@/services/medicationService";

import { markAsTaken, unmarkAsTaken } from "@/services/intakeService";

import { logError } from "@/services/observability";
import type { PlanTier } from "@/types/saas";

type ContextType = {
  pastillas: Pastilla[];
  setPastillas: React.Dispatch<React.SetStateAction<Pastilla[]>>;
  removePastillaById: (id: string) => Promise<void>;
  trackMedicationToggle: (id: string, nextTomada: boolean) => Promise<void>;
  hydrated: boolean;
  planTier: PlanTier;
  limits: {
    maxMedications: number;
  };
  canCreateMedication: boolean;
  refreshRemote: () => Promise<void>;
};

const MedicationContext = createContext<ContextType | null>(null);

export const useMedication = () => {
  const context = useContext(MedicationContext);
  if (!context) {
    throw new Error("useMedication must be used inside provider");
  }
  return context;
};

export const MedicationProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { user, profile } = useAuth();

  const [pastillas, setPastillas] = useState<Pastilla[]>([]);
  const [hydrated, setHydrated] = useState(false);

  //
  // 🔥 HYDRATE REMOTO
  //
  useEffect(() => {
    const hydrate = async () => {
      try {
        if (user?.id) {
          const remote = await loadRemotePastillas(user.id);
          setPastillas(remote);
        } else {
          setPastillas([]);
        }
      } catch (error) {
        logError("MedicationProvider hydrate error", { error });
      } finally {
        setHydrated(true);
      }
    };

    hydrate();
  }, [user?.id]);

  //
  // 💰 PLAN
  //
  const planTier: PlanTier = (profile?.plan as PlanTier) ?? "free";

  const limits = useMemo(
    () => ({
      maxMedications: planTier === "pro" ? 200 : 10,
    }),
    [planTier],
  );

  const canCreateMedication =
    pastillas.length < limits.maxMedications;

  //
  // 🔄 REFRESH
  //
  const refreshRemote = async () => {
    if (!user?.id) return;

    const remote = await loadRemotePastillas(user.id);
    setPastillas(remote);
  };

  //
  // ❌ DELETE REAL
  //
  const removePastillaById = async (id: string) => {
    try {
      await deleteMedication(id);
      await refreshRemote();
    } catch (error) {
      logError("removePastilla error", { error });
    }
  };

  //
  // ✅ TOGGLE REAL (TAKEN / UNTAKEN)
  //
  const trackMedicationToggle = async (
    id: string,
    nextTomada: boolean,
  ) => {
    try {
      if (nextTomada) {
        await markAsTaken(id);
      } else {
        await unmarkAsTaken(id);
      }

      await insertMedicationEvent(
        user?.id ?? null,
        id,
        nextTomada ? "taken" : "untaken",
      );

      await refreshRemote();
    } catch (error) {
      logError("trackMedicationToggle error", { error });
    }
  };

  return (
    <MedicationContext.Provider
      value={{
        pastillas,
        setPastillas,
        removePastillaById,
        trackMedicationToggle,
        hydrated,
        planTier,
        limits,
        canCreateMedication,
        refreshRemote,
      }}
    >
      {children}
    </MedicationContext.Provider>
  );
};
