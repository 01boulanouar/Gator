import { feed_follows, feeds, posts, users } from "../schema";
import { eq , desc} from "drizzle-orm";
import { db } from "..";
import { User } from "./users";

export type Post = {
    id?: string;
    created_at?: Date;
    updated_at?: Date;
    title: string;
    description: string;
    published_at: Date;
    feed_id: string;
}

export async function createPost(post: Post) {
    const [result] = await db.insert(posts).values(post)
    .onConflictDoNothing()
    .returning();
    return result;
}

export async function getPostsForUser(user: User, numOfPosts: number) {
    const result = await db.select({
        post: {
            title: posts.title,
            description: posts.description,
            published_at: posts.published_at,
            feed_id: posts.feed_id,
        },
        user : {
            name: users.name,
        },
        feed: {
            name: feeds.name,
            url: feeds.url,
        }
    }).from(posts)
    .innerJoin(feed_follows, eq(posts.feed_id, feed_follows.feed_id))
    .innerJoin(feeds, eq(feed_follows.feed_id, feeds.id))
    .innerJoin(users, eq(feed_follows.user_id, users.id))
    .where(eq(feed_follows.user_id, user.id))
    .orderBy(desc(posts.updated_at))
    .limit(numOfPosts);
    return result;
}