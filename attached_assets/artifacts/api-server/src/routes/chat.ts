import { Router, type IRouter } from "express";
import { db, apiKeysTable, instructionsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import Groq from "groq-sdk";
import {
  SendChatMessageBody,
  SendChatMessageResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const sessions = new Map<
  string,
  Array<{ role: "user" | "assistant"; content: string }>
>();

const INSTRUCTIONS_ID = "singleton";

async function getSystemPrompt(): Promise<string> {
  try {
    const row = await db
      .select()
      .from(instructionsTable)
      .where(eq(instructionsTable.id, INSTRUCTIONS_ID))
      .limit(1);
    if (row.length > 0) return row[0].content;
  } catch {}
  return `You are PakBot, Pakistan's first AI assistant. You are friendly, helpful, and knowledgeable.
You can speak both English and Urdu. When users greet you in Urdu/Roman Urdu, respond warmly in the same language.
You are proud to represent Pakistan and can discuss Pakistani culture, history, and current events.
Keep responses concise but informative. Always match the user's language exactly.`;
}

// Fetch and extract text from a URL
async function fetchUrlContent(url: string): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "PakBot-URLReader/1.0" },
    });
    clearTimeout(timeout);
    if (!res.ok) return `Could not fetch URL (status ${res.status}).`;
    const html = await res.text();
    // Strip HTML tags and collapse whitespace
    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 8000); // limit content length
    return text || "No readable content found at this URL.";
  } catch (err: any) {
    clearTimeout(timeout);
    if (err?.name === "AbortError")
      return "Request timed out while fetching the URL.";
    return `Could not fetch URL: ${err?.message ?? "Unknown error"}`;
  }
}

// Helper: authenticate and validate API key
async function authenticateKey(
  req: any,
  res: any,
): Promise<typeof apiKeysTable.$inferSelect | null> {
  const apiKey = req.headers["x-api-key"] as string | undefined;
  logger.info({ apiKey: apiKey || "MISSING" }, "DEBUG: X-API-Key header received");
  
  if (!apiKey) {
    res
      .status(401)
      .json({
        error: "API key required.",
        hint: "Pass your key as the X-API-Key header: X-API-Key: pk_...",
      });
    return null;
  }
  
  const keyRecord = await db
    .select()
    .from(apiKeysTable)
    .where(eq(apiKeysTable.key, apiKey))
    .limit(1);
  
  logger.info({ 
    searchKey: apiKey, 
    foundRecords: keyRecord.length,
    firstRecord: keyRecord[0] || "NONE"
  }, "DEBUG: Database query result");
  
  if (keyRecord.length === 0) {
    logger.info({ searchKey: apiKey }, "DEBUG: API key not found in database");
    res.status(401).json({ error: "Invalid API key." });
    return null;
  }
  
  logger.info({ 
    isActive: keyRecord[0].is_active,
    recordDetails: keyRecord[0]
  }, "DEBUG: Checking API key active status");
  
  if (!keyRecord[0].is_active) {
    logger.info({ searchKey: apiKey }, "DEBUG: API key is inactive");
    res.status(401).json({ error: "API key is disabled." });
    return null;
  }
  
  logger.info({ searchKey: apiKey }, "DEBUG: API key validation successful");
  return keyRecord[0];
}

// Helper: build OpenAI message content from body
async function buildMessages(
  body: any,
  systemPrompt: string,
  history: Array<{ role: "user" | "assistant"; content: string }>,
) {
  const { message, imageBase64, imageMimeType, url } = body;

  let urlContext = "";
  if (url) {
    const content = await fetchUrlContent(url);
    urlContext = `\n\n[URL Content from ${url}]:\n${content}\n[End of URL Content]`;
  }

  const userText = message + urlContext;

  // Use vision-capable model when image is present
  const model = "llama-3.3-70b-versatile";

  let userContent: any;
  if (imageBase64) {
    const mimeType = imageMimeType ?? "image/jpeg";
    userContent = [
      { type: "text", text: userText },
      {
        type: "image_url",
        image_url: { url: `data:${mimeType};base64,${imageBase64}` },
      },
    ];
  } else {
    userContent = userText;
  }

  const messages = [
    { role: "system" as const, content: systemPrompt },
    ...history.map((h) => ({
      role: h.role as "user" | "assistant",
      content: h.content,
    })),
    { role: "user" as const, content: userContent },
  ];

  return { messages, model };
}

// POST /chat — standard JSON response
router.post("/chat", async (req, res) => {
  const keyRecord = await authenticateKey(req, res);
  if (!keyRecord) return;

  const body = SendChatMessageBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: "Invalid request body." });
    return;
  }

  const { message, sessionId = `session_${Date.now()}`, url } = body.data;

  if (!sessions.has(sessionId)) sessions.set(sessionId, []);
  const history = sessions.get(sessionId)!;
  const systemPrompt = await getSystemPrompt();

  const { messages, model } = await buildMessages(
    body.data,
    systemPrompt,
    history,
  );

  // Graceful URL error
  if (
    url &&
    messages[messages.length - 1]?.content
      ?.toString()
      .includes("Could not fetch URL")
  ) {
    const errText = messages[messages.length - 1].content as string;
    if (
      errText.startsWith("Could not fetch URL") ||
      errText.startsWith("Request timed out") ||
      errText.startsWith("No readable")
    ) {
      res.status(422).json({ error: errText });
      return;
    }
  }

  const completion = await groq.chat.completions.create({ model, messages });

  const reply =
    completion.choices[0]?.message?.content ??
    "Kuch masla ho gaya, dobara try karo.";

  history.push({ role: "user", content: message });
  history.push({ role: "assistant", content: reply });

  await db
    .update(apiKeysTable)
    .set({ requestCount: (keyRecord.requestCount ?? 0) + 1 })
    .where(eq(apiKeysTable.key, keyRecord.key));

  res.json(SendChatMessageResponse.parse({ reply, sessionId }));
});

// POST /chat/stream — Server-Sent Events streaming response
router.post("/chat/stream", async (req, res) => {
  const keyRecord = await authenticateKey(req, res);
  if (!keyRecord) return;

  const body = SendChatMessageBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: "Invalid request body." });
    return;
  }

  const { message, sessionId = `session_${Date.now()}` } = body.data;

  if (!sessions.has(sessionId)) sessions.set(sessionId, []);
  const history = sessions.get(sessionId)!;
  const systemPrompt = await getSystemPrompt();

  const { messages, model } = await buildMessages(
    body.data,
    systemPrompt,
    history,
  );

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");

  const completion = await groq.chat.completions.create({
    model,
    messages,
    stream: true,
  });

  let fullReply = "";
  for await (const chunk of completion) {
    const text = chunk.choices[0]?.delta?.content ?? "";
    if (text) {
      fullReply += text;
      res.write(text);
    }
  }
  res.end();

  history.push({ role: "user", content: message });
  history.push({ role: "assistant", content: fullReply });

  await db
    .update(apiKeysTable)
    .set({ requestCount: (keyRecord.requestCount ?? 0) + 1 })
    .where(eq(apiKeysTable.key, keyRecord.key));
});

export default router;
