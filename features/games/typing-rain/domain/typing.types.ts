export type LanguageType = "ko" | "en";

export type DifficultyLevel = "easy" | "normal" | "hard";

export type ContentType = "word" | "short-sentence" | "long-sentence";

export type PlayableContentType = Extract<
  ContentType,
  "word" | "short-sentence"
>;

export type TypingGameStatus =
  "idle" | "countdown" | "playing" | "paused" | "game-over" | "result";

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
  minContentLength: number;
  maxContentLength: number;
  minWordLength: number;
  maxWordLength: number;
}

export interface FallingWord {
  id: string;
  contentId: string;
  text: string;
  contentType?: PlayableContentType;
  x: number;
  speed: number;
  spawnedAt: number;
  fallDurationMs: number;
  sequence?: number;
  status: "active" | "matched" | "missed";
}

export interface TypingRuleOptions {
  caseSensitive: boolean;
  punctuationRequired: boolean;
  trimWhitespace: boolean;
  collapseWhitespace: boolean;
}

export interface TypingGameSettings {
  language: LanguageType;
  difficulty: DifficultyLevel;
  contentType: PlayableContentType;
}

export interface TypingSession {
  targetId: string | null;
  startedAt: number | null;
  completedAt: number | null;
  inputValue: string;
  previousInputValue: string;
  mistakeCount: number;
  mistakePositions: number[];
  typedCharacterCount: number;
  correctCharacterCount: number;
}

export interface TypingTimingRecord {
  spawnedAt: number;
  firstInputAt: number | null;
  completedAt: number | null;
  missedAt: number | null;
  inputDurationMs: number | null;
  exposureDurationMs: number;
}

export interface TypingTargetSessionRecord extends TypingTimingRecord {
  targetId: string;
  contentId: string;
  text: string;
  contentType: PlayableContentType;
  typoCount: number;
  mistakePositions: number[];
  typedCharacterCount: number;
  correctCharacterCount: number;
}

export interface TypingComparisonResult {
  isExactMatch: boolean;
  isPrefixMatch: boolean;
  correctCharacterCount: number;
  mismatchPositions: number[];
  missingCharacterCount: number;
  extraCharacterCount: number;
}

export interface TypingContentResultRecord {
  targetId: string;
  contentId: string;
  text: string;
  contentType: PlayableContentType;
  typoCount: number;
  inputDurationMs: number | null;
  exposureDurationMs: number;
  missed: boolean;
  completed: boolean;
}

export interface ContentLearningRecord {
  contentId: string;
  shownCount: number;
  attemptedCount: number;
  correctCount: number;
  missedCount: number;
  typoCount: number;
  totalInputDurationMs: number;
  fastestInputDurationMs: number | null;
  lastInputDurationMs: number | null;
  lastPlayedAt: string;
}

export interface GameHistoryRecord {
  id: string;
  playedAt: string;
  language: LanguageType;
  contentType: PlayableContentType;
  difficulty: DifficultyLevel;
  score: number;
  correctCount: number;
  missedCount: number;
  typoCount: number;
  accuracy: number;
  maxCombo: number;
  playDurationMs: number;
  averageInputDurationMs: number | null;
}

export interface TypingGameResult {
  score: number;
  correctCount: number;
  missedCount: number;
  typoCount: number;
  typedCharacterCount: number;
  correctCharacterCount: number;
  accuracy: number;
  maxCombo: number;
  elapsedMs: number;
  averageInputDurationMs: number | null;
  fastestContent: TypingContentResultRecord | null;
  slowestContent: TypingContentResultRecord | null;
  mostMistypedContents: TypingContentResultRecord[];
  targetRecords: TypingTargetSessionRecord[];
  completedCharactersPerMinute: number;
  isNewHighScore: boolean;
}

export interface TypingGamePreferences {
  language: LanguageType;
  difficulty: DifficultyLevel;
  contentType: PlayableContentType;
  soundEnabled: boolean;
  reduceMotion: boolean;
  typingRules: TypingRuleOptions;
}

export interface TypingGameStorageV1 {
  version: 1;
  highScores: Record<string, number>;
  maxCombo: number;
  preferences: {
    language: LanguageType;
    difficulty: DifficultyLevel;
    contentType?: PlayableContentType;
    soundEnabled: boolean;
    reduceMotion: boolean;
    typingRules?: TypingRuleOptions;
  };
}

export interface TypingGameStorageV2 {
  version: 2;
  preferences: TypingGamePreferences;
  highScores: Record<string, number>;
  maxCombo: number;
  recentGames: GameHistoryRecord[];
  learningRecords: Record<string, ContentLearningRecord>;
}

export type TypingGameStorage = TypingGameStorageV2;
