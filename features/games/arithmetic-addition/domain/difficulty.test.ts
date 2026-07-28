import { describe, expect, it } from "vitest";
import { classifyAdditionDifficulty } from "./difficulty";

describe("classifyAdditionDifficulty", () => {
  it("classifies small-number and double additions as easy when the sum is not above 10", () => {
    expect(classifyAdditionDifficulty(1, 7)).toBe("easy");
    expect(classifyAdditionDifficulty(4, 4)).toBe("easy");
    expect(classifyAdditionDifficulty(2, 3)).toBe("easy");
  });

  it("classifies regular sums from 6 to 10 as medium", () => {
    expect(classifyAdditionDifficulty(3, 4)).toBe("medium");
    expect(classifyAdditionDifficulty(4, 6)).toBe("medium");
  });

  it("classifies sums above 10 as hard", () => {
    expect(classifyAdditionDifficulty(2, 9)).toBe("hard");
    expect(classifyAdditionDifficulty(8, 7)).toBe("hard");
  });
});

