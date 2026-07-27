import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { JWTPayload } from "jose";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

export async function getAdminSession(): Promise<JWTPayload | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return token ? verifySessionToken(token) : null;
}

export async function requireAdminSession(): Promise<JWTPayload> {
  const session = await getAdminSession();
  if (!session) {
    redirect("/login");
  }
  return session;
}

export function getAdminSessionUsername(session: JWTPayload): string {
  return typeof session.sub === "string" ? session.sub : "관리자";
}
