export const getStats = async (userId) => {
  // verificar plan
  const { data: user } = await supabase
    .from("users")
    .select("plan")
    .eq("id", userId)
    .single();

  if (user.plan !== "pro") {
    throw new Error("Solo PRO");
  }

  const { data } = await supabase.from("intakes").select("taken");

  const total = data.length;
  const taken = data.filter((i) => i.taken).length;

  return {
    percentage: (taken / total) * 100,
  };
};
