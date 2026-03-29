import { Router, type IRouter } from "express";
import { db, apiKeysTable, instructionsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const router: IRouter = Router();

const ADMIN_KEY = process.env.ADMIN_KEY ?? "pakbot-admin-2024";
const INSTRUCTIONS_ID = "singleton";

function requireAdmin(req: any, res: any): boolean {
  const adminKey = req.headers["x-admin-key"] as string | undefined;
  if (!adminKey || adminKey !== ADMIN_KEY) {
    res.status(401).json({ error: "Wrong admin key." });
    return false;
  }
  return true;
}

async function getOrSeedInstructions(): Promise<string> {
  const existing = await db.select().from(instructionsTable).where(eq(instructionsTable.id, INSTRUCTIONS_ID)).limit(1);
  if (existing.length > 0) return existing[0].content;

  // Seed with default instructions from attached file if it exists
  let defaultContent = `You are PakBot, Pakistan's first AI assistant. You are friendly, helpful, and knowledgeable. 
You can speak both English and Urdu. When users greet you in Urdu/Roman Urdu, respond warmly in the same language.
You are proud to represent Pakistan and can discuss Pakistani culture, history, and current events.
Keep responses concise but informative. Always match the user's language exactly.`;

  try {
    const instructionsPath = resolve(process.cwd(), "../..", "attached_assets/Pasted-When-PakBot-engages-with-users-it-naturally-adapts-to-t_1774491915093.txt");
    defaultContent = readFileSync(instructionsPath, "utf-8");
  } catch {
    // Use default if file not found
  }

  await db.insert(instructionsTable).values({
    id: INSTRUCTIONS_ID,
    content: defaultContent,
  });

  return defaultContent;
}

// Seed on module load
getOrSeedInstructions().catch(() => {});

router.get("/admin/keys", async (req, res) => {
  if (!requireAdmin(req, res)) return;
  const keys = await db.select().from(apiKeysTable);
  res.json(keys.map(k => ({
    id: k.id,
    name: k.name,
    email: k.email ?? undefined,
    key: k.key,
    isActive: k.isActive,
    requestCount: k.requestCount,
    createdAt: k.createdAt.toISOString(),
  })));
});

router.post("/admin/keys", async (req, res) => {
  if (!requireAdmin(req, res)) return;
  const { name, email } = req.body;
  if (!name) {
    res.status(400).json({ error: "Name is required." });
    return;
  }
  const newKey = {
    id: randomUUID(),
    name: String(name),
    email: email ? String(email) : null,
    key: `pk_${randomUUID().replace(/-/g, "")}`,
    isActive: true,
  };
  await db.insert(apiKeysTable).values(newKey);
  const created = await db.select().from(apiKeysTable).where(eq(apiKeysTable.id, newKey.id)).limit(1);
  const k = created[0];
  res.status(201).json({
    id: k.id,
    name: k.name,
    email: k.email ?? undefined,
    key: k.key,
    isActive: k.isActive,
    requestCount: k.requestCount,
    createdAt: k.createdAt.toISOString(),
  });
});

router.patch("/admin/keys/:id", async (req, res) => {
  if (!requireAdmin(req, res)) return;
  const { isActive } = req.body;
  if (typeof isActive !== "boolean") {
    res.status(400).json({ error: "isActive must be a boolean." });
    return;
  }
  await db.update(apiKeysTable).set({ isActive }).where(eq(apiKeysTable.id, req.params.id));
  const updated = await db.select().from(apiKeysTable).where(eq(apiKeysTable.id, req.params.id)).limit(1);
  if (updated.length === 0) {
    res.status(404).json({ error: "Key not found." });
    return;
  }
  const k = updated[0];
  res.json({
    id: k.id,
    name: k.name,
    email: k.email ?? undefined,
    key: k.key,
    isActive: k.isActive,
    requestCount: k.requestCount,
    createdAt: k.createdAt.toISOString(),
  });
});

router.delete("/admin/keys/:id", async (req, res) => {
  if (!requireAdmin(req, res)) return;
  await db.delete(apiKeysTable).where(eq(apiKeysTable.id, req.params.id));
  res.json({ success: true });
});

router.get("/admin/instructions", async (req, res) => {
  if (!requireAdmin(req, res)) return;
  const content = await getOrSeedInstructions();
  const row = await db.select().from(instructionsTable).where(eq(instructionsTable.id, INSTRUCTIONS_ID)).limit(1);
  res.json({
    content,
    updatedAt: row[0]?.updatedAt?.toISOString() ?? new Date().toISOString(),
  });
});

router.put("/admin/instructions", async (req, res) => {
  if (!requireAdmin(req, res)) return;
  const { content } = req.body;
  if (!content || typeof content !== "string") {
    res.status(400).json({ error: "content is required." });
    return;
  }

  const existing = await db.select().from(instructionsTable).where(eq(instructionsTable.id, INSTRUCTIONS_ID)).limit(1);
  if (existing.length === 0) {
    await db.insert(instructionsTable).values({ id: INSTRUCTIONS_ID, content });
  } else {
    await db.update(instructionsTable).set({ content, updatedAt: new Date() }).where(eq(instructionsTable.id, INSTRUCTIONS_ID));
  }

  const updated = await db.select().from(instructionsTable).where(eq(instructionsTable.id, INSTRUCTIONS_ID)).limit(1);
  res.json({
    content: updated[0].content,
    updatedAt: updated[0].updatedAt.toISOString(),
  });
});

export default router;
