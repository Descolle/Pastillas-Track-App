import { supabase } from "@/lib/supabase";

// Update medication dose in schedules table
export async function updateMedicationDose(scheduleId: string, newDose: number) {
  console.log("🔧 UPDATE DOSE START:", { scheduleId, newDose });

  const { error } = await supabase
    .from("schedules")
    .update({ dosage: newDose })
    .eq("id", scheduleId);

  if (error) {
    console.log("🔧 UPDATE DOSE ERROR:", error);
    throw error;
  }

  console.log("🔧 UPDATE DOSE SUCCESS");
}

// Update medication time in schedules table
export async function updateMedicationTime(scheduleId: string, newTime: string) {
  console.log("🔧 UPDATE TIME START:", { scheduleId, newTime });

  const { error } = await supabase
    .from("schedules")
    .update({ time: newTime })
    .eq("id", scheduleId);

  if (error) {
    console.log("🔧 UPDATE TIME ERROR:", error);
    throw error;
  }

  console.log("🔧 UPDATE TIME SUCCESS");
}

// Update both dose and time
export async function updateMedicationSchedule(scheduleId: string, dose: number, time: string) {
  console.log("🔧 UPDATE SCHEDULE START:", { scheduleId, dose, time });

  const { error } = await supabase
    .from("schedules")
    .update({ 
      dosage: dose,
      time: time
    })
    .eq("id", scheduleId);

  if (error) {
    console.log("🔧 UPDATE SCHEDULE ERROR:", error);
    throw error;
  }

  console.log("🔧 UPDATE SCHEDULE SUCCESS");
}
