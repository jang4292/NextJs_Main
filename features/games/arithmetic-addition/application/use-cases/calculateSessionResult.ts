import type {
  Difficulty,
  DifficultyAccuracy,
  LearningSession,
  QuestionResult,
  SessionAnalysis,
} from "../../domain/arithmetic.types";
import {
  calculateStarRating,
  evaluateLearningSession,
} from "../../domain/evaluation";

const DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"];

export function calculateSessionResult(
  session: LearningSession,
): SessionAnalysis {
  const completedResults = session.results.filter((result) => result.completed);
  const totalQuestions = session.totalQuestions;
  const firstTryCorrectCount = completedResults.filter(
    (result) => result.firstTryCorrect,
  ).length;
  const finalCorrectCount = completedResults.filter((result) =>
    result.attempts.some((attempt) => attempt.isCorrect),
  ).length;
  const retryCorrectCount = completedResults.filter(
    (result) =>
      !result.firstTryCorrect &&
      result.attempts.some((attempt) => attempt.isCorrect),
  ).length;
  const averageElapsedMs = average(
    completedResults.map((result) => result.totalElapsedMs),
  );
  const averageAttemptCount = average(
    completedResults.map((result) => result.attempts.length),
  );
  const firstTryAccuracy =
    totalQuestions === 0 ? 0 : firstTryCorrectCount / totalQuestions;
  const wrongResults = completedResults.filter(
    (result) => !result.firstTryCorrect,
  );

  return {
    totalQuestions,
    firstTryCorrectCount,
    retryCorrectCount,
    finalCorrectCount,
    firstTryAccuracy,
    averageElapsedMs,
    averageAttemptCount,
    maxStreak: calculateMaxFirstTryStreak(completedResults),
    wrongResults,
    difficultOperands: calculateDifficultOperands(wrongResults),
    difficultSums: calculateDifficultSums(wrongResults),
    difficultyAccuracy: calculateDifficultyAccuracy(completedResults),
    evaluation: evaluateLearningSession(firstTryAccuracy, averageElapsedMs),
    starRating: calculateStarRating(firstTryCorrectCount),
  };
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function calculateMaxFirstTryStreak(results: QuestionResult[]): number {
  let current = 0;
  let max = 0;

  for (const result of results) {
    if (result.firstTryCorrect) {
      current += 1;
      max = Math.max(max, current);
    } else {
      current = 0;
    }
  }

  return max;
}

function calculateDifficultOperands(results: QuestionResult[]): number[] {
  const counts = new Map<number, number>();

  for (const result of results) {
    addCount(counts, result.question.leftOperand);
    addCount(counts, result.question.rightOperand);
  }

  return sortedFrequentValues(counts);
}

function calculateDifficultSums(results: QuestionResult[]): number[] {
  const counts = new Map<number, number>();

  for (const result of results) {
    addCount(counts, result.question.answer);
  }

  return sortedFrequentValues(counts);
}

function calculateDifficultyAccuracy(
  results: QuestionResult[],
): Record<Difficulty, DifficultyAccuracy> {
  return DIFFICULTIES.reduce(
    (accuracy, difficulty) => {
      const difficultyResults = results.filter(
        (result) => result.question.difficulty === difficulty,
      );
      const firstTryCorrect = difficultyResults.filter(
        (result) => result.firstTryCorrect,
      ).length;

      accuracy[difficulty] = {
        total: difficultyResults.length,
        firstTryCorrect,
        rate:
          difficultyResults.length === 0
            ? 0
            : firstTryCorrect / difficultyResults.length,
      };

      return accuracy;
    },
    {} as Record<Difficulty, DifficultyAccuracy>,
  );
}

function addCount(counts: Map<number, number>, value: number) {
  counts.set(value, (counts.get(value) ?? 0) + 1);
}

function sortedFrequentValues(counts: Map<number, number>): number[] {
  return [...counts.entries()]
    .sort(([leftValue, leftCount], [rightValue, rightCount]) => {
      if (rightCount !== leftCount) return rightCount - leftCount;
      return leftValue - rightValue;
    })
    .map(([value]) => value);
}

