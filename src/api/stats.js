import { supabase } from "../../lib/supabase";

export const getWeeklyStats = async (userId) => {
  const today = new Date();
  const last7Days = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    last7Days.push(d.toISOString().split("T")[0]);
  }

  const { data, error } = await supabase
    .from("intakes")
    .select(
      `
      taken_at,
      status,
      schedules (
        medications (
          user_id
        )
      )
    `,
    )
    .in("date(taken_at)", last7Days)
    .eq("schedules.medications.user_id", userId);

  if (error) throw error;

  // 📊 agrupar por día
  const daily = last7Days.map((date) => {
    const dayData = data.filter((d) => {
      const intakeDate = d.taken_at ? new Date(d.taken_at).toISOString().split("T")[0] : null;
      return intakeDate === date;
    });

    const total = dayData.length;
    const taken = dayData.filter((d) => d.status === 'taken').length;

    const percentage = total === 0 ? 0 : Math.round((taken / total) * 100);

    return {
      day: new Date(date).toLocaleDateString("es-CL", {
        weekday: "short",
      }),
      percentage,
    };
  });

  // 📊 promedio semanal
  const totalAll = data.length;
  const takenAll = data.filter((d) => d.status === 'taken').length;

  const percentage =
    totalAll === 0 ? 0 : Math.round((takenAll / totalAll) * 100);

  // 🔥 streak
  let streak = 0;
  for (let i = daily.length - 1; i >= 0; i--) {
    if (daily[i].percentage === 100) streak++;
    else break;
  }

  return {
    percentage,
    streak,
    daily,
  };
};
