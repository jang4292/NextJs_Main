import { NextRequest, NextResponse } from "next/server";
import {
  createMediaErrorResponse,
  MediaDownloaderError,
  mediaErrorMessages,
  mediaErrorStatus,
  toMediaDownloaderError,
} from "@/features/media-downloader/application/errors";
import type { DownloadRequest } from "@/features/media-downloader/domain/mediaTypes";
import { downloadYoutubeMedia } from "@/features/media-downloader/infrastructure/mediaDownloader";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isDownloadRequestBody(value: unknown): value is DownloadRequest {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<DownloadRequest>;
  return (
    typeof candidate.url === "string" &&
    (candidate.type === "video" || candidate.type === "audio") &&
    typeof candidate.formatId === "string" &&
    (candidate.quality === undefined || typeof candidate.quality === "string")
  );
}

function bufferToArrayBuffer(data: Uint8Array): ArrayBuffer {
  return data.buffer.slice(
    data.byteOffset,
    data.byteOffset + data.byteLength,
  ) as ArrayBuffer;
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

  if (!isDownloadRequestBody(body)) {
    return NextResponse.json(
      {
        code: "FORMAT_NOT_AVAILABLE",
        message: mediaErrorMessages.FORMAT_NOT_AVAILABLE,
      },
      { status: mediaErrorStatus.FORMAT_NOT_AVAILABLE },
    );
  }

  try {
    const file = await downloadYoutubeMedia(body);
    const encodedFilename = encodeURIComponent(file.filename);

    return new Response(bufferToArrayBuffer(file.data), {
      status: 200,
      headers: {
        "Content-Type": file.contentType,
        "Content-Length": String(file.byteLength),
        "Content-Disposition": `attachment; filename="${file.filename}"; filename*=UTF-8''${encodedFilename}`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const mediaError =
      error instanceof MediaDownloaderError
        ? error
        : toMediaDownloaderError(error, "DOWNLOAD_FAILED");

    console.error(
      "Media download failed:",
      mediaError.internalMessage ?? error,
    );
    return NextResponse.json(createMediaErrorResponse(mediaError), {
      status: mediaError.status,
    });
  }
}
