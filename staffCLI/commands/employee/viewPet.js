import { getSupabaseServiceRoleClient } from "../../library/supabase-client.js";

const viewPetAction = async (session, petID) => {
    const supabaseClient = getSupabaseServiceRoleClient();
    
    if (!petID) {
        console.log("Usage: view-pet <pet_id>");
        return;
    }

    const id = parseInt(petID);

    if (isNaN(id) || id <= 0) {
        console.error(`Error: Pet ID must be a positive number.`);
        return;
    }

    console.log(`[${session.role.toUpperCase()}] Retrieving Pet ID ${id}...`);

    const { data: pet, error } = await supabaseClient
        .from("pet")
        .select("*")
        .eq("petid", id)
        .single(); 

    if (error) {
        if (error.code === 'PGRST116') { 
            console.log(`\nPet ID ${id} not found.`);
        } else {
            console.error(`ERROR retrieving Pet: ${error.message}`);
        }
        return;
    }

    console.log(`\nPet Details (ID: ${pet.petid}):`);
    console.log("=========================================");
    console.log(`Name: ${pet.name}`);
    console.log(`Species: ${pet.species}`);
    console.log(`Breed: ${pet.breed || 'N/A'}`);
    console.log(`Age: ${pet.age} years`);
    console.log(`Gender: ${pet.gender}`);
    console.log(`Fixed: ${pet.isfixed}`);
    console.log(`Fee: $${pet.adoptionfee.toFixed(2)}`);
    console.log(`Status: ${pet.adoptionstatus.toUpperCase()}`);
    console.log("-----------------------------------------");
    console.log(`Description: ${pet.generaldescription || 'No general description provided.'}`);
    console.log(`Health Info: ${pet.healthinfo || 'No health information provided.'}`);
    console.log("=========================================");
};

export default {
    name: "view-pet",
    description: "Retrieves and displays the full record for a single pet ID.",
    action: viewPetAction,
};