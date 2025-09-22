
import { handlerLogin, handlerRegister, handlerReset, handlerUsers } from "./handlers";
import {registerCommand, runCommand } from "./commands";

async function main()
{
   const CommandsRegistry = {};
   registerCommand(CommandsRegistry, "login", handlerLogin);
   registerCommand(CommandsRegistry, "register", handlerRegister);
   registerCommand(CommandsRegistry, "reset", handlerReset);
   registerCommand(CommandsRegistry, "users", handlerUsers);

   const [cmdName, ...args] = process.argv.slice(2);
   await runCommand(CommandsRegistry, cmdName, ...args);
   process.exit(0);
}

main();