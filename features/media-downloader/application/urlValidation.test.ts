import { describe, expect, it } from "vitest";
import { resolveMediaPlatform } from "./platformResolver";
import { validateMediaUrl } from "./urlValidation";

describe("validateMediaUrl", () => {
  it("accepts supported YouTube single video URLs", () => {
    const urls = [
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      "https://youtube.com/shorts/dQw4w9WgXcQ",
      "https://youtu.be/dQw4w9WgXcQ",
    ];

    for (const url of urls) {
      expect(validateMediaUrl(url)).toMatchObject({
        ok: true,
        platform: "youtube",
      });
    }
  });

  it("rejects non-HTTPS protocols", () => {
    expect(
      validateMediaUrl("http://www.youtube.com/watch?v=abc"),
    ).toMatchObject({
      ok: false,
      code: "INVALID_URL",
    });
    expect(validateMediaUrl("file:///etc/passwd")).toMatchObject({
      ok: false,
      code: "INVALID_URL",
    });
  });

  it("rejects local and private hosts before platform resolution", () => {
    const urls = [
      "https://localhost/watch?v=abc",
      "https://127.0.0.1/watch?v=abc",
      "https://10.1.2.3/watch?v=abc",
      "https://172.16.1.1/watch?v=abc",
      "https://192.168.1.1/watch?v=abc",
      "https://169.254.10.20/watch?v=abc",
      "https://[::1]/watch?v=abc",
    ];

    for (const url of urls) {
      expect(validateMediaUrl(url)).toMatchObject({
        ok: false,
        code: "INVALID_URL",
      });
    }
  });

  it("rejects unsupported hosts and YouTube playlist-only URLs", () => {
    expect(validateMediaUrl("https://example.com/video")).toMatchObject({
      ok: false,
      code: "UNSUPPORTED_PLATFORM",
    });
    expect(
      validateMediaUrl("https://www.youtube.com/playlist?list=abc"),
    ).toMatchObject({
      ok: false,
      code: "UNSUPPORTED_PLATFORM",
    });
  });
});

describe("resolveMediaPlatform", () => {
  it("resolves only exact YouTube hosts for the MVP", () => {
    expect(resolveMediaPlatform("https://youtube.com/watch?v=abc")).toBe(
      "youtube",
    );
    expect(resolveMediaPlatform("https://www.youtube.com/watch?v=abc")).toBe(
      "youtube",
    );
    expect(resolveMediaPlatform("https://youtu.be/abc")).toBe("youtube");
    expect(
      resolveMediaPlatform("https://youtube.com.evil.test/watch?v=abc"),
    ).toBe("unknown");
  });
});
