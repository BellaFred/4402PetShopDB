import { getSupabaseServiceRoleClient } from "../../library/supabase-client.js";

const searchEmployeesAction = async (session, field, criteria) => {
  const supabaseClient = getSupabaseServiceRoleClient();
  if (!criteria) {
    console.log("Usage: search-employees <field> <criteria>");
    return;
  }

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

  const lowerField = field.toLowerCase();
  let finalCriteria = null;

  if (!SUPPORTED_FIELDS.includes(lowerField)) {
    console.error(
      `Error: Field '${field}' is not a supported field for updates.`
    );
    return;
  }
  switch (lowerField) {
    case "mobile":
      const mobile = criteria;
      if (mobile.length !== 9 || isNaN(mobile)) {
        console.error(`Error: Invalid Phone number.`);
        return;
      }
      finalCriteria = mobile;
      break;
    case "email":
      const email = criteria;
      const regexEmail = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      if (!regexEmail.test(email)) {
        console.error(`Error: Invalid Email.`);
        return;
      }
      finalCriteria = email;
      break;
    case "name":
    case "address":
      const stringcriteria = criteria.toString();
      if (stringcriteria.length < 0) {
        console.error(`Error: Invalid Password`);
        return;
      }
      finalCriteria = stringcriteria;
      break;
    case "password":
      const stringPassword = criteria;
      if (stringPassword.toString().length < 0) {
        console.error(`Error: Invalid Password`);
        return;
      }
      finalCriteria = stringPassword;
      break;
    case "salary":
      const numericSalary = parseInt(criteria);
      if (isNaN(numericSalary) || numericSalary < 0) {
        console.error(`Error: Salary must be a non-negative integer.`);
        return;
      }
      finalCriteria = numericSalary;
      break;
    case "role":
      const validRoles = ["owner", "employee"];
      console.log(validRoles.includes(criteria));
      if (!validRoles.includes(criteria)) {
        console.error(
          `Error: Invalid role '${criteria}'. Must be one of: ${validRoles.join(
            ", "
          )}.`
        );
        return;
      }
      finalCriteria = criteria;
      break;
    case "routingnumber":
      const stringRoutingNumber = parseInt(criteria);
      if (
        isNaN(stringRoutingNumber) ||
        stringRoutingNumber.toString().length !== 9
      ) {
        console.log(stringRoutingNumber.toString().length);
        console.error("Error: Routing Number must be 9 digits long.");
        return;
      }
      finalCriteria = stringRoutingNumber;
      break;
    default:
      console.error("Error: Invalid criteria for field");
      break;
  }

  console.log(
    `[${session.role.toUpperCase()}] Searching for Employees that match ${finalCriteria} in ${lowerField}...`
  );

  let { data: employee, error } = await supabaseClient
    .from("employee")
    .select("*")
    .eq(lowerField, finalCriteria);

  if (error) {
    console.error(`ERROR viewing Employee: ${error.message}`);
  } else {
    console.log("     ID     |     Name     ");
    console.log("----------------------------");
    employee.forEach((row) => {
      console.log(` ${row.employeeid}   |   ${row.name}`);
    });
  }
};
export default {
  name: "search-employees",
  description: "Used to search for employees fitting given criteria.",
  action: searchEmployeesAction,
};
