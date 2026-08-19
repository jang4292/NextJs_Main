import type {
  DownloadRequest,
  MediaErrorResponse,
  MediaInfo,
} from "../domain/mediaTypes";

export class MediaDownloaderClientError extends Error {
  readonly code: string;

  constructor(error: MediaErrorResponse) {
    super(error.message);
    this.name = "MediaDownloaderClientError";
    this.code = error.code;
  }
}

function isMediaErrorResponse(value: unknown): value is MediaErrorResponse {
  return (
    Boolean(value) &&
    typeof value === "object" &&
    typeof (value as Partial<MediaErrorResponse>).code === "string" &&
    typeof (value as Partial<MediaErrorResponse>).message === "string"
  );
}

async function readJsonResponse(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return undefined;
  }
}

export async function analyzeMedia(
  url: string,
  fetcher: typeof fetch = fetch,
): Promise<MediaInfo> {
  const response = await fetcher("/api/media/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  const payload = await readJsonResponse(response);

  if (!response.ok) {
    if (isMediaErrorResponse(payload)) {
      throw new MediaDownloaderClientError(payload);
    }
    throw new Error("미디어 분석에 실패했습니다.");
  }

  return payload as MediaInfo;
}

function filenameFromContentDisposition(header: string | null): string {
  if (!header) return "media-download.bin";

  const encodedMatch = /filename\*=UTF-8''([^;]+)/i.exec(header);
  if (encodedMatch) {
    try {
      return decodeURIComponent(encodedMatch[1]);
    } catch {
      return encodedMatch[1];
    }
  }

  const plainMatch = /filename="?([^";]+)"?/i.exec(header);
  return plainMatch?.[1] ?? "media-download.bin";
}

export async function downloadMedia(
  request: DownloadRequest,
  fetcher: typeof fetch = fetch,
): Promise<{ blob: Blob; filename: string }> {
  const response = await fetcher("/api/media/download", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const payload = await readJsonResponse(response);
    if (isMediaErrorResponse(payload)) {
      throw new MediaDownloaderClientError(payload);
    }
    throw new Error("다운로드에 실패했습니다.");
  }

  return {
    blob: await response.blob(),
    filename: filenameFromContentDisposition(
      response.headers.get("content-disposition"),
    ),
  };
}
