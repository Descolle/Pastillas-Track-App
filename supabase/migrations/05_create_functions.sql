-- =========================
-- STEP 5: CREATE FUNCTIONS AND TRIGGERS
-- =========================

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create new handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create adherence calculation function
CREATE OR REPLACE FUNCTION calculate_daily_adherence(p_user_id UUID, p_date DATE)
RETURNS VOID AS $$
DECLARE
  total INT;
  taken INT;
BEGIN
  -- Count total expected medications for the day
  SELECT COUNT(*) INTO total
  FROM schedules
  WHERE user_id = p_user_id;

  -- Count taken medications
  SELECT COUNT(*) INTO taken
  FROM intakes i
  JOIN schedules s ON s.id = i.schedule_id
  WHERE s.user_id = p_user_id
    AND DATE(i.taken_at) = p_date
    AND i.status = 'taken';

  -- Insert into adherence history
  INSERT INTO adherence_history (
    user_id,
    date,
    total_medications,
    taken_medications,
    adherence_percentage
  )
  VALUES (
    p_user_id,
    p_date,
    total,
    taken,
    CASE WHEN total = 0 THEN 0 ELSE (taken::NUMERIC / total) * 100 END
  );
END;
$$ LANGUAGE plpgsql;
