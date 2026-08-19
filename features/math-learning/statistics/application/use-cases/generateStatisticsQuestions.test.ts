import { describe, expect, it } from "vitest";
import {
  calculateMaximum,
  calculateMean,
  calculateMedian,
  calculateMinimum,
  calculateMode,
  calculateSum,
  hasUniqueMode,
} from "../../domain/statistics";
import type { StatisticsQuestionKind } from "../../domain/statistics.types";
import { STATISTICS_STAGE } from "../../domain/stages";
import { generateStatisticsQuestions } from "./generateStatisticsQuestions";

const fixedRng = () => 0.41;

describe("generateStatisticsQuestions", () => {
  it("generates ten unique statistics questions", () => {
    const questions = generateStatisticsQuestions(STATISTICS_STAGE, fixedRng);

    expect(questions).toHaveLength(10);
    expect(new Set(questions.map((question) => question.id)).size).toBe(10);
  });

  it("includes every basic statistics kind", () => {
    const questions = generateStatisticsQuestions(STATISTICS_STAGE, fixedRng);

    expect(new Set(questions.map((question) => question.kind))).toEqual(
      new Set<StatisticsQuestionKind>([
        "sum",
        "maximum",
        "minimum",
        "mean",
        "median",
        "mode",
      ]),
    );
  });

  it("keeps every generated answer aligned with the data set", () => {
    const questions = generateStatisticsQuestions(STATISTICS_STAGE, fixedRng);

    expect(
      questions.every((question) => {
        const expectedAnswer = calculateAnswer(question.kind, question.values);

        return question.answer === expectedAnswer;
      }),
    ).toBe(true);
  });

  it("only generates integer answers and unique mode questions", () => {
    const questions = generateStatisticsQuestions(STATISTICS_STAGE, fixedRng);

    expect(
      questions.every((question) => Number.isInteger(question.answer)),
    ).toBe(true);
    expect(
      questions
        .filter((question) => question.kind === "mode")
        .every((question) => hasUniqueMode(question.values)),
    ).toBe(true);
  });
});

function calculateAnswer(
  kind: StatisticsQuestionKind,
  values: readonly number[],
): number {
  if (kind === "sum") return calculateSum(values);
  if (kind === "maximum") return calculateMaximum(values);
  if (kind === "minimum") return calculateMinimum(values);
  if (kind === "mean") return calculateMean(values);
  if (kind === "median") return calculateMedian(values);
  return calculateMode(values);
}
