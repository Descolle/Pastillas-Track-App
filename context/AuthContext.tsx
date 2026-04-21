import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";
import * as InAppPurchases from "expo-in-app-purchases";

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

  // 🔹 cargar perfil
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

  // 🔹 sesión inicial
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

  // 💳 COMPRAS
  useEffect(() => {
    if (!user) return;

    const init = async () => {
      await InAppPurchases.connectAsync();
      await InAppPurchases.getProductsAsync(["plan_pro"]);
    };

    init();

    const listener = InAppPurchases.setPurchaseListener(
      async ({ responseCode, results }) => {
        if (responseCode === InAppPurchases.IAPResponseCode.OK) {
          for (const purchase of results || []) {
            if (!purchase.acknowledged) {
              console.log("💰 Compra:", purchase.productId);

              // 🔥 LLAMADA A SUPABASE FUNCTION
              await fetch(
                "https://eszbvlipbytljgalptmz.supabase.co/functions/v1/verify-payment",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    userId: user.id,
                    productId: purchase.productId,
                    purchaseToken: purchase.purchaseToken,
                  }),
                }
              );

              // 🔄 refrescar perfil
              await loadProfile(user.id);

              // ✅ confirmar compra
              await InAppPurchases.finishTransactionAsync(purchase, true);
            }
          }
        }
      },
    );

    return () => {
      InAppPurchases.disconnectAsync();
    };
  }, [user]);

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

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, initialized, signOut, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}
