-- 🔒 FIX SCHEDULES RLS POLICY
-- Replace overly permissive policy with proper user-specific access

-- First, drop the existing policy
DROP POLICY IF EXISTS "Enable read access for all users" ON schedules;

-- Create proper RLS policy that only allows users to access their own schedules
CREATE POLICY "Users can only access their own schedules" ON schedules
FOR ALL USING (
  -- User can only read their own schedules
  (auth.uid() = user_id)
);

-- Grant permission to execute the policy
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
