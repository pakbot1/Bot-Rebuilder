import { Router, type IRouter } from "express";
import { db, apiKeysTable, instructionsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { openai } from "@workspace/integrations-openai-ai-server";
import { SendChatMessageBody, SendChatMessageResponse } from "@workspace/api-zod";

const router: IRouter = Router();

const sessions = new Map<string, Array<{ role: "user" | "assistant"; content: string }>>();

const INSTRUCTIONS_ID = "singleton";

async function getSystemPrompt(): Promise<string> {
  try {
    const row = await db.select().from(instructionsTable).where(eq(instructionsTable.id, INSTRUCTIONS_ID)).limit(1);
    if (row.length > 0) return row[0].content;
  } catch {}
  return `You are PakBot, Pakistan's first AI assistant. You are friendly, helpful, and knowledgeable.
You can speak both English and Urdu. When users greet you in Urdu/Roman Urdu, respond warmly in the same language.
You are proud to represent Pakistan and can discuss Pakistani culture, history, and current events.
Keep responses concise but informative. Always match the user's language exactly.`;
}

router.post("/chat", async (req, res) => {
  const apiKey = req.headers["x-api-key"] as string | undefined;

  if (!apiKey) {
    res.status(401).json({ error: "API key required.", hint: "Pass your key as the X-API-Key header: X-API-Key: pk_..." });
    return;
  }

  const keyRecord = await db.select().from(apiKeysTable).where(eq(apiKeysTable.key, apiKey)).limit(1);

  if (keyRecord.length === 0) {
    res.status(401).json({ error: "Invalid API key." });
    return;
  }

  if (!keyRecord[0].isActive) {
    res.status(401).json({ error: "API key is disabled." });
    return;
  }

  const body = SendChatMessageBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: "Invalid request body." });
    return;
  }

  const { message, sessionId = `session_${Date.now()}`, imageBase64, imageMimeType } = body.data;

  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, []);
  }

  const history = sessions.get(sessionId)!;
  const systemPrompt = await getSystemPrompt();

  // Build the user message content (text or text+image)
  let userContent: any;
  if (imageBase64) {
    const mimeType = imageMimeType ?? "image/jpeg";
    userContent = [
      { type: "text", text: message },
      {
        type: "image_url",
        image_url: {
          url: `data:${mimeType};base64,${imageBase64}`,
        },
      },
    ];
  } else {
    userContent = message;
  }

  // Use vision-capable model when image is present
  const model = imageBase64 ? "gpt-4o" : "gpt-5-mini";

  const completion = await openai.chat.completions.create({
    model,
    messages: [
      { role: "system", content: systemPrompt },
      ...history.map(h => ({ role: h.role, content: h.content })),
      { role: "user", content: userContent },
    ],
  });

  const reply = completion.choices[0]?.message?.content ?? "Kuch masla ho gaya, dobara try karo.";

  // Store text-only in history for continuity
  history.push({ role: "user", content: message });
  history.push({ role: "assistant", content: reply });

  await db
    .update(apiKeysTable)
    .set({ requestCount: (keyRecord[0].requestCount ?? 0) + 1 })
    .where(eq(apiKeysTable.key, apiKey));

  const response = SendChatMessageResponse.parse({ reply, sessionId });
  res.json(response);
});

export default router;
