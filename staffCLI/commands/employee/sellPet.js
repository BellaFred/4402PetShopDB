import { getSupabaseServiceRoleClient } from '../../library/supabase-client.js';

const sellPetAction = async (session, petid, customerid, paymentid) => {
    const supabaseClient = getSupabaseServiceRoleClient();
    
    if (!petid || !customerid || !paymentid) {
        console.log("Usage: sell-pet <pet_id> <customer_id> <payment_id>");
        return;
    }

    const employeeid = session.employeeid || session.employeeID || session.id || session.uid; 
    
    if (!employeeid) {
        console.error("Error: Employee ID not found in session. Please ensure you are logged in correctly.");
        return;
    }

    const numericRegex = /^[1-9]\d*$/; 
    
    if (!numericRegex.test(petid)) {
        console.error(`Error: Pet ID '${petid}' must be a positive number.`);
        return;
    }
    if (!numericRegex.test(customerid)) {
        console.error(`Error: Customer ID '${customerid}' must be a positive number.`);
        return;
    }
    if (!numericRegex.test(paymentid)) {
        console.error(`Error: Payment ID '${paymentid}' must be a positive number.`);
        return;
    }

    const petId = petid; 
    const custId = customerid;
    const payId = paymentid;

    console.log(`[${session.role.toUpperCase()}] Initiating sale for Pet ID ${petId}...`);

    const { data: pet, error: petError } = await supabaseClient
        .from('pet')
        .select('adoptionfee, adoptionstatus')
        .eq('petid', petId) 
        .single();
    
    if (petError || !pet) {
        console.error(`ERROR: Could not find Pet ID ${petId}.`);
        if (petError) {
             console.error(` 	Supabase Query Error: ${petError.message}`);
        } else {
             console.error(` 	No record found in the database with petid = ${petId}.`);
        }
        return;
    }
    
    const totalAmount = parseFloat(pet.adoptionfee);

    if (pet.adoptionstatus.toLowerCase() !== 'unadopted') {
        console.error(`SALE REJECTED: Pet ID ${petId} is currently '${pet.adoptionstatus}'. Only 'unadopted' pets can be sold.`);
        return;
    }
    
    const orderDate = new Date().toISOString();

    const orderPayload = {
        customerid: custId,
        employeeid: employeeid, 
        paymentid: payId,
        petid: petId, 
        orderdate: orderDate,
        totalamount: totalAmount,
    };
    
    const { data: orderResultData, error: orderError } = await supabaseClient
        .from('orderinfo') 
        .insert([orderPayload])
        .select('orderid')
        .single();

    if (orderError) {
        console.error(`ERROR inserting Order: ${orderError.message}`);
        console.log(` 	  (Check if Customer ID ${custId} or Payment ID ${payId} exist.)`);
        return;
    }
    
    const newOrderID = orderResultData.orderid; 
    console.log(` 	Order created successfully (ID: ${newOrderID}).`);

    const { error: updateError } = await supabaseClient
        .from('pet') 
        .update({ adoptionstatus: 'adopted' })
        .eq('petid', petId); 
    
    if (updateError) {
        console.error(`WARNING: Order was created, but failed to update Pet status! Order ID: ${newOrderID}`);
        console.error(` 	Update Error: ${updateError.message}`);
    } else {
        console.log(`SALE COMPLETE! Pet ID ${petId} is now 'adopted'.`);
        console.log(` 	Order Details: ID ${newOrderID} for $${totalAmount.toFixed(2)}.`);
    }
};

export default {
    name: 'sell-pet',
    description: 'Records a pet sale (adoption) by creating an ORDERINFO record and updating the pet status.',
    action: sellPetAction
};