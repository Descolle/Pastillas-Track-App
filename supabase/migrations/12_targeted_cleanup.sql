-- =========================
-- TARGETED CLEANUP - USER OBJECTS ONLY
-- =========================

-- Show what triggers exist before cleanup
SELECT 'BEFORE CLEANUP - All triggers:' as info;
SELECT trigger_name, event_manipulation, event_object_table, action_statement, action_timing
FROM information_schema.triggers 
WHERE trigger_schema = 'public';

-- Show what functions exist before cleanup  
SELECT 'BEFORE CLEANUP - All functions:' as info;
SELECT routine_name, routine_definition
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_type = 'FUNCTION';

-- Drop only user-created triggers (exclude system triggers starting with RI_)
DO $$
DECLARE
    trigger_record RECORD;
    trigger_count INTEGER := 0;
BEGIN
    FOR trigger_record IN 
        SELECT trigger_name, event_object_table
        FROM information_schema.triggers 
        WHERE trigger_schema = 'public'
        AND trigger_name NOT LIKE 'RI_%'  -- Exclude system triggers
    LOOP
        BEGIN
            EXECUTE 'DROP TRIGGER IF EXISTS ' || trigger_record.trigger_name || ' ON ' || trigger_record.event_object_table || ' CASCADE';
            trigger_count := trigger_count + 1;
            RAISE NOTICE 'Dropped user trigger: % on %', trigger_record.trigger_name, trigger_record.event_object_table;
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not drop trigger: %', trigger_record.trigger_name;
        END;
    END LOOP;
    RAISE NOTICE 'Total user triggers dropped: %', trigger_count;
END $$;

-- Drop user-created functions (be more selective)
DO $$
DECLARE
    func_record RECORD;
    func_count INTEGER := 0;
BEGIN
    FOR func_record IN 
        SELECT routine_name, routine_definition
        FROM information_schema.routines 
        WHERE routine_schema = 'public' 
        AND routine_type = 'FUNCTION'
        AND (
            routine_name LIKE '%intake%' 
            OR routine_name LIKE '%medication%'
            OR routine_name LIKE '%schedule%'
            OR routine_name LIKE '%date%'
            OR routine_name LIKE '%taken%'
            OR routine_name LIKE '%create%'
            OR routine_name LIKE '%auto%'
            OR routine_name LIKE '%default%'
        )
    LOOP
        BEGIN
            EXECUTE 'DROP FUNCTION IF EXISTS ' || func_record.routine_name || ' CASCADE';
            func_count := func_count + 1;
            RAISE NOTICE 'Dropped user function: %', func_record.routine_name;
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not drop function: %', func_record.routine_name;
        END;
    END LOOP;
    RAISE NOTICE 'Total user functions dropped: %', func_count;
END $$;

-- Show what's left after cleanup
SELECT 'AFTER CLEANUP - Remaining triggers:' as info;
SELECT trigger_name, event_object_table, action_statement
FROM information_schema.triggers 
WHERE trigger_schema = 'public';

SELECT 'AFTER CLEANUP - Remaining functions:' as info;
SELECT routine_name, routine_definition
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_type = 'FUNCTION';

-- Also check for any views that might reference the old schema
SELECT 'Checking views for old schema references:' as info;
SELECT table_name, view_definition
FROM information_schema.views 
WHERE table_schema = 'public'
AND (
    view_definition LIKE '%intakes.date%' 
    OR view_definition LIKE '%intakes.taken%'
);

SELECT 'TARGETED CLEANUP COMPLETED' as status;
