import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://TU_PROJECT.supabase.co";
const supabaseKey = "TU_ANON_KEY";

export const supabase = createClient(supabaseUrl, supabaseKey);
