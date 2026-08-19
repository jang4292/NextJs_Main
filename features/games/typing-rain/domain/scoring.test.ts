import { describe, expect, it } from "vitest";
import { calculateComboBonus, calculateScore } from "./scoring";

describe("scoring", () => {
  it("calculates combo bonus from the current combo", () => {
    expect(calculateComboBonus(0)).toBe(0);
    expect(calculateComboBonus(4)).toBe(40);
  });

  it("applies difficulty multipliers to the base score and combo", () => {
    expect(calculateScore({ combo: 2, difficulty: "easy" })).toBe(120);
    expect(calculateScore({ combo: 2, difficulty: "normal" })).toBe(144);
    expect(calculateScore({ combo: 2, difficulty: "hard" })).toBe(180);
  });
});
