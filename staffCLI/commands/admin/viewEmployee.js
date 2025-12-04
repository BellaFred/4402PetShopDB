import { getSupabaseServiceRoleClient } from "../../library/supabase-client.js";

const viewEmployeeAction = async (session, employeeID) => {
  const supabaseClient = getSupabaseServiceRoleClient();
  if (!employeeID) {
    console.log("Usage: view-employee <employee_id> ");
    return;
  }

  const id = parseInt(employeeID);
  if (isNaN(id) || id <= 0) {
    console.error(` Error: Employee ID must be a positive number.`);
    return;
  }

  console.log(`[${session.role.toUpperCase()}] Searching Employee ID ${id}...`);

  let { data: employee, error } = await supabaseClient
    .from("employee")
    .select("*")
    .eq("employeeid", id);

  if (error) {
    console.error(`ERROR viewing Employee: ${error.message}`);
  } else if (employee[0] === undefined) {
    console.error(`Employee ID ${id} not found.`);
  } else {
    console.log(`
Employee ID:    ${id}\n
Name:           ${employee[0].name}\n
Mobile:         ${employee[0].mobile}\n
Email:          ${employee[0].email}\n
Password:       ${employee[0].password}\n
Address:        ${employee[0].address}\n
Salary:         ${employee[0].salary}\n
Role:           ${employee[0].role}\n
Routing Number: ${employee[0].routingnumber}
      `);
  }
};
export default {
  name: "view-employee",
  description: "Used to view information on an employee.",
  action: viewEmployeeAction,
};
