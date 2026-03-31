import app from "./app";
import { logger } from "./lib/logger";
import * as path from "path";
import { fileURLToPath } from "url";
import express from "express";
import { db, apiKeysTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Insert test API key on server startup
async function ensureTestApiKey() {
  try {
    const testKey = "pk_a1310271384f31fa1ea2dd2b084ba391";
    
    // Check if key already exists
    const existingKey = await db
      .select()
      .from(apiKeysTable)
      .where(eq(apiKeysTable.key, testKey))
      .limit(1);
    
    if (existingKey.length === 0) {
      // Insert the test key
      await db.insert(apiKeysTable).values({
        id: "test-key-001",
        name: "Test Key",
        key: testKey,
        is_active: true,
        requestCount: 0,
      });
      logger.info("Test API key inserted successfully");
    } else {
      logger.info("Test API key already exists");
    }
  } catch (error) {
    logger.error({ error }, "Failed to ensure test API key");
  }
}

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const distPath = path.resolve('/opt/render/project/src/attached_assets/artifacts/pak-bot/dist/public');

app.use(express.static(distPath));

app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(port, async (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  // Ensure test API key exists
  await ensureTestApiKey();

  logger.info({ port }, "Server listening");
});
