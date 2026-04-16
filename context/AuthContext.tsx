import { supabase } from "@/api/supabase";
import type { Session, User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  hydrated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // 🔥 escucha cambios de sesión
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
  const validSession = data.session;

  if (validSession?.user?.email_confirmed_at) {
    setSession(validSession);
    setUser(validSession.user);
  } else {
    setSession(null);
    setUser(null);
  }

  setHydrated(true);
});

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

useEffect(() => {
  const init = async () => {
    const { data } = await supabase.auth.getSession();
    const session = data.session;

    setSession(session);
    setUser(session?.user ?? null);

    if (session?.user) {
      await supabase.from("users").upsert({
        id: session.user.id,
        email: session.user.email,
        plan: "free",
      });
    }

    setHydrated(true);
  };

  init();

  const { data: listener } = supabase.auth.onAuthStateChange(
    async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        await supabase.from("users").upsert({
          id: session.user.id,
          email: session.user.email,
          plan: "free",
        });
      }
    }
  );

  return () => {
    listener.subscription.unsubscribe();
  };
}, []);


  return (
    <AuthContext.Provider value={{ user, session, hydrated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
