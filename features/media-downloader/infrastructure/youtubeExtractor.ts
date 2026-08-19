import {
  MediaDownloaderError,
  toMediaDownloaderError,
} from "../application/errors";
import {
  mapYtDlpFormats,
  type YtDlpFormatInput,
} from "../application/formatMapping";
import { validateMediaUrl } from "../application/urlValidation";
import type { MediaInfo } from "../domain/mediaTypes";
import { getMediaRuntimeConfig, verifyYtDlpTool } from "./mediaEnvironment";
import { runProcess, type RunProcess } from "./processRunner";

export type MediaExtractor = {
  analyze(url: string): Promise<MediaInfo>;
};

export type YoutubeExtractorOptions = {
  ytdlpPath?: string;
  timeoutMs?: number;
  run?: RunProcess;
};

export function buildYtDlpAnalyzeArgs(url: string): string[] {
  return [
    "--dump-single-json",
    "--no-playlist",
    "--no-warnings",
    "--skip-download",
    url,
  ];
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value : undefined;
}

function asNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value)
    ? value
    : undefined;
}

function normalizeFormat(value: unknown): YtDlpFormatInput | null {
  if (!value || typeof value !== "object") return null;

  const record = value as Record<string, unknown>;
  return {
    format_id: asString(record.format_id),
    ext: asString(record.ext),
    height: asNumber(record.height) ?? null,
    vcodec: asString(record.vcodec) ?? null,
    acodec: asString(record.acodec) ?? null,
    tbr: asNumber(record.tbr) ?? null,
    abr: asNumber(record.abr) ?? null,
    filesize: asNumber(record.filesize) ?? null,
    filesize_approx: asNumber(record.filesize_approx) ?? null,
  };
}

function thumbnailFromRecord(
  record: Record<string, unknown>,
): string | undefined {
  const directThumbnail = asString(record.thumbnail);
  if (directThumbnail) return directThumbnail;

  const thumbnails = record.thumbnails;
  if (!Array.isArray(thumbnails)) return undefined;

  const urls = thumbnails
    .map((thumbnail) =>
      thumbnail && typeof thumbnail === "object"
        ? asString((thumbnail as Record<string, unknown>).url)
        : undefined,
    )
    .filter((url): url is string => Boolean(url));

  return urls.at(-1);
}

export function parseYtDlpMediaInfo(
  stdout: string,
  originalUrl: string,
): MediaInfo {
  let parsed: unknown;
  try {
    parsed = JSON.parse(stdout);
  } catch {
    throw new MediaDownloaderError("MEDIA_UNAVAILABLE", {
      internalMessage: "yt-dlp returned non-JSON analyze output",
    });
  }

  if (!parsed || typeof parsed !== "object") {
    throw new MediaDownloaderError("MEDIA_UNAVAILABLE", {
      internalMessage: "yt-dlp returned an invalid analyze shape",
    });
  }

  const record = parsed as Record<string, unknown>;
  const formats = Array.isArray(record.formats)
    ? record.formats
        .map(normalizeFormat)
        .filter((format): format is YtDlpFormatInput => Boolean(format))
    : [];
  const mappedFormats = mapYtDlpFormats(formats);

  if (mappedFormats.length === 0) {
    throw new MediaDownloaderError("FORMAT_NOT_AVAILABLE", {
      internalMessage: "yt-dlp returned no MVP-compatible formats",
    });
  }

  return {
    platform: "youtube",
    originalUrl,
    title: asString(record.title) ?? "Untitled media",
    thumbnail: thumbnailFromRecord(record),
    durationSeconds: asNumber(record.duration),
    formats: mappedFormats,
  };
}

export async function analyzeYoutubeVideo(
  url: string,
  options: YoutubeExtractorOptions = {},
): Promise<MediaInfo> {
  const validation = validateMediaUrl(url);
  if (!validation.ok) {
    throw new MediaDownloaderError(validation.code, {
      message: validation.message,
    });
  }

  const config = getMediaRuntimeConfig();
  const processRunner = options.run ?? runProcess;

  try {
    await verifyYtDlpTool({
      ytdlpPath: options.ytdlpPath ?? config.ytdlpPath,
      run: processRunner,
    });

    const result = await processRunner({
      command: options.ytdlpPath ?? config.ytdlpPath,
      args: buildYtDlpAnalyzeArgs(validation.url),
      timeoutMs: options.timeoutMs ?? config.analyzeTimeoutMs,
    });

    return parseYtDlpMediaInfo(result.stdout, validation.url);
  } catch (error) {
    throw toMediaDownloaderError(error, "MEDIA_UNAVAILABLE");
  }
}

export function createYoutubeExtractor(
  options: YoutubeExtractorOptions = {},
): MediaExtractor {
  return {
    analyze(url: string) {
      return analyzeYoutubeVideo(url, options);
    },
  };
}
