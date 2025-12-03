import { createClient } from '@supabase/supabase-js';

let supabaseClient = null;
let supabaseServiceRoleClient = null;


export const getSupabaseClient = () => {
    const url = process.env.SUPABASE_URL;
    const anonKey = process.env.SUPABASE_ANON_KEY; 

    if (!url || !anonKey) {
        throw new Error("FATAL: SUPABASE_URL or SUPABASE_ANON_KEY is missing. Check your .env file.");
    }
    
   if (!supabaseClient) {
        supabaseClient = createClient(url, anonKey);
    }
    return supabaseClient;
};

export const getSupabaseServiceRoleClient = () => {
   const url = process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; 

    if (!url || !serviceKey) {
        throw new Error("FATAL: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing. Check your .env file.");
    }

    if (!supabaseServiceRoleClient) {
        supabaseServiceRoleClient = createClient(url, serviceKey, {
            auth: {
                persistSession: false, 
            }
        });
    }
    return supabaseServiceRoleClient;
};