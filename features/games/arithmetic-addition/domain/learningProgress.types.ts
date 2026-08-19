import type { Difficulty, Operator, StageId } from "./arithmetic.types";

export const ARITHMETIC_PROGRESS_VERSION = 1;
export const MAX_RECENT_SESSIONS = 20;
export const MAX_MISTAKES = 100;

export type StageProgressStatus =
  "not-started" | "practicing" | "confident" | "completed";

export interface StageProgressRecord {
  operation: Operator;
  stageId: StageId;
  status: StageProgressStatus;
  completedSessions: number;
  bestFirstTryAccuracy: number;
  bestStarRating: 1 | 2 | 3;
  lastFirstTryAccuracy: number;
  lastPlayedAt: string;
}

export interface LearningSessionSummary {
  id: string;
  operation: Operator;
  stageId: StageId;
  startedAt: string;
  completedAt?: string;
  totalQuestions: number;
  firstTryCorrectCount: number;
  firstTryAccuracy: number;
  starRating: 1 | 2 | 3;
}

export interface MistakeRecord {
  questionKey: string;
  operation: Operator;
  stageId: StageId;
  leftOperand: number;
  rightOperand: number;
  answer: number;
  difficulty: Difficulty;
  mistakeCount: number;
  firstSeenAt: string;
  lastSeenAt: string;
  lastSubmittedAnswer?: number;
}

export interface ArithmeticLearningData {
  version: number;
  lastPlayedOperation?: Operator;
  lastPlayedStageId?: StageId;
  stageProgress: StageProgressRecord[];
  recentSessions: LearningSessionSummary[];
  mistakes: MistakeRecord[];
}

export type LearningRecommendationKind =
  | "next-stage"
  | "repeat-stage"
  | "review-mistakes"
  | "previous-stage"
  | "complete";

export interface LearningRecommendation {
  kind: LearningRecommendationKind;
  title: string;
  message: string;
  actionLabel?: string;
  targetStageId?: StageId;
}
