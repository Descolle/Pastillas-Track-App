-- =========================
-- STEP 8: FINAL TRIGGER CLEANUP
-- =========================

-- Check what triggers currently exist
SELECT trigger_name, event_manipulation, event_object_table, action_statement, action_timing
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
AND (action_statement LIKE '%intakes%' OR action_statement LIKE '%date%');

-- Check what functions exist that might reference intakes
SELECT routine_name, routine_definition
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND (routine_definition LIKE '%intakes%' OR routine_definition LIKE '%date%');

-- Disable RLS temporarily
ALTER TABLE intakes DISABLE ROW LEVEL SECURITY;
ALTER TABLE schedules DISABLE ROW LEVEL SECURITY;

-- Drop ALL triggers systematically with CASCADE
DROP TRIGGER IF EXISTS create_default_intake_trigger ON intakes CASCADE;
DROP TRIGGER IF EXISTS create_default_intake_trigger ON schedules CASCADE;
DROP TRIGGER IF EXISTS update_intake_date ON intakes CASCADE;
DROP TRIGGER IF EXISTS set_intake_date ON intakes CASCADE;
DROP TRIGGER IF EXISTS auto_intake_trigger ON intakes CASCADE;
DROP TRIGGER IF EXISTS auto_intake_trigger ON schedules CASCADE;
DROP TRIGGER IF EXISTS intakes_insert_trigger ON intakes CASCADE;
DROP TRIGGER IF EXISTS intakes_update_trigger ON intakes CASCADE;
DROP TRIGGER IF EXISTS intakes_delete_trigger ON intakes CASCADE;

-- Drop ALL functions with CASCADE
DROP FUNCTION IF EXISTS create_default_intake() CASCADE;
DROP FUNCTION IF EXISTS create_intake_for_today() CASCADE;
DROP FUNCTION IF EXISTS auto_create_intake() CASCADE;
DROP FUNCTION IF EXISTS update_intake_date() CASCADE;
DROP FUNCTION IF EXISTS handle_new_intake() CASCADE;

-- Search for any other functions that might reference intakes or date
DO $$
DECLARE
    func_record RECORD;
BEGIN
    FOR func_record IN 
        SELECT routine_name 
        FROM information_schema.routines 
        WHERE routine_schema = 'public' 
        AND (routine_definition LIKE '%intakes%' OR routine_definition LIKE '%date%')
    LOOP
        EXECUTE 'DROP FUNCTION IF EXISTS ' || func_record.routine_name || ' CASCADE';
    END LOOP;
END $$;

-- Re-enable RLS
ALTER TABLE intakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
