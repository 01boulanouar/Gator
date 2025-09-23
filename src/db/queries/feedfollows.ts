import { feed_follows, feeds, users } from "../schema";
import { and, eq } from "drizzle-orm";
import { db } from "..";
import { User } from "./users";
import { FeedFollow, getFeedByUrl } from "./feeds";

export async function createFeedFollow(feedFollow: FeedFollow) {
  const [ inserted ] = await db.insert(feed_follows).values(feedFollow).returning( { id: feed_follows.id });
  const [ result ] = await db.select({ 
    feedFollow : {
        id: feed_follows.id,
        created_at: feed_follows.created_at,
        updated_at: feed_follows.updated_at,
  },
    user : {
        name: users.name,
    },
    feed: {
        name: feeds.name,
        url: feeds.url,
    }

  }).from(feed_follows)
  .innerJoin(feeds, eq(feed_follows.feed_id, feeds.id))
  .innerJoin(users, eq(feed_follows.user_id, users.id))
  .where(eq(feed_follows.id, inserted.id))
  return result;
}

export async function getFeedFollowsForUser(user: User) {
    const result = await db.select({ 
    feedFollow : {
        id: feed_follows.id,
        created_at: feed_follows.created_at,
        updated_at: feed_follows.updated_at,
  },
    user : {
        name: users.name,
    },
    feed: {
        name: feeds.name,
        url: feeds.url,
    }
  }).from(feed_follows)
    .innerJoin(feeds, eq(feed_follows.feed_id, feeds.id))
    .innerJoin(users, eq(feed_follows.user_id, users.id))
    .where(eq(feed_follows.user_id, user.id));

    return result;
};

export async function deleteFeedFollow(user: User, url:string) {
    const feed = await getFeedByUrl(url);
    if (!feed)
      throw new Error("feed is not followed");
    const [result] = await db.delete(feed_follows)
    .where(and(eq(feed_follows.user_id, user.id), eq(feed_follows.feed_id, feed.id))).returning();
    return result;
}