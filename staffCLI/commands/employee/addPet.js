import inquirer from 'inquirer';
import { getSupabaseServiceRoleClient } from '../../library/supabase-client.js';


const checkValidValue = (value, validOptions, fieldName) => {
    if (value === '') return true;
    const lowerValue = value.toLowerCase();
    if (!validOptions.includes(lowerValue)) {
        return `Error: Invalid ${fieldName} '${value}'. Must be one of: ${validOptions.join(', ')}.`;
    }
    return true;
};


const addPetAction = async () => {
    console.log('--- New Pet Intake ---');
    console.log('Please provide the details for the pet. All fields are required unless noted.');

    const questions = [
        {
            type: 'input',
            name: 'name',
            message: 'Name:',
            validate: value => (value.trim() ? true : 'Name is required.')
        },
        {
            type: 'input',
            name: 'species',
            message: 'Species (Dog, Cat, Fish, Bird):',
            validate: (value) => {
                const validSpecies = ['cat', 'dog', 'fish', 'bird'];
                return checkValidValue(value, validSpecies, 'species');
            }
        },
        {
            type: 'input',
            name: 'gender',
            message: 'Gender (Male, Female, Unknwn (Unknown)):', 
            validate: (value) => {
                const validGenders = ['female', 'male', 'unknwn'];
                return checkValidValue(value, validGenders, 'gender');
            }
        },
        {
            type: 'input',
            name: 'isfixed',
            message: 'Is Fixed? (Yes, No, N/A):',
            validate: (value) => {
                const validFixedStatus = ['yes', 'no', 'n/a'];
                return checkValidValue(value, validFixedStatus, 'fixed status');
            }
        },
        {
            type: 'input',
            name: 'adoptionStatus',
            message: 'Adoption Status (Unadopted, Adopted):',
            validate: (value) => {
                const validAdoptionStatus = ['unadopted', 'adopted']; 
                return checkValidValue(value, validAdoptionStatus, 'adoption status');
            }
        },
        {
            type: 'input',
            name: 'age',
            message: 'Age (Years):',
            validate: (value) => {
                const pass = !isNaN(parseFloat(value)) && isFinite(value) && parseFloat(value) >= 0;
                return (value === '' || pass) ? true : 'Please enter a valid non-negative number for age.';
            }
        },
        {
            type: 'input',
            name: 'adoptionFee',
            message: 'Adoption Fee (USD):',
            validate: (value) => {
                const pass = !isNaN(parseFloat(value)) && isFinite(value) && parseFloat(value) >= 0;
                return (value === '' || pass) ? true : 'Please enter a valid non-negative number for the adoption fee.';
            }
        },
        { type: 'input', name: 'breed', message: 'Breed (Optional):' },
        { type: 'input', name: 'generalDescription', message: 'General Description (Optional, 100 chars max):' },
        { type: 'input', name: 'healthInfo', message: 'Health Info (Optional, 9 chars max):' },
    ];

    try {
        const answers = await inquirer.prompt(questions);

        const petPayload = {
            name: answers.name?.trim()?.toLowerCase() || null,
            species: answers.species?.trim()?.toLowerCase() || null,
            gender: answers.gender?.trim()?.toLowerCase() || null,

            isfixed: answers.isfixed?.trim()?.toLowerCase() || 'n/a', 
            
            adoptionstatus: answers.adoptionStatus?.trim()?.toLowerCase() || 'unadopted',

            age: parseInt(answers.age || '0'), 
            adoptionfee: parseFloat(answers.adoptionFee || '0.0'),
            
            breed: answers.breed?.trim() || null,
            generaldescription: answers.generalDescription?.trim() || null, 
            healthinfo: answers.healthInfo?.trim() || null,
        };

        const supabaseClient = getSupabaseServiceRoleClient();

        console.log('\n--- Pet Data Ready ---');
        console.log(petPayload);
        
        const { data: petResultData, error: petError } = await supabaseClient
            .from('pet') 
            .insert([petPayload])
            .select('petid, name') 
            .single();

        if (petError) {
            console.error(`\nERROR inserting Pet: ${petError.message}`);
            if (petError.message.includes('value too long')) {
                 console.log("\nTIP: The error above strongly suggests that the input for 'healthinfo' (max 9 chars) or 'generaldescription' (max 100 chars) was too long, or the 'gender' field was not entered as 'female', 'male', or 'unknwn'.");
            }
            return;
        }

        console.log(`\nSuccess! New pet **${petResultData.name}** added.`);
        console.log(`Pet ID: ${petResultData.petid}`);

    } catch (error) {
        if (error.isTtyError) {
             console.log('\nInput session canceled.');
        } else {
            console.error('\nAn unexpected error occurred during the process:', error.message);
        }
    }
};

export default {
    name: 'add-pet',
    description: 'Add a new pet record to the database.',
    action: addPetAction
};