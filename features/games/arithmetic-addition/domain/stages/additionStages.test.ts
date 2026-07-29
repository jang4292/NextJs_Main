import { describe, expect, it } from "vitest";
import { ADDITION_STAGES } from "./additionStages";

describe("ADDITION_STAGES", () => {
  it("defines six ordered addition stages with ten questions each", () => {
    expect(ADDITION_STAGES.map((stage) => stage.id)).toEqual([
      "addition-within-5",
      "addition-within-10",
      "addition-doubles",
      "addition-make-10",
      "addition-over-10",
      "addition-mixed",
    ]);
    expect(ADDITION_STAGES.every((stage) => stage.questionCount === 10)).toBe(
      true,
    );
  });

  it("keeps generated stages backed by enough unique candidates", () => {
    for (const stage of ADDITION_STAGES.filter(
      (candidate) => !candidate.useMixedGenerator,
    )) {
      const candidates = stage.buildCandidates?.() ?? [];
      const keys = candidates.map(
        (candidate) =>
          `${candidate.leftOperand}-${candidate.rightOperand}`,
      );

      expect(candidates.length).toBeGreaterThanOrEqual(stage.questionCount);
      expect(new Set(keys).size).toBe(candidates.length);
    }
  });
});
