import { supabase } from "@/lib/supabase";

// Delete medication and all related data (cascade delete)
export async function deleteMedication(scheduleId: string) {
  console.log("🗑️ DELETE MEDICATION START:", { scheduleId });

  try {
    console.log("🗑️ STEP 1: Getting medication_id from schedule...");
    // First get the medication_id from the schedule
    const { data: schedule, error: scheduleError } = await supabase
      .from("schedules")
      .select("medication_id")
      .eq("id", scheduleId)
      .single();

    console.log("🗑️ STEP 1 RESULT:", { schedule, scheduleError });

    if (scheduleError) {
      console.log("🗑️ DELETE SCHEDULE ERROR:", scheduleError);
      throw scheduleError;
    }

    if (!schedule?.medication_id) {
      throw new Error("Medication not found");
    }

    console.log("🗑️ STEP 2: Checking for other schedules BEFORE deleting...");
    // Check if there are other schedules for this medication BEFORE deleting
    const { data: otherSchedules, error: checkError } = await supabase
      .from("schedules")
      .select("id")
      .eq("medication_id", schedule.medication_id);

    console.log("🗑️ STEP 2 RESULT:", { otherSchedules, checkError });

    if (checkError) {
      console.log("🗑️ CHECK OTHER SCHEDULES ERROR:", checkError);
      throw checkError;
    }

    // Count if there are other schedules (excluding the one we're about to delete)
    const otherSchedulesCount = otherSchedules?.filter(s => s.id !== scheduleId).length || 0;
    console.log("🗑️ OTHER SCHEDULES COUNT (excluding current):", otherSchedulesCount);

    console.log("🗑️ STEP 3: Deleting intakes...");
    // Delete intakes for this schedule
    const { error: intakesError } = await supabase
      .from("intakes")
      .delete()
      .eq("schedule_id", scheduleId);

    console.log("🗑️ STEP 3 RESULT:", { intakesError });

    if (intakesError) {
      console.log("🗑️ DELETE INTAKES ERROR:", intakesError);
      throw intakesError;
    }

    console.log("🗑️ STEP 4: Deleting schedule...");
    // Delete the schedule
    const { error: deleteScheduleError } = await supabase
      .from("schedules")
      .delete()
      .eq("id", scheduleId);

    console.log("🗑️ STEP 4 RESULT:", { deleteScheduleError });

    if (deleteScheduleError) {
      console.log("🗑️ DELETE SCHEDULE ERROR:", deleteScheduleError);
      throw deleteScheduleError;
    }

    // If no other schedules exist, delete the medication too
    if (otherSchedulesCount === 0) {
      console.log("🗑️ STEP 5: Deleting medication (no other schedules)...");
      const { error: deleteMedError } = await supabase
        .from("medications")
        .delete()
        .eq("id", schedule.medication_id);

      console.log("🗑️ STEP 5 RESULT:", { deleteMedError });

      if (deleteMedError) {
        console.log("🗑️ DELETE MEDICATION ERROR:", deleteMedError);
        throw deleteMedError;
      }
    } else {
      console.log("🗑️ STEP 5 SKIPPED: Other schedules exist, keeping medication");
    }

    console.log("🗑️ DELETE MEDICATION SUCCESS");
  } catch (error) {
    console.log("🗑️ DELETE MEDICATION ERROR:", error);
    throw error;
  }
}
