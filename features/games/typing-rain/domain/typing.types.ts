export type LanguageType = "ko" | "en";

export type DifficultyLevel = "easy" | "normal" | "hard";

export type ContentType = "word" | "short-sentence" | "long-sentence";

export type TypingGameStatus =
  | "idle"
  | "countdown"
  | "playing"
  | "paused"
  | "game-over"
  | "result";

export interface TypingContent {
  id: string;
  text: string;
  language: LanguageType;
  type: ContentType;
  difficulty: DifficultyLevel;
  category: string;
  tags: string[];
  enabled: boolean;
}

export interface DifficultyConfig {
  spawnIntervalMs: number;
  fallDurationMs: number;
  maxActiveWords: number;
  initialHealth: number;
  minWordLength: number;
  maxWordLength: number;
}

export interface FallingWord {
  id: string;
  contentId: string;
  text: string;
  x: number;
  speed: number;
  spawnedAt: number;
  fallDurationMs: number;
  status: "active" | "matched" | "missed";
}

export interface TypingGameSettings {
  language: LanguageType;
  difficulty: DifficultyLevel;
}

export interface TypingGameResult {
  score: number;
  correctCount: number;
  missedCount: number;
  typedCharacterCount: number;
  correctCharacterCount: number;
  accuracy: number;
  maxCombo: number;
  elapsedMs: number;
  completedCharactersPerMinute: number;
  isNewHighScore: boolean;
}

export interface TypingGameStorage {
  version: 1;
  highScores: Record<string, number>;
  maxCombo: number;
  preferences: {
    language: LanguageType;
    difficulty: DifficultyLevel;
    soundEnabled: boolean;
    reduceMotion: boolean;
  };
}
