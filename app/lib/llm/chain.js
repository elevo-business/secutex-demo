import * as groq from "./providers/groq.js";
import * as gemini from "./providers/gemini.js";
import * as canned from "./providers/canned.js";
import { SYSTEM_PROMPT, buildUserMessage } from "./prompt.js";
import { safeParseQuote } from "./schema.js";

const PROVIDERS = { groq, gemini, canned };
const DEFAULT_PRIMARY = "gemini";
const DEFAULT_FALLBACK = "canned";
const DEFAULT_TIMEOUT_MS = 8000;
const FORCED_DEMO_ORDER = ["canned"];

function parseOrder() {
  if (process.env.DEMO_MODE_FORCE === "true") return FORCED_DEMO_ORDER;
  const primary = (process.env.LLM_PRIMARY || DEFAULT_PRIMARY).trim();
  const fallback = (process.env.LLM_FALLBACK || DEFAULT_FALLBACK)
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);
  const seen = new Set();
  const ordered = [];
  for (const candidate of [primary, ...fallback]) {
    if (!candidate || seen.has(candidate)) continue;
    if (!PROVIDERS[candidate]) continue;
    seen.add(candidate);
    ordered.push(candidate);
  }
  if (!ordered.includes("canned")) ordered.push("canned");
  return ordered;
}

function timeoutMs() {
  const raw = Number.parseInt(process.env.LLM_TIMEOUT_MS || "", 10);
  return Number.isFinite(raw) && raw > 0 ? raw : DEFAULT_TIMEOUT_MS;
}

function classifyError(err) {
  if (!err) return "provider_error";
  if (err.name === "AbortError") return "timeout";
  const msg = String(err.message || err).toLowerCase();
  if (msg.includes("aborted") || msg.includes("timeout")) return "timeout";
  if (err.status === 401 || err.status === 403 || msg.includes("api key") || msg.includes("unauthorized")) {
    return "auth_failed";
  }
  if (err.status === 429 || msg.includes("rate")) return "rate_limited";
  if (err.status >= 500 || msg.includes("network") || msg.includes("fetch")) return "unavailable";
  if (msg.includes("json") || msg.includes("parse")) return "invalid_response";
  return "provider_error";
}

async function runProvider(providerName, payload) {
  const provider = PROVIDERS[providerName];
  if (!provider) {
    return { ok: false, reason: "unknown_provider" };
  }
  if (!provider.isConfigured()) {
    return { ok: false, reason: "not_configured" };
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs());
  const startedAt = Date.now();
  try {
    const raw = await provider.call({
      system: SYSTEM_PROMPT,
      user: buildUserMessage(payload),
      mailId: payload.mailId,
      signal: controller.signal,
    });
    const parsed = safeParseQuote(raw);
    if (!parsed.ok) {
      console.warn(`[llm:${providerName}] schema_invalid:`, parsed.error);
      return { ok: false, reason: "schema_invalid" };
    }
    return {
      ok: true,
      data: parsed.data,
      latencyMs: Date.now() - startedAt,
    };
  } catch (err) {
    console.warn(`[llm:${providerName}] error:`, err?.stack || err);
    return { ok: false, reason: classifyError(err) };
  } finally {
    clearTimeout(timer);
  }
}

export async function run(payload) {
  const order = parseOrder();
  const attempts = [];
  for (const providerName of order) {
    const result = await runProvider(providerName, payload);
    attempts.push({ provider: providerName, ok: result.ok, reason: result.reason });
    if (result.ok) {
      return {
        data: result.data,
        _meta: {
          source: providerName,
          latencyMs: result.latencyMs,
          attempts,
        },
      };
    }
  }
  throw new Error(`llm_chain_exhausted: ${JSON.stringify(attempts)}`);
}
