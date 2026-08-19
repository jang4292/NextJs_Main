import { describe, expect, it } from "vitest";
import type {
  GameHistoryRecord,
  TypingTargetSessionRecord,
} from "../../domain/typing.types";
import {
  applyTargetRecordsToLearningRecords,
  calculateAverageInputDurationMs,
  getMostMistypedContents,
  limitRecentGames,
} from "./learningRecords";

describe("learningRecords", () => {
  it("calculates average input duration from completed records", () => {
    expect(
      calculateAverageInputDurationMs([
        targetRecord("a", { inputDurationMs: 1_000 }),
        targetRecord("b", { inputDurationMs: 2_000 }),
        targetRecord("c", { inputDurationMs: null }),
      ]),
    ).toBe(1_500);
  });

  it("accumulates shown, attempt, correct, missed, typo, and timing records", () => {
    const nextRecords = applyTargetRecordsToLearningRecords({
      learningRecords: {},
      targetRecords: [
        targetRecord("word-a", {
          firstInputAt: 100,
          completedAt: 900,
          typoCount: 2,
          inputDurationMs: 800,
        }),
        targetRecord("word-a", {
          missedAt: 1_500,
          typoCount: 1,
        }),
      ],
      playedAt: "2026-07-30T00:00:00.000Z",
    });

    expect(nextRecords["word-a"]).toMatchObject({
      shownCount: 2,
      attemptedCount: 1,
      correctCount: 1,
      missedCount: 1,
      typoCount: 3,
      totalInputDurationMs: 800,
      fastestInputDurationMs: 800,
      lastInputDurationMs: 800,
    });
  });

  it("keeps recent games newest first and limited to thirty", () => {
    const games = Array.from({ length: 35 }, (_, index) =>
      gameHistoryRecord(index),
    );

    const limited = limitRecentGames(games);

    expect(limited).toHaveLength(30);
    expect(limited[0].id).toBe("game-34");
    expect(limited.at(-1)?.id).toBe("game-5");
  });

  it("ranks frequently mistyped content by missed, typo, accuracy, and speed", () => {
    const ranked = getMostMistypedContents(
      {
        a: learningRecord("a", {
          missedCount: 1,
          typoCount: 1,
          correctCount: 4,
          attemptedCount: 5,
        }),
        b: learningRecord("b", {
          missedCount: 2,
          typoCount: 0,
          correctCount: 1,
          attemptedCount: 3,
        }),
        c: learningRecord("c", {
          missedCount: 1,
          typoCount: 5,
          correctCount: 5,
          attemptedCount: 6,
        }),
      },
      3,
    );

    expect(ranked.map((record) => record.contentId)).toEqual(["b", "c", "a"]);
  });
});

function targetRecord(
  contentId: string,
  overrides: Partial<TypingTargetSessionRecord> = {},
): TypingTargetSessionRecord {
  return {
    targetId: `${contentId}-${Math.random()}`,
    contentId,
    text: contentId,
    contentType: "word",
    spawnedAt: 0,
    firstInputAt: null,
    completedAt: null,
    missedAt: null,
    inputDurationMs: null,
    exposureDurationMs: 0,
    typoCount: 0,
    mistakePositions: [],
    typedCharacterCount: 0,
    correctCharacterCount: 0,
    ...overrides,
  };
}

function gameHistoryRecord(index: number): GameHistoryRecord {
  return {
    id: `game-${index}`,
    playedAt: new Date(index * 1_000).toISOString(),
    language: "ko",
    contentType: "word",
    difficulty: "easy",
    score: index,
    correctCount: 0,
    missedCount: 0,
    typoCount: 0,
    accuracy: 1,
    maxCombo: 0,
    playDurationMs: 0,
    averageInputDurationMs: null,
  };
}

function learningRecord(
  contentId: string,
  overrides: Partial<ReturnType<typeof baseLearningRecord>>,
) {
  return {
    ...baseLearningRecord(contentId),
    ...overrides,
  };
}

function baseLearningRecord(contentId: string) {
  return {
    contentId,
    shownCount: 1,
    attemptedCount: 1,
    correctCount: 0,
    missedCount: 0,
    typoCount: 0,
    totalInputDurationMs: 0,
    fastestInputDurationMs: null,
    lastInputDurationMs: null,
    lastPlayedAt: "2026-07-30T00:00:00.000Z",
  };
}
