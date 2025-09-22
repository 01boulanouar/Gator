export type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;

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

