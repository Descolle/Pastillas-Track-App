import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://eszbvlipbytljgalptmz.supabase.co";
const supabaseKey = "sb_publishable_qO6NB4as71nAebSEu8_DnQ_DPIq7gAD";

export const supabase = createClient(supabaseUrl, supabaseKey);
