// Quick script to reset taken status for all medications - UPDATED FOR NEW SCHEMA
import { supabase } from '../lib/supabase.js';

async function resetAllTakenStatus() {
  console.log("🔄 Resetting taken status for all medications...");
  
  try {
    const { error } = await supabase
      .from('intakes')
      .update({ status: 'missed' })
      .neq('status', 'missed'); // Only update those that are not missed
      
    if (error) {
      console.error("❌ Error resetting taken status:", error);
    } else {
      console.log("✅ All taken status reset successfully!");
    }
  } catch (error) {
    console.error("❌ Reset failed:", error);
  }
}

resetAllTakenStatus();
