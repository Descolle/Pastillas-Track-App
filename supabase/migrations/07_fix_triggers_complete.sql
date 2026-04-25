-- =========================
-- STEP 7: COMPLETE TRIGGER AND FUNCTION FIX
-- =========================

-- First, disable RLS temporarily to fix triggers
ALTER TABLE intakes DISABLE ROW LEVEL SECURITY;

-- Drop ALL triggers on intakes table
DROP TRIGGER IF EXISTS create_default_intake_trigger ON intakes;
DROP TRIGGER IF EXISTS update_intake_date ON intakes;
DROP TRIGGER IF EXISTS set_intake_date ON intakes;
DROP TRIGGER IF EXISTS auto_intake_trigger ON intakes;

-- Drop ALL functions that might reference old schema
DROP FUNCTION IF EXISTS create_default_intake();
DROP FUNCTION IF EXISTS create_intake_for_today();
DROP FUNCTION IF EXISTS auto_create_intake();
DROP FUNCTION IF EXISTS update_intake_date();

-- Check for any other problematic functions
DROP FUNCTION IF EXISTS public.handle_new_intake();

-- Re-enable RLS
ALTER TABLE intakes ENABLE ROW LEVEL SECURITY;

-- Now create a clean trigger for new schema (optional)
-- Remove the automatic intake creation for now to isolate the issue
-- The app will create intakes manually in createMedicationWithSchedule

-- Verify the intakes table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'intakes' 
ORDER BY ordinal_position;
