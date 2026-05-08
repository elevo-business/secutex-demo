import OpenAI from "openai";

const GROQ_BASE_URL = "https://api.groq.com/openai/v1";
const DEFAULT_MODEL = "llama-3.3-70b-versatile";

let cachedClient = null;
let cachedKey = null;

function getClient() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;
  if (cachedClient && cachedKey === apiKey) return cachedClient;
  cachedClient = new OpenAI({ apiKey, baseURL: GROQ_BASE_URL });
  cachedKey = apiKey;
  return cachedClient;
}

export const name = "groq";

export function isConfigured() {
  return Boolean(process.env.GROQ_API_KEY);
}

export async function call({ system, user, signal }) {
  const client = getClient();
  if (!client) {
    throw new Error("groq_not_configured");
  }
  const completion = await client.chat.completions.create(
    {
      model: process.env.GROQ_MODEL || DEFAULT_MODEL,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      response_format: { type: "json_object" },
      temperature: 0.1,
      max_tokens: 1500,
    },
    { signal }
  );
  const content = completion.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("groq_empty_response");
  }
  return JSON.parse(content);
}
