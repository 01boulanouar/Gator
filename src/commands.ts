import { setUser } from "./config";
import { createUser, deleteUsers, getUser } from "./db/queries/users";

export type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;

export async function handlerLogin(cmdName: string, ...args: string[]) {

    const user = args[0];
    const exists = await getUser(user);
    if (!exists)
        throw new Error("can't login user does not exit");
    
    setUser(user);
    console.log(`${user} has been set correctly`);
}

export async function handlerRegister(cmdName: string, ...args: string[]) {
    
    const user = args[0];
    const exists = await getUser(user);
    
    if (exists)
        throw new Error("user already exists");
    
    const result = await createUser(user);
    
    setUser(user);
    console.log(`${user} has been set correctly`);
    
    console.log(result);
}

export async function handlerReset(cmdName: string, ...args: string[])
{
    await deleteUsers();
    console.log("Cleared db");
}

export type CommandsRegistry = Record<string, CommandHandler>;

export async function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler) {
    registry[cmdName] = handler;
};

export async function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]) {
    try {
        if (!cmdName)
            throw new Error("No command specified");
        
        if (!(cmdName in registry))
            throw new Error("Command doesn't exist");

        if (cmdName in ["login", "register"] && args.length < 1)
            throw new Error("Not enough arguments");

        const handler = registry[cmdName];
        await handler(cmdName, ...args);

    } catch (error)
    {
        if (error instanceof Error) {
             console.log(error.message);
             process.exit(1);
        }
    }
};

