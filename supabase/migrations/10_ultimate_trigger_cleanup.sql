-- =========================
-- ULTIMATE TRIGGER CLEANUP
-- =========================

-- Disable ALL RLS temporarily to allow trigger removal
ALTER TABLE intakes DISABLE ROW LEVEL SECURITY;
ALTER TABLE schedules DISABLE ROW LEVEL SECURITY;
ALTER TABLE medications DISABLE ROW LEVEL SECURITY;
ALTER TABLE adherence_history DISABLE ROW LEVEL SECURITY;
ALTER TABLE caregivers DISABLE ROW LEVEL SECURITY;
ALTER TABLE payments DISABLE ROW LEVEL SECURITY;
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Show what triggers exist before cleanup
SELECT 'BEFORE CLEANUP - Existing triggers:' as info;
SELECT trigger_name, event_manipulation, event_object_table, action_statement, action_timing
FROM information_schema.triggers 
WHERE trigger_schema = 'public';

-- Show what functions exist before cleanup  
SELECT 'BEFORE CLEANUP - Existing functions:' as info;
SELECT routine_name, routine_definition
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_type = 'FUNCTION';

-- Drop EVERY possible trigger on ALL tables with CASCADE
DROP TRIGGER IF EXISTS create_default_intake_trigger ON intakes CASCADE;
DROP TRIGGER IF EXISTS create_default_intake_trigger ON schedules CASCADE;
DROP TRIGGER IF EXISTS create_default_intake_trigger ON medications CASCADE;
DROP TRIGGER IF EXISTS update_intake_date ON intakes CASCADE;
DROP TRIGGER IF EXISTS update_intake_date ON schedules CASCADE;
DROP TRIGGER IF EXISTS update_intake_date ON medications CASCADE;
DROP TRIGGER IF EXISTS set_intake_date ON intakes CASCADE;
DROP TRIGGER IF EXISTS set_intake_date ON schedules CASCADE;
DROP TRIGGER IF EXISTS set_intake_date ON medications CASCADE;
DROP TRIGGER IF EXISTS auto_intake_trigger ON intakes CASCADE;
DROP TRIGGER IF EXISTS auto_intake_trigger ON schedules CASCADE;
DROP TRIGGER IF EXISTS auto_intake_trigger ON medications CASCADE;
DROP TRIGGER IF EXISTS intakes_insert_trigger ON intakes CASCADE;
DROP TRIGGER IF EXISTS intakes_update_trigger ON intakes CASCADE;
DROP TRIGGER IF EXISTS intakes_delete_trigger ON intakes CASCADE;
DROP TRIGGER IF EXISTS schedules_insert_trigger ON schedules CASCADE;
DROP TRIGGER IF EXISTS schedules_update_trigger ON schedules CASCADE;
DROP TRIGGER IF EXISTS schedules_delete_trigger ON schedules CASCADE;
DROP TRIGGER IF EXISTS medications_insert_trigger ON medications CASCADE;
DROP TRIGGER IF EXISTS medications_update_trigger ON medications CASCADE;
DROP TRIGGER IF EXISTS medications_delete_trigger ON medications CASCADE;

-- Drop ALL functions with CASCADE
DROP FUNCTION IF EXISTS create_default_intake() CASCADE;
DROP FUNCTION IF EXISTS create_intake_for_today() CASCADE;
DROP FUNCTION IF EXISTS auto_create_intake() CASCADE;
DROP FUNCTION IF EXISTS update_intake_date() CASCADE;
DROP FUNCTION IF EXISTS handle_new_intake() CASCADE;
DROP FUNCTION IF EXISTS create_intake_on_schedule() CASCADE;
DROP FUNCTION IF EXISTS update_intake_on_schedule() CASCADE;
DROP FUNCTION IF EXISTS handle_medication_insert() CASCADE;
DROP FUNCTION IF EXISTS handle_schedule_insert() CASCADE;
DROP FUNCTION IF EXISTS handle_medication_creation() CASCADE;

-- Search and destroy ANY remaining functions with broad pattern matching
DO $$
DECLARE
    func_record RECORD;
    func_count INTEGER := 0;
BEGIN
    FOR func_record IN 
        SELECT routine_name 
        FROM information_schema.routines 
        WHERE routine_schema = 'public' 
        AND routine_type = 'FUNCTION'
        AND (routine_definition LIKE '%intakes%' 
             OR routine_definition LIKE '%date%' 
             OR routine_definition LIKE '%taken%'
             OR routine_definition LIKE '%schedule%'
             OR routine_definition LIKE '%medication%')
    LOOP
        BEGIN
            EXECUTE 'DROP FUNCTION IF EXISTS ' || func_record.routine_name || ' CASCADE';
            func_count := func_count + 1;
            RAISE NOTICE 'Dropped function: %', func_record.routine_name;
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not drop function: %', func_record.routine_name;
        END;
    END LOOP;
    RAISE NOTICE 'Total functions dropped: %', func_count;
END $$;

-- Re-enable RLS
ALTER TABLE intakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE adherence_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE caregivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Show what's left after cleanup
SELECT 'AFTER CLEANUP - Remaining triggers:' as info;
SELECT trigger_name, event_object_table 
FROM information_schema.triggers 
WHERE trigger_schema = 'public';

SELECT 'AFTER CLEANUP - Remaining functions:' as info;
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_type = 'FUNCTION';

SELECT 'CLEANUP COMPLETED' as status;
