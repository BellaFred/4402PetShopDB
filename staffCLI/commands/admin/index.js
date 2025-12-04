import addEmployeeCommand from "./addEmployee.js";
import removeEmployeeCommand from './removeEmployee.js';
import updateEmployeeCommand from "./updateEmployee.js";
// import viewPayrollCommand from './viewPayroll.js';

export const adminCommands = [
  addEmployeeCommand,
  updateEmployeeCommand,
  removeEmployeeCommand,
  //    viewPayrollCommand,
];
