import { NextRequest, NextResponse } from "next/server";
import {
  createMediaErrorResponse,
  MediaDownloaderError,
  mediaErrorMessages,
  mediaErrorStatus,
  toMediaDownloaderError,
} from "@/features/media-downloader/application/errors";
import { validateMediaUrl } from "@/features/media-downloader/application/urlValidation";
import { analyzeYoutubeVideo } from "@/features/media-downloader/infrastructure/youtubeExtractor";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type AnalyzeRequestBody = {
  url: string;
};

function isAnalyzeRequestBody(value: unknown): value is AnalyzeRequestBody {
  return (
    Boolean(value) &&
    typeof value === "object" &&
    typeof (value as Partial<AnalyzeRequestBody>).url === "string"
  );
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        code: "INVALID_URL",
        message: mediaErrorMessages.INVALID_URL,
      },
      { status: mediaErrorStatus.INVALID_URL },
    );
  }

  if (!isAnalyzeRequestBody(body)) {
    return NextResponse.json(
      {
        code: "INVALID_URL",
        message: mediaErrorMessages.INVALID_URL,
      },
      { status: mediaErrorStatus.INVALID_URL },
    );
  }

  const validation = validateMediaUrl(body.url);
  if (!validation.ok) {
    return NextResponse.json(
      { code: validation.code, message: validation.message },
      { status: mediaErrorStatus[validation.code] },
    );
  }

  try {
    const mediaInfo = await analyzeYoutubeVideo(validation.url);
    return NextResponse.json(mediaInfo);
  } catch (error) {
    const mediaError =
      error instanceof MediaDownloaderError
        ? error
        : toMediaDownloaderError(error, "MEDIA_UNAVAILABLE");

    console.error("Media analyze failed:", mediaError.internalMessage ?? error);
    return NextResponse.json(createMediaErrorResponse(mediaError), {
      status: mediaError.status,
    });
  }
}
