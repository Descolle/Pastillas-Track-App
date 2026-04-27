import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { useAuth } from "@/context/AuthContext";
import { markAsTaken } from "@/services/intakeServices";
import { deleteMedication } from "@/services/medicationDeleteService";
import {
  updateMedicationDose,
  updateMedicationTime,
} from "@/services/medicationEditService";
import {
  loadRemotePastillas,
  type Pastilla,
} from "@/services/medicationService";

import {
  cancelMedicationNotification,
  scheduleMedicationNotification,
} from "@/services/notificationService";

import { logError } from "@/services/observability";
import type { PlanTier } from "@/types/saas";

type ContextType = {
  pastillas: Pastilla[];
  setPastillas: React.Dispatch<React.SetStateAction<Pastilla[]>>;
  removePastillaById: (id: string) => Promise<void>;
  updatePastillaById: (id: string, pastilla: Pastilla) => Promise<void>;
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

  const canCreateMedication = pastillas.length < limits.maxMedications;

  //
  // 🔄 REFRESH
  //
  const refreshRemote = async () => {
    if (!user?.id) return;

    const remote = await loadRemotePastillas(user.id);
    setPastillas(remote);
  };

  //
  // 🗑️ DELETE (NO TOCADO, solo notificación correcta)
  //
  const removePastillaById = async (id: string) => {
    try {
      await cancelMedicationNotification(id); // 🔥 FIX

      await deleteMedication(id);

      setPastillas((prev) => prev.filter((p) => p.id !== id));

      console.log("🗑️ DELETE PASTILLA SUCCESS:", { id });
    } catch (error) {
      logError("removePastilla error", { error });
      throw error;
    }
  };

  //
  // ✏️ UPDATE (NO TOCADO, solo notificación correcta)
  //
  const updatePastillaById = async (id: string, pastilla: Pastilla) => {
    try {
      if (pastilla.cantidad !== undefined) {
        await updateMedicationDose(id, pastilla.cantidad);
      }

      if (pastilla.time !== undefined) {
        await updateMedicationTime(id, pastilla.time);

        const medication = pastillas.find((p) => p.id === id);

        if (medication) {
          await cancelMedicationNotification(id); // 🔥 FIX

          await scheduleMedicationNotification(
            id,
            medication.nombre,
            pastilla.time,
          );
        }
      }

      setPastillas((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...pastilla } : p)),
      );
    } catch (error) {
      logError("updatePastilla error", { error });
      throw error;
    }
  };

  //
  // 🔥 TOGGLE (TAKEN)
  //
  const trackMedicationToggle = async (
    id: string,
    nextTomada: boolean,
  ) => {
    try {
      if (nextTomada && user?.id) {
        await markAsTaken(id, user.id);
      }

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
        updatePastillaById,
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
