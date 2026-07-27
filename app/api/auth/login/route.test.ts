import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it } from "vitest";
import { resetRateLimitersForTest } from "@/lib/rateLimit";
import { POST } from "./route";

const TEST_USERNAME = "admin";
const TEST_PASSWORD = "correct-horse-battery-staple";
const TEST_PASSWORD_HASH =
  "$2b$10$8VjW5d8QN5Vi4e.l5bgiLunHH/j3b6wwAKH9satTFmD2g6ootywvC";
const TEST_SECRET = "test-session-secret-that-is-long-enough-1234567890";

function loginRequest(body: unknown, ip = "203.0.113.10") {
  return new NextRequest("http://localhost/api/auth/login", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": ip,
    },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

describe("POST /api/auth/login", () => {
  beforeEach(() => {
    resetRateLimitersForTest();
    process.env.ADMIN_USERNAME = TEST_USERNAME;
    process.env.ADMIN_PASSWORD_HASH = TEST_PASSWORD_HASH;
    process.env.SESSION_SECRET = TEST_SECRET;
  });

  it("returns 400 for malformed JSON", async () => {
    const response = await POST(loginRequest("{"));

    await expect(response.json()).resolves.toEqual({
      message: "요청 형식이 올바르지 않습니다.",
    });
    expect(response.status).toBe(400);
  });

  it("returns 400 for missing credentials", async () => {
    const response = await POST(loginRequest({ username: "", password: "" }));

    await expect(response.json()).resolves.toEqual({
      message: "아이디와 비밀번호를 입력해주세요.",
    });
    expect(response.status).toBe(400);
  });

  it("returns 400 for non-string credentials", async () => {
    const response = await POST(
      loginRequest({ username: TEST_USERNAME, password: 123 }),
    );

    await expect(response.json()).resolves.toEqual({
      message: "요청 형식이 올바르지 않습니다.",
    });
    expect(response.status).toBe(400);
  });

  it("returns 400 for overlong credentials", async () => {
    const response = await POST(
      loginRequest({ username: "a".repeat(101), password: TEST_PASSWORD }),
    );

    await expect(response.json()).resolves.toEqual({
      message: "입력 길이가 너무 깁니다.",
    });
    expect(response.status).toBe(400);
  });

  it("returns 401 for invalid credentials", async () => {
    const response = await POST(
      loginRequest({ username: TEST_USERNAME, password: "wrong-password" }),
    );

    await expect(response.json()).resolves.toEqual({
      message: "아이디 또는 비밀번호가 올바르지 않습니다.",
    });
    expect(response.status).toBe(401);
  });

  it("sets the admin session cookie for valid credentials", async () => {
    const response = await POST(
      loginRequest({ username: TEST_USERNAME, password: TEST_PASSWORD }),
    );

    await expect(response.json()).resolves.toEqual({ message: "로그인 성공" });
    expect(response.status).toBe(200);
    expect(response.headers.get("set-cookie")).toContain("admin_session=");
  });

  it("returns 500 when admin credential env is missing", async () => {
    delete process.env.ADMIN_PASSWORD_HASH;

    const response = await POST(
      loginRequest({ username: TEST_USERNAME, password: TEST_PASSWORD }),
    );

    await expect(response.json()).resolves.toEqual({
      message: "서버 설정 오류가 발생했습니다.",
    });
    expect(response.status).toBe(500);
  });

  it("returns 500 when session secret env is missing", async () => {
    delete process.env.SESSION_SECRET;

    const response = await POST(
      loginRequest({ username: TEST_USERNAME, password: TEST_PASSWORD }),
    );

    await expect(response.json()).resolves.toEqual({
      message: "서버 설정 오류가 발생했습니다.",
    });
    expect(response.status).toBe(500);
  });

  it("rate limits repeated attempts for a username", async () => {
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const response = await POST(
        loginRequest({
          username: TEST_USERNAME,
          password: `wrong-password-${attempt}`,
        }),
      );
      expect(response.status).toBe(401);
    }

    const response = await POST(
      loginRequest({ username: TEST_USERNAME, password: "wrong-password-5" }),
    );

    await expect(response.json()).resolves.toEqual({
      message: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.",
    });
    expect(response.status).toBe(429);
    expect(response.headers.get("retry-after")).toBeTruthy();
  });
});
