import { extract } from "../../lib/llm/index.js";
import { sanitizeInput } from "../../lib/sanitize.js";
import {
  checkOrigin,
  checkRateLimit,
  checkLength,
  errorResponse,
} from "../../lib/http-guards.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function logServerError(scope, err) {
  // Detaillierte Fehler nur ins Server-Log; nicht an den Client leaken.
  console.error(`[extract:${scope}]`, err?.stack || err);
}

async function readJson(request) {
  try {
    return { ok: true, value: await request.json() };
  } catch (err) {
    return {
      ok: false,
      failure: {
        status: 400,
        code: "invalid_json",
        message: "Body ist kein gültiges JSON.",
      },
      err,
    };
  }
}

function validatePayload(payload) {
  if (!payload || typeof payload !== "object") {
    return {
      ok: false,
      failure: { status: 400, code: "invalid_body", message: "Body fehlt oder ungültig." },
    };
  }
  if (!payload.body || typeof payload.body !== "string") {
    return {
      ok: false,
      failure: { status: 400, code: "missing_body", message: "Feld 'body' fehlt oder ungültig." },
    };
  }
  return { ok: true };
}

export async function POST(request) {
  const origin = checkOrigin(request);
  if (!origin.ok) return errorResponse(origin);

  const rate = checkRateLimit(request);
  if (!rate.ok) return errorResponse(rate);

  const parsed = await readJson(request);
  if (!parsed.ok) {
    logServerError("json", parsed.err);
    return errorResponse(parsed.failure);
  }

  const validated = validatePayload(parsed.value);
  if (!validated.ok) return errorResponse(validated.failure);

  const sanitized = sanitizeInput(parsed.value);

  const length = checkLength(sanitized);
  if (!length.ok) return errorResponse(length);

  try {
    const result = await extract(sanitized);
    return Response.json(result);
  } catch (err) {
    logServerError("chain", err);
    return errorResponse({
      status: 500,
      code: "extract_failed",
      message: "Extraktion fehlgeschlagen.",
    });
  }
}
