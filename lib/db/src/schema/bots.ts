import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const botsTable = pgTable("bots", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  apiKeyId: text("api_key_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const conversationsTable = pgTable("conversations", {
  id: text("id").primaryKey(),
  botId: text("bot_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const messagesTable = pgTable("messages", {
  id: text("id").primaryKey(),
  conversationId: text("conversation_id").notNull(),
  role: text("role").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertBotSchema = createInsertSchema(botsTable).omit({ createdAt: true });
export type InsertBot = z.infer<typeof insertBotSchema>;
export type Bot = typeof botsTable.$inferSelect;
