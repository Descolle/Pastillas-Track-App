import { supabase } from "./supabase";

export const getTodayStats = async (userId) => {
  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("intakes")
    .select(
      `
      taken,
      schedules!inner(
        medications!inner(user_id)
      )
    `,
    )
    .eq("date", today)
    .eq("schedules.medications.user_id", userId);

  if (error) throw error;

  const total = data.length;
  const taken = data.filter((i) => i.taken).length;
  const pending = total - taken;

  const percentage = total > 0 ? Math.round((taken / total) * 100) : 0;

  return {
    total,
    taken,
    pending,
    percentage,
  };
};

export const getWeeklyStats = async (userId) => {
  const today = new Date();
  const past7 = new Date();
  past7.setDate(today.getDate() - 6);

  const from = past7.toISOString().split("T")[0];
  const to = today.toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("intakes")
    .select(`
      taken,
      date,
      schedules!inner(
        medications!inner(user_id)
      )
    `)
    .gte("date", from)
    .lte("date", to)
    .eq("schedules.medications.user_id", userId);

  if (error) throw error;

  // agrupar por día
  const grouped = {};

  data.forEach((i) => {
    if (!grouped[i.date]) {
      grouped[i.date] = { total: 0, taken: 0 };
    }

    grouped[i.date].total++;
    if (i.taken) grouped[i.date].taken++;
  });

  return grouped;
};

