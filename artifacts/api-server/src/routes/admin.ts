import { Router, type IRouter } from "express";
import { db, apiKeysTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

const router: IRouter = Router();

const ADMIN_KEY = process.env.ADMIN_KEY ?? "pakbot-admin-2024";

function requireAdmin(req: any, res: any): boolean {
  const adminKey = req.headers["x-admin-key"] as string | undefined;
  if (!adminKey || adminKey !== ADMIN_KEY) {
    res.status(401).json({ error: "Wrong admin key." });
    return false;
  }
  return true;
}

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

export default router;
