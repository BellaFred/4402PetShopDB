import { getSupabaseServiceRoleClient } from "../../library/supabase-client.js";

const SUPPORTED_FIELDS = [
  "name",
  "mobile",
  "email",
  "password",
  "address",
  "salary",
  "role",
  "routingnumber",
];

const updateEmployeeAction = async (session, employeeID, field, value) => {
  const supabaseClient = getSupabaseServiceRoleClient();
  if (!employeeID || !field || !value) {
    console.log("Usage: update-employee <employee_id> <field> <new_value>");
    console.log(`Supported fields: ${SUPPORTED_FIELDS.join(", ")}`);
    return;
  }

  const updateData = {};
  const lowerField = field.toLowerCase();
  const id = parseInt(employeeID);

  if (isNaN(id) || id <= 0) {
    console.error(` Error: Employee ID must be a positive number.`);
    return;
  }
  if (!SUPPORTED_FIELDS.includes(lowerField)) {
    console.error(
      `Error: Field '${field}' is not a supported field for updates.`
    );
    return;
  }

  let finalValue = null;

  switch (lowerField) {
    case "mobile":
      const mobile = value;
      if (mobile.length() !== 9 || isNaN(mobile)) {
        console.error(`Error: Invalid Phone number.`);
        return;
      }
      finalValue = mobile;
      break;
    case "email":
      const email = value;
      const regexEmail = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      if (!regexEmail.test(email)) {
        console.error(`Error: Invalid Email.`);
        return;
      }
      finalValue = email;
      break;
    case "name":
    case "address":
      const stringValue = value.toString();
      if (stringValue.length < 0) {
        console.error(`Error: Invalid Password`);
        return;
      }
      let newString = stringValue.replace(/_/g," ");
      console.log(newString);
      finalValue = newString;
      break;
    case "password":
      const stringPassword = value;
      if (stringValue.toString().length < 0) {
        console.error(`Error: Invalid Password`);
        return;
      }
      finalValue = stringPassword;
      break;
    case "salary":
      const numericSalary = parseInt(value);
      if (isNaN(numericSalary) || numericSalary < 0) {
        console.error(`Error: Salary must be a non-negative integer.`);
        return;
      }
      finalValue = numericSalary;
      break;
    case "role":
      const validRoles = ["owner", "employee"];
      if (!validRoles.includes(value)) {
        console.error(
          `Error: Invalid role '${value}'. Must be one of: ${validRoles.join(
            ", "
          )}.`
        );
        break;
      }
      break;
    case "routingnumber":
      const stringRoutingNumber = parseInt(value);
      if (
        isNaN(stringRoutingNumber) ||
        stringRoutingNumber.toString().length !== 9
      ) {
        console.log(stringRoutingNumber.toString().length);
        console.error("Error: Routing Number must be 9 digits long.");
        return;
      }
      finalValue = stringRoutingNumber;
      break;
    default:
      console.error("Error: Invalid Value for field");
      break;
  }

  updateData[field] = finalValue;

  console.log(
    `[${session.role.toUpperCase()}] Updating Employee ID ${id} set ${field} to ${finalValue}...`
  );

  const { data, error } = await supabaseClient
    .from("employee")
    .update(updateData)
    .eq("employeeid", id)
    .select(`employeeid, ${lowerField}`);

  if (error) {
    console.error(`ERROR updating Employee: ${error.message}`);
  } else if (data.length === 0) {
    console.log(`Employee ID ${id} not found.`);
  } else {
    console.log(
      `Employee ID ${id} updated successfully! New ${field}: ${data[0][lowerField]}`
    );
  }
};

export default {
  name: "update-employee",
  description:
    "Used to update the name, mobile, email, password, address, salary, role, or routing number for an employee.",
  action: updateEmployeeAction,
};
