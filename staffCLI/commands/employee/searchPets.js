import { getSupabaseServiceRoleClient } from "../../library/supabase-client.js";

const SUPPORTED_SEARCH_FIELDS = [
    'petid', 'species', 'breed', 'name', 'age', 'gender', 
    'isfixed', 'adoptionfee', 'adoptionstatus'
];

const searchPetsAction = async (session, ...filters) => {
    const supabaseClient = getSupabaseServiceRoleClient();
    
    if (filters.length === 0) {
        console.log("Usage: search-pets <field1> <value1> [<field2> <value2> ...]");
        console.log("To search for multiple values (OR), use a comma: species cat,dog");
        console.log(`Supported fields: ${SUPPORTED_SEARCH_FIELDS.join(', ')}`);
        return;
    }
    if (filters.length % 2 !== 0) {
        console.error("Error: Must provide an even number of arguments (alternating field and value pairs).");
        return;
    }

    const searchCriteria = [];
    let query = supabaseClient.from("pet").select("*");

    for (let i = 0; i < filters.length; i += 2) {
        const field = filters[i];
        const value = filters[i + 1];

        const lowerField = field.toLowerCase();
        
        if (!SUPPORTED_SEARCH_FIELDS.includes(lowerField)) {
            console.error(`Error: Field '${field}' is not a supported search field. Skipping this filter.`);
            continue;
        }
        const isMultiValue = value.includes(',');
        
        let rawValues;
        if (isMultiValue) {
            rawValues = value.split(',').map(v => v.trim()).filter(v => v.length > 0);
        } else {
            rawValues = [value];
        }

        let successfullyParsedValues = [];
        let isValidFilter = true;

        for (const val of rawValues) {
            let preparedVal;
            
            if (lowerField === 'petid' || lowerField === 'age') {
                const numericValue = parseInt(val);
                if (isNaN(numericValue) || numericValue < 0) {
                    console.error(`Error: Value '${val}' for ${field} must be a non-negative integer. Skipping this filter.`);
                    isValidFilter = false;
                    break;
                }
                preparedVal = numericValue;
            } else if (lowerField === 'adoptionfee') {
                const fee = parseFloat(val);
                if (isNaN(fee) || fee < 0) {
                    console.error(`Error: Value '${val}' for ${field} must be a non-negative number. Skipping this filter.`);
                    isValidFilter = false;
                    break;
                }
                preparedVal = fee;
            } else {
                preparedVal = val.toLowerCase();
            }
            successfullyParsedValues.push(preparedVal);
        }

        if (!isValidFilter) {
            continue; 
        }
        
        if (isMultiValue) {
            searchCriteria.push(`${lowerField} IN ("${successfullyParsedValues.join('", "')}")`);
            query = query.in(lowerField, successfullyParsedValues);
        } else {
            const singleValue = successfullyParsedValues[0];
            searchCriteria.push(`${lowerField} = "${singleValue}"`);
            query = query.eq(lowerField, singleValue);
        }
    }
    
    if (searchCriteria.length === 0) {
        console.log("No valid search criteria were provided.");
        return;
    }

    console.log(`[${session.role.toUpperCase()}] Searching Pet table with criteria: ${searchCriteria.join(' AND ')}...`);

    const { data: pets, error } = await query;

    if (error) {
        console.error(`ERROR searching Pets: ${error.message}`);
        return;
    }

    if (pets.length === 0) {
        console.log(`\nNo pets found matching the criteria.`);
    } else {
        console.log(`\nFound ${pets.length} pet(s) matching the criteria:`);
        
        pets.forEach(pet => {
            console.log("-----------------------------------------");
            console.log(`ID: ${pet.petid} | Name: ${pet.name} | Status: ${pet.adoptionstatus}`);
            console.log(`Species: ${pet.species} | Breed: ${pet.breed || 'N/A'}`);
            console.log(`Age: ${pet.age} | Gender: ${pet.gender} | Fixed: ${pet.isfixed}`);
            console.log(`Fee: $${pet.adoptionfee.toFixed(2)}`);
        });
        console.log("-----------------------------------------");
    }
};

export default {
    name: "search-pets",
    description: "Retrieves pet records matching a field/value criteria.",
    action: searchPetsAction,
};