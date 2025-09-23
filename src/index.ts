
import { handlers } from "./handlers";
import {  registerCommand, runCommand } from "./commands";
import { middlewareLoggedIn } from "./middleware";
import { loggedInHandlers } from "./loggedInHandlers";

async function main()
{
   const CommandsRegistry = {};
 
   for (const [name, handler] of Object.entries(handlers))
         registerCommand(CommandsRegistry, name, handler);
 
   for (const [name, handler] of Object.entries(loggedInHandlers))
         registerCommand(CommandsRegistry, name, middlewareLoggedIn(handler));


   const [cmdName, ...args] = process.argv.slice(2);
   await runCommand(CommandsRegistry, cmdName, ...args);
   process.exit(0);
}

main();
