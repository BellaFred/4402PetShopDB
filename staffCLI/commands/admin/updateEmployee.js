import { supabaseServiceRoleClient } from "../../library/supabase-client.js";

const SUPORTED_FIELDS = [
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

  let finalValue = value;

  switch (lowerField) {
    case "name":
      break;
    case "mobile":
      break;
    case "email":
      break;
    case "password":
      break;
    case "address":
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
      if (!validRoles.includes(finalValue)) {
        console.error(
          `Error: Invalid role '${value}'. Must be one of: ${validRoles.join(
            ", "
          )}.`
        );
        return;
      }
      break;
    case "routingnumber":
      numericRoutingNumber = value;
      if (isNaN(numericRoutingNumber) || length)
      break;
    default:
      break;
  }
};

console.log(finalValue);

export default {
  name: "update-employee",
  description:
    "Used to update the name, mobile, email, password, address, salary, role, or routing number for an employee.",
  action: updateEmployeeAction,
};
