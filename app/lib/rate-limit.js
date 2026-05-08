const buckets = new Map();
const MS_PER_MINUTE = 60_000;

function getBucket(key, capacity) {
  const existing = buckets.get(key);
  if (existing) return existing;
  const fresh = { tokens: capacity, lastRefill: Date.now() };
  buckets.set(key, fresh);
  return fresh;
}

function refill(bucket, capacity) {
  const now = Date.now();
  const elapsed = now - bucket.lastRefill;
  if (elapsed <= 0) return;
  const refilled = (elapsed / MS_PER_MINUTE) * capacity;
  bucket.tokens = Math.min(capacity, bucket.tokens + refilled);
  bucket.lastRefill = now;
}

export function take(key, limitPerMinute) {
  if (!Number.isFinite(limitPerMinute) || limitPerMinute <= 0) return true;
  const bucket = getBucket(key, limitPerMinute);
  refill(bucket, limitPerMinute);
  if (bucket.tokens >= 1) {
    bucket.tokens -= 1;
    return true;
  }
  return false;
}

export function clientIp(request) {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  const real = request.headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}

export function _resetForTests() {
  buckets.clear();
}
