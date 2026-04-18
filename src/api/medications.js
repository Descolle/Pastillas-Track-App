import { supabase } from "../../lib/supabase";

export const getMedications = async (userId) => {
  const { data, error } = await supabase
    .from("medications")
    .select(
      `
      id,
      name,
      dosage,
      schedules (
        id,
        time
      )
    `,
    )
    .eq("user_id", userId);

  if (error) throw error;

  return data;
};

export const createMedication = async (userId, medData) => {
  const { data: user } = await supabase
    .from("profiles") // 🔥 CAMBIO AQUÍ
    .select("plan")
    .eq("id", userId)
    .single();ss

  const { count } = await supabase
    .from("medications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  if (user?.plan === "free" && count >= 5) {
    throw new Error("Límite FREE alcanzado");
  }

  const { data, error } = await supabase
    .from("medications")
    .insert([{ ...medData, user_id: userId }])
    .select(); // 🔥 importante para devolver id

  if (error) throw error;

  return data;
};
