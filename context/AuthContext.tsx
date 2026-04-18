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
  nombre?: string;
  apellido?: string;
  fecha_nacimiento?: string;
  genero?: string;
  plan?: string;
};

type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  initialized: boolean;
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
  const [initialized, setInitialized] = useState(false);

  const loadProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.log("❌ error profile:", error);
      setProfile(null);
      return;
    }

    setProfile(data);
  };

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getSession();
      const sessionUser = data.session?.user;

      if (sessionUser) {
        const userData = {
          id: sessionUser.id,
          email: sessionUser.email,
        };

        setUser(userData);
        await loadProfile(sessionUser.id);
      } else {
        setUser(null);
        setProfile(null);
      }

      setLoading(false);
      setInitialized(true);
    };

    load();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const sessionUser = session?.user;

        if (sessionUser) {
          const userData = {
            id: sessionUser.id,
            email: sessionUser.email,
          };

          setUser(userData);
          await loadProfile(sessionUser.id);
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
      value={{ user, profile, loading, initialized, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}
