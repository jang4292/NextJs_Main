import type {
  DifficultyLevel,
  LanguageType,
  TypingGameResult,
  TypingGameSettings,
  TypingGameStorage,
} from "../../domain/typing.types";

export const TYPING_RAIN_STORAGE_KEY = "portfolio.typingRain.storage.v1";
export const TYPING_RAIN_STORAGE_VERSION = 1;

export function buildHighScoreKey(
  language: LanguageType,
  difficulty: DifficultyLevel,
): string {
  return `${language}:${difficulty}`;
}

export function getDefaultStorage(): TypingGameStorage {
  return {
    version: TYPING_RAIN_STORAGE_VERSION,
    highScores: {},
    maxCombo: 0,
    preferences: {
      language: "ko",
      difficulty: "easy",
      soundEnabled: false,
      reduceMotion: false,
    },
  };
}

export function parseTypingGameStorage(
  raw: string | null,
): TypingGameStorage {
  if (!raw) return getDefaultStorage();

  try {
    const parsed = JSON.parse(raw) as Partial<TypingGameStorage>;
    if (parsed.version !== TYPING_RAIN_STORAGE_VERSION) {
      return getDefaultStorage();
    }

    const defaults = getDefaultStorage();

    return {
      version: TYPING_RAIN_STORAGE_VERSION,
      highScores:
        parsed.highScores && typeof parsed.highScores === "object"
          ? sanitizeHighScores(parsed.highScores)
          : {},
      maxCombo:
        typeof parsed.maxCombo === "number" && parsed.maxCombo >= 0
          ? parsed.maxCombo
          : 0,
      preferences: {
        language: isLanguage(parsed.preferences?.language)
          ? parsed.preferences.language
          : defaults.preferences.language,
        difficulty: isDifficulty(parsed.preferences?.difficulty)
          ? parsed.preferences.difficulty
          : defaults.preferences.difficulty,
        soundEnabled:
          typeof parsed.preferences?.soundEnabled === "boolean"
            ? parsed.preferences.soundEnabled
            : defaults.preferences.soundEnabled,
        reduceMotion:
          typeof parsed.preferences?.reduceMotion === "boolean"
            ? parsed.preferences.reduceMotion
            : defaults.preferences.reduceMotion,
      },
    };
  } catch {
    return getDefaultStorage();
  }
}

export function serializeTypingGameStorage(
  storage: TypingGameStorage,
): string {
  return JSON.stringify(storage);
}

export function applyPreferences(
  storage: TypingGameStorage,
  preferences: Partial<TypingGameStorage["preferences"]>,
): TypingGameStorage {
  return {
    ...storage,
    preferences: {
      ...storage.preferences,
      ...preferences,
    },
  };
}

export function applyGameResultToStorage({
  storage,
  settings,
  result,
}: {
  storage: TypingGameStorage;
  settings: TypingGameSettings;
  result: TypingGameResult;
}): TypingGameStorage {
  const key = buildHighScoreKey(settings.language, settings.difficulty);
  const previousScore = storage.highScores[key] ?? 0;

  return {
    ...storage,
    highScores: {
      ...storage.highScores,
      [key]: Math.max(previousScore, result.score),
    },
    maxCombo: Math.max(storage.maxCombo, result.maxCombo),
    preferences: {
      ...storage.preferences,
      language: settings.language,
      difficulty: settings.difficulty,
    },
  };
}

function sanitizeHighScores(value: Record<string, unknown>): Record<string, number> {
  return Object.entries(value).reduce<Record<string, number>>(
    (scores, [key, score]) => {
      if (typeof score === "number" && Number.isFinite(score) && score >= 0) {
        scores[key] = score;
      }

      return scores;
    },
    {},
  );
}

function isLanguage(value: unknown): value is LanguageType {
  return value === "ko" || value === "en";
}

function isDifficulty(value: unknown): value is DifficultyLevel {
  return value === "easy" || value === "normal" || value === "hard";
}
