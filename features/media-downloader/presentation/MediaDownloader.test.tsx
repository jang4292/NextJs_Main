// @vitest-environment jsdom

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MediaDownloader } from "./MediaDownloader";
import {
  statusDescription,
  statusLabel,
} from "./hooks/useMediaDownloaderViewModel";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

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

  it("enables analyze only when a URL candidate is present", () => {
    render(<MediaDownloader />);

    const input = screen.getByLabelText("Media URL") as HTMLInputElement;
    const analyzeButton = screen.getByRole("button", {
      name: /Analyze/i,
    }) as HTMLButtonElement;

    expect(input.type).toBe("text");
    expect(input.inputMode).toBe("url");
    expect(analyzeButton.disabled).toBe(true);
    expect(analyzeButton.dataset.canAnalyze).toBe("false");

    fireEvent.change(input, {
      target: {
        value: "https://youtu.be/sCk-huN2ULg?si=ITqQvfzZkUHawzTV",
      },
    });
    expect(analyzeButton.disabled).toBe(false);
    expect(analyzeButton.dataset.canAnalyze).toBe("true");
    expect(analyzeButton.dataset.status).toBe("idle");
    expect(analyzeButton.dataset.urlCandidate).toBe(
      "https://youtu.be/sCk-huN2ULg?si=ITqQvfzZkUHawzTV",
    );
  });

  it("enables analyze for quote-wrapped Markdown copied URLs", () => {
    render(<MediaDownloader />);

    const input = screen.getByLabelText("Media URL");
    const analyzeButton = screen.getByRole("button", {
      name: /Analyze/i,
    }) as HTMLButtonElement;

    fireEvent.change(input, {
      target: {
        value:
          "'[https://youtu.be/sCk-huN2ULg?si=OgSE-P3WLHGgepBA'](https://youtu.be/sCk-huN2ULg?si=OgSE-P3WLHGgepBA')",
      },
    });

    expect(analyzeButton.disabled).toBe(false);
  });

  it("shows an invalid URL message when analysis is submitted without a URL candidate", async () => {
    render(<MediaDownloader />);

    fireEvent.submit(screen.getByLabelText("Media URL").closest("form")!);

    expect(
      await screen.findByText("올바른 HTTPS 미디어 URL을 입력해주세요."),
    ).toBeTruthy();
  });

  it("submits the extracted URL and reflects the canonical URL after analysis", async () => {
    const canonicalUrl = "https://www.youtube.com/watch?v=sCk-huN2ULg";
    const fetchMock = vi.fn<typeof fetch>(async () =>
      Response.json({
        platform: "youtube",
        originalUrl: canonicalUrl,
        title: "Demo Clip",
        durationSeconds: 65,
        formats: [
          {
            id: "video-mp4-360",
            type: "video",
            container: "mp4",
            label: "MP4 360p",
            qualityLabel: "360p",
            height: 360,
            hasAudio: true,
            hasVideo: true,
            requiresFfmpeg: true,
          },
        ],
      }),
    );
    vi.stubGlobal("fetch", fetchMock);
    render(<MediaDownloader />);

    const input = screen.getByLabelText("Media URL") as HTMLInputElement;
    fireEvent.change(input, {
      target: {
        value:
          "'[https://youtu.be/sCk-huN2ULg?si=OgSE-P3WLHGgepBA'](https://youtu.be/sCk-huN2ULg?si=OgSE-P3WLHGgepBA')",
      },
    });
    fireEvent.click(screen.getByRole("button", { name: /Analyze/i }));

    await waitFor(() => expect(input.value).toBe(canonicalUrl));
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/media/analyze",
      expect.objectContaining({
        body: JSON.stringify({
          url: "https://youtu.be/sCk-huN2ULg?si=OgSE-P3WLHGgepBA",
        }),
      }),
    );
  });
});
