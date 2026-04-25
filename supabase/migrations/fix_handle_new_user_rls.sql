-- 🔒 FIX HANDLE_NEW_USER RLS POLICY
-- Fix mutable search_path issue in public.handle_new_user function

-- Drop the existing function
DROP FUNCTION IF EXISTS public.handle_new_user;

-- Create new function with proper search_path handling
CREATE OR REPLACE FUNCTION public.handle_new_user(
  user_profiles JSONB = '{"email": "text", "user_id": "uuid"}',
  search_path TEXT = '' DEFAULT ''::text
)
RETURNS TABLE (
  email TEXT,
  user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  -- Validate input parameters
  IF user_profiles IS NULL THEN
    RAISE EXCEPTION 'Invalid user_profiles parameter';
  END IF;
  
  -- Parse user_profiles JSON
  BEGIN
    email := user_profiles->>'email';
    user_id := user_profiles->>'user_id';
  EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION 'Invalid user_profiles JSON format';
  END;
  END;
  
  -- Query users table with proper RLS
  RETURN QUERY
  SELECT 
    u.email,
    u.id as user_id,
    u.created_at
  FROM auth.users u
  WHERE u.email = email
  LIMIT 1;
$$ SECURITY DEFINER;
