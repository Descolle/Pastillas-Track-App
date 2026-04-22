import { useGlobalStyles } from "@/styles/globalStyles";
import { useMemo } from "react";

// 🔹 Hook base (por si quieres acceso directo)
export const useStyles = () => {
  return useGlobalStyles();
};

// Export global styles for direct use
export { useGlobalStyles };

// 🔹 Home
export const useHomeScreenStyles = () => {
  const styles = useGlobalStyles();

  return useMemo(() => ({
    ...styles,

    // 👉 estilos específicos de Home (opcional)
    // ejemplo:
    // header: { marginBottom: 10 },

  }), [styles]);
};

// 🔹 Profile
export const useProfileScreenStyles = () => {
  const styles = useGlobalStyles();

  return useMemo(() => ({
    ...styles,

    // 👉 estilos específicos de Profile (opcional)

  }), [styles]);
};

// 🔹 Medication
export const useMedicationScreenStyles = () => {
  const styles = useGlobalStyles();

  return useMemo(() => ({
    ...styles,

    // 👉 estilos específicos de Medication (opcional)

  }), [styles]);
};
