import { CommandHandler } from "./commands";
import { readConfig } from "./config";
import { getUser, User } from "./db/queries/users";

export type UserCommandHandler = (cmdName: string, user: User, ...args: string[]) => Promise<void>;

export function middlewareLoggedIn(handler: UserCommandHandler): CommandHandler {

   async function inner(cmdName: string, ...args: string[]): Promise<void> {

         const userName = readConfig().currentUserName;
         if (!userName)
            throw new Error("User not loged in");
         const user = await getUser(userName);
         if (!user)
            throw new Error(`User ${userName} not found`)
         return await handler(cmdName, user, ...args);
   };

   return inner;
}
