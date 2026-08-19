import { describe, expect, it } from "vitest";
import { SUBTRACTION_STAGES } from "../../domain/stages/subtractionStages";
import { generateSubtractionQuestions } from "./generateSubtractionQuestions";

const fixedRng = () => 0.31;

describe("generateSubtractionQuestions", () => {
  it("generates ten unique non-negative subtraction questions for every stage", () => {
    for (const stage of SUBTRACTION_STAGES) {
      const questions = generateSubtractionQuestions(stage, fixedRng);

      expect(questions).toHaveLength(10);
      expect(new Set(questions.map((question) => question.id)).size).toBe(10);
      expect(
        questions.every(
          (question) =>
            question.operator === "subtraction" &&
            question.stageId === stage.id &&
            question.leftOperand >= question.rightOperand &&
            question.answer === question.leftOperand - question.rightOperand,
        ),
      ).toBe(true);
    }
  });

  it("generates to-zero and from-ten questions from their stage rules", () => {
    const toZero = generateSubtractionQuestions(
      SUBTRACTION_STAGES[2],
      fixedRng,
    );
    const fromTen = generateSubtractionQuestions(
      SUBTRACTION_STAGES[3],
      fixedRng,
    );

    expect(toZero.every((question) => question.answer === 0)).toBe(true);
    expect(fromTen.every((question) => question.leftOperand === 10)).toBe(true);
  });
});
