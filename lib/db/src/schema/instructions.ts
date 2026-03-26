import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const instructionsTable = pgTable("bot_instructions", {
  id: text("id").primaryKey(),
  content: text("content").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type BotInstructions = typeof instructionsTable.$inferSelect;
