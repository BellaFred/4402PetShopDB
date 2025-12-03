import { getSupabaseServiceRoleClient } from "../../library/supabase-client.js";

const removeEmployeeAction = async (session, employeeID) => {
  const supabaseClient = getSupabaseServiceRoleClient();
  if (!employeeID) {
    console.log("Usage: remove-employee <employee_id> ");
    return;
  }

  const id = parseInt(employeeID);

  console.log(`[${session.role.toUpperCase()}] Deleteing Employee ID ${id}...`);

  const { error } = await supabaseClient
    .from("employee")
    .delete()
    .eq("employeeid", id);

  if (error) {
    console.error(`ERROR deleting Employee: ${error.message}`);
  } else {
    console.log(`Employee ID ${id} deleted successfully!`);
  }
};
export default {
  name: "remove-employee",
  description: "Used to remove employee from the database.",
  action: removeEmployeeAction,
};
