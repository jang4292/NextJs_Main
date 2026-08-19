import { describe, expect, it } from "vitest";
import { DIVISION_STAGES } from "../../domain/stages/divisionStages";
import { generateDivisionQuestions } from "./generateDivisionQuestions";

const fixedRng = () => 0.29;

describe("generateDivisionQuestions", () => {
  it("generates ten unique exact-division questions for every stage", () => {
    for (const stage of DIVISION_STAGES) {
      const questions = generateDivisionQuestions(stage, fixedRng);

      expect(questions).toHaveLength(10);
      expect(new Set(questions.map((question) => question.id)).size).toBe(10);
      expect(
        questions.every(
          (question) =>
            question.operator === "division" &&
            question.stageId === stage.id &&
            question.rightOperand > 0 &&
            question.leftOperand % question.rightOperand === 0 &&
            question.answer === question.leftOperand / question.rightOperand,
        ),
      ).toBe(true);
    }
  });

  it("keeps equal-sharing questions in the configured beginner range", () => {
    const questions = generateDivisionQuestions(DIVISION_STAGES[0], fixedRng);

    expect(
      questions.every(
        (question) =>
          question.rightOperand >= 2 &&
          question.rightOperand <= 5 &&
          question.answer >= 2 &&
          question.answer <= 5,
      ),
    ).toBe(true);
  });
});
