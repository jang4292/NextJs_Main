import { describe, expect, it } from "vitest";
import { DEFAULT_MATCH_THREE_CONFIG } from "../../config/gameConfig";
import { calculateMatchScore } from "./scoringService";

describe("calculateMatchScore", () => {
  it("scores removed tiles with the base value", () => {
    expect(calculateMatchScore(3, 1, DEFAULT_MATCH_THREE_CONFIG)).toBe(30);
  });

  it("applies a cascade multiplier", () => {
    expect(calculateMatchScore(4, 3, DEFAULT_MATCH_THREE_CONFIG)).toBe(120);
  });
});
