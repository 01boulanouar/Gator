import { readConfig, setUser } from "./config";
import { createFeed, createFeedFollow, Feed, FeedFollow, getFeedByUrl, getFeedFollowsForUser, getFeeds } from "./db/queries/feeds";
import { getUser, createUser, deleteUsers, getUsers, User, getUserById } from "./db/queries/users";
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

function printFeed(feed: Feed, user: User) {
    console.log(`User: ${JSON.stringify(user, null, 2)}`);
    console.log(`Feed: ${JSON.stringify(feed, null, 2)}`);
}

async function handlerAddFeed(cmdName: string, user: User, ...args: string[]) {

    if (args.length < 2)
        throw new Error("usage addfeed <name> <url>");

    const [name, url] = args;
    const feed : Feed = {
        name,
        url,
        user_id: user.id
    };
    const newFeed = await createFeed(feed);
    
    const feedFollow: FeedFollow = {
        feed_id: newFeed.id,
        user_id: user.id,
    };

    printFeed(feed, user);
    const result = await createFeedFollow(feedFollow);
    console.log(JSON.stringify(result, null, 2));
}

async function handlerFeeds(cmdName: string, ...args: string[]) {
    const feeds = await getFeeds();
    for (const feed of feeds)
    {
        const user = await getUserById(feed.user_id);
        console.log(`${feed.name}`);
        console.log(` - url: ${feed.url}`);
        console.log(` - user: ${user.name}`);
    }
}

async function handlerFollow(cmdName: string, user: User, ...args: string[]) {
    if (args.length < 1)
        throw new Error("usage: follow <url>");


    const url = args[0];
    const feed = await getFeedByUrl(url);

    const feedFollow : FeedFollow = {
        user_id: user.id,
        feed_id: feed.id,
    }
    const result = await createFeedFollow(feedFollow);
    console.log(JSON.stringify(result, null, 2));
}

async function handlerFollowing(cmdName: string, user: User, ...args: string[]) {
    
    const result = await getFeedFollowsForUser(user);
    console.log(JSON.stringify(result, null, 2));
}


export const handlers = {
  login: handlerLogin,
  register: handlerRegister,
  reset: handlerReset,
  users: handlerUsers,
  agg: handlerAgg,
  addfeed: handlerAddFeed,
  feeds: handlerFeeds,
  follow: handlerFollow,
  following: handlerFollowing
};