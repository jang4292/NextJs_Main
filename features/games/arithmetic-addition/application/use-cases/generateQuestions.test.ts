import { describe, expect, it } from "vitest";
import { generateQuestions } from "./generateQuestions";

function fixedRng(value: number) {
  return () => value;
}

describe("generateQuestions", () => {
  it("generates ten one-digit addition questions by default", () => {
    const questions = generateQuestions({ rng: fixedRng(0.37) });

    expect(questions).toHaveLength(10);
    expect(
      questions.every(
        (question) =>
          question.leftOperand >= 1 &&
          question.leftOperand <= 9 &&
          question.rightOperand >= 1 &&
          question.rightOperand <= 9,
      ),
    ).toBe(true);
  });

  it("calculates each answer correctly", () => {
    const questions = generateQuestions({ rng: fixedRng(0.5) });

    expect(
      questions.every(
        (question) =>
          question.answer === question.leftOperand + question.rightOperand,
      ),
    ).toBe(true);
  });

  it("does not repeat the same ordered problem in one set", () => {
    const questions = generateQuestions({ rng: fixedRng(0) });
    const ids = questions.map((question) => question.id);

    expect(new Set(ids).size).toBe(questions.length);
  });

  it("uses the default easy-medium-hard distribution", () => {
    const questions = generateQuestions({ rng: fixedRng(0.25) });
    const countByDifficulty = questions.reduce(
      (counts, question) => {
        counts[question.difficulty] += 1;
        return counts;
      },
      { easy: 0, medium: 0, hard: 0 },
    );

    expect(countByDifficulty).toEqual({ easy: 3, medium: 4, hard: 3 });
  });
});

