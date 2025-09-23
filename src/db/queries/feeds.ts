import { feed_follows, feeds, users } from "../schema";
import { eq } from "drizzle-orm";
import { db } from "..";
import { User } from "./users";

// type FullFeed = typeof feeds.$inferSelect;
// export type Feed = Partial<Pick<FullFeed, 'id' | 'created_at' | 'updated_at'>> & Omit<FullFeed, 'id' | 'created_at' | 'updated_at'>;

export type Feed = {
  id?: string;
  created_at?: Date;
  updated_at?: Date;
  name: string;
  url: string;
  user_id: string;
}

export type FeedFollow = {
  id?: string;
  created_at?: Date;
  updated_at?: Date;
  user_id: string;
  feed_id: string;
}

export async function createFeed(feed: Feed) {

    const [result] = await db.insert(feeds).values(feed).returning();
    return result;
}

export async function getFeeds() {

    const result = await db.select().from(feeds);
    return result;
}

export async function getFeedByUrl(url: string) {
    const [result] = await db.select().from(feeds).where(eq(feeds.url, url));
    return result;
};


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
    const [fullUser] = await db.select().from(users).where(eq(users.name, user.name));
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
    .where(eq(feed_follows.user_id, fullUser.id));
    
    ;
    return result;
};

