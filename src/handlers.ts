import { readConfig, setUser } from "./config";
import { getUser, createUser, deleteUsers, getUsers } from "./db/queries/users";
import { fetchFeed } from "./rss";

async function handlerLogin(cmdName: string, ...args: string[]) {

    if (args.length < 1)
        throw new Error("Not enough arguments");

    const user = args[0];
    const exists = await getUser(user);
    if (!exists)
        throw new Error("can't login user does not exit");
    
    setUser(user);
    console.log(`${user} has been set correctly`);
}

async function handlerRegister(cmdName: string, ...args: string[]) {
    
    if (args.length < 1)
        throw new Error("Not enough arguments");

    const user = args[0];
    const exists = await getUser(user);
    
    if (exists)
        throw new Error("user already exists");
    
    const result = await createUser(user);
    
    setUser(user);
    console.log(`${user} has been set correctly`);
    
    console.log(result);
}

async function handlerReset(cmdName: string, ...args: string[]) {
    await deleteUsers();
    console.log("Cleared db");
}

async function handlerUsers(cmdName: string, ...args: string[]) {
    const users = await getUsers();
    for (const user of users)
        console.log(` * ${user.name} ${readConfig().currentUserName === user.name ? "(current)" : ""}`);
    
}

async function handlerAgg(cmdName: string, ...args: string[]) {
    const result = await fetchFeed("https://www.wagslane.dev/index.xml");
    console.log(JSON.stringify(result,null, 2))
    // console.log(`channel: ${result.rss.channel.title}`);
    // for (const item of result.rss.channel.item)
    //     console.log(` * ${item.title}`);

}



export const handlers = {
  login: handlerLogin,
  register: handlerRegister,
  reset: handlerReset,
  users: handlerUsers,
  agg: handlerAgg,

};