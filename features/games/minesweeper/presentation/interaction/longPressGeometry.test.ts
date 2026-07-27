import { describe, expect, it } from "vitest";
import { hasExceededMoveThreshold } from "./longPressGeometry";

describe("hasExceededMoveThreshold", () => {
  it("is false for movement within the threshold", () => {
    expect(hasExceededMoveThreshold(3, 4, 10)).toBe(false); // distance 5
  });

  it("is true once the distance exceeds the threshold", () => {
    expect(hasExceededMoveThreshold(6, 8, 5)).toBe(true); // distance 10
  });

  it("is false exactly at the threshold", () => {
    expect(hasExceededMoveThreshold(3, 4, 5)).toBe(false); // distance 5
  });
});
