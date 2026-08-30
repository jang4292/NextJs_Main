import { access, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it, vi } from "vitest";
import { parseMediaFormatId } from "../application/formatMapping";
import {
  buildYtDlpDownloadArgs,
  downloadYoutubeMedia,
} from "./mediaDownloader";
import type { MediaRuntimeConfig } from "./mediaEnvironment";
import type { RunProcess, RunProcessOptions } from "./processRunner";

const testRuntimeConfig: MediaRuntimeConfig = {
  ytdlpPath: "yt-dlp",
  ffmpegPath: "ffmpeg",
  ffprobePath: "ffprobe",
  analyzeTimeoutMs: 45_000,
  downloadTimeoutMs: 180_000,
  maxOutputBytes: 1024,
};

const successfulProcessResult = {
  stdout: "",
  stderr: "",
  exitCode: 0,
  signal: null,
};

function workDirFromArgs(options: RunProcessOptions): string | null {
  const prefixIndex = options.args.indexOf("-P");
  return prefixIndex >= 0 ? (options.args[prefixIndex + 1] ?? null) : null;
}

async function expectPathRemoved(path: string) {
  await expect(access(path)).rejects.toMatchObject({ code: "ENOENT" });
}

describe("buildYtDlpDownloadArgs", () => {
  it("builds a video download argument vector without shell interpolation", () => {
    const selection = parseMediaFormatId("video-mp4-720");
    expect(selection).not.toBeNull();

    const args = buildYtDlpDownloadArgs({
      url: "https://youtu.be/demo",
      selection: selection!,
      workDir: "/tmp/media-work",
      ffmpegPath: "/usr/local/bin/ffmpeg",
    });

    expect(args).toContain("--no-playlist");
    expect(args).toContain("--merge-output-format");
    expect(args).toContain("mp4");
    expect(args).toContain("https://youtu.be/demo");
    expect(args.join(" ")).toContain("height<=720");
  });

  it("builds an audio extraction argument vector for MP3 quality", () => {
    const selection = parseMediaFormatId("audio-mp3-128");
    expect(selection).not.toBeNull();

    const args = buildYtDlpDownloadArgs({
      url: "https://youtu.be/demo",
      selection: selection!,
      workDir: "/tmp/media-work",
    });

    expect(args).toContain("--extract-audio");
    expect(args).toContain("--audio-format");
    expect(args).toContain("mp3");
    expect(args).toContain("--audio-quality");
    expect(args).toContain("128K");
  });
});

describe("downloadYoutubeMedia", () => {
  it("returns the downloaded file and removes the temporary job directory", async () => {
    let workDir = "";
    const run = vi.fn<RunProcess>(async (options) => {
      const nextWorkDir = workDirFromArgs(options);
      if (nextWorkDir) {
        workDir = nextWorkDir;
        await writeFile(join(workDir, "download.mp4"), "demo");
      }

      return successfulProcessResult;
    });

    const file = await downloadYoutubeMedia(
      {
        url: "https://youtu.be/demo",
        type: "video",
        formatId: "video-mp4-360",
      },
      { run, config: testRuntimeConfig },
    );

    expect(file).toMatchObject({
      filename: "youtube-video.mp4",
      contentType: "video/mp4",
      byteLength: 4,
    });
    expect(workDir).toContain("media-downloader-");
    await expectPathRemoved(workDir);
  });

  it("passes canonical single-video URLs to yt-dlp downloads", async () => {
    const canonicalUrl = "https://www.youtube.com/watch?v=sCk-huN2ULg";
    let workDir = "";
    const run = vi.fn<RunProcess>(async (options) => {
      const nextWorkDir = workDirFromArgs(options);
      if (nextWorkDir) {
        workDir = nextWorkDir;
        await writeFile(join(workDir, "download.mp4"), "demo");
      }

      return successfulProcessResult;
    });

    await downloadYoutubeMedia(
      {
        url: "https://youtu.be/sCk-huN2ULg?si=EbUySaKQQsWBoHx-",
        type: "video",
        formatId: "video-mp4-360",
      },
      { run, config: testRuntimeConfig },
    );
    const downloadCall = run.mock.calls.find(([options]) =>
      options.args.includes("--merge-output-format"),
    );
    const downloadArgs = downloadCall?.[0].args ?? [];

    expect(downloadArgs.at(-1)).toBe(canonicalUrl);
    expect(downloadArgs.join(" ")).not.toContain("si=");
    await expectPathRemoved(workDir);
  });

  it("removes partial output when yt-dlp fails", async () => {
    let workDir = "";
    const run = vi.fn<RunProcess>(async (options) => {
      const nextWorkDir = workDirFromArgs(options);
      if (nextWorkDir) {
        workDir = nextWorkDir;
        await writeFile(join(workDir, "download.part"), "partial");
        throw new Error("yt-dlp download failed");
      }

      return successfulProcessResult;
    });

    await expect(
      downloadYoutubeMedia(
        {
          url: "https://youtu.be/demo",
          type: "video",
          formatId: "video-mp4-360",
        },
        { run, config: testRuntimeConfig },
      ),
    ).rejects.toMatchObject({ code: "DOWNLOAD_FAILED" });

    expect(workDir).toContain("media-downloader-");
    await expectPathRemoved(workDir);
  });

  it("rejects oversized output before reading it into the response", async () => {
    let workDir = "";
    const run = vi.fn<RunProcess>(async (options) => {
      const nextWorkDir = workDirFromArgs(options);
      if (nextWorkDir) {
        workDir = nextWorkDir;
        await writeFile(join(workDir, "download.mp4"), "too-large");
      }

      return successfulProcessResult;
    });

    await expect(
      downloadYoutubeMedia(
        {
          url: "https://youtu.be/demo",
          type: "video",
          formatId: "video-mp4-360",
        },
        {
          run,
          config: {
            ...testRuntimeConfig,
            maxOutputBytes: 4,
          },
        },
      ),
    ).rejects.toMatchObject({ code: "DOWNLOAD_FAILED" });

    expect(workDir).toContain("media-downloader-");
    await expectPathRemoved(workDir);
  });
});
