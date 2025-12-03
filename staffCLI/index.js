import { Command } from 'commander';
import * as readline from 'readline/promises';
import { stdin as input, stdout as output, exit } from 'process';

import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
config({ path: path.resolve(__dirname, '..', '.env') });

console.log(`[DIAGNOSTIC] Supabase URL loaded: ${!!process.env.SUPABASE_URL}`);

import { loginAndGetRole } from './library/auth.js';
import { employeeCommands } from './commands/employee/index.js'; 
import { adminCommands } from './commands/admin/index.js'; 

const program = new Command();

const availableCommands = new Map(); 

function loadCommands(role) {
    availableCommands.clear(); 

    availableCommands.set('logout', { name: 'logout', description: 'Logs out of the current session.', action: async () => exit(0) });
    availableCommands.set('help', { name: 'help', description: 'Displays available commands.', action: async () => {
        console.log("\nAvailable Commands:");
        availableCommands.forEach(cmd => {
            console.log(`  ${cmd.name.padEnd(15)} - ${cmd.description}`);
        });
        console.log("");
    }});

    employeeCommands.forEach(cmd => {
        availableCommands.set(cmd.name, cmd);
    });

    if (role.toLowerCase() === 'admin') {
        adminCommands.forEach(cmd => {
            availableCommands.set(cmd.name, cmd);
        });
    }

    console.log(`Successfully loaded ${availableCommands.size} commands for role: ${role.toUpperCase()}`);
}

async function startInteractiveSession(session) {
    const rl = readline.createInterface({ input, output });
    const role = session.role.toUpperCase();

    while (true) {
        let commandLine;
        try {
            commandLine = await rl.question(`[${role}] petshop> `);
        } catch (e) {
            console.log("\nSession terminated.");
            exit(0);
        }

        const parts = commandLine.trim().split(/\s+/);
        const commandName = parts[0].toLowerCase();
        const args = parts.slice(1);

        if (commandName === '') {
            continue;
        }

        const command = availableCommands.get(commandName);

        if (command) {
            try {
                await command.action(session, ...args);
            } catch (e) {
                console.error(`\nCOMMAND EXECUTION ERROR: An unhandled error occurred during '${commandName}' execution.`);
                console.error(e.message);
            }
        } else {
            console.log(`\nCommand not recognized: ${commandName}`);
            console.log("Type 'help' for a list of available commands.");
        }
    }
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
             exit(0);
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