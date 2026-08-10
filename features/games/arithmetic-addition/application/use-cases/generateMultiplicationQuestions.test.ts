import { describe, expect, it } from "vitest";
import { MULTIPLICATION_STAGES } from "../../domain/stages/multiplicationStages";
import { generateMultiplicationQuestions } from "./generateMultiplicationQuestions";

const fixedRng = () => 0.37;

describe("generateMultiplicationQuestions", () => {
  it("generates ten unique multiplication questions for every stage", () => {
    for (const stage of MULTIPLICATION_STAGES) {
      const questions = generateMultiplicationQuestions(stage, fixedRng);

      expect(questions).toHaveLength(10);
      expect(new Set(questions.map((question) => question.id)).size).toBe(10);
      expect(
        questions.every(
          (question) =>
            question.operator === "multiplication" &&
            question.stageId === stage.id &&
            question.answer ===
              question.leftOperand * question.rightOperand,
        ),
      ).toBe(true);
    }
  });

  it("keeps equal-group questions inside the configured small range", () => {
    const questions = generateMultiplicationQuestions(
      MULTIPLICATION_STAGES[0],
      fixedRng,
    );

    expect(
      questions.every(
        (question) =>
          question.leftOperand >= 2 &&
          question.leftOperand <= 4 &&
          question.rightOperand >= 2 &&
          question.rightOperand <= 5,
      ),
    ).toBe(true);
  });

  it("generates zero and one multiplication questions from their stage rules", () => {
    const byZero = generateMultiplicationQuestions(
      MULTIPLICATION_STAGES[1],
      fixedRng,
    );
    const byOne = generateMultiplicationQuestions(
      MULTIPLICATION_STAGES[2],
      fixedRng,
    );

    expect(
      byZero.every(
        (question) =>
          question.leftOperand === 0 ||
          question.rightOperand === 0 ||
          question.answer === 0,
      ),
    ).toBe(true);
    expect(
      byOne.every(
        (question) =>
          question.leftOperand === 1 ||
          question.rightOperand === 1,
      ),
    ).toBe(true);
  });
});
