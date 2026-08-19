import { describe, expect, it } from "vitest";
import {
  MediaDownloaderError,
  createMediaErrorResponse,
  toMediaDownloaderError,
} from "./errors";

describe("media error mapping", () => {
  it("keeps technical process errors out of the user-facing payload", () => {
    const error = toMediaDownloaderError(
      new Error("ERROR: Sign in to confirm you're not a bot"),
      "DOWNLOAD_FAILED",
    );

    expect(error.code).toBe("MEDIA_UNAVAILABLE");
    expect(createMediaErrorResponse(error)).toEqual({
      code: "MEDIA_UNAVAILABLE",
      message:
        "현재 이 영상은 분석할 수 없습니다. 잠시 후 다시 시도하거나 다른 공개 영상을 이용해주세요.",
    });
  });

  it("preserves already classified errors", () => {
    const classified = new MediaDownloaderError("FORMAT_NOT_AVAILABLE");

    expect(toMediaDownloaderError(classified)).toBe(classified);
  });

  it("maps missing local executables to a stable runtime tool error", () => {
    const missingToolError = Object.assign(new Error("spawn yt-dlp ENOENT"), {
      code: "ENOENT",
    });
    const error = toMediaDownloaderError(missingToolError, "DOWNLOAD_FAILED");

    expect(error.code).toBe("MEDIA_TOOL_UNAVAILABLE");
    expect(createMediaErrorResponse(error)).toEqual({
      code: "MEDIA_TOOL_UNAVAILABLE",
      message:
        "로컬 미디어 처리 도구를 찾을 수 없습니다. yt-dlp, FFmpeg, FFprobe 설치 또는 환경 변수 경로를 확인해주세요.",
    });
  });
});
