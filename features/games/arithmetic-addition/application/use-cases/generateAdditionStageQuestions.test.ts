import { describe, expect, it } from "vitest";
import { ADDITION_STAGES } from "../../domain/stages/additionStages";
import { generateAdditionStageQuestions } from "./generateAdditionStageQuestions";

const fixedRng = () => 0.42;

describe("generateAdditionStageQuestions", () => {
  it("generates ten unique questions for every addition stage", () => {
    for (const stage of ADDITION_STAGES) {
      const questions = generateAdditionStageQuestions(stage, fixedRng);

      expect(questions).toHaveLength(10);
      expect(new Set(questions.map((question) => question.id)).size).toBe(10);
      expect(
        questions.every(
          (question) =>
            question.operator === "addition" &&
            question.stageId === stage.id &&
            question.answer ===
              question.leftOperand + question.rightOperand,
        ),
      ).toBe(true);
    }
  });

  it("keeps within-five and within-ten answers inside the configured ranges", () => {
    const withinFive = generateAdditionStageQuestions(
      ADDITION_STAGES[0],
      fixedRng,
    );
    const withinTen = generateAdditionStageQuestions(
      ADDITION_STAGES[1],
      fixedRng,
    );

    expect(
      withinFive.every((question) => question.answer <= 5),
    ).toBe(true);
    expect(
      withinTen.every((question) => question.answer <= 10),
    ).toBe(true);
  });

  it("generates doubles and make-ten questions from their stage rules", () => {
    const doubles = generateAdditionStageQuestions(
      ADDITION_STAGES[2],
      fixedRng,
    );
    const makeTen = generateAdditionStageQuestions(
      ADDITION_STAGES[3],
      fixedRng,
    );

    expect(
      doubles.every(
        (question) => question.leftOperand === question.rightOperand,
      ),
    ).toBe(true);
    expect(makeTen.every((question) => question.answer === 10)).toBe(true);
  });

  it("generates over-ten questions between eleven and eighteen", () => {
    const questions = generateAdditionStageQuestions(
      ADDITION_STAGES[4],
      fixedRng,
    );

    expect(
      questions.every(
        (question) => question.answer >= 11 && question.answer <= 18,
      ),
    ).toBe(true);
  });
});
