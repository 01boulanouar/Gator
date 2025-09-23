import { readConfig, setUser } from "./config";
import { getNextFeedToFetch, markFeedFetched } from "./db/queries/feeds";
import { createPost, Post } from "./db/queries/posts";
import { getUser, createUser, getUsers, deleteAll } from "./db/queries/users";
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
    await deleteAll();
    console.log("Cleared db");
}

async function handlerUsers(cmdName: string, ...args: string[]) {
    const users = await getUsers();
    for (const user of users)
        console.log(` * ${user.name} ${readConfig().currentUserName === user.name ? "(current)" : ""}`);
    
}


async function scrapeFeeds() {
    const next_feed = await getNextFeedToFetch();
    await markFeedFetched(next_feed);
    const result = await fetchFeed(next_feed.url);
    console.log(`channel: ${result.rss.channel.title}`);
    for (const item of result.rss.channel.item)
    {
        const post: Post = {
            title: item.title,
            description: item.description,
            published_at: new Date(item.pubDate),
            feed_id: next_feed.id
        }
        await createPost(post);
        console.log(`adding post: ${post.title}`);
    }


}

function parseDuration(durationStr: string): number {
    const regex = /^(\d+)(ms|s|m|h)$/;
    const match = durationStr.match(regex);
    let duration = 10000; // default duration if regex fails
    if (match)
    {
        duration = Number(match[0]);
        if (match[1] === "s")
            duration * 1000;
        else if (match[1] === "m")
            duration * 1000 * 60;
        else if (match[1] === "h")
             duration * 1000 * 60 * 60;
    }
    return (duration);
}

function handleError() {
    console.log("failed to scrape feeds");
    process.exit(1);
}

async function handlerAgg(cmdName: string, ...args: string[]) {
    if (args.length < 1)
        throw new Error("usage agg <time_between_req>");
    
    const time_between_req = parseDuration(args[0]);
    console.log(`Collecting feeds every ${args[0]}`);

    scrapeFeeds();

    const interval = setInterval(() => {
        scrapeFeeds();  
    }, time_between_req);

    await new Promise<void>((resolve) => {
        process.on("SIGINT", () => {
            console.log("Shutting down feed aggregator...");
            clearInterval(interval);
            resolve();
        });
    });
}

export const handlers = {
  login: handlerLogin,
  register: handlerRegister,
  reset: handlerReset,
  users: handlerUsers,
  agg: handlerAgg,

};