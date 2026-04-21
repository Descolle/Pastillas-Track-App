import { supabase } from "@/lib/supabase";

export async function deleteCurrentAccount() {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    throw sessionError;
  }

  if (!session?.access_token) {
    throw new Error("No hay una sesion activa para eliminar.");
  }

  const { error } = await supabase.functions.invoke("delete-account", {
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  if (error) {
    throw error;
  }
}
