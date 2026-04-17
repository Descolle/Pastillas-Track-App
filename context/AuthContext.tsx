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
  fecha_nacimiento?: string;
  genero?: string;
  plan?: string;
};

type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
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

  // 🔥 cargar sesión inicial + validar profile
  useEffect(() => {
    const loadSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        // ❌ sesión inválida → limpiar
        if (error || !data.session?.user) {
          await supabase.auth.signOut();
          setUser(null);
          setProfile(null);
          setLoading(false);
          return;
        }

        const authUser = data.session.user;

        // 🔥 buscar profile real en BD
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authUser.id)
          .single();

        // ❌ no existe profile → sesión inválida
        if (profileError || !profileData) {
          console.log("⚠️ Usuario sin profile → cerrando sesión");

          await supabase.auth.signOut();
          setUser(null);
          setProfile(null);
          setLoading(false);
          return;
        }

        // ✅ todo correcto
        setUser({
          id: authUser.id,
          email: authUser.email,
        });

        setProfile(profileData);
      } catch (err) {
        console.log("Error loading session:", err);

        await supabase.auth.signOut();
        setUser(null);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    loadSession();

    // 🔄 escuchar cambios de auth
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!session?.user) {
          setUser(null);
          setProfile(null);
          return;
        }

        const authUser = session.user;

        // 🔥 traer profile en tiempo real
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authUser.id)
          .single();

        if (!profileData) {
          console.log("⚠️ sesión sin profile → logout");

          await supabase.auth.signOut();
          setUser(null);
          setProfile(null);
          return;
        }

        setUser({
          id: authUser.id,
          email: authUser.email,
        });

        setProfile(profileData);
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
    <AuthContext.Provider value={{ user, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
