import { getSupabaseServiceRoleClient } from "../../library/supabase-client.js";

const SUPPORTED_SEARCH_FIELDS = [
    'customerid', 'name', 'mobile', 'email', 'address'
];

const searchCustomersAction = async (session, ...filters) => {
    const supabaseClient = getSupabaseServiceRoleClient();
    
    if (filters.length === 0) {
        console.log("Usage: search-customers <field1> <value1> [<field2> <value2> ...]");
        console.log("To search for multiple values (OR), use a comma: customerid ID1,ID2");
        console.log(`Supported fields: ${SUPPORTED_SEARCH_FIELDS.join(', ')}`);
        return;
    }
    if (filters.length % 2 !== 0) {
        console.error("Error: Must provide an even number of arguments (alternating field and value pairs).");
        return;
    }

    const searchCriteria = [];
    let query = supabaseClient.from("customer").select("*");

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
            successfullyParsedValues.push(val); 
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

    console.log(`[${session.role.toUpperCase()}] Searching Customer table with criteria: ${searchCriteria.join(' AND ')}...`);

    const { data: customers, error } = await query;

    if (error) {
        console.error(`ERROR searching Customers: ${error.message}`);
        return;
    }

    if (customers.length === 0) {
        console.log(`\nNo customers found matching the criteria.`);
    } else {
        console.log(`\nFound ${customers.length} customer(s) matching the criteria:`);
        
        customers.forEach(customer => {
            console.log("-----------------------------------------");
            console.log(`ID: ${customer.customerid} | Name: ${customer.name}`);
            console.log(`Mobile: ${customer.mobile} | Email: ${customer.email}`);
            console.log(`Address: ${customer.address}`);
        });
        console.log("-----------------------------------------");
    }
};

export default {
    name: "search-customers",
    description: "Retrieves customer records matching multiple criteria.",
    action: searchCustomersAction,
};