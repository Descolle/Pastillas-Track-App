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
  checkDailyResetLocal,
  insertMedicationEvent,
  loadLocalPastillas,
  loadRemotePastillas,
  removePastilla,
  replaceAllPastillas,
  syncLocalToRemote,
  type Pastilla,
} from "@/services/medicationService";
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
  if (!context) throw new Error("useMedication must be used inside provider");
  return context;
};

export const MedicationProvider = ({ children }: { children: ReactNode }) => {
  const { user, profile } = useAuth();
  const [pastillas, setPastillas] = useState<Pastilla[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const hydrate = async () => {
      try {
        if (user?.id) {
          const merged = await syncLocalToRemote(user.id);
          setPastillas(merged);
        } else {
          const local = await loadLocalPastillas();
          setPastillas(local);
        }
      } finally {
        setHydrated(true);
      }
    };
    hydrate().catch((error: unknown) => {
      logError("MedicationProvider hydrate error", { error });
      setHydrated(true);
    });
  }, [user?.id]);

  useEffect(() => {
    if (!hydrated) return;

    const checkDailyReset = async () => {
      const next = await checkDailyResetLocal(pastillas);
      setPastillas((prev) => {
        if (JSON.stringify(prev) === JSON.stringify(next)) {
          return prev;
        }
        return next;
      });
    };

    checkDailyReset().catch((error: unknown) => logError("Daily reset error", { error }));
    const id = setInterval(checkDailyReset, 60_000);
    return () => clearInterval(id);
  }, [hydrated, pastillas]);

  useEffect(() => {
    if (!hydrated) return;
    replaceAllPastillas(user?.id ?? null, pastillas).catch((error: unknown) =>
      logError("save medication error", { error }),
    );
  }, [pastillas, hydrated, user?.id]);

  const planTier: PlanTier = profile?.plan_tier ?? "free";
  const limits = useMemo(
    () => ({
      maxMedications: planTier === "pro" ? 200 : 10,
    }),
    [planTier],
  );

  const canCreateMedication = pastillas.length < limits.maxMedications;

  const refreshRemote = async () => {
    if (!user?.id) {
      const local = await loadLocalPastillas();
      setPastillas(local);
      return;
    }
    const remote = await loadRemotePastillas(user.id);
    setPastillas(remote);
  };

  const removePastillaById = async (id: string) => {
    setPastillas((prev) => prev.filter((p) => p.id !== id));
    await removePastilla(user?.id ?? null, id);
  };

  const trackMedicationToggle = async (id: string, nextTomada: boolean) => {
    await insertMedicationEvent(user?.id ?? null, id, nextTomada ? "taken" : "untaken");
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
