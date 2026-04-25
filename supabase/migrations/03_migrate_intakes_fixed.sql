-- =========================
-- STEP 3: MIGRATE INTAKES STRUCTURE (FINAL FIX)
-- =========================

-- First, check what columns exist in current intakes table
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'intakes';

-- Create new intakes table structure
CREATE TABLE intakes_new (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  schedule_id UUID REFERENCES schedules(id) ON DELETE CASCADE,
  taken_at TIMESTAMPTZ,
  status intake_status NOT NULL DEFAULT 'taken',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes on NEW table
CREATE INDEX idx_intakes_schedule ON intakes_new(schedule_id);
CREATE INDEX idx_intakes_taken_at ON intakes_new(taken_at);

-- Migrate data from old intakes to new intakes (fixed for missing created_at)
INSERT INTO intakes_new (id, schedule_id, taken_at, status, created_at)
SELECT 
  i.id,
  i.schedule_id,
  CASE 
    WHEN i.taken = true THEN now()
    ELSE NULL
  END as taken_at,
  CASE 
    WHEN i.taken = true THEN 'taken'
    ELSE 'missed'
  END as status,
  now() as created_at -- Use now() since old table doesn't have created_at
FROM intakes i;

-- Drop old intakes table and rename new one
DROP TABLE intakes CASCADE;
ALTER TABLE intakes_new RENAME TO intakes;
