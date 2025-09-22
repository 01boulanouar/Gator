import { setUser } from "./config";
import { createUser, getUser } from "./db/queries/users";

export type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;

// todo: refactor both these functions
export async function handlerLogin(cmdName: string, ...args: string[]) {
    if (args.length < 1)
        throw new Error("please enter a login");
    const user = args[0];
    const exists = await getUser(user);
    if (!exists)
        throw new Error("can't login user does not exit");
    setUser(user);
    console.log(`${user} has been set correctly`);
}

export async function handlerRegister(cmdName: string, ...args: string[]) {
    if (args.length < 1)
        throw new Error("please enter a name");
    const user = args[0];
    const exists = await getUser(user);
    if (exists)
        throw new Error("user already exists");
    const result = await createUser(user);
    setUser(user);
    console.log(`${user} has been set correctly`);
    console.log(result);
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

