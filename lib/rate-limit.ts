import "server-only";

type Bucket = { timestamps: number[] };

const store = new Map<string, Bucket>();

function prune(bucket: Bucket, windowMs: number) {
  const cutoff = Date.now() - windowMs;
  bucket.timestamps = bucket.timestamps.filter((t) => t > cutoff);
}

/**
 * Simple in-memory rate limiter.
 * Limits `limit` submissions per `windowMs` per client key (IP).
 * Good for a single-instance deployment; swap for a DB/Redis-backed
 * implementation if scaling horizontally.
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { ok: boolean; remaining: number; retryAfterMs?: number } {
  const now = Date.now();
  let bucket = store.get(key);
  if (!bucket) {
    bucket = { timestamps: [] };
    store.set(key, bucket);
  }
  prune(bucket, windowMs);

  if (bucket.timestamps.length >= limit) {
    const retryAfterMs =
      bucket.timestamps[0] - (now - windowMs) + 1000;
    return { ok: false, remaining: 0, retryAfterMs };
  }

  bucket.timestamps.push(now);
  return { ok: true, remaining: limit - bucket.timestamps.length };
}

/** Coarse cleanup so the map does not grow unbounded. */
setInterval(() => {
  for (const [key, bucket] of store) {
    prune(bucket, 60 * 60 * 1000);
    if (bucket.timestamps.length === 0) store.delete(key);
  }
}, 10 * 60 * 1000).unref();

/** Best-effort client IP extraction from request headers. */
export function getClientIp(headers: Headers): string {
  const fwd = headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return headers.get("x-real-ip") ?? "unknown";
}