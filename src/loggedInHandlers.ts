import { createFeedFollow, deleteFeedFollow, getFeedFollowsForUser } from "./db/queries/feedfollows";
import { createFeed, Feed, FeedFollow, getFeedByUrl } from "./db/queries/feeds";
import { User } from "./db/queries/users";

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
        url
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


async function handlerFeeds(cmdName: string, user: User, ...args: string[]) {
    const feedFollows = await getFeedFollowsForUser(user);
    for (const feedfollow of feedFollows)
    {
        console.log(`${feedfollow.feed.name}`);
        console.log(` - url: ${feedfollow.feed.url}`);
        console.log(` - user: ${feedfollow.user.name}`);
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

async function handlerUnfollow(cmdName: string, user: User, ...args: string[]) {
    if (args.length < 1)
        throw new Error("usage unfollow <url>");
    const url = args[0];
    const result = await deleteFeedFollow(user, url);
    console.log(JSON.stringify(result, null, 2));
}

export const loggedInHandlers = {
  addfeed: handlerAddFeed,
  feeds: handlerFeeds,
  follow: handlerFollow,
  following: handlerFollowing,
  unfollow: handlerUnfollow
}
