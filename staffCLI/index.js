import { Command } from 'commander';
import * as readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';

import { loginAndGetRole } from './library/auth.js';
import { employeeCommands } from './commands/employee/index.js'; 
import { adminCommands } from './commands/admin/index.js'; 

const program = new Command();

const availableCommands = new Map(); 


function loadCommands(role) {
    availableCommands.clear();
    
    // Load all EMPLOYEE commands for ALL staff
    employeeCommands.forEach(cmd => {
        availableCommands.set(cmd.name, cmd.action); 
    });

    // Load ADMIN-only commands for OWNER ONLY
    if (role === 'admin') {
        adminCommands.forEach(cmd => {
            availableCommands.set(cmd.name, cmd.action);
        });
    }
}


async function startInteractiveSession(session) {
    const rl = readline.createInterface({ input, output });
    
    console.log(`\nWelcome back, ${session.role.toUpperCase()}!`);
    console.log("Type 'help' for commands or 'exit'/'quit' to log out.");
    
    let running = true;
    while (running) {
        // shows the user's current role
        const promptText = `staffcli(${session.role})> `;
        let inputLine = await rl.question(promptText);
        
        const parts = inputLine.trim().split(/\s+/).filter(p => p.length > 0);
        const commandName = parts[0];
        const args = parts.slice(1);
        
        if (!commandName) continue;

        if (commandName === 'exit' || commandName === 'quit') {
            running = false;
            console.log('Logging out. Goodbye!');
            break;
        }

        if (commandName === 'help') {
            console.log("\nAvailable Commands:");
            availableCommands.forEach((action, name) => {
                const commandObj = [...employeeCommands, ...adminCommands].find(c => c.name === name);
                console.log(`  ${name}: ${commandObj ? commandObj.description : 'No description available'}`);
            });
            continue;
        }

        // Execute the command if it exists
        if (availableCommands.has(commandName)) {
            try {
                await availableCommands.get(commandName)(session, ...args);
            } catch (e) {
                console.error(`\nCommand Execution Error: ${e.message}`);
            }
        } else {
            console.log(`\nError: Command '${commandName}' not recognized. Type 'help' to see available commands.`);
        }
    }
    
    rl.close();
}



program
    .command('login')
    .description('Log in to the CLI and start the interactive session')
    .argument('<email>', 'Staff login email address')
    .argument('<password>', 'Staff password')
    .action(async (email, password) => {
        const loginData = await loginAndGetRole(email, password);
        
        if (loginData) {
            loadCommands(loginData.role);
            await startInteractiveSession(loginData);
        } else {
             process.exit(0);
        }
    });

async function run() {
    const isLoginCommand = process.argv.length >= 4 && process.argv[2] === 'login';
    const isHelpCommand = process.argv.length === 3 && process.argv[2] === 'help';
    
    if (process.argv.length < 3 || (!isLoginCommand && !isHelpCommand)) {
        program.help();
        return;
    }
    await program.parseAsync(process.argv);
}

run();