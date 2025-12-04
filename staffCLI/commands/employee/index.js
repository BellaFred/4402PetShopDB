import deletePetCommand from './deletePet.js';
import addPetCommand from './addPet.js';
import updatePetCommand from './updatePet.js';
import sellPetCommand from './sellPet.js'; 
import searchPetsCommand from './searchPets.js';
import viewPetCommand from './viewPet.js';

export const employeeCommands = [
    updatePetCommand,
    addPetCommand,
   deletePetCommand,
   sellPetCommand, 
   searchPetsCommand,
   viewPetCommand
];