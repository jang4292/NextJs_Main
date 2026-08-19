import { describe, expect, it } from "vitest";
import { SEQUENCE_STAGE } from "../../domain/stages";
import { generateSequenceQuestions } from "./generateSequenceQuestions";

const fixedRng = () => 0.41;

describe("generateSequenceQuestions", () => {
  it("generates ten unique sequence questions", () => {
    const questions = generateSequenceQuestions(SEQUENCE_STAGE, fixedRng);

    expect(questions).toHaveLength(10);
    expect(new Set(questions.map((question) => question.id)).size).toBe(10);
  });

  it("includes both increasing and decreasing patterns", () => {
    const questions = generateSequenceQuestions(SEQUENCE_STAGE, fixedRng);

    expect(
      questions.some((question) => question.direction === "increase"),
    ).toBe(true);
    expect(
      questions.some((question) => question.direction === "decrease"),
    ).toBe(true);
  });

  it("keeps every answer aligned with the sequence step", () => {
    const questions = generateSequenceQuestions(SEQUENCE_STAGE, fixedRng);

    expect(
      questions.every((question) => {
        const lastValue = question.values.at(-1);
        if (lastValue === undefined) return false;

        return question.direction === "increase"
          ? question.answer === lastValue + question.step
          : question.answer === lastValue - question.step;
      }),
    ).toBe(true);
  });

  it("keeps decreasing sequences positive", () => {
    const questions = generateSequenceQuestions(SEQUENCE_STAGE, fixedRng);
    const decreasingQuestions = questions.filter(
      (question) => question.direction === "decrease",
    );

    expect(
      decreasingQuestions.every(
        (question) =>
          question.answer > 0 && question.values.every((value) => value > 0),
      ),
    ).toBe(true);
  });
});
