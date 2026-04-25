-- =========================
-- STEP 6: FIX RLS POLICIES FOR NEW SCHEMA
-- =========================

-- Drop existing intakes RLS policies
DROP POLICY IF EXISTS "Users can view their own intakes" ON intakes;
DROP POLICY IF EXISTS "Users can insert their own intakes" ON intakes;
DROP POLICY IF EXISTS "Users can update their own intakes" ON intakes;
DROP POLICY IF EXISTS "Users can delete their own intakes" ON intakes;

-- Create new RLS policies for intakes table (new schema)
CREATE POLICY "Users can view their own intakes" ON intakes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM schedules s
      JOIN medications m ON m.id = s.medication_id
      WHERE s.id = intakes.schedule_id AND m.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own intakes" ON intakes
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM schedules s
      JOIN medications m ON m.id = s.medication_id
      WHERE s.id = intakes.schedule_id AND m.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own intakes" ON intakes
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM schedules s
      JOIN medications m ON m.id = s.medication_id
      WHERE s.id = intakes.schedule_id AND m.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own intakes" ON intakes
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM schedules s
      JOIN medications m ON m.id = s.medication_id
      WHERE s.id = intakes.schedule_id AND m.user_id = auth.uid()
    )
  );

-- Fix schedules RLS policy to work with new user_id column
DROP POLICY IF EXISTS "Users can view their own schedules" ON schedules;
DROP POLICY IF EXISTS "Users can insert their own schedules" ON schedules;
DROP POLICY IF EXISTS "Users can update their own schedules" ON schedules;
DROP POLICY IF EXISTS "Users can delete their own schedules" ON schedules;

CREATE POLICY "Users can view their own schedules" ON schedules
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own schedules" ON schedules
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own schedules" ON schedules
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own schedules" ON schedules
  FOR DELETE USING (user_id = auth.uid());
