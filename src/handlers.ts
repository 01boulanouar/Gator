import { json } from "zod";
import { readConfig, setUser } from "./config";
import { createFeed, Feed } from "./db/queries/feeds";
import { getUser, createUser, deleteUsers, getUsers, User } from "./db/queries/users";
import { fetchFeed, RSSFeed } from "./rss";

export async function handlerLogin(cmdName: string, ...args: string[]) {

    if (args.length < 1)
        throw new Error("Not enough arguments");

    const user = args[0];
    const exists = await getUser(user);
    if (!exists)
        throw new Error("can't login user does not exit");
    
    setUser(user);
    console.log(`${user} has been set correctly`);
}

export async function handlerRegister(cmdName: string, ...args: string[]) {
    
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

export async function handlerReset(cmdName: string, ...args: string[]) {
    await deleteUsers();
    console.log("Cleared db");
}

export async function handlerUsers(cmdName: string, ...args: string[]) {
    const users = await getUsers();
    for (const user of users)
        console.log(` * ${user.name} ${readConfig().currentUserName === user.name ? "(current)" : ""}`);
    
}

function printFeed(feed: Feed, user: User) {
    console.log(`User: ${JSON.stringify(user, null, 2)}`);
    console.log(`Feed: ${JSON.stringify(feed, null, 2)}`);
}

export async function handlerAddFeed(cmdName: string, ...args: string[]) {
    if (args.length < 2)
        throw new Error("usage addfeed <name> <url>");

    const [name, url] = args;
    const user = await getUser(readConfig().currentUserName);

    const feed : Feed = {
        name,
        url,
        user_id: user.id
    };
    await createFeed(feed);
    printFeed(feed, user);
}

export async function handlerAgg(cmdName: string, ...args: string[]) {
    const result = await fetchFeed("https://www.wagslane.dev/index.xml");
    console.log(JSON.stringify(result,null, 2))
    // console.log(`channel: ${result.rss.channel.title}`);
    // for (const item of result.rss.channel.item)
    //     console.log(` * ${item.title}`);

}