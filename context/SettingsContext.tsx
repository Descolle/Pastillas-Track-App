import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SystemUI from "expo-system-ui";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useColorScheme as useDeviceColorScheme } from "react-native";

export type AppLanguage = "es" | "en";
export type AppTheme = "light" | "dark";
export type NotificationSound =
  | "pill_reminder_1.wav"
  | "pill_reminder_2.wav"
  | "pill_reminder_3.wav";

export const NOTIFICATION_SOUNDS: {
  value: NotificationSound;
  label: string;
}[] = [
  { value: "pill_reminder_1.wav", label: "Tone 1" },
  { value: "pill_reminder_2.wav", label: "Tone 2" },
  { value: "pill_reminder_3.wav", label: "Tone 3" },
];

export const DEFAULT_NOTIFICATION_SOUND: NotificationSound =
  "pill_reminder_1.wav";

const STORAGE_KEYS = {
  language: "settings_language",
  theme: "settings_theme",
  notificationSound: "settings_notification_sound",
};

type TranslationKey =
  | "settings"
  | "language"
  | "spanish"
  | "english"
  | "appearance"
  | "light"
  | "dark"
  | "notificationTone"
  | "close"
  | "home"
  | "create"
  | "profile"
  | "newMedication"
  | "newMedicationDescription"
  | "name"
  | "dose"
  | "time"
  | "saveMedication"
  | "saving"
  | "saved"
  | "medicationCreated"
  | "error"
  | "mustSignIn"
  | "limitReached"
  | "planLimitReached"
  | "nameRequired"
  | "invalidDose"
  | "couldNotSave"
  | "exampleMedicine"
  | "exampleDose"
  | "offline"
  | "willSyncWhenOnline"
  | "delete"
  | "deleteConfirmTitle"
  | "deleteConfirmBody"
  | "editMedication"
  | "whatToEdit"
  | "cancel"
  | "success"
  | "doseUpdated"
  | "timeUpdated"
  | "takenDose"
  | "profileTitle"
  | "loadingProfile"
  | "years"
  | "plan"
  | "weeklyProgress"
  | "noStats"
  | "weeklyAdherence"
  | "lastSevenDays"
  | "editProfile"
  | "privacyData"
  | "signOut"
  | "male"
  | "female"
  | "maleTrans"
  | "femaleTrans"
  | "other"
  | "editDose"
  | "editTime"
  | "newDose"
  | "zeroToDelete"
  | "newTime"
  | "timeFormat"
  | "invalidNumber"
  | "deleteMedicationQuestion"
  | "invalidTime"
  | "save";

const translations: Record<AppLanguage, Record<TranslationKey, string>> = {
  es: {
    settings: "Configuracion",
    language: "Idioma",
    spanish: "Espanol",
    english: "Ingles",
    appearance: "Apariencia",
    light: "Dia",
    dark: "Noche",
    notificationTone: "Tono de notificacion",
    close: "Cerrar",
    home: "Inicio",
    create: "Crear",
    profile: "Perfil",
    newMedication: "Nuevo Medicamento",
    newMedicationDescription:
      "Agrega un medicamento con su dosis y horario para recordarlo cada dia.",
    name: "Nombre",
    dose: "Dosis",
    time: "Hora",
    saveMedication: "Guardar medicamento",
    saving: "Guardando...",
    saved: "Guardado",
    medicationCreated: "Medicamento creado correctamente",
    error: "Error",
    mustSignIn: "Debes iniciar sesion",
    limitReached: "Limite alcanzado",
    planLimitReached: "Tu plan actual ya alcanzo el maximo de medicamentos.",
    nameRequired: "El nombre es obligatorio",
    invalidDose: "Dosis invalida",
    couldNotSave: "No se pudo guardar",
    exampleMedicine: "Ej: Paracetamol",
    exampleDose: "Ej: 1",
    offline: "Offline",
    willSyncWhenOnline: "Se sincronizara cuando vuelva internet",
    delete: "Eliminar",
    deleteConfirmTitle: "Eliminar",
    deleteConfirmBody: "Seguro?",
    editMedication: "Editar medicamento",
    whatToEdit: "Que quieres editar?",
    cancel: "Cancelar",
    success: "Exito",
    doseUpdated: "Dosis actualizada",
    timeUpdated: "Hora actualizada",
    takenDose: "Tomada",
    profileTitle: "PERFIL",
    loadingProfile: "Cargando perfil...",
    years: "años",
    plan: "Plan",
    weeklyProgress: "Tu progreso",
    noStats: "Aun no hay estadisticas disponibles.",
    weeklyAdherence: "Cumplimiento semanal",
    lastSevenDays: "Ultimos 7 dias",
    editProfile: "Editar perfil",
    privacyData: "Privacidad y datos",
    signOut: "Cerrar sesion",
    male: "Hombre",
    female: "Mujer",
    maleTrans: "Hombre trans",
    femaleTrans: "Mujer trans",
    other: "Otro",
    editDose: "Editar dosis",
    editTime: "Editar hora",
    newDose: "Nueva dosis",
    zeroToDelete: "0 para eliminar",
    newTime: "Nueva hora",
    timeFormat: "Formato: HH:MM (ej: 08:30, 14:45, 22:00)",
    invalidNumber: "Ingresa un numero valido mayor o igual a 0",
    deleteMedicationQuestion:
      "Estas seguro de que quieres eliminar este medicamento?",
    invalidTime: "Usa el formato HH:MM (ej: 08:30)",
    save: "Guardar",
  },
  en: {
    settings: "Settings",
    language: "Language",
    spanish: "Spanish",
    english: "English",
    appearance: "Appearance",
    light: "Day",
    dark: "Night",
    notificationTone: "Notification tone",
    close: "Close",
    home: "Home",
    create: "Create",
    profile: "Profile",
    newMedication: "New Medication",
    newMedicationDescription:
      "Add a medication with its dose and schedule so you can remember it every day.",
    name: "Name",
    dose: "Dose",
    time: "Time",
    saveMedication: "Save medication",
    saving: "Saving...",
    saved: "Saved",
    medicationCreated: "Medication created successfully",
    error: "Error",
    mustSignIn: "You must sign in",
    limitReached: "Limit reached",
    planLimitReached:
      "Your current plan has already reached the medication limit.",
    nameRequired: "Name is required",
    invalidDose: "Invalid dose",
    couldNotSave: "Could not save",
    exampleMedicine: "Ex: Paracetamol",
    exampleDose: "Ex: 1",
    offline: "Offline",
    willSyncWhenOnline: "It will sync when internet returns",
    delete: "Delete",
    deleteConfirmTitle: "Delete",
    deleteConfirmBody: "Are you sure?",
    editMedication: "Edit medication",
    whatToEdit: "What do you want to edit?",
    cancel: "Cancel",
    success: "Success",
    doseUpdated: "Dose updated",
    timeUpdated: "Time updated",
    takenDose: "Taken",
    profileTitle: "PROFILE",
    loadingProfile: "Loading profile...",
    years: "years old",
    plan: "Plan",
    weeklyProgress: "Your progress",
    noStats: "No statistics available yet.",
    weeklyAdherence: "Weekly adherence",
    lastSevenDays: "Last 7 days",
    editProfile: "Edit profile",
    privacyData: "Privacy and data",
    signOut: "Sign out",
    male: "Man",
    female: "Woman",
    maleTrans: "Trans man",
    femaleTrans: "Trans woman",
    other: "Other",
    editDose: "Edit dose",
    editTime: "Edit time",
    newDose: "New dose",
    zeroToDelete: "0 to delete",
    newTime: "New time",
    timeFormat: "Format: HH:MM (ex: 08:30, 14:45, 22:00)",
    invalidNumber: "Enter a valid number greater than or equal to 0",
    deleteMedicationQuestion:
      "Are you sure you want to delete this medication?",
    invalidTime: "Use HH:MM format (ex: 08:30)",
    save: "Save",
  },
};

type SettingsContextType = {
  language: AppLanguage;
  theme: AppTheme;
  colorScheme: AppTheme;
  notificationSound: NotificationSound;
  loading: boolean;
  setLanguage: (language: AppLanguage) => Promise<void>;
  setTheme: (theme: AppTheme) => Promise<void>;
  setNotificationSound: (sound: NotificationSound) => Promise<void>;
  t: (key: TranslationKey) => string;
};

const SettingsContext = createContext<SettingsContextType | null>(null);

function isNotificationSound(value: string | null): value is NotificationSound {
  return NOTIFICATION_SOUNDS.some((sound) => sound.value === value);
}

export async function getStoredNotificationSound(): Promise<NotificationSound> {
  const stored = await AsyncStorage.getItem(STORAGE_KEYS.notificationSound);
  return isNotificationSound(stored) ? stored : DEFAULT_NOTIFICATION_SOUND;
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const deviceScheme = useDeviceColorScheme();
  const [language, setLanguageState] = useState<AppLanguage>("es");
  const [theme, setThemeState] = useState<AppTheme>(
    deviceScheme === "dark" ? "dark" : "light",
  );
  const [notificationSound, setNotificationSoundState] =
    useState<NotificationSound>(DEFAULT_NOTIFICATION_SOUND);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hydrate = async () => {
      try {
        const [storedLanguage, storedTheme, storedSound] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.language),
          AsyncStorage.getItem(STORAGE_KEYS.theme),
          AsyncStorage.getItem(STORAGE_KEYS.notificationSound),
        ]);

        if (storedLanguage === "es" || storedLanguage === "en") {
          setLanguageState(storedLanguage);
        }

        if (storedTheme === "light" || storedTheme === "dark") {
          setThemeState(storedTheme);
        }

        if (isNotificationSound(storedSound)) {
          setNotificationSoundState(storedSound);
        }
      } finally {
        setLoading(false);
      }
    };

    hydrate();
  }, []);

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(theme === "dark" ? "#151718" : "#FFFFFF");
  }, [theme]);

  const setLanguage = async (nextLanguage: AppLanguage) => {
    setLanguageState(nextLanguage);
    await AsyncStorage.setItem(STORAGE_KEYS.language, nextLanguage);
  };

  const setTheme = async (nextTheme: AppTheme) => {
    setThemeState(nextTheme);
    await AsyncStorage.setItem(STORAGE_KEYS.theme, nextTheme);
  };

  const setNotificationSound = async (nextSound: NotificationSound) => {
    setNotificationSoundState(nextSound);
    await AsyncStorage.setItem(STORAGE_KEYS.notificationSound, nextSound);
  };

  const value = useMemo<SettingsContextType>(
    () => ({
      language,
      theme,
      colorScheme: theme,
      notificationSound,
      loading,
      setLanguage,
      setTheme,
      setNotificationSound,
      t: (key: TranslationKey) => translations[language][key],
    }),
    [language, theme, notificationSound, loading],
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used inside SettingsProvider");
  }
  return context;
}
