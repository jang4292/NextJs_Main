import { NextRequest, NextResponse } from "next/server";
import {
  createSessionToken,
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  sessionCookieOptions,
} from "@/lib/auth";
import { verifyCredentials } from "@/lib/credentials";
import {
  createRateLimiter,
  getClientIp,
  rateLimitHeaders,
  RATE_LIMIT_MESSAGE,
} from "@/lib/rateLimit";

export const runtime = "nodejs";

interface LoginRequest {
  username: string;
  password: string;
}

const LOGIN_WINDOW_MS = 5 * 60 * 1000;
const MAX_USERNAME_LENGTH = 100;
const MAX_PASSWORD_LENGTH = 200;
const INVALID_REQUEST_MESSAGE = "요청 형식이 올바르지 않습니다.";
const INPUT_TOO_LONG_MESSAGE = "입력 길이가 너무 깁니다.";

const loginIpLimiter = createRateLimiter({
  max: 10,
  windowMs: LOGIN_WINDOW_MS,
});

const loginUsernameLimiter = createRateLimiter({
  max: 5,
  windowMs: LOGIN_WINDOW_MS,
});

function isLoginRequest(value: unknown): value is LoginRequest {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<LoginRequest>;
  return (
    typeof candidate.username === "string" &&
    typeof candidate.password === "string"
  );
}

export async function POST(request: NextRequest) {
  const ipLimit = loginIpLimiter.check(getClientIp(request));
  if (!ipLimit.allowed) {
    return NextResponse.json(
      { message: RATE_LIMIT_MESSAGE },
      { status: 429, headers: rateLimitHeaders(ipLimit) },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: INVALID_REQUEST_MESSAGE },
      { status: 400 },
    );
  }

  if (!isLoginRequest(body)) {
    return NextResponse.json(
      { message: INVALID_REQUEST_MESSAGE },
      { status: 400 },
    );
  }

  const username = body.username.trim();
  const { password } = body;

  if (!username || !password) {
    return NextResponse.json(
      { message: "아이디와 비밀번호를 입력해주세요." },
      { status: 400 },
    );
  }

  if (
    username.length > MAX_USERNAME_LENGTH ||
    password.length > MAX_PASSWORD_LENGTH
  ) {
    return NextResponse.json(
      { message: INPUT_TOO_LONG_MESSAGE },
      { status: 400 },
    );
  }

  const usernameLimit = loginUsernameLimiter.check(username.toLowerCase());
  if (!usernameLimit.allowed) {
    return NextResponse.json(
      { message: RATE_LIMIT_MESSAGE },
      { status: 429, headers: rateLimitHeaders(usernameLimit) },
    );
  }

  const isValid = await verifyCredentials(username, password);
  if (!isValid) {
    return NextResponse.json(
      { message: "아이디 또는 비밀번호가 올바르지 않습니다." },
      { status: 401 },
    );
  }

  const token = await createSessionToken(username);
  const response = NextResponse.json({ message: "로그인 성공" });
  response.cookies.set(
    SESSION_COOKIE,
    token,
    sessionCookieOptions(SESSION_MAX_AGE_SECONDS),
  );
  return response;
}
