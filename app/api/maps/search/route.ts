import { NextRequest, NextResponse } from "next/server";
import { searchPlaces } from "@/features/maps/application/searchPlaces";
import {
  getClientIp,
  rateLimitHeaders,
  createRateLimiter,
} from "@/lib/rateLimit";

export const runtime = "nodejs";

const mapSearchLimiter = createRateLimiter({
  max: 20,
  windowMs: 60_000,
});

export async function GET(request: NextRequest) {
  const ip = getClientIp(request);
  const rateLimitResult = mapSearchLimiter.check(ip);

  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { message: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요." },
      { status: 429, headers: rateLimitHeaders(rateLimitResult) },
    );
  }

  const provider = request.nextUrl.searchParams.get("provider") ?? "naver";
  const query = request.nextUrl.searchParams.get("query") ?? "";

  try {
    const result = await searchPlaces({ provider, query });
    return NextResponse.json(
      { provider, query, places: result.places },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        },
      },
    );
  } catch (error) {
    const candidate = error as { code?: string; message?: string };
    const message = candidate.message ?? "지도 검색에 실패했습니다.";

    if (candidate.code === "INVALID_QUERY") {
      return NextResponse.json({ message }, { status: 400 });
    }

    if (candidate.code === "INVALID_PROVIDER") {
      return NextResponse.json({ message }, { status: 400 });
    }

    if (candidate.code === "PROVIDER_UNAVAILABLE") {
      return NextResponse.json({ message }, { status: 503 });
    }

    return NextResponse.json({ message }, { status: 500 });
  }
}
