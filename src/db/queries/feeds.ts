import { feeds } from "../schema";
import { eq } from "drizzle-orm";
import { db } from "..";


export type Feed = {
  id?: string;
  created_at?: Date;
  updated_at?: Date;
  name: string;
  url: string;
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
    console.log(result);
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


