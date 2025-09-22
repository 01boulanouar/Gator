
import {handlerLogin, handlerRegister, handlerReset, registerCommand, runCommand } from './commands';

async function main()
{
   const CommandsRegistry = {};
   registerCommand(CommandsRegistry, "login", handlerLogin);
   registerCommand(CommandsRegistry, "register", handlerRegister);
   registerCommand(CommandsRegistry, "reset", handlerReset);

   const [cmdName, ...args] = process.argv.slice(2);
   await runCommand(CommandsRegistry, cmdName, ...args);
   process.exit(0);
}

main();