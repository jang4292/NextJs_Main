import { describe, expect, it } from "vitest";
import type {
  QuestionResult,
  SessionAnalysis,
} from "../../domain/arithmetic.types";
import { ADDITION_STAGES } from "../../domain/stages/additionStages";
import { buildRecommendation } from "./buildRecommendation";

describe("buildRecommendation", () => {
  it("recommends mistake review when three or more questions need practice", () => {
    const recommendation = buildRecommendation(
      analysis({ firstTryAccuracy: 0.7, wrongCount: 3 }),
      ADDITION_STAGES[1],
      { stages: ADDITION_STAGES },
    );

    expect(recommendation.kind).toBe("review-mistakes");
  });

  it("recommends the next stage after stable completion", () => {
    const recommendation = buildRecommendation(
      analysis({ firstTryAccuracy: 0.8, wrongCount: 2 }),
      ADDITION_STAGES[1],
      { stages: ADDITION_STAGES },
    );

    expect(recommendation.kind).toBe("next-stage");
    expect(recommendation.targetStageId).toBe("addition-doubles");
  });

  it("recommends repeating a stage in the practice band", () => {
    const recommendation = buildRecommendation(
      analysis({ firstTryAccuracy: 0.7, wrongCount: 2 }),
      ADDITION_STAGES[1],
      { stages: ADDITION_STAGES },
    );

    expect(recommendation.kind).toBe("repeat-stage");
    expect(recommendation.targetStageId).toBe("addition-within-10");
  });

  it("recommends the previous stage for low accuracy when possible", () => {
    const recommendation = buildRecommendation(
      analysis({ firstTryAccuracy: 0.5, wrongCount: 2 }),
      ADDITION_STAGES[2],
      { stages: ADDITION_STAGES },
    );

    expect(recommendation.kind).toBe("previous-stage");
    expect(recommendation.targetStageId).toBe("addition-within-10");
  });
});

function analysis({
  firstTryAccuracy,
  wrongCount,
}: {
  firstTryAccuracy: number;
  wrongCount: number;
}): SessionAnalysis {
  return {
    totalQuestions: 10,
    firstTryCorrectCount: Math.round(firstTryAccuracy * 10),
    retryCorrectCount: 0,
    finalCorrectCount: 10,
    firstTryAccuracy,
    averageElapsedMs: 3000,
    averageAttemptCount: 1,
    maxStreak: 4,
    wrongResults: Array.from({ length: wrongCount }, (_, index) =>
      wrongResult(index),
    ),
    difficultOperands: [],
    difficultSums: [],
    difficultyAccuracy: {
      easy: { total: 0, firstTryCorrect: 0, rate: 0 },
      medium: { total: 0, firstTryCorrect: 0, rate: 0 },
      hard: { total: 0, firstTryCorrect: 0, rate: 0 },
    },
    evaluation: {
      level: "doing-well",
      title: "잘하고 있어요",
      message: "좋아요.",
    },
    starRating: 2,
  };
}

function wrongResult(index: number): QuestionResult {
  return {
    question: {
      id: `wrong-${index}`,
      leftOperand: index,
      rightOperand: 1,
      operator: "addition",
      answer: index + 1,
      difficulty: "easy",
      stageId: "addition-within-10",
    },
    attempts: [],
    firstTryCorrect: false,
    completed: true,
    totalElapsedMs: 1000,
  };
}
