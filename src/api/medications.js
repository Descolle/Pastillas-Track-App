import { supabase } from "../../lib/supabase";

export const getMedications = async (userId) => {
  const { data, error } = await supabase
    .from("medications")
    .select(`
      id,
      name,
      schedules (
        id,
        time,
        dosage
      )
    `)
    .eq("user_id", userId);

  if (error) throw error;

  return data ?? [];
};

export const createMedication = async (userId, medData) => {
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", userId)
    .single();

  if (profileError) throw profileError;

  const { count } = await supabase
    .from("medications")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);

  if (profile?.plan === "free" && (count ?? 0) >= 5) {
    throw new Error("Límite FREE alcanzado");
  }

  const { data, error } = await supabase
    .from("medications")
    .insert({
      name: medData.name,
      user_id: userId,
    })
    .select()
    .single();

  if (error) throw error;

  return data;
};
