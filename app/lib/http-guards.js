import { clientIp, take } from "./rate-limit.js";

const DEFAULT_MAX_INPUT = 4000;
const DEFAULT_RATE_LIMIT_RPM = 10;

function parseAllowedOrigins() {
  const raw = process.env.ALLOWED_ORIGINS;
  if (!raw) return null;
  const list = raw.split(",").map((s) => s.trim()).filter(Boolean);
  return list.length > 0 ? list : null;
}

export function checkOrigin(request) {
  const allowed = parseAllowedOrigins();
  if (!allowed) return { ok: true };
  const origin = request.headers.get("origin");
  if (!origin) return { ok: true };
  if (allowed.includes(origin)) return { ok: true };
  return { ok: false, status: 403, code: "forbidden_origin", message: "Forbidden" };
}

export function checkRateLimit(request) {
  const raw = Number.parseInt(process.env.RATE_LIMIT_RPM || "", 10);
  const limit = Number.isFinite(raw) && raw > 0 ? raw : DEFAULT_RATE_LIMIT_RPM;
  const ip = clientIp(request);
  if (take(ip, limit)) return { ok: true };
  return {
    ok: false,
    status: 429,
    code: "rate_limited",
    message: "Rate-Limit erreicht. Bitte später erneut versuchen.",
    limit,
  };
}

export function maxInputChars() {
  const raw = Number.parseInt(process.env.MAX_INPUT_CHARS || "", 10);
  return Number.isFinite(raw) && raw > 0 ? raw : DEFAULT_MAX_INPUT;
}

export function checkLength({ subject, from, body }) {
  const limit = maxInputChars();
  const total = (subject?.length || 0) + (from?.length || 0) + (body?.length || 0);
  if (total <= limit) return { ok: true };
  return {
    ok: false,
    status: 400,
    code: "input_too_long",
    message: "Input zu lang",
    limit,
  };
}

export function errorResponse(failure) {
  const payload = {
    error: failure.message,
    code: failure.code,
  };
  if (typeof failure.limit === "number") payload.limit = failure.limit;
  return Response.json(payload, { status: failure.status });
}
