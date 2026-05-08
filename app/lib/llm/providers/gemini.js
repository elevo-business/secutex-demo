import { GoogleGenerativeAI } from "@google/generative-ai";

const DEFAULT_MODEL = "gemini-2.0-flash-exp";

let cachedClient = null;
let cachedKey = null;

function getClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (cachedClient && cachedKey === apiKey) return cachedClient;
  cachedClient = new GoogleGenerativeAI(apiKey);
  cachedKey = apiKey;
  return cachedClient;
}

export const name = "gemini";

export function isConfigured() {
  return Boolean(process.env.GEMINI_API_KEY);
}

function abortablePromise(signal) {
  return new Promise((_, reject) => {
    if (!signal) return;
    if (signal.aborted) {
      reject(new Error("gemini_aborted"));
      return;
    }
    signal.addEventListener(
      "abort",
      () => reject(new Error("gemini_aborted")),
      { once: true }
    );
  });
}

export async function call({ system, user, signal }) {
  const client = getClient();
  if (!client) {
    throw new Error("gemini_not_configured");
  }
  const model = client.getGenerativeModel({
    model: process.env.GEMINI_MODEL || DEFAULT_MODEL,
    systemInstruction: system,
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.1,
      maxOutputTokens: 1500,
    },
  });
  const generation = model.generateContent(user);
  const result = signal
    ? await Promise.race([generation, abortablePromise(signal)])
    : await generation;
  const text = result?.response?.text?.();
  if (!text) {
    throw new Error("gemini_empty_response");
  }
  return JSON.parse(text);
}
