import { getSupabaseServiceRoleClient } from "../../library/supabase-client.js";

const addEmployeeAction = async (
  session,
  email,
  name,
  password,
  role,
  routingnumber
) => {
  const supabaseClient = getSupabaseServiceRoleClient();


      if (!email || !name || !password || !role || !routingnumber) {
        console.log("Usage: add-employee <email> <name> <password> <role> <routingnumber>");
        return;
    }

  const newData = {};

  const regexEmail = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  if (!regexEmail.test(email)) {
    console.error(`Error: Invalid Email.`);
    return;
  }
  const finalEmail = email;
  if (name.length < 0) {
    console.error(`Error: Invalid Name`);
    return;
  }
  const finalName = name;
  if (password.toString().length < 0) {
    console.error(`Error: Invalid Password`);
    return;
  }
  const finalPassword = password;
  const validRoles = ["owner", "employee"];
  if (!validRoles.includes(role)) {
    console.error(
      `Error: Invalid role role. Must be one of: ${validRoles.join(", ")}.`
    );
  }
  const finalRole = role;
  const stringRoutingNumber = parseInt(routingnumber);
  if (
    isNaN(stringRoutingNumber) ||
    stringRoutingNumber.toString().length !== 9
  ) {
    console.error("Error: Routing Number must be 9 digits long.");
    return;
  }
  const finalRoutingNumber = stringRoutingNumber;

  newData["email"] = finalEmail;
  newData["name"] = finalName;
  newData["password"] = finalPassword;
  newData["role"] = finalRole;
  newData["routingnumber"] = finalRoutingNumber;

  console.log(`[${session.role.toUpperCase()}] Adding new Employee ${name}...`);

  const { data, error } = await supabaseClient
    .from("employee")
    .insert([newData])
    .select();

  const newID = data[0].employeeid;

  if (error) {
    console.error(`ERROR updating Employee: ${error.message}`);
  } else {
    console.log(`Employee ${name} has added successfully with id ${newID}!`);
  }
};
export default {
  name: "add-employee",
  description: "Used to add employee into the database.",
  action: addEmployeeAction,
};
