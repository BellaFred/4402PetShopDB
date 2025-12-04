import addEmployeeCommand from "./addEmployee.js";
import removeEmployeeCommand from "./removeEmployee.js";
import updateEmployeeCommand from "./updateEmployee.js";
import searchEmployeesCommand from './searchEmployees.js';
import viewEmployeeCommand from "./viewEmployee.js";

export const adminCommands = [
  addEmployeeCommand,
  updateEmployeeCommand,
  removeEmployeeCommand,
  searchEmployeesCommand,
  viewEmployeeCommand,
];
