-- =========================
-- NUCLEAR CLEANUP - DESTROY ALL
-- =========================

-- Disable ALL constraints temporarily
ALTER TABLE intakes DISABLE TRIGGER ALL;
ALTER TABLE schedules DISABLE TRIGGER ALL;
ALTER TABLE medications DISABLE TRIGGER ALL;
ALTER TABLE adherence_history DISABLE TRIGGER ALL;
ALTER TABLE caregivers DISABLE TRIGGER ALL;
ALTER TABLE payments DISABLE TRIGGER ALL;
ALTER TABLE profiles DISABLE TRIGGER ALL;

-- Drop ALL triggers with extreme prejudice
DROP TRIGGER IF EXISTS ANY_TRIGGER_NAME ON intakes CASCADE;
DROP TRIGGER IF EXISTS ANY_TRIGGER_NAME ON schedules CASCADE;
DROP TRIGGER IF EXISTS ANY_TRIGGER_NAME ON medications CASCADE;

-- Use a more aggressive approach - drop ALL triggers in the schema
DO $$
DECLARE
    trigger_record RECORD;
    trigger_count INTEGER := 0;
BEGIN
    FOR trigger_record IN 
        SELECT trigger_name, event_object_table
        FROM information_schema.triggers 
        WHERE trigger_schema = 'public'
    LOOP
        BEGIN
            EXECUTE 'DROP TRIGGER IF EXISTS ' || trigger_record.trigger_name || ' ON ' || trigger_record.event_object_table || ' CASCADE';
            trigger_count := trigger_count + 1;
            RAISE NOTICE 'Dropped trigger: % on %', trigger_record.trigger_name, trigger_record.event_object_table;
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not drop trigger: %', trigger_record.trigger_name;
        END;
    END LOOP;
    RAISE NOTICE 'Total triggers dropped: %', trigger_count;
END $$;

-- Drop ALL functions with extreme prejudice
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

-- Also drop any procedures
DO $$
DECLARE
    proc_record RECORD;
    proc_count INTEGER := 0;
BEGIN
    FOR proc_record IN 
        SELECT routine_name
        FROM information_schema.routines 
        WHERE routine_schema = 'public' 
        AND routine_type = 'PROCEDURE'
    LOOP
        BEGIN
            EXECUTE 'DROP PROCEDURE IF EXISTS ' || proc_record.routine_name || ' CASCADE';
            proc_count := proc_count + 1;
            RAISE NOTICE 'Dropped procedure: %', proc_record.routine_name;
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not drop procedure: %', proc_record.routine_name;
        END;
    END LOOP;
    RAISE NOTICE 'Total procedures dropped: %', proc_count;
END $$;

-- Re-enable constraints
ALTER TABLE intakes ENABLE TRIGGER ALL;
ALTER TABLE schedules ENABLE TRIGGER ALL;
ALTER TABLE medications ENABLE TRIGGER ALL;
ALTER TABLE adherence_history ENABLE TRIGGER ALL;
ALTER TABLE caregivers ENABLE TRIGGER ALL;
ALTER TABLE payments ENABLE TRIGGER ALL;
ALTER TABLE profiles ENABLE TRIGGER ALL;

-- Show final state
SELECT 'FINAL STATE - Remaining triggers:' as info;
SELECT trigger_name, event_object_table 
FROM information_schema.triggers 
WHERE trigger_schema = 'public';

SELECT 'FINAL STATE - Remaining functions:' as info;
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_type = 'FUNCTION';

SELECT 'FINAL STATE - Remaining procedures:' as info;
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_type = 'PROCEDURE';

SELECT 'NUCLEAR CLEANUP COMPLETED' as status;
