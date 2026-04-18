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

type AuthContextType = {
  user: User | null;
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
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getSession();

      const sessionUser = data.session?.user;

      if (sessionUser) {
        setUser({
          id: sessionUser.id,
          email: sessionUser.email,
        });
      } else {
        setUser(null);
      }

      setLoading(false);
      setInitialized(true);
    };

    load();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const sessionUser = session?.user;

        if (sessionUser) {
          setUser({
            id: sessionUser.id,
            email: sessionUser.email,
          });
        } else {
          setUser(null);
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
  };

  return (
    <AuthContext.Provider value={{ user, loading, initialized, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
