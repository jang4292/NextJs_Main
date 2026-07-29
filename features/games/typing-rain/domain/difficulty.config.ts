import type {
  DifficultyConfig,
  DifficultyLevel,
} from "./typing.types";

export const DIFFICULTY_CONFIGS: Record<DifficultyLevel, DifficultyConfig> = {
  easy: {
    spawnIntervalMs: 2600,
    fallDurationMs: 11500,
    maxActiveWords: 2,
    initialHealth: 7,
    minWordLength: 2,
    maxWordLength: 5,
  },
  normal: {
    spawnIntervalMs: 2100,
    fallDurationMs: 9000,
    maxActiveWords: 3,
    initialHealth: 5,
    minWordLength: 2,
    maxWordLength: 8,
  },
  hard: {
    spawnIntervalMs: 1550,
    fallDurationMs: 7200,
    maxActiveWords: 5,
    initialHealth: 4,
    minWordLength: 3,
    maxWordLength: 12,
  },
};

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
