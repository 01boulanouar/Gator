import { pgTable, timestamp, uuid, text, unique } from "drizzle-orm/pg-core";
import { describe } from "node:test";

export const users = pgTable("users", {
   id: uuid("id").primaryKey().notNull().defaultRandom(),
   created_at: timestamp("created_at").notNull().defaultNow(),
   updated_at: timestamp("updated_at").notNull().defaultNow()
   .$onUpdate(() => new Date()),
   name: text("name").notNull().unique(),
});

export const feeds = pgTable("feeds", {
   id: uuid("id").primaryKey().notNull().defaultRandom(),
   created_at: timestamp("created_at").notNull().defaultNow(),
   updated_at: timestamp("updated_at").notNull().defaultNow()
   .$onUpdate(() => new Date()),
   name: text("name").notNull(),
   url: text("url").notNull().unique(),
   last_fetched_at: timestamp("last_fetched_at")
})

export const feed_follows = pgTable("feed_follows", {
   id: uuid("id").primaryKey().notNull().defaultRandom(),
   created_at: timestamp("created_at").notNull().defaultNow(),
   updated_at: timestamp("updated_at").notNull().defaultNow()
   .$onUpdate(() => new Date()),
   user_id: uuid("user_id").notNull().references(() => users.id, {onDelete: "cascade"}),
   feed_id: uuid("feed_id").notNull().references(() => feeds.id, {onDelete: "cascade"})
}, (table) => [
   unique().on(table.user_id, table.feed_id)
])

export const posts = pgTable("posts", {
   id: uuid("id").primaryKey().notNull().defaultRandom(),
   created_at: timestamp("created_at").notNull().defaultNow(),
   updated_at: timestamp("updated_at").notNull().defaultNow()
   .$onUpdate(() => new Date()),
   title: text("title").notNull().unique(),
   description: text("description").notNull(),
   published_at: timestamp("published_at").notNull(),
   feed_id: uuid("feed_id").notNull().references(() => feeds.id, { onDelete: "cascade" })
})