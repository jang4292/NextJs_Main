import { SignJWT } from "jose/jwt/sign";
import { beforeEach, describe, expect, it } from "vitest";
import { createSessionToken, verifySessionToken } from "./auth";

const TEST_SECRET = "test-session-secret-that-is-long-enough-1234567890";

describe("session tokens", () => {
  beforeEach(() => {
    process.env.SESSION_SECRET = TEST_SECRET;
  });

  it("round-trips a token through createSessionToken and verifySessionToken", async () => {
    const token = await createSessionToken("admin");
    const payload = await verifySessionToken(token);
    expect(payload).not.toBeNull();
    expect(payload?.sub).toBe("admin");
  });

  it("returns null for a malformed token", async () => {
    const payload = await verifySessionToken("not-a-real-token");
    expect(payload).toBeNull();
  });

  it("returns null for a token signed with a different secret", async () => {
    const token = await new SignJWT({ sub: "admin" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("2h")
      .sign(new TextEncoder().encode("a-completely-different-secret-value"));

    const payload = await verifySessionToken(token);
    expect(payload).toBeNull();
  });

  it("returns null for an expired token", async () => {
    const nowSeconds = Math.floor(Date.now() / 1000);
    const token = await new SignJWT({ sub: "admin" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt(nowSeconds - 100)
      .setExpirationTime(nowSeconds - 10)
      .sign(new TextEncoder().encode(TEST_SECRET));

    const payload = await verifySessionToken(token);
    expect(payload).toBeNull();
  });
});
