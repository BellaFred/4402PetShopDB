import { getSupabaseServiceRoleClient } from "../../library/supabase-client.js";

const deletePetAction = async (session, petID) => {
    const supabaseClient = getSupabaseServiceRoleClient();
    
    if (!petID) {
        console.log("Usage: delete-pet <pet_id>");
        return;
    }

    const id = parseInt(petID);

    if (isNaN(id) || id <= 0) {
        console.error(`Error: Pet ID must be a positive number.`);
        return;
    }

    console.log(`[${session.role.toUpperCase()}] Deleting Pet ID ${id}...`);

    const { error, count } = await supabaseClient
        .from("pet")
        .delete()
        .eq("petid", id);

    if (error) {
        console.error(`ERROR deleting Pet: ${error.message}`);
    } else if (count === 0) {
        console.log(`Pet ID ${id} not found. No pet records were deleted.`);
    } else {
        console.log(`Pet ID ${id} deleted successfully!`);
    }
};

export default {
    name: "delete-pet",
    description: "Used to delete a pet record from the database.",
    action: deletePetAction,
};