import { describe, expect, it } from "vitest";
import { resolveSwipeDirection } from "./swipeGeometry";

describe("resolveSwipeDirection", () => {
  it("ignores gestures below the threshold", () => {
    expect(resolveSwipeDirection(10, 5, 30)).toBeNull();
  });

  it("resolves a dominant rightward swipe", () => {
    expect(resolveSwipeDirection(50, 10, 30)).toBe("RIGHT");
  });

  it("resolves a dominant leftward swipe", () => {
    expect(resolveSwipeDirection(-50, 10, 30)).toBe("LEFT");
  });

  it("resolves a dominant downward swipe", () => {
    expect(resolveSwipeDirection(10, 50, 30)).toBe("DOWN");
  });

  it("resolves a dominant upward swipe", () => {
    expect(resolveSwipeDirection(10, -50, 30)).toBe("UP");
  });

  it("breaks an exact tie in favor of the vertical axis", () => {
    expect(resolveSwipeDirection(40, 40, 30)).toBe("DOWN");
    expect(resolveSwipeDirection(40, -40, 30)).toBe("UP");
  });

  it("uses the given threshold instead of the default", () => {
    expect(resolveSwipeDirection(25, 5, 20)).toBe("RIGHT");
    expect(resolveSwipeDirection(15, 5, 20)).toBeNull();
  });
});
