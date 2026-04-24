// Migration script to fix UTC date issues and reset taken status
// Run this script once to fix existing data

import { supabase } from '../lib/supabase.js';

async function fixDatesAndResetStatus() {
  console.log("🔧 Starting date migration and status reset...");
  
  try {
    // Get all intakes to fix date formats
    const { data: intakes, error: intakesError } = await supabase
      .from('intakes')
      .select('*');
      
    if (intakesError) {
      console.error("❌ Error fetching intakes:", intakesError);
      return;
    }
    
    console.log(`📊 Found ${intakes.length} intakes to process`);
    
    // Fix dates and reset taken status for all intakes
    const today = new Date().toLocaleDateString('en-CA'); // Local date YYYY-MM-DD
    
    for (const intake of intakes) {
      // Convert UTC date to local date if needed
      const localDate = intake.date.includes('T') 
        ? new Date(intake.date).toLocaleDateString('en-CA')
        : intake.date;
      
      const { error: updateError } = await supabase
        .from('intakes')
        .update({ 
          date: localDate,
          taken: false // Reset taken status for fresh start
        })
        .eq('id', intake.id);
        
      if (updateError) {
        console.error(`❌ Error updating intake ${intake.id}:`, updateError);
      } else {
        console.log(`✅ Fixed intake ${intake.id}: ${intake.date} -> ${localDate}, taken: false`);
      }
    }
    
    console.log("🎉 Migration completed!");
    
  } catch (error) {
    console.error("❌ Migration failed:", error);
  }
}

// Run the migration
fixDatesAndResetStatus();
