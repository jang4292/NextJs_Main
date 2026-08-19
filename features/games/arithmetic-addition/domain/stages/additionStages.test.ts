import { describe, expect, it } from "vitest";
import type { LearningStage } from "../arithmetic.types";
import { ADDITION_STAGES } from "./additionStages";
import { DIVISION_STAGES } from "./divisionStages";
import { MULTIPLICATION_STAGES } from "./multiplicationStages";
import { SUBTRACTION_STAGES } from "./subtractionStages";

describe("arithmetic stages", () => {
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

  it("defines the learning metadata required for stage grouping", () => {
    const stages: LearningStage[] = [
      ...ADDITION_STAGES,
      ...SUBTRACTION_STAGES,
      ...MULTIPLICATION_STAGES,
      ...DIVISION_STAGES,
    ];

    expect(
      stages.every(
        (stage) =>
          stage.questionTypes.length > 0 &&
          stage.questionTypes.includes("standard") &&
          Boolean(stage.category),
      ),
    ).toBe(true);
    expect(
      ADDITION_STAGES.slice(0, 4).every((stage) => stage.category === "basic"),
    ).toBe(true);
    expect(
      ADDITION_STAGES.slice(4).every((stage) => stage.category === "practice"),
    ).toBe(true);
    expect(
      SUBTRACTION_STAGES.every((stage) => stage.category === "basic"),
    ).toBe(true);
    expect(
      MULTIPLICATION_STAGES.every((stage) => stage.category === "basic"),
    ).toBe(true);
    expect(DIVISION_STAGES.every((stage) => stage.category === "basic")).toBe(
      true,
    );
  });

  it("defines three ordered multiplication basic stages", () => {
    expect(MULTIPLICATION_STAGES.map((stage) => stage.id)).toEqual([
      "multiplication-equal-groups",
      "multiplication-by-zero",
      "multiplication-by-one",
    ]);
    expect(
      MULTIPLICATION_STAGES.every((stage) => stage.questionCount === 10),
    ).toBe(true);
    expect(MULTIPLICATION_STAGES[1].prerequisites).toEqual([
      "multiplication-equal-groups",
    ]);
    expect(MULTIPLICATION_STAGES[2].prerequisites).toEqual([
      "multiplication-by-zero",
    ]);
  });

  it("keeps generated stages backed by enough unique candidates", () => {
    const generatedStages = [
      ...ADDITION_STAGES.filter((candidate) => !candidate.useMixedGenerator),
      ...SUBTRACTION_STAGES,
      ...MULTIPLICATION_STAGES,
      ...DIVISION_STAGES,
    ];

    for (const stage of generatedStages) {
      const candidates = stage.buildCandidates?.() ?? [];
      const keys = candidates.map(
        (candidate) => `${candidate.leftOperand}-${candidate.rightOperand}`,
      );

      expect(candidates.length).toBeGreaterThanOrEqual(stage.questionCount);
      expect(new Set(keys).size).toBe(candidates.length);
    }
  });
});
