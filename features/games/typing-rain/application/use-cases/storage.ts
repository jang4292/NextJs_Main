import { DEFAULT_TYPING_RULES } from "../../domain/difficulty.config";
import type {
  ContentLearningRecord,
  DifficultyLevel,
  GameHistoryRecord,
  LanguageType,
  PlayableContentType,
  TypingGamePreferences,
  TypingGameResult,
  TypingGameSettings,
  TypingGameStorage,
  TypingGameStorageV1,
  TypingRuleOptions,
} from "../../domain/typing.types";
import {
  applyTargetRecordsToLearningRecords,
  createGameHistoryRecord,
  limitRecentGames,
} from "./learningRecords";

export const TYPING_RAIN_STORAGE_KEY = "portfolio.typingRain.storage.v2";
export const TYPING_RAIN_LEGACY_STORAGE_KEY = "portfolio.typingRain.storage.v1";
export const TYPING_RAIN_STORAGE_VERSION = 2;

export function buildHighScoreKey(
  language: LanguageType,
  difficulty: DifficultyLevel,
  contentType: PlayableContentType = "word",
): string {
  return `${language}:${difficulty}:${contentType}`;
}

export function createDefaultTypingGameStorage(): TypingGameStorage {
  return {
    version: TYPING_RAIN_STORAGE_VERSION,
    highScores: {},
    maxCombo: 0,
    recentGames: [],
    learningRecords: {},
    preferences: createDefaultPreferences(),
  };
}

export const getDefaultStorage = createDefaultTypingGameStorage;

export function loadTypingGameStorage(storage?: Storage): TypingGameStorage {
  if (typeof window === "undefined" && !storage) {
    return createDefaultTypingGameStorage();
  }

  const storageSource = storage ?? window.localStorage;

  try {
    return parseTypingGameStorage(
      storageSource.getItem(TYPING_RAIN_STORAGE_KEY) ??
        storageSource.getItem(TYPING_RAIN_LEGACY_STORAGE_KEY),
    );
  } catch {
    return createDefaultTypingGameStorage();
  }
}

export function saveTypingGameStorage(
  storageValue: TypingGameStorage,
  storage?: Storage,
) {
  if (typeof window === "undefined" && !storage) return;

  const storageSource = storage ?? window.localStorage;

  try {
    storageSource.setItem(
      TYPING_RAIN_STORAGE_KEY,
      serializeTypingGameStorage(storageValue),
    );
  } catch {
    // Storage failures should not block a playable session.
  }
}

export function parseTypingGameStorage(raw: string | null): TypingGameStorage {
  if (!raw) return createDefaultTypingGameStorage();

  try {
    return migrateTypingGameStorage(JSON.parse(raw) as unknown);
  } catch {
    return createDefaultTypingGameStorage();
  }
}

export function migrateTypingGameStorage(value: unknown): TypingGameStorage {
  if (!isRecord(value)) return createDefaultTypingGameStorage();

  if (value.version === 2) {
    return sanitizeStorageV2(value);
  }

  if (value.version === 1) {
    return migrateStorageV1(value as Partial<TypingGameStorageV1>);
  }

  return createDefaultTypingGameStorage();
}

export function serializeTypingGameStorage(storage: TypingGameStorage): string {
  return JSON.stringify(storage);
}

export function applyPreferences(
  storage: TypingGameStorage,
  preferences: Partial<TypingGameStorage["preferences"]>,
): TypingGameStorage {
  return {
    ...storage,
    preferences: sanitizePreferences({
      ...storage.preferences,
      ...preferences,
      typingRules: {
        ...storage.preferences.typingRules,
        ...preferences.typingRules,
      },
    }),
  };
}

export function applyGameResultToStorage({
  storage,
  settings,
  result,
  playedAt = new Date().toISOString(),
}: {
  storage: TypingGameStorage;
  settings: TypingGameSettings;
  result: TypingGameResult;
  playedAt?: string;
}): TypingGameStorage {
  const key = buildHighScoreKey(
    settings.language,
    settings.difficulty,
    settings.contentType,
  );
  const previousScore = storage.highScores[key] ?? 0;
  const id = `${playedAt}:${settings.language}:${settings.difficulty}:${settings.contentType}`;
  const historyRecord = createGameHistoryRecord({
    id,
    playedAt,
    settings,
    result,
  });

  return {
    ...storage,
    highScores: {
      ...storage.highScores,
      [key]: Math.max(previousScore, result.score),
    },
    maxCombo: Math.max(storage.maxCombo, result.maxCombo),
    recentGames: limitRecentGames([historyRecord, ...storage.recentGames]),
    learningRecords: applyTargetRecordsToLearningRecords({
      learningRecords: storage.learningRecords,
      targetRecords: result.targetRecords,
      playedAt,
    }),
    preferences: {
      ...storage.preferences,
      language: settings.language,
      difficulty: settings.difficulty,
      contentType: settings.contentType,
    },
  };
}

function createDefaultPreferences(): TypingGamePreferences {
  return {
    language: "ko",
    difficulty: "easy",
    contentType: "word",
    soundEnabled: false,
    reduceMotion: false,
    typingRules: DEFAULT_TYPING_RULES,
  };
}

function migrateStorageV1(
  storage: Partial<TypingGameStorageV1>,
): TypingGameStorage {
  const defaults = createDefaultTypingGameStorage();
  const preferences = sanitizePreferences({
    ...defaults.preferences,
    ...storage.preferences,
    contentType: storage.preferences?.contentType ?? "word",
    typingRules: {
      ...defaults.preferences.typingRules,
      ...storage.preferences?.typingRules,
    },
  });
  const highScores = migrateHighScores(sanitizeHighScores(storage.highScores));

  return {
    ...defaults,
    highScores,
    maxCombo: sanitizeNonNegativeNumber(storage.maxCombo) ?? 0,
    preferences,
  };
}

function sanitizeStorageV2(value: Record<string, unknown>): TypingGameStorage {
  return {
    version: TYPING_RAIN_STORAGE_VERSION,
    highScores: sanitizeHighScores(value.highScores),
    maxCombo: sanitizeNonNegativeNumber(value.maxCombo) ?? 0,
    recentGames: sanitizeRecentGames(value.recentGames),
    learningRecords: sanitizeLearningRecords(value.learningRecords),
    preferences: sanitizePreferences(value.preferences),
  };
}

function sanitizePreferences(value: unknown): TypingGamePreferences {
  const defaults = createDefaultPreferences();

  if (!isRecord(value)) return defaults;

  return {
    language: isLanguage(value.language)
      ? value.language
      : defaults.language,
    difficulty: isDifficulty(value.difficulty)
      ? value.difficulty
      : defaults.difficulty,
    contentType: isPlayableContentType(value.contentType)
      ? value.contentType
      : defaults.contentType,
    soundEnabled:
      typeof value.soundEnabled === "boolean"
        ? value.soundEnabled
        : defaults.soundEnabled,
    reduceMotion:
      typeof value.reduceMotion === "boolean"
        ? value.reduceMotion
        : defaults.reduceMotion,
    typingRules: sanitizeTypingRules(value.typingRules),
  };
}

function sanitizeTypingRules(value: unknown): TypingRuleOptions {
  if (!isRecord(value)) return DEFAULT_TYPING_RULES;

  return {
    caseSensitive:
      typeof value.caseSensitive === "boolean"
        ? value.caseSensitive
        : DEFAULT_TYPING_RULES.caseSensitive,
    punctuationRequired:
      typeof value.punctuationRequired === "boolean"
        ? value.punctuationRequired
        : DEFAULT_TYPING_RULES.punctuationRequired,
    trimWhitespace:
      typeof value.trimWhitespace === "boolean"
        ? value.trimWhitespace
        : DEFAULT_TYPING_RULES.trimWhitespace,
    collapseWhitespace:
      typeof value.collapseWhitespace === "boolean"
        ? value.collapseWhitespace
        : DEFAULT_TYPING_RULES.collapseWhitespace,
  };
}

function sanitizeHighScores(value: unknown): Record<string, number> {
  if (!isRecord(value)) return {};

  return Object.entries(value).reduce<Record<string, number>>(
    (scores, [key, score]) => {
      const sanitizedScore = sanitizeNonNegativeNumber(score);

      if (sanitizedScore !== null) {
        scores[key] = sanitizedScore;
      }

      return scores;
    },
    {},
  );
}

function migrateHighScores(
  highScores: Record<string, number>,
): Record<string, number> {
  return Object.entries(highScores).reduce<Record<string, number>>(
    (scores, [key, score]) => {
      scores[key] = score;
      const [language, difficulty, contentType] = key.split(":");

      if (
        isLanguage(language) &&
        isDifficulty(difficulty) &&
        contentType === undefined
      ) {
        scores[buildHighScoreKey(language, difficulty, "word")] = score;
      }

      return scores;
    },
    {},
  );
}

function sanitizeRecentGames(value: unknown): GameHistoryRecord[] {
  if (!Array.isArray(value)) return [];

  return limitRecentGames(
    value.filter(isGameHistoryRecord).map((record) => ({ ...record })),
  );
}

function sanitizeLearningRecords(
  value: unknown,
): Record<string, ContentLearningRecord> {
  if (!isRecord(value)) return {};

  return Object.entries(value).reduce<Record<string, ContentLearningRecord>>(
    (records, [contentId, record]) => {
      if (!isRecord(record)) return records;

      records[contentId] = {
        contentId,
        shownCount: sanitizeNonNegativeNumber(record.shownCount) ?? 0,
        attemptedCount: sanitizeNonNegativeNumber(record.attemptedCount) ?? 0,
        correctCount: sanitizeNonNegativeNumber(record.correctCount) ?? 0,
        missedCount: sanitizeNonNegativeNumber(record.missedCount) ?? 0,
        typoCount: sanitizeNonNegativeNumber(record.typoCount) ?? 0,
        totalInputDurationMs:
          sanitizeNonNegativeNumber(record.totalInputDurationMs) ?? 0,
        fastestInputDurationMs: sanitizeNullableNonNegativeNumber(
          record.fastestInputDurationMs,
        ),
        lastInputDurationMs: sanitizeNullableNonNegativeNumber(
          record.lastInputDurationMs,
        ),
        lastPlayedAt:
          typeof record.lastPlayedAt === "string"
            ? record.lastPlayedAt
            : new Date(0).toISOString(),
      };

      return records;
    },
    {},
  );
}

function isGameHistoryRecord(value: unknown): value is GameHistoryRecord {
  if (!isRecord(value)) return false;

  return (
    typeof value.id === "string" &&
    typeof value.playedAt === "string" &&
    isLanguage(value.language) &&
    isPlayableContentType(value.contentType) &&
    isDifficulty(value.difficulty) &&
    sanitizeNonNegativeNumber(value.score) !== null &&
    sanitizeNonNegativeNumber(value.correctCount) !== null &&
    sanitizeNonNegativeNumber(value.missedCount) !== null &&
    sanitizeNonNegativeNumber(value.typoCount) !== null &&
    typeof value.accuracy === "number" &&
    Number.isFinite(value.accuracy) &&
    sanitizeNonNegativeNumber(value.maxCombo) !== null &&
    sanitizeNonNegativeNumber(value.playDurationMs) !== null &&
    sanitizeNullableNonNegativeNumber(value.averageInputDurationMs) !== undefined
  );
}

function sanitizeNullableNonNegativeNumber(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  return sanitizeNonNegativeNumber(value);
}

function sanitizeNonNegativeNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) && value >= 0
    ? value
    : null;
}

function isLanguage(value: unknown): value is LanguageType {
  return value === "ko" || value === "en";
}

function isDifficulty(value: unknown): value is DifficultyLevel {
  return value === "easy" || value === "normal" || value === "hard";
}

function isPlayableContentType(value: unknown): value is PlayableContentType {
  return value === "word" || value === "short-sentence";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
