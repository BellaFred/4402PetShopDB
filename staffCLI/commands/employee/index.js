import deletePetCommand from './deletePet.js';
import addPetCommand from './addPet.js';
import updatePetCommand from './updatePet.js';
import sellPetCommand from './sellPet.js'; 
import searchPetsCommand from './searchPets.js';
import viewPetCommand from './viewPet.js';
import searchOrdersCommand from './searchOrders.js';
import viewOrderCommand from './viewOrder.js';
import searchCustomersCommand from './searchCustomers.js';
import viewCustomerCommand from './viewCustomer.js';

export const employeeCommands = [
    updatePetCommand,
    searchOrdersCommand,
    viewOrderCommand,
    searchCustomersCommand,
    viewCustomerCommand,
    addPetCommand,
   deletePetCommand,
   sellPetCommand, 
   searchPetsCommand,
   viewPetCommand
];