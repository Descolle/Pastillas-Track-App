-- =========================
-- STEP 1: ADD NEW ENUMS
-- =========================

-- Create new enum types
CREATE TYPE intake_status AS ENUM ('taken', 'missed', 'late');
CREATE TYPE caregiver_status AS ENUM ('pending', 'accepted', 'rejected');
CREATE TYPE payment_status AS ENUM ('active', 'cancelled', 'expired');
