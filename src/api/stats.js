import { supabase } from "../../lib/supabase";

export const getWeeklyStats = async (userId) => {
  const today = new Date();
  const last7Days = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - i
    );

    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");

    last7Days.push(`${yyyy}-${mm}-${dd}`);
  }

  const { data, error } = await supabase
    .from("intakes")
    .select(`
      taken_at,
      status,
      schedules!inner (
        user_id,
        dosage
      )
    `)
    .eq("schedules.user_id", userId)
    .in("date(taken_at)", last7Days);

  if (error) throw error;

  const daily = last7Days.map((date) => {
    const dayData = (data ?? []).filter(
      (d) => {
        const intakeDate = d.taken_at ? new Date(d.taken_at).toISOString().split("T")[0] : null;
        return intakeDate === date;
      }
    );

    const total = dayData.reduce(
      (acc, d) => acc + (d.schedules?.dosage || 1),
      0
    );

    const taken = dayData
      .filter((d) => d.status === "taken")
      .reduce((acc, d) => acc + (d.schedules?.dosage || 1), 0);

    const percentage =
      total === 0 ? 0 : Math.round((taken / total) * 100);

    return {
      day: new Date(date).toLocaleDateString("es-CL", {
        weekday: "short",
      }),
      percentage,
    };
  });

  const totalAll = (data ?? []).reduce(
    (acc, d) => acc + (d.schedules?.dosage || 1),
    0
  );

  const takenAll = (data ?? [])
    .filter((d) => d.status === "taken")
    .reduce((acc, d) => acc + (d.schedules?.dosage || 1), 0);

  const percentage =
    totalAll === 0 ? 0 : Math.round((takenAll / totalAll) * 100);

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
