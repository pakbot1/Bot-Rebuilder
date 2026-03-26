import { Router, type IRouter } from "express";
import { db, apiKeysTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { openai } from "@workspace/integrations-openai-ai-server";
import { SendChatMessageBody, SendChatMessageResponse } from "@workspace/api-zod";

const router: IRouter = Router();

const sessions = new Map<string, Array<{ role: "user" | "assistant"; content: string }>>();

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

  const { message, sessionId = `session_${Date.now()}` } = body.data;

  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, [
      {
        role: "assistant",
        content: "Assalam o Alaikum! Main PakBot hoon — Pakistan ka pehla AI assistant. Aap mujhse kuch bhi pooch sakte hain! 😊",
      },
    ]);
  }

  const history = sessions.get(sessionId)!;
  history.push({ role: "user", content: message });

  const completion = await openai.chat.completions.create({
    model: "gpt-5-mini",
    messages: [
      {
        role: "system",
        content: `You are PakBot, Pakistan's first AI assistant. You are friendly, helpful, and knowledgeable. 
You can speak both English and Urdu. When users greet you in Urdu/Roman Urdu, respond warmly in the same language.
You are proud to represent Pakistan and can discuss Pakistani culture, history, and current events.
Keep responses concise but informative.`,
      },
      ...history,
    ],
  });

  const reply = completion.choices[0]?.message?.content ?? "Kuch masla ho gaya, dobara try karo.";
  history.push({ role: "assistant", content: reply });

  await db
    .update(apiKeysTable)
    .set({ requestCount: (keyRecord[0].requestCount ?? 0) + 1 })
    .where(eq(apiKeysTable.key, apiKey));

  const response = SendChatMessageResponse.parse({ reply, sessionId });
  res.json(response);
});

export default router;
