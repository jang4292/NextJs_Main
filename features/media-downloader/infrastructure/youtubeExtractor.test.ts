import { describe, expect, it } from "vitest";
import { buildYtDlpAnalyzeArgs, parseYtDlpMediaInfo } from "./youtubeExtractor";

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
