import { MediaDownloaderError } from "../application/errors";
import { runProcess, type RunProcess } from "./processRunner";

type MediaToolName = "yt-dlp" | "ffmpeg" | "ffprobe";

function mediaToolUnavailableMessage(toolName: MediaToolName): string {
  if (toolName === "yt-dlp") {
    return "미디어 분석 도구 yt-dlp를 실행할 수 없습니다. yt-dlp 설치 상태와 YTDLP_PATH 환경 변수 경로를 확인해주세요.";
  }

  return "미디어 다운로드 도구를 실행할 수 없습니다. FFmpeg와 FFprobe 설치 상태 및 FFMPEG_PATH, FFPROBE_PATH 환경 변수 경로를 확인해주세요.";
}

export type MediaRuntimeConfig = {
  ytdlpPath: string;
  ffmpegPath: string;
  ffprobePath: string;
  analyzeTimeoutMs: number;
  downloadTimeoutMs: number;
  maxOutputBytes: number;
};

function parsePositiveIntegerEnv(
  value: string | undefined,
  fallback: number,
): number {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export function getMediaRuntimeConfig(): MediaRuntimeConfig {
  return {
    ytdlpPath: process.env.YTDLP_PATH || "yt-dlp",
    ffmpegPath: process.env.FFMPEG_PATH || "ffmpeg",
    ffprobePath: process.env.FFPROBE_PATH || "ffprobe",
    analyzeTimeoutMs: parsePositiveIntegerEnv(
      process.env.MEDIA_ANALYZE_TIMEOUT_MS,
      45_000,
    ),
    downloadTimeoutMs: parsePositiveIntegerEnv(
      process.env.MEDIA_DOWNLOAD_TIMEOUT_MS,
      180_000,
    ),
    maxOutputBytes: parsePositiveIntegerEnv(
      process.env.MEDIA_MAX_OUTPUT_BYTES,
      350 * 1024 * 1024,
    ),
  };
}

async function verifyMediaTool(options: {
  command: string;
  toolName: MediaToolName;
  versionArgs: string[];
  run?: RunProcess;
}) {
  const processRunner = options.run ?? runProcess;

  try {
    await processRunner({
      command: options.command,
      args: options.versionArgs,
      timeoutMs: 5_000,
      maxStdoutBytes: 8 * 1024,
      maxStderrBytes: 8 * 1024,
    });
  } catch (error) {
    throw new MediaDownloaderError("MEDIA_TOOL_UNAVAILABLE", {
      message: mediaToolUnavailableMessage(options.toolName),
      internalMessage: `${options.toolName} readiness check failed: ${
        error instanceof Error ? error.message : String(error)
      }`,
    });
  }
}

export async function verifyYtDlpTool(options: {
  ytdlpPath: string;
  run?: RunProcess;
}) {
  await verifyMediaTool({
    command: options.ytdlpPath,
    toolName: "yt-dlp",
    versionArgs: ["--version"],
    run: options.run,
  });
}

export async function verifyFfmpegTools(options: {
  ffmpegPath: string;
  ffprobePath: string;
  run?: RunProcess;
}) {
  await verifyMediaTool({
    command: options.ffmpegPath,
    toolName: "ffmpeg",
    versionArgs: ["-version"],
    run: options.run,
  });
  await verifyMediaTool({
    command: options.ffprobePath,
    toolName: "ffprobe",
    versionArgs: ["-version"],
    run: options.run,
  });
}
