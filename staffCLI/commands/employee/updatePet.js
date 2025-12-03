

import { supabaseServiceRoleClient } from '../../library/supabase-client.js';

const SUPPORTED_FIELDS = [
    'species', 'breed', 'name', 'age', 'gender', 'isfixed', 
    'generaldescription', 'healthinfo', 'adoptionfee', 'adoptionstatus'
];

const updatePetAction = async (session, petID, field, value) => {
    
    if (!petID || !field || !value) {
        console.log("Usage: update-pet <pet_id> <field> <new_value>");
        console.log(`Supported fields: ${SUPPORTED_FIELDS.join(', ')}`);
        return;
    }

    const updateData = {};
    const lowerField = field.toLowerCase();
    const id = parseInt(petID);

    if (isNaN(id) || id <= 0) {
        console.error(` Error: Pet ID must be a positive number.`);
        return;
    }
    if (lowerField === 'adoptionstatus') {
        const validStatuses = ['available', 'on hold', 'adopted'];
        if (!validStatuses.includes(value.toLowerCase())) {
            console.error(`Error: Invalid status '${value}'. Must be one of: Available, On Hold, Adopted.`);
            return;
        }
        
        updateData.adoptionStatus = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase(); 
    } else if (lowerField === 'adoptionfee') {
        const fee = parseFloat(value);
        if (isNaN(fee) || fee <= 0) {
            console.error(`Error: Adoption fee must be a positive number.`);
            return;
        }
        updateData.adoptionFee = fee;
    } else {
        console.error(`Error: Field '${field}' is not supported for updates. Supported: adoptionStatus, adoptionFee.`);
        return;
    }

    console.log(`[${session.role.toUpperCase()}] Updating Pet ID ${petID} set ${field} to ${value}...`);

 
    const { data, error } = await supabaseServiceRoleClient
        .from('Pet') 
        .update(updateData)
        .eq('petID', petID)
        .select();

    if (error) {
        console.error(`ERROR updating Pet: ${error.message}`);
    } else if (data.length === 0) {
        console.log(`Pet ID ${petID} not found.`);
    } else {
        console.log(`Pet ID ${petID} updated successfully! New ${field}: ${data[0][lowerField]}`);
    }
};

export default {
    name: 'update-pet',
    description: 'Update the status (Available/On Hold/Adopted) or the adoption fee for a pet.',
    action: updatePetAction
};