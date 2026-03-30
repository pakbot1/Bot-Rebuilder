import app from "./app";
import { logger } from "./lib/logger";
import * as path from "path";
import { fileURLToPath } from "url";
import express from "express";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../../../../artifacts/pak-bot/dist/public')));

app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(__dirname, '../../../../artifacts/pak-bot/dist/public/index.html'));
});

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
});
