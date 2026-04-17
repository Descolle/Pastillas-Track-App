import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";

type User = {
  id: string;
  email?: string;
};

type Profile = {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  genero?: string;
  fecha_nacimiento?: string;
  plan?: string;
};

type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>; // 🔥 NUEVO
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔥 obtener perfil
  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.log("Error profile:", error);
      return;
    }

    setProfile(data);
  };

  // 🔥 refrescar manual
  const refreshProfile = async () => {
    if (!user) return;
    await fetchProfile(user.id);
  };

  // 🔥 sesión inicial
  useEffect(() => {
    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session?.user) {
        const u = data.session.user;

        setUser({
          id: u.id,
          email: u.email,
        });

        await fetchProfile(u.id); // 🔥 cargar profile
      }

      setLoading(false);
    };

    loadSession();

    // 🔥 listener auth
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          const u = session.user;

          setUser({
            id: u.id,
            email: u.email,
          });

          await fetchProfile(u.id); // 🔥 cargar profile
        } else {
          setUser(null);
          setProfile(null);
        }
      },
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signOut,
        refreshProfile, // 🔥 exportado
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
