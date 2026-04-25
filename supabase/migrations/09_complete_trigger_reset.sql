-- =========================
-- STEP 9: COMPLETE TRIGGER RESET
-- =========================

-- Disable ALL RLS temporarily
ALTER TABLE intakes DISABLE ROW LEVEL SECURITY;
ALTER TABLE schedules DISABLE ROW LEVEL SECURITY;
ALTER TABLE medications DISABLE ROW LEVEL SECURITY;
ALTER TABLE adherence_history DISABLE ROW LEVEL SECURITY;
ALTER TABLE caregivers DISABLE ROW LEVEL SECURITY;
ALTER TABLE payments DISABLE ROW LEVEL SECURITY;

-- Drop EVERY possible trigger on ALL tables
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

-- Drop ALL functions that might reference old schema
DROP FUNCTION IF EXISTS create_default_intake() CASCADE;
DROP FUNCTION IF EXISTS create_intake_for_today() CASCADE;
DROP FUNCTION IF EXISTS auto_create_intake() CASCADE;
DROP FUNCTION IF EXISTS update_intake_date() CASCADE;
DROP FUNCTION IF EXISTS handle_new_intake() CASCADE;
DROP FUNCTION IF EXISTS create_intake_on_schedule() CASCADE;
DROP FUNCTION IF EXISTS update_intake_on_schedule() CASCADE;
DROP FUNCTION IF EXISTS handle_medication_insert() CASCADE;

-- Search and destroy ANY remaining functions
DO $$
DECLARE
    func_record RECORD;
BEGIN
    FOR func_record IN 
        SELECT routine_name 
        FROM information_schema.routines 
        WHERE routine_schema = 'public' 
        AND (routine_definition LIKE '%intakes%' 
             OR routine_definition LIKE '%date%' 
             OR routine_definition LIKE '%taken%'
             OR routine_definition LIKE '%schedule%')
    LOOP
        BEGIN
            EXECUTE 'DROP FUNCTION IF EXISTS ' || func_record.routine_name || ' CASCADE';
            EXCEPTION WHEN OTHERS THEN
                -- Ignore errors if function doesn't exist or can't be dropped
                NULL;
        END;
    END LOOP;
END $$;

-- Re-enable RLS
ALTER TABLE intakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE adherence_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE caregivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Show what's left
SELECT 'Remaining triggers:' as info;
SELECT trigger_name, event_object_table 
FROM information_schema.triggers 
WHERE trigger_schema = 'public';

SELECT 'Remaining functions:' as info;
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_type = 'FUNCTION';
