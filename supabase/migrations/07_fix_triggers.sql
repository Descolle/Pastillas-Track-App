-- =========================
-- STEP 7: FIX TRIGGERS AND FUNCTIONS
-- =========================

-- Drop any existing triggers that might reference old schema
DROP TRIGGER IF EXISTS update_intake_date ON intakes;
DROP TRIGGER IF EXISTS set_intake_date ON intakes;

-- Check for any functions that reference old intakes.date column
DROP FUNCTION IF EXISTS create_intake_for_today();
DROP FUNCTION IF EXISTS auto_create_intake();

-- Create a proper trigger for new schema (optional - if needed)
-- This trigger creates an intake record when a new schedule is created
CREATE OR REPLACE FUNCTION create_default_intake()
RETURNS TRIGGER AS $$
BEGIN
  -- Create a default intake for the new schedule
  INSERT INTO intakes (schedule_id, taken_at, status)
  VALUES (NEW.id, NULL, 'missed');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically create intake when schedule is created
CREATE TRIGGER create_default_intake_trigger
AFTER INSERT ON schedules
FOR EACH ROW EXECUTE FUNCTION create_default_intake();
