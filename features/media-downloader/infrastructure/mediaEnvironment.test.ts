import { describe, expect, it, vi } from "vitest";
import type { RunProcess } from "./processRunner";
import { verifyFfmpegTools, verifyYtDlpTool } from "./mediaEnvironment";

const successfulProcessResult = {
  stdout: "",
  stderr: "",
  exitCode: 0,
  signal: null,
};

describe("media runtime readiness checks", () => {
  it("checks yt-dlp with its version argument", async () => {
    const run = vi.fn<RunProcess>().mockResolvedValue(successfulProcessResult);

    await verifyYtDlpTool({ ytdlpPath: "yt-dlp", run });

    expect(run).toHaveBeenCalledWith(
      expect.objectContaining({
        command: "yt-dlp",
        args: ["--version"],
      }),
    );
  });

  it("checks ffmpeg and ffprobe before media downloads", async () => {
    const run = vi.fn<RunProcess>().mockResolvedValue(successfulProcessResult);

    await verifyFfmpegTools({
      ffmpegPath: "ffmpeg",
      ffprobePath: "ffprobe",
      run,
    });

    expect(run).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        command: "ffmpeg",
        args: ["-version"],
      }),
    );
    expect(run).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        command: "ffprobe",
        args: ["-version"],
      }),
    );
  });

  it("maps missing tools to a user-safe readiness error", async () => {
    const run = vi.fn<RunProcess>().mockRejectedValue(
      Object.assign(new Error("spawn missing ENOENT"), {
        code: "ENOENT",
      }),
    );

    await expect(
      verifyYtDlpTool({ ytdlpPath: "missing-ytdlp", run }),
    ).rejects.toMatchObject({
      code: "MEDIA_TOOL_UNAVAILABLE",
      message:
        "미디어 분석 도구 yt-dlp를 실행할 수 없습니다. yt-dlp 설치 상태와 YTDLP_PATH 환경 변수 경로를 확인해주세요.",
      status: 503,
    });
  });

  it("identifies ffmpeg tools when download readiness fails", async () => {
    const run = vi.fn<RunProcess>().mockRejectedValue(
      Object.assign(new Error("spawn missing ENOENT"), {
        code: "ENOENT",
      }),
    );

    await expect(
      verifyFfmpegTools({
        ffmpegPath: "missing-ffmpeg",
        ffprobePath: "missing-ffprobe",
        run,
      }),
    ).rejects.toMatchObject({
      code: "MEDIA_TOOL_UNAVAILABLE",
      message:
        "미디어 다운로드 도구를 실행할 수 없습니다. FFmpeg와 FFprobe 설치 상태 및 FFMPEG_PATH, FFPROBE_PATH 환경 변수 경로를 확인해주세요.",
      status: 503,
    });
  });
});
