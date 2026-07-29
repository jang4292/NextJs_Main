import { describe, expect, it } from "vitest";
import type {
  ArithmeticQuestion,
  LearningSession,
  QuestionResult,
} from "../../domain/arithmetic.types";
import {
  ARITHMETIC_PROGRESS_VERSION,
  MAX_MISTAKES,
  MAX_RECENT_SESSIONS,
  type ArithmeticLearningData,
  type LearningSessionSummary,
  type MistakeRecord,
} from "../../domain/learningProgress.types";
import { ADDITION_STAGES } from "../../domain/stages/additionStages";
import { calculateSessionResult } from "./calculateSessionResult";
import {
  applyStageResult,
  getDefaultLearningData,
  parseLearningData,
} from "./learningStorage";

describe("learningStorage", () => {
  it("returns defaults for empty, corrupt, or wrong-version data", () => {
    expect(parseLearningData(null)).toEqual(getDefaultLearningData());
    expect(parseLearningData("{bad json")).toEqual(getDefaultLearningData());
    expect(parseLearningData(JSON.stringify({ version: 999 }))).toEqual(
      getDefaultLearningData(),
    );
  });

  it("applies a completed stage result to progress, history, and mistakes", () => {
    const stage = ADDITION_STAGES[0];
    const session = createSession([
      result(question(1, 2), [{ answer: 3, isCorrect: true }]),
      result(question(2, 2), [
        { answer: 5, isCorrect: false },
        { answer: 4, isCorrect: true },
      ]),
    ]);
    const analysis = calculateSessionResult(session);

    const data = applyStageResult(
      getDefaultLearningData(),
      stage,
      session,
      analysis,
    );

    expect(data.lastPlayedOperation).toBe("addition");
    expect(data.lastPlayedStageId).toBe(stage.id);
    expect(data.stageProgress[0]).toMatchObject({
      stageId: stage.id,
      completedSessions: 1,
      status: "practicing",
    });
    expect(data.recentSessions).toHaveLength(1);
    expect(data.mistakes).toHaveLength(1);
    expect(data.mistakes[0]).toMatchObject({
      leftOperand: 2,
      rightOperand: 2,
      mistakeCount: 1,
    });
  });

  it("caps recent sessions and mistakes", () => {
    const stage = ADDITION_STAGES[0];
    const session = createSession([
      result(question(4, 1), [
        { answer: 0, isCorrect: false },
        { answer: 5, isCorrect: true },
      ]),
    ]);
    const analysis = calculateSessionResult(session);
    const currentData: ArithmeticLearningData = {
      ...getDefaultLearningData(),
      recentSessions: Array.from(
        { length: MAX_RECENT_SESSIONS },
        (_, index) => createSessionSummary(index),
      ),
      mistakes: Array.from({ length: MAX_MISTAKES }, (_, index) =>
        createMistake(index),
      ),
    };

    const data = applyStageResult(currentData, stage, session, analysis);

    expect(data.recentSessions).toHaveLength(MAX_RECENT_SESSIONS);
    expect(data.mistakes).toHaveLength(MAX_MISTAKES);
    expect(data.recentSessions[0].id).toBe(session.id);
  });

  it("parses only valid records from persisted data", () => {
    const raw = JSON.stringify({
      version: ARITHMETIC_PROGRESS_VERSION,
      stageProgress: [{ bad: true }],
      recentSessions: [createSessionSummary(1), { bad: true }],
      mistakes: [createMistake(1), { bad: true }],
    });

    const data = parseLearningData(raw);

    expect(data.stageProgress).toHaveLength(0);
    expect(data.recentSessions).toHaveLength(1);
    expect(data.mistakes).toHaveLength(1);
  });
});

function question(leftOperand: number, rightOperand: number): ArithmeticQuestion {
  return {
    id: `${leftOperand}-${rightOperand}`,
    leftOperand,
    rightOperand,
    operator: "addition",
    answer: leftOperand + rightOperand,
    difficulty: "easy",
    stageId: "addition-within-5",
  };
}

function result(
  arithmeticQuestion: ArithmeticQuestion,
  answers: Array<{ answer: number; isCorrect: boolean }>,
): QuestionResult {
  const attempts = answers.map((answer, index) => ({
    submittedAnswer: answer.answer,
    isCorrect: answer.isCorrect,
    elapsedMs: 1000,
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

function createSession(results: QuestionResult[]): LearningSession {
  return {
    id: "session-new",
    startedAt: "2026-07-29T00:00:00.000Z",
    completedAt: "2026-07-29T00:01:00.000Z",
    totalQuestions: results.length,
    results,
  };
}

function createSessionSummary(index: number): LearningSessionSummary {
  return {
    id: `session-${index}`,
    operation: "addition",
    stageId: "addition-within-5",
    startedAt: "2026-07-28T00:00:00.000Z",
    totalQuestions: 10,
    firstTryCorrectCount: 8,
    firstTryAccuracy: 0.8,
    starRating: 2,
  };
}

function createMistake(index: number): MistakeRecord {
  return {
    questionKey: `addition:addition-within-5:standard:${index}:1`,
    operation: "addition",
    stageId: "addition-within-5",
    leftOperand: index,
    rightOperand: 1,
    answer: index + 1,
    difficulty: "easy",
    mistakeCount: 1,
    firstSeenAt: "2026-07-28T00:00:00.000Z",
    lastSeenAt: "2026-07-28T00:00:00.000Z",
  };
}
