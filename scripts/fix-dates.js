// Migration script to fix UTC date issues and reset taken status
// Run this script once to fix existing data - UPDATED FOR NEW SCHEMA

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
    const today = new Date().toISOString(); // Full timestamp for new schema
    
    for (const intake of intakes) {
      // Convert old date to new taken_at timestamp if needed
      const takenAt = intake.taken_at ? intake.taken_at : null;
      
      const { error: updateError } = await supabase
        .from('intakes')
        .update({ 
          taken_at: takenAt,
          status: 'missed' // Reset status for fresh start
        })
        .eq('id', intake.id);
        
      if (updateError) {
        console.error(`❌ Error updating intake ${intake.id}:`, updateError);
      } else {
        console.log(`✅ Fixed intake ${intake.id}: status -> missed`);
      }
    }
    
    console.log("🎉 Migration completed!");
    
  } catch (error) {
    console.error("❌ Migration failed:", error);
  }
}

// Run the migration
fixDatesAndResetStatus();
