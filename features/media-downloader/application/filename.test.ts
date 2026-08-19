import { describe, expect, it } from "vitest";
import {
  buildContentDispositionFilename,
  sanitizeDownloadFilename,
} from "./filename";

describe("sanitizeDownloadFilename", () => {
  it("removes path and shell-sensitive filename characters", () => {
    expect(sanitizeDownloadFilename("../Hello: <World>?*")).toBe("Hello-World");
  });

  it("falls back for empty or unsafe names", () => {
    expect(sanitizeDownloadFilename("...")).toBe("media-download");
    expect(sanitizeDownloadFilename(undefined, "fallback")).toBe("fallback");
  });

  it("caps long filenames", () => {
    expect(sanitizeDownloadFilename("a".repeat(200))).toHaveLength(120);
  });
});

describe("buildContentDispositionFilename", () => {
  it("keeps the extension controlled by the caller", () => {
    expect(buildContentDispositionFilename("Clip", ".m/p4")).toBe("Clip.mp4");
  });
});
