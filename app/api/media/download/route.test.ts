import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MediaDownloaderError } from "@/features/media-downloader/application/errors";
import { POST } from "./route";

const downloadMock = vi.hoisted(() => vi.fn());

vi.mock("@/features/media-downloader/infrastructure/mediaDownloader", () => ({
  downloadYoutubeMedia: downloadMock,
}));

function downloadRequest(body: unknown) {
  return new NextRequest("http://localhost/api/media/download", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

describe("POST /api/media/download", () => {
  beforeEach(() => {
    downloadMock.mockReset();
  });

  it("returns 400 for invalid request bodies", async () => {
    const response = await POST(
      downloadRequest({ url: "https://youtu.be/demo", type: "video" }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      code: "FORMAT_NOT_AVAILABLE",
    });
    expect(downloadMock).not.toHaveBeenCalled();
  });

  it("returns a downloadable file response", async () => {
    downloadMock.mockResolvedValue({
      data: new TextEncoder().encode("demo"),
      filename: "youtube-video.mp4",
      contentType: "video/mp4",
      byteLength: 4,
    });

    const response = await POST(
      downloadRequest({
        url: "https://youtu.be/demo",
        type: "video",
        formatId: "video-mp4-360",
      }),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("video/mp4");
    expect(response.headers.get("content-disposition")).toContain(
      "youtube-video.mp4",
    );
    await expect(response.text()).resolves.toBe("demo");
  });

  it("returns stable readiness errors from the download boundary", async () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    downloadMock.mockRejectedValue(
      new MediaDownloaderError("MEDIA_TOOL_UNAVAILABLE", {
        internalMessage: "yt-dlp readiness check failed",
      }),
    );

    const response = await POST(
      downloadRequest({
        url: "https://youtu.be/demo",
        type: "video",
        formatId: "video-mp4-360",
      }),
    );

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toMatchObject({
      code: "MEDIA_TOOL_UNAVAILABLE",
    });
    consoleError.mockRestore();
  });
});
