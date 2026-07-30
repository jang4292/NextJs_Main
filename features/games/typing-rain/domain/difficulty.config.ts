import type {
  DifficultyConfig,
  DifficultyLevel,
  PlayableContentType,
  TypingRuleOptions,
} from "./typing.types";

export const DEFAULT_TYPING_RULES: TypingRuleOptions = {
  caseSensitive: true,
  punctuationRequired: true,
  trimWhitespace: true,
  collapseWhitespace: false,
};

export const CONTENT_TYPE_LABELS: Record<PlayableContentType, string> = {
  word: "단어",
  "short-sentence": "짧은 문장",
};

export const CONTENT_TYPE_DIFFICULTY_CONFIGS: Record<
  PlayableContentType,
  Record<DifficultyLevel, DifficultyConfig>
> = {
  word: {
    easy: createDifficultyConfig({
      spawnIntervalMs: 2600,
      fallDurationMs: 11500,
      maxActiveWords: 2,
      initialHealth: 7,
      minContentLength: 2,
      maxContentLength: 5,
    }),
    normal: createDifficultyConfig({
      spawnIntervalMs: 2100,
      fallDurationMs: 9000,
      maxActiveWords: 3,
      initialHealth: 5,
      minContentLength: 2,
      maxContentLength: 8,
    }),
    hard: createDifficultyConfig({
      spawnIntervalMs: 1550,
      fallDurationMs: 7200,
      maxActiveWords: 5,
      initialHealth: 4,
      minContentLength: 3,
      maxContentLength: 12,
    }),
  },
  "short-sentence": {
    easy: createDifficultyConfig({
      spawnIntervalMs: 5200,
      fallDurationMs: 24500,
      maxActiveWords: 2,
      initialHealth: 5,
      minContentLength: 5,
      maxContentLength: 30,
    }),
    normal: createDifficultyConfig({
      spawnIntervalMs: 4800,
      fallDurationMs: 22500,
      maxActiveWords: 2,
      initialHealth: 4,
      minContentLength: 5,
      maxContentLength: 45,
    }),
    hard: createDifficultyConfig({
      spawnIntervalMs: 4300,
      fallDurationMs: 20500,
      maxActiveWords: 2,
      initialHealth: 3,
      minContentLength: 8,
      maxContentLength: 60,
    }),
  },
};

export const DIFFICULTY_CONFIGS = CONTENT_TYPE_DIFFICULTY_CONFIGS.word;

export const DIFFICULTY_LABELS: Record<DifficultyLevel, string> = {
  easy: "Easy",
  normal: "Normal",
  hard: "Hard",
};

export const DIFFICULTY_MULTIPLIERS: Record<DifficultyLevel, number> = {
  easy: 1,
  normal: 1.2,
  hard: 1.5,
};

function createDifficultyConfig({
  spawnIntervalMs,
  fallDurationMs,
  maxActiveWords,
  initialHealth,
  minContentLength,
  maxContentLength,
}: Omit<DifficultyConfig, "minWordLength" | "maxWordLength">): DifficultyConfig {
  return {
    spawnIntervalMs,
    fallDurationMs,
    maxActiveWords,
    initialHealth,
    minContentLength,
    maxContentLength,
    minWordLength: minContentLength,
    maxWordLength: maxContentLength,
  };
}
