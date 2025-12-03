
import { createClient } from '@supabase/supabase-js';



const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;


if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("FATAL: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing. Check your .env file.");
}


export const supabaseServiceRoleClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
        persistSession: false, 
    }
});