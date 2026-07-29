import { describe, expect, it } from "vitest";
import type {
  ArithmeticQuestion,
  LearningSession,
  QuestionResult,
} from "../../domain/arithmetic.types";
import { calculateSessionResult } from "./calculateSessionResult";

function question(
  id: string,
  leftOperand: number,
  rightOperand: number,
  difficulty: ArithmeticQuestion["difficulty"] = "medium",
): ArithmeticQuestion {
  return {
    id,
    leftOperand,
    rightOperand,
    operator: "addition",
    answer: leftOperand + rightOperand,
    difficulty,
    stageId: "addition-mixed",
  };
}

function result(
  arithmeticQuestion: ArithmeticQuestion,
  answers: Array<{ answer: number; isCorrect: boolean; elapsedMs: number }>,
): QuestionResult {
  const attempts = answers.map((answer, index) => ({
    submittedAnswer: answer.answer,
    isCorrect: answer.isCorrect,
    elapsedMs: answer.elapsedMs,
    attemptNumber: index + 1,
  }));

  return {
    question: arithmeticQuestion,
    attempts,
    firstTryCorrect: attempts[0]?.isCorrect ?? false,
    completed: true,
    totalElapsedMs: attempts.reduce(
      (totalElapsedMs, attempt) => totalElapsedMs + attempt.elapsedMs,
      0,
    ),
  };
}

describe("calculateSessionResult", () => {
  it("calculates accuracy, averages, streak, retries, and final correct count", () => {
    const session: LearningSession = {
      id: "session-1",
      startedAt: "2026-07-28T00:00:00.000Z",
      completedAt: "2026-07-28T00:01:00.000Z",
      totalQuestions: 3,
      results: [
        result(question("q1", 1, 2, "easy"), [
          { answer: 3, isCorrect: true, elapsedMs: 3000 },
        ]),
        result(question("q2", 4, 5, "medium"), [
          { answer: 8, isCorrect: false, elapsedMs: 2000 },
          { answer: 9, isCorrect: true, elapsedMs: 4000 },
        ]),
        result(question("q3", 8, 7, "hard"), [
          { answer: 14, isCorrect: false, elapsedMs: 5000 },
          { answer: 13, isCorrect: false, elapsedMs: 3000 },
        ]),
      ],
    };

    const analysis = calculateSessionResult(session);

    expect(analysis.totalQuestions).toBe(3);
    expect(analysis.firstTryCorrectCount).toBe(1);
    expect(analysis.retryCorrectCount).toBe(1);
    expect(analysis.finalCorrectCount).toBe(2);
    expect(analysis.firstTryAccuracy).toBeCloseTo(1 / 3);
    expect(analysis.averageElapsedMs).toBeCloseTo((3000 + 6000 + 8000) / 3);
    expect(analysis.averageAttemptCount).toBeCloseTo(5 / 3);
    expect(analysis.maxStreak).toBe(1);
    expect(analysis.wrongResults).toHaveLength(2);
  });

  it("summarizes difficult operands, sums, difficulty accuracy, evaluation, and stars", () => {
    const session: LearningSession = {
      id: "session-2",
      startedAt: "2026-07-28T00:00:00.000Z",
      totalQuestions: 3,
      results: [
        result(question("q1", 1, 2, "easy"), [
          { answer: 3, isCorrect: true, elapsedMs: 3000 },
        ]),
        result(question("q2", 4, 5, "medium"), [
          { answer: 8, isCorrect: false, elapsedMs: 2000 },
          { answer: 9, isCorrect: true, elapsedMs: 4000 },
        ]),
        result(question("q3", 4, 7, "hard"), [
          { answer: 10, isCorrect: false, elapsedMs: 5000 },
          { answer: 11, isCorrect: true, elapsedMs: 3000 },
        ]),
      ],
    };

    const analysis = calculateSessionResult(session);

    expect(analysis.difficultOperands.slice(0, 2)).toEqual([4, 5]);
    expect(analysis.difficultSums).toEqual([9, 11]);
    expect(analysis.difficultyAccuracy.medium).toEqual({
      total: 1,
      firstTryCorrect: 0,
      rate: 0,
    });
    expect(analysis.evaluation.level).toBe("needs-basics");
    expect(analysis.starRating).toBe(1);
  });
});
