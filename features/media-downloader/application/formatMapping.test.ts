import { describe, expect, it } from "vitest";
import {
  formatMatchesDownloadType,
  mapYtDlpFormats,
  parseMediaFormatId,
} from "./formatMapping";

describe("mapYtDlpFormats", () => {
  it("maps available YouTube formats to MVP video and audio presets", () => {
    const formats = mapYtDlpFormats([
      {
        format_id: "18",
        ext: "mp4",
        height: 360,
        vcodec: "avc1",
        acodec: "mp4a",
        filesize: 10_000,
      },
      {
        format_id: "137",
        ext: "mp4",
        height: 1080,
        vcodec: "avc1",
        acodec: "none",
        filesize_approx: 90_000,
      },
      {
        format_id: "140",
        ext: "m4a",
        vcodec: "none",
        acodec: "mp4a",
        abr: 128,
      },
    ]);

    expect(formats.map((format) => format.id)).toEqual([
      "video-mp4-360",
      "video-mp4-720",
      "video-mp4-1080",
      "audio-mp3-128",
      "audio-mp3-192",
    ]);
  });

  it("does not expose unavailable video heights", () => {
    const formats = mapYtDlpFormats([
      {
        format_id: "18",
        ext: "mp4",
        height: 360,
        vcodec: "avc1",
        acodec: "mp4a",
      },
    ]);

    expect(
      formats
        .filter((format) => format.type === "video")
        .map((format) => format.id),
    ).toEqual(["video-mp4-360"]);
  });
});

describe("parseMediaFormatId", () => {
  it("parses supported download format ids", () => {
    expect(parseMediaFormatId("video-mp4-720")).toMatchObject({
      type: "video",
      maxHeight: 720,
    });
    expect(parseMediaFormatId("audio-mp3-192")).toMatchObject({
      type: "audio",
      bitrateKbps: 192,
    });
  });

  it("rejects unknown format ids and mismatched download types", () => {
    expect(parseMediaFormatId("video-webm-720")).toBeNull();
    expect(formatMatchesDownloadType("audio-mp3-128", "video")).toBe(false);
    expect(formatMatchesDownloadType("audio-mp3-128", "audio")).toBe(true);
  });
});
