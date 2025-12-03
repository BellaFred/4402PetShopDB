import { getSupabaseServiceRoleClient } from '../../library/supabase-client.js';

const SUPPORTED_FIELDS = [
    'species', 'breed', 'name', 'age', 'gender', 'isfixed', 
    'generaldescription', 'healthinfo', 'adoptionfee', 'adoptionstatus'
];


const updatePetAction = async (session, petid, field, value) => {
   const supabaseClient = getSupabaseServiceRoleClient();
    
    if (!petid || !field || !value) {
        console.log("Usage: update-pet <pet_id> <field> <new_value>");
        console.log(`Supported fields: ${SUPPORTED_FIELDS.join(', ')}`);
        return;
    }

    const updateData = {};
    const lowerField = field.toLowerCase();
    const id = parseInt(petid);

    if (isNaN(id) || id <= 0) {
        console.error(`Error: Pet ID must be a positive number.`);
        return;
    }
    if (!SUPPORTED_FIELDS.includes(lowerField)) {
        console.error(`Error: Field '${field}' is not a supported field for updates.`);
        return;
    }
    
    let finalValue = value;

    
    if (lowerField === 'age') {
        const numericAge = parseInt(value);
        if (isNaN(numericAge) || numericAge < 0) {
            console.error(`Error: Age must be a non-negative integer.`);
            return;
        }
        finalValue = numericAge;
        
    } else if (lowerField === 'adoptionfee') {
        const fee = parseFloat(value);
        if (isNaN(fee) || fee < 0) {
            console.error(`Error: Adoption fee must be a non-negative number.`);
            return;
        }
        finalValue = fee;
        
    } else {
        if (lowerField === 'species' || lowerField === 'gender' || lowerField === 'isfixed' || lowerField === 'adoptionstatus') {
            finalValue = value.toLowerCase();
        } else {
             finalValue = value;
        }

        if (lowerField === 'species') {
            const validSpecies = ['cat', 'dog', 'fish', 'bird'];
            if (!validSpecies.includes(finalValue)) {
                console.error(`Error: Invalid species '${value}'. Must be one of: ${validSpecies.join(', ')}.`);
                return;
            }
        } else if (lowerField === 'gender') {
            const validGenders = ['female', 'male', 'undetermined'];
            if (!validGenders.includes(finalValue)) {
                console.error(`Error: Invalid gender '${value}'. Must be one of: ${validGenders.join(', ')}.`);
                return;
            }
        } else if (lowerField === 'isfixed') {
            const validFixedStatus = ['yes', 'no', 'n/a'];
            if (!validFixedStatus.includes(finalValue)) {
                console.error(`Error: Invalid status '${value}'. Must be one of: ${validFixedStatus.join(', ')}.`);
                return;
            }
        } else if (lowerField === 'adoptionstatus') {
            const validAdoptionStatus = ['unadopted', 'adopted']; 
            if (!validAdoptionStatus.includes(finalValue)) {
                console.error(`Error: Invalid status '${value}'. Must be one of: ${validAdoptionStatus.join(', ')}.`);
                return;
            }
        }
        
        if (typeof finalValue === 'string' && finalValue.trim().length === 0) {
             console.error(`Error: Value for field '${field}' cannot be empty.`);
             return;
        }
    }
    
    updateData[field] = finalValue; 

    console.log(`[${session.role.toUpperCase()}] Updating Pet ID ${id} set ${field} to ${finalValue}...`);

    const { data, error } = await supabaseClient
        .from('pet') 
        .update(updateData)
        .eq('petid', id)
        .select(`petid, ${lowerField}`); 

    if (error) {
        console.error(`ERROR updating Pet: ${error.message}`);
    } else if (data.length === 0) {
        console.log(`Pet ID ${id} not found.`);
    } else {
        console.log(`Pet ID ${id} updated successfully! New ${field}: ${data[0][lowerField]}`);
    }
};

export default {
    name: 'update-pet',
    description: 'Update the attributes for a pet.',
    action: updatePetAction
};