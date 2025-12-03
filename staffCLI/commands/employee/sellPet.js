
import { supabaseServiceRoleClient } from '../../library/supabase-client.js';

const sellPetAction = async (session, petID, customerID) => {
    if (!petID || !customerID) {
        console.log("Usage: sell-pet <pet_id> <customer_id>");
        return;
    }

    console.log(`[${session.role.toUpperCase()}] Processing sale of Pet ID ${petID} to Customer ID ${customerID}...`);

    try {
        let { data: pet, error: petError } = await supabaseServiceRoleClient
            .from('Pet')
            .select('adoptionFee, adoptionStatus')
            .eq('petID', petID)
            .single();

        if (petError || !pet) {
            console.error(`Error: Pet ID ${petID} not found.`);
            return;
        }
        if (pet.adoptionStatus !== 'Available') {
            console.error(`Error: Pet ID ${petID} is currently ${pet.adoptionStatus}. Cannot sell.`);
            return;
        }

        const orderData = {
            customerID: customerID,
            employeeid: session.employeeid, 
            orderDate: new Date().toISOString(),
            totalAmount: pet.adoptionFee,
        };
        const { data: order, error: orderError } = await supabaseServiceRoleClient
            .from('Order')
            .insert([orderData])
            .select('orderID')
            .single();

        if (orderError) throw new Error(orderError.message);
        const orderID = order.orderID;

        const { error: linkError } = await supabaseServiceRoleClient
            .from('OrderPet')
            .insert({ orderID: orderID, petID: petID });
        if (linkError) throw new Error(linkError.message);

        const { error: updateError } = await supabaseServiceRoleClient
            .from('Pet')
            .update({ adoptionStatus: 'Adopted' })
            .eq('petID', petID);
        if (updateError) throw new Error(updateError.message);
        
        console.log(`\n Transaction Complete!`);
        console.log(`   Order ID: ${orderID}`);
        console.log(`   Total Amount: $${pet.adoptionFee}`);
        console.log(`   Pet status updated to 'Adopted'.`);

    } catch (e) {
        console.error(`\n FATAL TRANSACTION ERROR: ${e.message}`);
    }
};

export default {
    name: 'sell-pet',
    description: 'Process the sale of a pet and update its status.',
    action: sellPetAction
};