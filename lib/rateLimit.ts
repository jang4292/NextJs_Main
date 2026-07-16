export interface RateLimitOptions {
  max: number;
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  retryAfterSeconds: number;
}

interface Bucket {
  count: number;
  resetAt: number;
}

const UNKNOWN_CLIENT = "unknown";
const registeredLimiters = new Set<MemoryRateLimiter>();

export const RATE_LIMIT_MESSAGE =
  "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.";

export class MemoryRateLimiter {
  private readonly buckets = new Map<string, Bucket>();

  constructor(private readonly options: RateLimitOptions) {
    if (options.max < 1) {
      throw new Error("Rate limit max must be at least 1");
    }
    if (options.windowMs < 1) {
      throw new Error("Rate limit windowMs must be at least 1");
    }
  }

  check(key: string, nowMs = Date.now()): RateLimitResult {
    const normalizedKey = key.trim() || UNKNOWN_CLIENT;
    const existing = this.buckets.get(normalizedKey);

    if (!existing || existing.resetAt <= nowMs) {
      const resetAt = nowMs + this.options.windowMs;
      this.buckets.set(normalizedKey, { count: 1, resetAt });
      return this.result(true, this.options.max - 1, resetAt, nowMs);
    }

    if (existing.count >= this.options.max) {
      return this.result(false, 0, existing.resetAt, nowMs);
    }

    existing.count += 1;
    return this.result(
      true,
      this.options.max - existing.count,
      existing.resetAt,
      nowMs,
    );
  }

  reset(): void {
    this.buckets.clear();
  }

  private result(
    allowed: boolean,
    remaining: number,
    resetAt: number,
    nowMs: number,
  ): RateLimitResult {
    return {
      allowed,
      remaining,
      resetAt,
      retryAfterSeconds: Math.max(1, Math.ceil((resetAt - nowMs) / 1000)),
    };
  }
}

export function createRateLimiter(
  options: RateLimitOptions,
): MemoryRateLimiter {
  const limiter = new MemoryRateLimiter(options);
  registeredLimiters.add(limiter);
  return limiter;
}

export function resetRateLimitersForTest(): void {
  registeredLimiters.forEach((limiter) => limiter.reset());
}

export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const firstIp = forwardedFor.split(",")[0]?.trim();
    if (firstIp) return firstIp;
  }

  return (
    request.headers.get("cf-connecting-ip")?.trim() ||
    request.headers.get("true-client-ip")?.trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    UNKNOWN_CLIENT
  );
}

export function rateLimitHeaders(
  result: RateLimitResult,
): Record<string, string> {
  return {
    "Retry-After": String(result.retryAfterSeconds),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(Math.ceil(result.resetAt / 1000)),
  };
}
