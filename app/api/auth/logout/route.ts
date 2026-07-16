import { NextResponse } from "next/server";
import { SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth";

export async function POST() {
  const response = NextResponse.json({ message: "로그아웃 되었습니다." });
  response.cookies.set(SESSION_COOKIE, "", sessionCookieOptions(0));
  return response;
}
