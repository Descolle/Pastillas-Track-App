-- =========================
-- STEP 2: UPDATE EXISTING TABLES
-- =========================

-- Update profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user',
ADD COLUMN IF NOT EXISTS pro_expires_at TIMESTAMPTZ;

-- Update medications table (remove quantity, keep dosage)
ALTER TABLE medications 
DROP COLUMN IF EXISTS quantity;

-- Update schedules table - add new columns
ALTER TABLE schedules 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS days_of_week INT[];

-- Create indexes for new columns
CREATE INDEX IF NOT EXISTS idx_schedules_user ON schedules(user_id);

-- Populate user_id in schedules from medications
UPDATE schedules 
SET user_id = m.user_id 
FROM medications m 
WHERE schedules.medication_id = m.id;
