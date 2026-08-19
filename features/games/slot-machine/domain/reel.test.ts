import { describe, expect, it } from "vitest";
import type { ReelStrips } from "./slot.types";
import { createReelWindows, getPaylineFromReels, getReelWindow } from "./reel";

describe("reel", () => {
  it("wraps the first and last symbols when building a reel window", () => {
    expect(getReelWindow(["cherry", "lemon", "bell"], 0)).toEqual({
      top: "bell",
      middle: "cherry",
      bottom: "lemon",
    });
  });

  it("creates reel windows and extracts the center payline", () => {
    const strips: ReelStrips = [
      ["cherry", "lemon", "bell"],
      ["star", "diamond", "seven"],
      ["bell", "cherry", "lemon"],
    ];
    const reels = createReelWindows(strips, [1, 2, 0]);

    expect(getPaylineFromReels(reels)).toEqual(["lemon", "seven", "bell"]);
  });

  it("rejects empty reel strips", () => {
    expect(() => getReelWindow([], 0)).toThrow(
      "Cannot create a reel window from an empty reel strip.",
    );
  });
});
