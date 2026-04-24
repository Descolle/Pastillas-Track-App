import { supabase } from "./supabase";

// Obtener estadísticas del día
export const getTodayStats = async (userId: string) => {
  // Fix timezone issue: use local date instead of UTC
  const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD format in local timezone

  const { data, error } = await supabase
    .from("intakes")
    .select(`
      taken,
      schedules (
        time,
        medications (
          name,
          user_id
        )
      )
    `)
    .eq("date", today)
    .eq("schedules.medications.user_id", userId);

  if (error) throw error;

  const stats = {
    total: data?.length || 0,
    taken: data?.filter((i: any) => i.taken).length || 0,
    pending: data?.filter((i: any) => !i.taken).length || 0,
    percentage: 0,
  };

  stats.percentage = stats.total > 0 ? Math.round((stats.taken / stats.total) * 100) : 0;

  return stats;
};
