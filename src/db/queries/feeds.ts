import { feeds } from "../schema";
import { db } from "..";

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

export async function createFeed(feed: Feed) {

    const [result] = await db.insert(feeds).values(feed).returning();
    return result;
}