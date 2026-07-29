import { describe, expect, it } from "vitest";
import type { TypingGameResult } from "../../domain/typing.types";
import {
  applyGameResultToStorage,
  applyPreferences,
  buildHighScoreKey,
  getDefaultStorage,
  parseTypingGameStorage,
} from "./storage";

describe("typing rain storage", () => {
  it("returns defaults for empty, corrupt, or wrong-version data", () => {
    expect(parseTypingGameStorage(null)).toEqual(getDefaultStorage());
    expect(parseTypingGameStorage("{bad json")).toEqual(getDefaultStorage());
    expect(parseTypingGameStorage(JSON.stringify({ version: 2 }))).toEqual(
      getDefaultStorage(),
    );
  });

  it("sanitizes parsed preferences and high scores", () => {
    const parsed = parseTypingGameStorage(
      JSON.stringify({
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
      }),
    );

    expect(parsed.highScores).toEqual({ "ko:easy": 1200 });
    expect(parsed.maxCombo).toBe(7);
    expect(parsed.preferences).toEqual({
      language: "en",
      difficulty: "hard",
      soundEnabled: true,
      reduceMotion: true,
    });
  });

  it("applies preferences without clearing stored scores", () => {
    const storage = {
      ...getDefaultStorage(),
      highScores: { "ko:easy": 500 },
    };

    expect(
      applyPreferences(storage, {
        language: "en",
        difficulty: "normal",
      }),
    ).toMatchObject({
      highScores: { "ko:easy": 500 },
      preferences: {
        language: "en",
        difficulty: "normal",
      },
    });
  });

  it("stores high score and max combo for the selected language and difficulty", () => {
    const result: TypingGameResult = {
      score: 900,
      correctCount: 5,
      missedCount: 1,
      typedCharacterCount: 12,
      correctCharacterCount: 10,
      accuracy: 10 / 12,
      maxCombo: 4,
      elapsedMs: 20000,
      completedCharactersPerMinute: 30,
      isNewHighScore: true,
    };

    const nextStorage = applyGameResultToStorage({
      storage: getDefaultStorage(),
      settings: { language: "ko", difficulty: "easy" },
      result,
    });

    expect(nextStorage.highScores[buildHighScoreKey("ko", "easy")]).toBe(900);
    expect(nextStorage.maxCombo).toBe(4);
  });
});
