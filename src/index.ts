
import {handlerLogin, registerCommand, runCommand } from './commands';

function main()
{
   const CommandsRegistry = {};
   registerCommand(CommandsRegistry, "login", handlerLogin);
   const args = process.argv.slice(2);
   runCommand(CommandsRegistry, "login", ...args);
}

main();