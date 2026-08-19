export type Operator =
  "addition" | "subtraction" | "multiplication" | "division";

export type Operation = Operator;

export type LearningCategory =
  "basic" | "practice" | "application" | "advanced";

export type QuestionType =
  | "standard"
  | "missing-left"
  | "missing-right"
  | "missing-answer"
  | "comparison"
  | "operation-choice"
  | "multiple-operations"
  | "visual"
  | "vertical-form"
  | "word-problem"
  | "quotient-remainder";

export interface QuestionRule {
  minLeft?: number;
  maxLeft?: number;
  minRight?: number;
  maxRight?: number;
  minAnswer?: number;
  maxAnswer?: number;
  maxDigits?: number;
  allowCarry?: boolean;
  allowBorrow?: boolean;
  allowRemainder?: boolean;
}

export type AdditionStageId =
  | "addition-within-5"
  | "addition-within-10"
  | "addition-doubles"
  | "addition-make-10"
  | "addition-over-10"
  | "addition-mixed";

export type SubtractionStageId =
  | "subtraction-within-5"
  | "subtraction-within-10"
  | "subtraction-to-zero"
  | "subtraction-from-10"
  | "subtraction-mixed";

export type MultiplicationStageId =
  | "multiplication-equal-groups"
  | "multiplication-by-zero"
  | "multiplication-by-one";

export type DivisionStageId = "division-equal-sharing";

export type StageId =
  | AdditionStageId
  | SubtractionStageId
  | MultiplicationStageId
  | DivisionStageId;

export type Difficulty = "easy" | "medium" | "hard";

export type GameStatus = "idle" | "playing" | "feedback" | "completed";

export interface LearningStage {
  id: StageId;
  operator: Operator;
  category: LearningCategory;
  order: number;
  title: string;
  shortTitle: string;
  description: string;
  questionTypes: QuestionType[];
  questionCount: number;
  prerequisites?: StageId[];
  ruleId?: string;
}

export interface ArithmeticQuestion {
  id: string;
  leftOperand: number;
  rightOperand: number;
  operator: Operator;
  answer: number;
  difficulty: Difficulty;
  stageId: StageId;
}

export interface QuestionAttempt {
  submittedAnswer: number;
  isCorrect: boolean;
  elapsedMs: number;
  attemptNumber: number;
}

export interface QuestionResult {
  question: ArithmeticQuestion;
  attempts: QuestionAttempt[];
  firstTryCorrect: boolean;
  completed: boolean;
  totalElapsedMs: number;
}

export interface LearningSession {
  id: string;
  startedAt: string;
  completedAt?: string;
  totalQuestions: number;
  results: QuestionResult[];
}

export type FeedbackKind = "correct" | "try-again" | "answer-revealed";

export interface FeedbackState {
  kind: FeedbackKind;
  title: string;
  message: string;
}

export interface DifficultyAccuracy {
  total: number;
  firstTryCorrect: number;
  rate: number;
}

export interface SessionAnalysis {
  totalQuestions: number;
  firstTryCorrectCount: number;
  retryCorrectCount: number;
  finalCorrectCount: number;
  firstTryAccuracy: number;
  averageElapsedMs: number;
  averageAttemptCount: number;
  maxStreak: number;
  wrongResults: QuestionResult[];
  difficultOperands: number[];
  difficultSums: number[];
  difficultyAccuracy: Record<Difficulty, DifficultyAccuracy>;
  evaluation: EvaluationMessage;
  starRating: 1 | 2 | 3;
}

export type LearningEvaluation =
  "very-stable" | "doing-well" | "needs-practice" | "needs-basics";

export interface EvaluationMessage {
  level: LearningEvaluation;
  title: string;
  message: string;
}
