-- =========================
-- STEP 4: CREATE NEW TABLES
-- =========================

-- Drop old adherence_history if exists
DROP TABLE IF EXISTS adherence_history CASCADE;

-- Create new adherence_history table
CREATE TABLE adherence_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  total_medications INT,
  taken_medications INT,
  adherence_percentage NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_adherence_user_date ON adherence_history(user_id, date);

-- Create caregivers table
CREATE TABLE caregivers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  caregiver_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status caregiver_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_caregivers_patient ON caregivers(patient_id);
CREATE INDEX idx_caregivers_caregiver ON caregivers(caregiver_id);

-- Update payments table
ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS status payment_status;

CREATE INDEX idx_payments_user ON payments(user_id);
