import { db } from "..";
import { feed_follows, feeds, posts, users, } from "../schema";
import { eq } from "drizzle-orm";

export type User = {
    id: string;
    name: string;
    created_at?: Date;
    updated_at?: Date;
}

export async function createUser(name: string) {
    const [result] = await db.insert(users).values( { name } ).returning();
    return result;
}

export async function getUser(name: string) {
    const [result] = await db.select().from(users).where(eq(users.name, name));
    return result;
};

export async function getUserById(user_id: string) {
    const [result] = await db.select().from(users).where(eq(users.id, user_id));
    return result;
};

export async function getUsers() {
    const result = await db.select().from(users);
    return result;
};

export async function deleteAll() {
    await db.delete(feed_follows);
    await db.delete(users);
    await db.delete(feeds);
    await db.delete(posts);
}

