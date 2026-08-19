// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MusicStudio } from "./MusicStudio";

beforeEach(() => {
  vi.spyOn(window.HTMLMediaElement.prototype, "load").mockImplementation(
    () => undefined,
  );
  vi.spyOn(window.HTMLMediaElement.prototype, "pause").mockImplementation(
    () => undefined,
  );
  vi.spyOn(window.HTMLMediaElement.prototype, "play").mockResolvedValue();
  vi.spyOn(window.HTMLMediaElement.prototype, "canPlayType").mockImplementation(
    (mimeType) =>
      mimeType === "audio/mpeg" || mimeType === "audio/mp3" ? "probably" : "",
  );
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("MusicStudio", () => {
  it("adds a single DJ history track to the custom queue", async () => {
    const user = userEvent.setup();

    render(<MusicStudio />);

    await user.click(
      screen.getByRole("button", {
        name: "Add Non Stop Flight to Custom Queue",
      }),
    );

    expect(
      screen.getByText('"Non Stop Flight"을(를) Custom Queue에 추가했습니다.'),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Custom Queue" }));

    expect(
      screen.getByRole("heading", { name: "Custom Queue (1)" }),
    ).toBeInTheDocument();
  });

  it("shows the selected date track list when a DJ history date is clicked", async () => {
    const user = userEvent.setup();

    render(<MusicStudio />);

    await user.click(screen.getByRole("button", { name: "2025년 2월 14일" }));

    expect(
      screen.getByText("Valentine's Day 특집 - 낭만 스윙 세션"),
    ).toBeInTheDocument();
    expect(screen.getByText("Little Brown Jug")).toBeInTheDocument();
  });

  it("plays a supported track from the history table", async () => {
    const user = userEvent.setup();

    render(<MusicStudio />);

    await user.click(
      screen.getByRole("button", { name: "Play Little Brown Jug" }),
    );

    expect(
      screen.getByRole("heading", { name: "Little Brown Jug" }),
    ).toBeInTheDocument();
    await waitFor(() =>
      expect(window.HTMLMediaElement.prototype.play).toHaveBeenCalled(),
    );
  });

  it("keeps Queue and Play table actions sticky on mobile", () => {
    render(<MusicStudio />);

    expect(screen.getByRole("columnheader", { name: "Queue" })).toHaveClass(
      "sticky",
      "right-16",
      "md:static",
    );
    expect(screen.getByRole("columnheader", { name: "Play" })).toHaveClass(
      "sticky",
      "right-0",
      "md:static",
    );
  });

  it("confirms before adding the same song from another date", async () => {
    const user = userEvent.setup();
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(false);

    render(<MusicStudio />);

    await user.click(
      screen.getByRole("button", {
        name: "Add Little Brown Jug to Custom Queue",
      }),
    );
    expect(confirmSpy).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "2025년 2월 14일" }));
    await user.click(
      screen.getByRole("button", {
        name: "Add Little Brown Jug to Custom Queue",
      }),
    );

    expect(confirmSpy).toHaveBeenCalledWith(
      expect.stringContaining("다른 날짜 또는 항목의 동일 음원"),
    );

    await user.click(screen.getByRole("button", { name: "Custom Queue" }));

    expect(
      screen.getByRole("heading", { name: "Custom Queue (1)" }),
    ).toBeInTheDocument();
  });
});
