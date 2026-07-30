import { describe, expect, it } from "vitest";
import type { TypingGameResult } from "../../domain/typing.types";
import {
  applyGameResultToStorage,
  applyPreferences,
  buildHighScoreKey,
  getDefaultStorage,
  migrateTypingGameStorage,
  parseTypingGameStorage,
  TYPING_RAIN_STORAGE_VERSION,
} from "./storage";

describe("typing rain storage", () => {
  it("returns defaults for empty, corrupt, or unknown-version data", () => {
    expect(parseTypingGameStorage(null)).toEqual(getDefaultStorage());
    expect(parseTypingGameStorage("{bad json")).toEqual(getDefaultStorage());
    expect(parseTypingGameStorage(JSON.stringify({ version: 99 }))).toEqual(
      getDefaultStorage(),
    );
  });

  it("migrates v1 preferences and high scores into v2 word keys", () => {
    const parsed = migrateTypingGameStorage({
      version: 1,
      highScores: {
        "ko:easy": 1200,
        bad: -1,
      },
      maxCombo: 7,
      preferences: {
        language: "en",
        difficulty: "hard",
        soundEnabled: true,
        reduceMotion: true,
      },
    });

    expect(parsed.version).toBe(TYPING_RAIN_STORAGE_VERSION);
    expect(parsed.highScores).toMatchObject({
      "ko:easy": 1200,
      "ko:easy:word": 1200,
    });
    expect(parsed.maxCombo).toBe(7);
    expect(parsed.preferences).toMatchObject({
      language: "en",
      difficulty: "hard",
      contentType: "word",
      soundEnabled: true,
      reduceMotion: true,
    });
  });

  it("sanitizes parsed v2 preferences and records", () => {
    const parsed = parseTypingGameStorage(
      JSON.stringify({
        version: 2,
        highScores: {
          "ko:easy:word": 1200,
          bad: -1,
        },
        maxCombo: 7,
        recentGames: [],
        learningRecords: {},
        preferences: {
          language: "en",
          difficulty: "hard",
          contentType: "short-sentence",
          soundEnabled: true,
          reduceMotion: true,
          typingRules: {
            caseSensitive: false,
            punctuationRequired: false,
            trimWhitespace: true,
            collapseWhitespace: true,
          },
        },
      }),
    );

    expect(parsed.highScores).toEqual({ "ko:easy:word": 1200 });
    expect(parsed.preferences.contentType).toBe("short-sentence");
    expect(parsed.preferences.typingRules.caseSensitive).toBe(false);
  });

  it("applies preferences without clearing stored scores", () => {
    const storage = {
      ...getDefaultStorage(),
      highScores: { "ko:easy:word": 500 },
    };

    expect(
      applyPreferences(storage, {
        language: "en",
        difficulty: "normal",
        contentType: "short-sentence",
      }),
    ).toMatchObject({
      highScores: { "ko:easy:word": 500 },
      preferences: {
        language: "en",
        difficulty: "normal",
        contentType: "short-sentence",
      },
    });
  });

  it("stores high score, recent game, max combo, and learning records", () => {
    const result = createResult();

    const nextStorage = applyGameResultToStorage({
      storage: getDefaultStorage(),
      settings: {
        language: "ko",
        difficulty: "easy",
        contentType: "short-sentence",
      },
      result,
      playedAt: "2026-07-30T00:00:00.000Z",
    });

    expect(
      nextStorage.highScores[
        buildHighScoreKey("ko", "easy", "short-sentence")
      ],
    ).toBe(900);
    expect(nextStorage.maxCombo).toBe(4);
    expect(nextStorage.recentGames).toHaveLength(1);
    expect(nextStorage.learningRecords["target-content"]).toMatchObject({
      shownCount: 1,
      correctCount: 1,
      typoCount: 1,
    });
  });
});

function createResult(): TypingGameResult {
  return {
    score: 900,
    correctCount: 5,
    missedCount: 1,
    typoCount: 1,
    typedCharacterCount: 12,
    correctCharacterCount: 10,
    accuracy: 10 / 12,
    maxCombo: 4,
    elapsedMs: 20_000,
    averageInputDurationMs: 800,
    fastestContent: null,
    slowestContent: null,
    mostMistypedContents: [],
    completedCharactersPerMinute: 30,
    isNewHighScore: true,
    targetRecords: [
      {
        targetId: "target-1",
        contentId: "target-content",
        text: "오늘도 잘했어요.",
        contentType: "short-sentence",
        spawnedAt: 0,
        firstInputAt: 100,
        completedAt: 900,
        missedAt: null,
        inputDurationMs: 800,
        exposureDurationMs: 900,
        typoCount: 1,
        mistakePositions: [2],
        typedCharacterCount: 8,
        correctCharacterCount: 7,
      },
    ],
  };
}
