
import { handlers } from "./handlers";
import { CommandHandler, registerCommand, runCommand } from "./commands";
import { middlewareLoggedIn, UserCommandHandler } from "./middleware";

async function main()
{
   const CommandsRegistry = {};
 
   for (const [name, handler] of Object.entries(handlers))
   {
      if (["addfeed", "follow", "following"].includes(name))
         registerCommand(CommandsRegistry, name, middlewareLoggedIn(handler as UserCommandHandler));
      else
         registerCommand(CommandsRegistry, name, handler as CommandHandler);
   }

   const [cmdName, ...args] = process.argv.slice(2);
   await runCommand(CommandsRegistry, cmdName, ...args);
   process.exit(0);
}

main();
