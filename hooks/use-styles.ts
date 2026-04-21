import { useGlobalStyles, useHomeStyles, useMedicationStyles, useProfileStyles } from "@/styles/globalStyles";
import { useMemo } from "react";

// Type for style hooks
type StyleHook = () => ReturnType<typeof useGlobalStyles>;

// Main hook for getting styles
export const useStyles = (styleHook?: StyleHook) => {
  const globalStyles = useGlobalStyles();
  const hookStyles = styleHook ? styleHook() : {};

  return useMemo(() => ({
    ...globalStyles,
    ...hookStyles,
  }), [globalStyles, hookStyles]);
};

// Export global styles for direct use
export { useGlobalStyles };

// Pre-defined style hooks for easy access
export const useHomeScreenStyles = () => useStyles(useHomeStyles);
export const useProfileScreenStyles = () => useStyles(useProfileStyles);
export const useMedicationScreenStyles = () => useStyles(useMedicationStyles);

// Helper for creating custom style hooks
export const createCustomStyles = (customStyles: ReturnType<typeof useGlobalStyles>) => {
  return () => {
    const globalStyles = useGlobalStyles();
    return useMemo(() => ({
      ...globalStyles,
      ...customStyles,
    }), [globalStyles, customStyles]);
  };
};
