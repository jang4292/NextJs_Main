import { describe, expect, it } from "vitest";
import { resolveSwipeDirection } from "./swipeGeometry";

describe("resolveSwipeDirection", () => {
  it("returns null for short pointer movement", () => {
    expect(resolveSwipeDirection(8, 12, 24)).toBeNull();
  });

  it("chooses the largest axis for diagonal movement", () => {
    expect(resolveSwipeDirection(40, 24, 24)).toBe("RIGHT");
    expect(resolveSwipeDirection(-20, 36, 24)).toBe("DOWN");
  });

  it("resolves each cardinal direction past the threshold", () => {
    expect(resolveSwipeDirection(25, 0, 24)).toBe("RIGHT");
    expect(resolveSwipeDirection(-25, 0, 24)).toBe("LEFT");
    expect(resolveSwipeDirection(0, 25, 24)).toBe("DOWN");
    expect(resolveSwipeDirection(0, -25, 24)).toBe("UP");
  });
});
