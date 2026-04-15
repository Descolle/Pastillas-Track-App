export const createMedication = async (userId, medData) => {
  // obtener plan
  const { data: user } = await supabase
    .from("users")
    .select("plan")
    .eq("id", userId)
    .single();

  // contar medicamentos
  const { count } = await supabase
    .from("medications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  if (user.plan === "free" && count >= 5) {
    throw new Error("Límite FREE alcanzado");
  }

  const { data, error } = await supabase
    .from("medications")
    .insert([{ ...medData, user_id: userId }]);

  if (error) throw error;

  return data;
};
