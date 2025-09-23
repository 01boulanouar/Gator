import { db } from "..";
import { users, } from "../schema";
import { eq } from "drizzle-orm";

export type User = {
    id?: string;
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

export async function deleteUsers() {
    await db.delete(users);
}

