import { getSupabaseServiceRoleClient } from './supabase-client.js';

export async function loginAndGetRole(email, password){
   const supabaseClient = getSupabaseServiceRoleClient();
    
    console.log(`Attempting to log in user: ${email}...`);

    const {data: employeeData, error}=await supabaseClient
        .from('employee')
        .select('employeeid, role, password')
        .eq('email', email)
        .single();

    if (error) {
        console.log(`SUPABASE QUERY ERROR:`, error.message);
    }

    if (error || !employeeData){
        console.error("Login failed: Invalid credentials or user not found");
        return null;
    }

    const {employeeid, role, password: dbPassword}=employeeData;

    console.log(`\n--- DEBUGGING CREDENTIALS ---`);
    console.log(`Provided Email: ${email}`);
    console.log(`DB Password (Length ${dbPassword.length}): [${dbPassword}]`); 
    console.log(`Input Password (Length ${password.length}): [${password}]`);
    console.log(`-----------------------------`);
    
   if (password !==dbPassword){
        console.error("Login failed: Incorrect password");
        return null;
    }

    console.log(`Login successful for Employee ID: ${employeeid}. Role: ${role.toUpperCase()}`);
    return {employeeid, role}; 
}