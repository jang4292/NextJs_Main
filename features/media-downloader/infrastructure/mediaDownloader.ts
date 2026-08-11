import { mkdtemp, readFile, readdir, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  MediaDownloaderError,
  toMediaDownloaderError,
} from "../application/errors";
import {
  buildContentDispositionFilename,
  sanitizeDownloadFilename,
} from "../application/filename";
import {
  formatMatchesDownloadType,
  parseMediaFormatId,
} from "../application/formatMapping";
import { validateMediaUrl } from "../application/urlValidation";
import type { DownloadRequest, DownloadSelection } from "../domain/mediaTypes";
import {
  getMediaRuntimeConfig,
  verifyFfmpegTools,
  verifyYtDlpTool,
  type MediaRuntimeConfig,
} from "./mediaEnvironment";
import { runProcess, type RunProcess } from "./processRunner";

export type DownloadedMediaFile = {
  data: Uint8Array;
  filename: string;
  contentType: string;
  byteLength: number;
};

export type DownloadYoutubeMediaOptions = {
  run?: RunProcess;
  config?: MediaRuntimeConfig;
};

function buildVideoSelector(maxHeight: number): string {
  return [
    `bestvideo[height<=${maxHeight}][ext=mp4]+bestaudio[ext=m4a]`,
    `best[height<=${maxHeight}][ext=mp4]`,
    `best[height<=${maxHeight}]`,
  ].join("/");
}

export function buildYtDlpDownloadArgs(options: {
  url: string;
  selection: DownloadSelection;
  workDir: string;
  ffmpegPath?: string;
}): string[] {
  const args = [
    "--no-playlist",
    "--no-warnings",
    "--newline",
    "--restrict-filenames",
    "--no-mtime",
    "-P",
    options.workDir,
    "-o",
    "download.%(ext)s",
  ];

  if (options.ffmpegPath) {
    args.push("--ffmpeg-location", options.ffmpegPath);
  }

  if (options.selection.type === "video") {
    args.push(
      "-f",
      buildVideoSelector(options.selection.maxHeight),
      "--merge-output-format",
      "mp4",
      "--remux-video",
      "mp4",
      options.url,
    );
    return args;
  }

  args.push(
    "-f",
    "bestaudio/best",
    "--extract-audio",
    "--audio-format",
    "mp3",
    "--audio-quality",
    `${options.selection.bitrateKbps}K`,
    options.url,
  );

  return args;
}

async function findDownloadedFile(workDir: string): Promise<string> {
  const entries = await readdir(workDir, { withFileTypes: true });
  const files = await Promise.all(
    entries
      .filter((entry) => entry.isFile() && !entry.name.endsWith(".part"))
      .map(async (entry) => {
        const filePath = join(workDir, entry.name);
        const fileStat = await stat(filePath);
        return { filePath, mtimeMs: fileStat.mtimeMs, size: fileStat.size };
      }),
  );

  const downloadedFiles = files
    .filter((file) => file.size > 0)
    .sort((a, b) => b.mtimeMs - a.mtimeMs);

  if (downloadedFiles.length === 0) {
    throw new MediaDownloaderError("DOWNLOAD_FAILED", {
      internalMessage: "yt-dlp completed without producing a file",
    });
  }

  return downloadedFiles[0].filePath;
}

function extensionForSelection(selection: DownloadSelection): string {
  return selection.type === "audio" ? "mp3" : "mp4";
}

function contentTypeForSelection(selection: DownloadSelection): string {
  return selection.type === "audio" ? "audio/mpeg" : "video/mp4";
}

export async function downloadYoutubeMedia(
  request: DownloadRequest,
  options: DownloadYoutubeMediaOptions = {},
): Promise<DownloadedMediaFile> {
  const validation = validateMediaUrl(request.url);
  if (!validation.ok) {
    throw new MediaDownloaderError(validation.code, {
      message: validation.message,
    });
  }

  const selection = parseMediaFormatId(request.formatId);
  if (
    !selection ||
    !formatMatchesDownloadType(request.formatId, request.type)
  ) {
    throw new MediaDownloaderError("FORMAT_NOT_AVAILABLE");
  }

  const config = options.config ?? getMediaRuntimeConfig();
  const processRunner = options.run ?? runProcess;
  const workDir = await mkdtemp(join(tmpdir(), "media-downloader-"));

  try {
    await verifyYtDlpTool({
      ytdlpPath: config.ytdlpPath,
      run: processRunner,
    });

    await verifyFfmpegTools({
      ffmpegPath: config.ffmpegPath,
      ffprobePath: config.ffprobePath,
      run: processRunner,
    });

    await processRunner({
      command: config.ytdlpPath,
      args: buildYtDlpDownloadArgs({
        url: validation.url,
        selection,
        workDir,
        ffmpegPath: config.ffmpegPath,
      }),
      timeoutMs: config.downloadTimeoutMs,
      maxStdoutBytes: 512 * 1024,
      maxStderrBytes: 128 * 1024,
    });

    const filePath = await findDownloadedFile(workDir);
    const fileStat = await stat(filePath);

    if (fileStat.size > config.maxOutputBytes) {
      throw new MediaDownloaderError("DOWNLOAD_FAILED", {
        internalMessage: `Downloaded file exceeded ${config.maxOutputBytes} bytes`,
      });
    }

    const data = await readFile(filePath);
    const extension = extensionForSelection(selection);
    const baseName =
      selection.type === "audio" ? "youtube-audio" : "youtube-video";

    return {
      data,
      filename: buildContentDispositionFilename(
        sanitizeDownloadFilename(baseName),
        extension,
      ),
      contentType: contentTypeForSelection(selection),
      byteLength: data.byteLength,
    };
  } catch (error) {
    throw toMediaDownloaderError(error, "DOWNLOAD_FAILED");
  } finally {
    await rm(workDir, { recursive: true, force: true });
  }
}
