import { describe, expect, it } from "vitest";
import type {
  ProbabilityQuestionKind,
  ProbabilityScenarioKind,
} from "../../domain/probability.types";
import { PROBABILITY_STAGE } from "../../domain/stages";
import { generateProbabilityQuestions } from "./generateProbabilityQuestions";

const fixedRng = () => 0.41;

describe("generateProbabilityQuestions", () => {
  it("generates ten unique probability questions", () => {
    const questions = generateProbabilityQuestions(PROBABILITY_STAGE, fixedRng);

    expect(questions).toHaveLength(10);
    expect(new Set(questions.map((question) => question.id)).size).toBe(10);
  });

  it("includes both total and favorable outcome questions", () => {
    const questions = generateProbabilityQuestions(PROBABILITY_STAGE, fixedRng);

    expect(new Set(questions.map((question) => question.kind))).toEqual(
      new Set<ProbabilityQuestionKind>([
        "total-outcomes",
        "favorable-outcomes",
      ]),
    );
  });

  it("includes coin, die, and color-pick scenarios", () => {
    const questions = generateProbabilityQuestions(PROBABILITY_STAGE, fixedRng);

    expect(new Set(questions.map((question) => question.scenarioKind))).toEqual(
      new Set<ProbabilityScenarioKind>(["coin", "die", "color-pick"]),
    );
  });

  it("keeps every answer aligned with the listed outcomes", () => {
    const questions = generateProbabilityQuestions(PROBABILITY_STAGE, fixedRng);

    expect(
      questions.every((question) => {
        const expectedAnswer =
          question.kind === "total-outcomes"
            ? question.outcomes.length
            : question.outcomes.filter((outcome) =>
                question.targetOutcomeLabels.includes(outcome),
              ).length;

        return question.answer === expectedAnswer;
      }),
    ).toBe(true);
  });

  it("keeps every answer as a count within the total outcomes", () => {
    const questions = generateProbabilityQuestions(PROBABILITY_STAGE, fixedRng);

    expect(
      questions.every(
        (question) =>
          Number.isInteger(question.answer) &&
          question.answer >= 0 &&
          question.answer <= question.outcomes.length,
      ),
    ).toBe(true);
  });
});
