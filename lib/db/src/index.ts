import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

console.log("DATABASE_URL:", process.env.DATABASE_URL);

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Test database connection
pool.on('connect', () => {
  console.log("✅ Database connected successfully");
});

pool.on('error', (err) => {
  console.error("❌ Database connection error:", err);
});

export const db = drizzle(pool, { schema });

export * from "./schema";
