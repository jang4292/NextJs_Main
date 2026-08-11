import type { MediaErrorCode, MediaErrorResponse } from "../domain/mediaTypes";

export const mediaErrorMessages: Record<MediaErrorCode, string> = {
  INVALID_URL: "올바른 HTTPS 미디어 URL을 입력해주세요.",
  UNSUPPORTED_PLATFORM: "현재는 공개 YouTube 단일 영상 URL만 지원합니다.",
  MEDIA_NOT_FOUND: "미디어를 찾을 수 없습니다.",
  MEDIA_UNAVAILABLE:
    "현재 이 영상은 분석할 수 없습니다. 잠시 후 다시 시도하거나 다른 공개 영상을 이용해주세요.",
  FORMAT_NOT_AVAILABLE: "선택한 포맷을 사용할 수 없습니다.",
  MEDIA_TOOL_UNAVAILABLE:
    "로컬 미디어 처리 도구를 찾을 수 없습니다. yt-dlp, FFmpeg, FFprobe 설치 또는 환경 변수 경로를 확인해주세요.",
  DOWNLOAD_FAILED: "다운로드 중 오류가 발생했습니다.",
  FFMPEG_FAILED:
    "FFmpeg 처리 중 오류가 발생했습니다. 로컬 FFmpeg 설치 상태를 확인해주세요.",
  TIMEOUT: "처리 시간이 너무 오래 걸려 요청을 중단했습니다.",
  UNKNOWN: "알 수 없는 오류가 발생했습니다.",
};

export const mediaErrorStatus: Record<MediaErrorCode, number> = {
  INVALID_URL: 400,
  UNSUPPORTED_PLATFORM: 400,
  MEDIA_NOT_FOUND: 404,
  MEDIA_UNAVAILABLE: 422,
  FORMAT_NOT_AVAILABLE: 400,
  MEDIA_TOOL_UNAVAILABLE: 503,
  DOWNLOAD_FAILED: 500,
  FFMPEG_FAILED: 500,
  TIMEOUT: 504,
  UNKNOWN: 500,
};

export class MediaDownloaderError extends Error {
  readonly code: MediaErrorCode;
  readonly status: number;
  readonly internalMessage?: string;

  constructor(
    code: MediaErrorCode,
    options: {
      message?: string;
      status?: number;
      internalMessage?: string;
    } = {},
  ) {
    super(options.message ?? mediaErrorMessages[code]);
    this.name = "MediaDownloaderError";
    this.code = code;
    this.status = options.status ?? mediaErrorStatus[code];
    this.internalMessage = options.internalMessage;
  }
}

export function createMediaErrorResponse(
  error: MediaDownloaderError,
): MediaErrorResponse {
  return {
    code: error.code,
    message: error.message,
  };
}

export function toMediaDownloaderError(
  error: unknown,
  fallbackCode: MediaErrorCode = "UNKNOWN",
): MediaDownloaderError {
  if (error instanceof MediaDownloaderError) {
    return error;
  }

  const rawMessage = error instanceof Error ? error.message : String(error);
  const message = rawMessage.toLowerCase();
  const errorCode =
    error && typeof error === "object"
      ? (error as { code?: unknown }).code
      : undefined;

  if (
    errorCode === "ENOENT" ||
    message.includes("enoent") ||
    message.includes("command not found")
  ) {
    return new MediaDownloaderError("MEDIA_TOOL_UNAVAILABLE", {
      internalMessage: rawMessage,
    });
  }

  if (message.includes("timed out") || message.includes("timeout")) {
    return new MediaDownloaderError("TIMEOUT", { internalMessage: rawMessage });
  }

  if (
    message.includes("requested format is not available") ||
    message.includes("format is not available")
  ) {
    return new MediaDownloaderError("FORMAT_NOT_AVAILABLE", {
      internalMessage: rawMessage,
    });
  }

  if (
    message.includes("ffmpeg") ||
    message.includes("ffprobe") ||
    message.includes("postprocessing")
  ) {
    return new MediaDownloaderError("FFMPEG_FAILED", {
      internalMessage: rawMessage,
    });
  }

  if (
    message.includes("private video") ||
    message.includes("sign in") ||
    message.includes("login") ||
    message.includes("not available") ||
    message.includes("unavailable")
  ) {
    return new MediaDownloaderError("MEDIA_UNAVAILABLE", {
      internalMessage: rawMessage,
    });
  }

  if (message.includes("video unavailable") || message.includes("not found")) {
    return new MediaDownloaderError("MEDIA_NOT_FOUND", {
      internalMessage: rawMessage,
    });
  }

  return new MediaDownloaderError(fallbackCode, {
    internalMessage: rawMessage,
  });
}
