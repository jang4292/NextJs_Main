import { describe, expect, it, vi } from "vitest";
import {
  analyzeYoutubeVideo,
  buildYtDlpAnalyzeArgs,
  parseYtDlpMediaInfo,
} from "./youtubeExtractor";
import type { RunProcess } from "./processRunner";

const successfulProcessResult = {
  stdout: "",
  stderr: "",
  exitCode: 0,
  signal: null,
};

function compatibleYtDlpPayload() {
  return {
    title: "Demo Clip",
    formats: [
      {
        format_id: "18",
        ext: "mp4",
        height: 360,
        vcodec: "avc1",
        acodec: "mp4a",
      },
      {
        format_id: "140",
        ext: "m4a",
        vcodec: "none",
        acodec: "mp4a",
      },
    ],
  };
}

describe("buildYtDlpAnalyzeArgs", () => {
  it("builds a shell-free argument vector for metadata analysis", () => {
    expect(buildYtDlpAnalyzeArgs("https://youtu.be/abc")).toEqual([
      "--dump-single-json",
      "--no-playlist",
      "--no-warnings",
      "--skip-download",
      "https://youtu.be/abc",
    ]);
  });
});

describe("analyzeYoutubeVideo", () => {
  it("passes canonical single-video URLs to yt-dlp", async () => {
    const canonicalUrl = "https://www.youtube.com/watch?v=sCk-huN2ULg";
    const run = vi.fn<RunProcess>(async (options) => {
      if (options.args.includes("--dump-single-json")) {
        return {
          ...successfulProcessResult,
          stdout: JSON.stringify(compatibleYtDlpPayload()),
        };
      }

      return successfulProcessResult;
    });

    const info = await analyzeYoutubeVideo(
      "https://www.youtube.com/watch?v=sCk-huN2ULg&list=RDsCk-huN2ULg&start_radio=1",
      { ytdlpPath: "yt-dlp", run },
    );
    const analyzeCall = run.mock.calls.find(([options]) =>
      options.args.includes("--dump-single-json"),
    );
    const analyzeArgs = analyzeCall?.[0].args ?? [];

    expect(info.originalUrl).toBe(canonicalUrl);
    expect(analyzeArgs.at(-1)).toBe(canonicalUrl);
    expect(analyzeArgs.join(" ")).not.toContain("list=");
    expect(analyzeArgs.join(" ")).not.toContain("start_radio=");
  });
});

describe("parseYtDlpMediaInfo", () => {
  it("maps yt-dlp JSON into the domain media info contract", () => {
    const info = parseYtDlpMediaInfo(
      JSON.stringify({
        title: "Demo Clip",
        thumbnail: "https://i.ytimg.com/vi/demo/maxresdefault.jpg",
        duration: 65,
        formats: [
          {
            format_id: "18",
            ext: "mp4",
            height: 360,
            vcodec: "avc1",
            acodec: "mp4a",
          },
          {
            format_id: "137",
            ext: "mp4",
            height: 1080,
            vcodec: "avc1",
            acodec: "none",
          },
          {
            format_id: "140",
            ext: "m4a",
            vcodec: "none",
            acodec: "mp4a",
          },
        ],
      }),
      "https://youtu.be/demo",
    );

    expect(info).toMatchObject({
      platform: "youtube",
      originalUrl: "https://youtu.be/demo",
      title: "Demo Clip",
      durationSeconds: 65,
    });
    expect(info.formats.map((format) => format.id)).toContain("video-mp4-1080");
    expect(info.formats.map((format) => format.id)).toContain("audio-mp3-192");
  });

  it("rejects non-JSON analyzer output", () => {
    expect(() =>
      parseYtDlpMediaInfo("not-json", "https://youtu.be/demo"),
    ).toThrow("현재 이 영상은 분석할 수 없습니다.");
  });
});
