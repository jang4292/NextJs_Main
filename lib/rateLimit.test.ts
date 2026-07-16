import { describe, expect, it } from "vitest";
import { getClientIp, MemoryRateLimiter, rateLimitHeaders } from "./rateLimit";

describe("MemoryRateLimiter", () => {
  it("allows requests until the max is reached", () => {
    const limiter = new MemoryRateLimiter({ max: 2, windowMs: 1000 });

    expect(limiter.check("client", 1000)).toMatchObject({
      allowed: true,
      remaining: 1,
    });
    expect(limiter.check("client", 1100)).toMatchObject({
      allowed: true,
      remaining: 0,
    });
    expect(limiter.check("client", 1200)).toMatchObject({
      allowed: false,
      remaining: 0,
    });
  });

  it("opens a new window after resetAt passes", () => {
    const limiter = new MemoryRateLimiter({ max: 1, windowMs: 1000 });

    expect(limiter.check("client", 1000).allowed).toBe(true);
    expect(limiter.check("client", 1500).allowed).toBe(false);
    expect(limiter.check("client", 2000).allowed).toBe(true);
  });

  it("tracks keys independently", () => {
    const limiter = new MemoryRateLimiter({ max: 1, windowMs: 1000 });

    expect(limiter.check("a", 1000).allowed).toBe(true);
    expect(limiter.check("a", 1001).allowed).toBe(false);
    expect(limiter.check("b", 1002).allowed).toBe(true);
  });

  it("emits retry headers", () => {
    const limiter = new MemoryRateLimiter({ max: 1, windowMs: 1000 });
    limiter.check("client", 1000);
    const result = limiter.check("client", 1200);

    expect(rateLimitHeaders(result)).toEqual({
      "Retry-After": "1",
      "X-RateLimit-Remaining": "0",
      "X-RateLimit-Reset": "2",
    });
  });
});

describe("getClientIp", () => {
  it("uses the first x-forwarded-for value", () => {
    const request = new Request("https://example.com", {
      headers: {
        "x-forwarded-for": "203.0.113.10, 198.51.100.20",
      },
    });

    expect(getClientIp(request)).toBe("203.0.113.10");
  });

  it("falls back to unknown", () => {
    expect(getClientIp(new Request("https://example.com"))).toBe("unknown");
  });
});
