import { getSupabaseServiceRoleClient } from "../../library/supabase-client.js";

const SUPPORTED_SEARCH_FIELDS = [
    'orderid', 'customerid', 'employeeid', 'paymentid', 'petid', 
    'orderdate', 'totalamount'
];

const searchOrdersAction = async (session, ...filters) => {
    const supabaseClient = getSupabaseServiceRoleClient();
    
    if (filters.length === 0) {
        console.log("Usage: search-orders <field1> <value1> [<field2> <value2> ...]");
        console.log("To search for multiple values (OR), use a comma: customerid ID1,ID2");
        console.log(`Supported fields: ${SUPPORTED_SEARCH_FIELDS.join(', ')}`);
        return;
    }
    if (filters.length % 2 !== 0) {
        console.error("Error: Must provide an even number of arguments (alternating field and value pairs).");
        return;
    }

    const searchCriteria = [];
    let query = supabaseClient.from("orderinfo").select("*"); 

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
            
            if (lowerField === 'totalamount') {
                const numericValue = parseFloat(val);
                if (isNaN(numericValue) || numericValue < 0) {
                    console.error(`Error: Value '${val}' for ${field} must be a non-negative number. Skipping this filter.`);
                    isValidFilter = false;
                    break;
                }
                preparedVal = numericValue;
            } else {
                preparedVal = val;
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

    console.log(`[${session.role.toUpperCase()}] Searching OrderInfo table with criteria: ${searchCriteria.join(' AND ')}...`);

    const { data: orders, error } = await query;

    if (error) {
        console.error(`ERROR searching Orders: ${error.message}`);
        return;
    }

    if (orders.length === 0) {
        console.log(`\nNo orders found matching the criteria.`);
    } else {
        console.log(`\nFound ${orders.length} order(s) matching the criteria:`);
        
        orders.forEach(order => {
            console.log("-----------------------------------------");
            console.log(`Order ID: ${order.orderid} | Date: ${order.orderdate}`);
            console.log(`Customer ID: ${order.customerid} | Employee ID: ${order.employeeid}`);
            console.log(`Pet ID: ${order.petid} | Total Amount: $${order.totalamount ? order.totalamount.toFixed(2) : '0.00'}`);
        });
        console.log("-----------------------------------------");
    }
};

export default {
    name: "search-orders",
    description: "Retrieves order records matching multiple criteria.",
    action: searchOrdersAction,
};