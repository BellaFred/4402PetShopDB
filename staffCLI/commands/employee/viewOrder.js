import { getSupabaseServiceRoleClient } from "../../library/supabase-client.js";

const viewOrderAction = async (session, orderID) => {
    const supabaseClient = getSupabaseServiceRoleClient();
    
    if (!orderID) {
        console.log("Usage: view-order <order_id>");
        return;
    }

    const id = orderID; 

    if (typeof id !== 'string' || id.trim().length === 0) {
        console.error(`Error: Order ID must be a non-empty string.`);
        return;
    }

    console.log(`[${session.role.toUpperCase()}] Retrieving Order ID ${id}...`);

    const { data: order, error } = await supabaseClient
        .from("orderinfo") 
        .select("*")
        .eq("orderid", id)
        .single(); 

    if (error) {
        if (error.code === 'PGRST116') { 
            console.log(`\nOrder ID ${id} not found.`);
        } else {
            console.error(`ERROR retrieving Order: ${error.message}`);
        }
        return;
    }

    console.log(`\nOrder Details (ID: ${order.orderid}):`);
    console.log("=========================================");
    console.log(`Date: ${order.orderdate}`);
    console.log(`Total Amount: $${order.totalamount ? order.totalamount.toFixed(2) : '0.00'}`);
    console.log("--- Associated IDs ---");
    console.log(`Customer ID: ${order.customerid}`);
    console.log(`Employee ID: ${order.employeeid}`);
    console.log(`Pet ID: ${order.petid}`);
    console.log(`Payment ID: ${order.paymentid}`);
    console.log("=========================================");
};

export default {
    name: "view-order",
    description: "Retrieves and displays the full record for a single order ID.",
    action: viewOrderAction,
};