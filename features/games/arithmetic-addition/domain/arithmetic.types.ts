export type Operator = "addition";

export type Difficulty = "easy" | "medium" | "hard";

export type GameStatus = "idle" | "playing" | "feedback" | "completed";

export interface ArithmeticQuestion {
  id: string;
  leftOperand: number;
  rightOperand: number;
  operator: Operator;
  answer: number;
  difficulty: Difficulty;
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
  | "very-stable"
  | "doing-well"
  | "needs-practice"
  | "needs-basics";

export interface EvaluationMessage {
  level: LearningEvaluation;
  title: string;
  message: string;
}
