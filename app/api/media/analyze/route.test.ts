import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MediaDownloaderError } from "@/features/media-downloader/application/errors";
import { POST } from "./route";

const analyzeMock = vi.hoisted(() => vi.fn());

vi.mock("@/features/media-downloader/infrastructure/youtubeExtractor", () => ({
  analyzeYoutubeVideo: analyzeMock,
}));

function analyzeRequest(body: unknown) {
  return new NextRequest("http://localhost/api/media/analyze", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

describe("POST /api/media/analyze", () => {
  beforeEach(() => {
    analyzeMock.mockReset();
  });

  it("returns 400 for malformed JSON", async () => {
    const response = await POST(analyzeRequest("{"));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      code: "INVALID_URL",
    });
    expect(analyzeMock).not.toHaveBeenCalled();
  });

  it("validates URL before invoking the analyzer", async () => {
    const response = await POST(
      analyzeRequest({ url: "https://example.com/video" }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      code: "UNSUPPORTED_PLATFORM",
    });
    expect(analyzeMock).not.toHaveBeenCalled();
  });

  it("returns analyzed media info for supported YouTube URLs", async () => {
    analyzeMock.mockResolvedValue({
      platform: "youtube",
      originalUrl: "https://youtu.be/demo",
      title: "Demo",
      formats: [],
    });

    const response = await POST(
      analyzeRequest({ url: "https://youtu.be/demo" }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      platform: "youtube",
      title: "Demo",
    });
    expect(analyzeMock).toHaveBeenCalledWith("https://youtu.be/demo");
  });

  it("returns stable readiness errors from the analyzer boundary", async () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    analyzeMock.mockRejectedValue(
      new MediaDownloaderError("MEDIA_TOOL_UNAVAILABLE", {
        internalMessage: "yt-dlp readiness check failed",
      }),
    );

    const response = await POST(
      analyzeRequest({ url: "https://youtu.be/demo" }),
    );

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toMatchObject({
      code: "MEDIA_TOOL_UNAVAILABLE",
    });
    consoleError.mockRestore();
  });
});
