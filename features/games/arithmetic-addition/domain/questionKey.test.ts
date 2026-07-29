import { describe, expect, it } from "vitest";
import { buildQuestionKey } from "./questionKey";

describe("buildQuestionKey", () => {
  it("builds a stable ordered key for a question", () => {
    expect(
      buildQuestionKey("addition", "addition-make-10", "standard", 4, 6),
    ).toBe("addition:addition-make-10:standard:4:6");
  });

  it("keeps swapped operands distinct for ordered practice questions", () => {
    expect(
      buildQuestionKey("addition", "addition-make-10", "standard", 4, 6),
    ).not.toBe(
      buildQuestionKey("addition", "addition-make-10", "standard", 6, 4),
    );
  });
});
