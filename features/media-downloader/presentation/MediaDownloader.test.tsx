import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { MediaDownloader } from "./MediaDownloader";
import {
  statusDescription,
  statusLabel,
} from "./hooks/useMediaDownloaderViewModel";

describe("MediaDownloader", () => {
  it("renders the initial analyze form and download controls", () => {
    const html = renderToStaticMarkup(<MediaDownloader />);

    expect(html).toContain("Media URL");
    expect(html).toContain("Analyze");
    expect(html).toContain("Download");
    expect(html).toContain("Status");
    expect(html).toContain("URL을 분석하면 선택 가능한 포맷이 표시됩니다.");
  });

  it("exposes user-facing labels for the ready status", () => {
    expect(statusLabel("ready")).toBe("준비 완료");
    expect(statusDescription("ready")).toContain("다운로드");
  });
});
