import { describe, expect, it } from "vitest";
import {
  calculateStarRating,
  evaluateLearningSession,
} from "./evaluation";

describe("calculateStarRating", () => {
  it("returns 3 stars for 9 or 10 first-try correct answers", () => {
    expect(calculateStarRating(9)).toBe(3);
    expect(calculateStarRating(10)).toBe(3);
  });

  it("returns 2 stars for 7 or 8 first-try correct answers", () => {
    expect(calculateStarRating(7)).toBe(2);
    expect(calculateStarRating(8)).toBe(2);
  });

  it("returns 1 star while still treating completion positively", () => {
    expect(calculateStarRating(6)).toBe(1);
  });
});

describe("evaluateLearningSession", () => {
  it("returns very stable for high accuracy and fast average time", () => {
    expect(evaluateLearningSession(0.9, 4500).level).toBe("very-stable");
  });

  it("returns doing well for at least 80 percent first-try accuracy", () => {
    expect(evaluateLearningSession(0.8, 8000).level).toBe("doing-well");
  });

  it("returns practice messages for lower accuracy bands", () => {
    expect(evaluateLearningSession(0.7, 7000).level).toBe("needs-practice");
    expect(evaluateLearningSession(0.5, 7000).level).toBe("needs-basics");
  });
});

