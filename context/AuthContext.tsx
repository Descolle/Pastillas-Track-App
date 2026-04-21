import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";
import { deleteCurrentAccount } from "@/services/account";

type User = {
  id: string;
  email?: string;
};

type Profile = {
  id?: string;
  nombre?: string;
  apellido?: string;
  fecha_nacimiento?: string;
  genero?: string;
  plan?: "free" | "pro";
};

type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  initialized: boolean;
  deleteAccount: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
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
      console.log("profile error:", error);
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
        setUser({
          id: sessionUser.id,
          email: sessionUser.email,
        });

        await loadProfile(sessionUser.id);
      }

      setLoading(false);
      setInitialized(true);
    };

    load();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const sessionUser = session?.user;

        if (sessionUser) {
          setUser({
            id: sessionUser.id,
            email: sessionUser.email,
          });

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

  const refreshProfile = async () => {
    if (user) {
      await loadProfile(user.id);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  const deleteAccount = async () => {
    await deleteCurrentAccount();

    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.log("signOut after delete failed:", error);
    }

    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        initialized,
        deleteAccount,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
