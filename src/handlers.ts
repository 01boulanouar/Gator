import { readConfig, setUser } from "./config";
import { getUser, createUser, deleteUsers, getUsers } from "./db/queries/users";

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

export async function handlerReset(cmdName: string, ...args: string[]) {
    await deleteUsers();
    console.log("Cleared db");
}

export async function handlerUsers(cmdName: string, ...args: string[]) {
    const users = await getUsers();
    for (const user of users)
        console.log(` * ${user.name} ${readConfig().currentUserName === user.name ? "(current)" : ""}`);
    
}