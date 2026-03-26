import { Router, type IRouter } from "express";
import { db, apiKeysTable, botsTable, conversationsTable, messagesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

const router: IRouter = Router();

async function requireApiKey(req: any, res: any): Promise<string | null> {
  const apiKey = req.headers["x-api-key"] as string | undefined;
  if (!apiKey) {
    res.status(401).json({ error: "API key required.", hint: "Pass your key as the X-API-Key header: X-API-Key: pk_..." });
    return null;
  }
  const keyRecord = await db.select().from(apiKeysTable).where(eq(apiKeysTable.key, apiKey)).limit(1);
  if (keyRecord.length === 0 || !keyRecord[0].isActive) {
    res.status(401).json({ error: "Invalid or disabled API key." });
    return null;
  }
  return keyRecord[0].id;
}

router.get("/bots", async (req, res) => {
  const keyId = await requireApiKey(req, res);
  if (!keyId) return;

  const bots = await db.select().from(botsTable).where(eq(botsTable.apiKeyId, keyId));
  res.json(bots.map(b => ({ id: b.id, name: b.name, createdAt: b.createdAt.toISOString() })));
});

router.post("/bots", async (req, res) => {
  const keyId = await requireApiKey(req, res);
  if (!keyId) return;

  const { name } = req.body;
  if (!name) {
    res.status(400).json({ error: "Name is required." });
    return;
  }

  const bot = { id: randomUUID(), name: String(name), apiKeyId: keyId };
  await db.insert(botsTable).values(bot);
  const created = await db.select().from(botsTable).where(eq(botsTable.id, bot.id)).limit(1);
  res.status(201).json({ id: created[0].id, name: created[0].name, createdAt: created[0].createdAt.toISOString() });
});

router.get("/bots/:botId/conversations", async (req, res) => {
  const keyId = await requireApiKey(req, res);
  if (!keyId) return;

  const conversations = await db.select().from(conversationsTable).where(eq(conversationsTable.botId, req.params.botId));
  res.json(conversations.map(c => ({ id: c.id, botId: c.botId, createdAt: c.createdAt.toISOString() })));
});

router.post("/bots/:botId/conversations", async (req, res) => {
  const keyId = await requireApiKey(req, res);
  if (!keyId) return;

  const conv = { id: randomUUID(), botId: req.params.botId };
  await db.insert(conversationsTable).values(conv);
  const created = await db.select().from(conversationsTable).where(eq(conversationsTable.id, conv.id)).limit(1);
  res.status(201).json({ id: created[0].id, botId: created[0].botId, createdAt: created[0].createdAt.toISOString() });
});

router.post("/bots/:botId/conversations/:id/messages", async (req, res) => {
  const keyId = await requireApiKey(req, res);
  if (!keyId) return;

  const { message } = req.body;
  if (!message) {
    res.status(400).json({ error: "Message is required." });
    return;
  }

  const msg = { id: randomUUID(), conversationId: req.params.id, role: "user", content: String(message) };
  await db.insert(messagesTable).values(msg);
  const created = await db.select().from(messagesTable).where(eq(messagesTable.id, msg.id)).limit(1);
  res.json({ id: created[0].id, role: created[0].role, content: created[0].content, createdAt: created[0].createdAt.toISOString() });
});

router.post("/bots/:botId/webhooks", async (req, res) => {
  const keyId = await requireApiKey(req, res);
  if (!keyId) return;

  const { url, events = [] } = req.body;
  if (!url) {
    res.status(400).json({ error: "URL is required." });
    return;
  }
  res.status(201).json({ id: randomUUID(), url, events, createdAt: new Date().toISOString() });
});

export default router;
