import { setUser } from "./config";

export type CommandHandler = (cmdName: string, ...args: string[]) => void;

export function handlerLogin(cmdName: string, ...args: string[]): void {
    if (args.length < 2)
        throw new Error("please enter a login");
    setUser(args[1]);
    console.log(`${args[1]} has been set correctly`);
}

export type CommandsRegistry = Record<string, CommandHandler>;

export function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler) {
    registry[cmdName] = handler;
};

export function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]) {
    try {
        if (args.length < 1)
            throw new Error("Not enough args")
        const handler = registry[cmdName];
        handler(cmdName, ...args);
    } catch (error)
    {
        if (error instanceof Error) {
             console.log(error.message);
             process.exit(1);
        }
    }
};

