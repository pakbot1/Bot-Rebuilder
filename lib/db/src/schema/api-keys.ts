import { pgTable, text, boolean, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const apiKeysTable = pgTable("api_keys", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email"),
  key: text("key").notNull().unique(),
  isActive: boolean("is_active").notNull().default(true),
  requestCount: integer("request_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertApiKeySchema = createInsertSchema(apiKeysTable).omit({
  requestCount: true,
  createdAt: true,
});
export type InsertApiKey = z.infer<typeof insertApiKeySchema>;
export type ApiKey = typeof apiKeysTable.$inferSelect;
