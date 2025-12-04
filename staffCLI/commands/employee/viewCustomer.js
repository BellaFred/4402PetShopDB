import { getSupabaseServiceRoleClient } from "../../library/supabase-client.js";

const viewCustomerAction = async (session, customerID) => {
    const supabaseClient = getSupabaseServiceRoleClient();
    
    if (!customerID) {
        console.log("Usage: view-customer <customer_id>");
        return;
    }

    const id = customerID; 

    if (typeof id !== 'string' || id.trim().length === 0) {
        console.error(`Error: Customer ID must be a non-empty string.`);
        return;
    }

    console.log(`[${session.role.toUpperCase()}] Retrieving Customer ID ${id}...`);

    const { data: customer, error } = await supabaseClient
        .from("customer") 
        .select("customerid, name, mobile, email, address")
        .eq("customerid", id)
        .single(); 

    if (error) {
        if (error.code === 'PGRST116') { 
            console.log(`\nCustomer ID ${id} not found.`);
        } else {
            console.error(`ERROR retrieving Customer: ${error.message}`);
        }
        return;
    }

    console.log(`\nCustomer Details (ID: ${customer.customerid}):`);
    console.log("=========================================");
    console.log(`Name: ${customer.name}`);
    console.log(`Mobile: ${customer.mobile}`);
    console.log(`Email: ${customer.email}`);
    console.log(`Address: ${customer.address}`);
    console.log("=========================================");
};

export default {
    name: "view-customer",
    description: "Retrieves and displays the full record for a single customer ID.",
    action: viewCustomerAction,
};