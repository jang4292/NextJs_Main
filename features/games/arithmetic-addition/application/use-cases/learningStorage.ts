import type {
  LearningSession,
  LearningStage,
  QuestionResult,
  SessionAnalysis,
} from "../../domain/arithmetic.types";
import {
  ARITHMETIC_PROGRESS_VERSION,
  MAX_MISTAKES,
  MAX_RECENT_SESSIONS,
  type ArithmeticLearningData,
  type LearningSessionSummary,
  type MistakeRecord,
  type StageProgressRecord,
  type StageProgressStatus,
} from "../../domain/learningProgress.types";
import { buildQuestionKey } from "../../domain/questionKey";

export const STORAGE_KEY = "portfolio.arithmetic.progress.v1";

export function getDefaultLearningData(): ArithmeticLearningData {
  return {
    version: ARITHMETIC_PROGRESS_VERSION,
    stageProgress: [],
    recentSessions: [],
    mistakes: [],
  };
}

export function parseLearningData(raw: string | null): ArithmeticLearningData {
  if (!raw) return getDefaultLearningData();

  try {
    const parsed = JSON.parse(raw) as Partial<ArithmeticLearningData>;

    if (parsed.version !== ARITHMETIC_PROGRESS_VERSION) {
      return getDefaultLearningData();
    }

    return {
      version: ARITHMETIC_PROGRESS_VERSION,
      lastPlayedOperation: parsed.lastPlayedOperation,
      lastPlayedStageId: parsed.lastPlayedStageId,
      stageProgress: Array.isArray(parsed.stageProgress)
        ? parsed.stageProgress.filter(isStageProgressRecord)
        : [],
      recentSessions: Array.isArray(parsed.recentSessions)
        ? parsed.recentSessions
            .filter(isLearningSessionSummary)
            .slice(0, MAX_RECENT_SESSIONS)
        : [],
      mistakes: Array.isArray(parsed.mistakes)
        ? parsed.mistakes.filter(isMistakeRecord).slice(0, MAX_MISTAKES)
        : [],
    };
  } catch {
    return getDefaultLearningData();
  }
}

export function serializeLearningData(data: ArithmeticLearningData): string {
  return JSON.stringify({
    ...data,
    recentSessions: data.recentSessions.slice(0, MAX_RECENT_SESSIONS),
    mistakes: data.mistakes.slice(0, MAX_MISTAKES),
  });
}

export function applyStageResult(
  data: ArithmeticLearningData,
  stage: LearningStage,
  session: LearningSession,
  analysis: SessionAnalysis,
): ArithmeticLearningData {
  const completedAt = session.completedAt ?? session.startedAt;
  const nextProgress = upsertStageProgress(
    data.stageProgress,
    stage,
    completedAt,
    analysis,
  );
  const nextSession = createSessionSummary(stage, session, analysis);
  const nextMistakes = applyMistakes(
    data.mistakes,
    analysis.wrongResults,
    completedAt,
  );

  return {
    version: ARITHMETIC_PROGRESS_VERSION,
    lastPlayedOperation: stage.operator,
    lastPlayedStageId: stage.id,
    stageProgress: nextProgress,
    recentSessions: [nextSession, ...data.recentSessions].slice(
      0,
      MAX_RECENT_SESSIONS,
    ),
    mistakes: nextMistakes,
  };
}

function upsertStageProgress(
  records: StageProgressRecord[],
  stage: LearningStage,
  completedAt: string,
  analysis: SessionAnalysis,
): StageProgressRecord[] {
  const existing = records.find((record) => record.stageId === stage.id);
  const completedSessions = (existing?.completedSessions ?? 0) + 1;
  const bestFirstTryAccuracy = Math.max(
    existing?.bestFirstTryAccuracy ?? 0,
    analysis.firstTryAccuracy,
  );
  const bestStarRating = Math.max(
    existing?.bestStarRating ?? 1,
    analysis.starRating,
  ) as 1 | 2 | 3;
  const nextRecord: StageProgressRecord = {
    operation: stage.operator,
    stageId: stage.id,
    status: getStageStatus(analysis.firstTryAccuracy),
    completedSessions,
    bestFirstTryAccuracy,
    bestStarRating,
    lastFirstTryAccuracy: analysis.firstTryAccuracy,
    lastPlayedAt: completedAt,
  };
  const rest = records.filter((record) => record.stageId !== stage.id);

  return [...rest, nextRecord].sort((left, right) =>
    left.stageId.localeCompare(right.stageId),
  );
}

function getStageStatus(firstTryAccuracy: number): StageProgressStatus {
  if (firstTryAccuracy >= 0.9) return "completed";
  if (firstTryAccuracy >= 0.8) return "confident";
  return "practicing";
}

function createSessionSummary(
  stage: LearningStage,
  session: LearningSession,
  analysis: SessionAnalysis,
): LearningSessionSummary {
  return {
    id: session.id,
    operation: stage.operator,
    stageId: stage.id,
    startedAt: session.startedAt,
    completedAt: session.completedAt,
    totalQuestions: analysis.totalQuestions,
    firstTryCorrectCount: analysis.firstTryCorrectCount,
    firstTryAccuracy: analysis.firstTryAccuracy,
    starRating: analysis.starRating,
  };
}

function applyMistakes(
  records: MistakeRecord[],
  wrongResults: QuestionResult[],
  seenAt: string,
): MistakeRecord[] {
  const nextRecords = new Map(
    records.map((record) => [record.questionKey, record]),
  );

  for (const result of wrongResults) {
    const { question } = result;
    const questionKey = buildQuestionKey(
      question.operator,
      question.stageId,
      "standard",
      question.leftOperand,
      question.rightOperand,
    );
    const existing = nextRecords.get(questionKey);
    const lastSubmittedAnswer = result.attempts.at(-1)?.submittedAnswer;

    nextRecords.set(questionKey, {
      questionKey,
      operation: question.operator,
      stageId: question.stageId,
      leftOperand: question.leftOperand,
      rightOperand: question.rightOperand,
      answer: question.answer,
      difficulty: question.difficulty,
      mistakeCount: (existing?.mistakeCount ?? 0) + 1,
      firstSeenAt: existing?.firstSeenAt ?? seenAt,
      lastSeenAt: seenAt,
      lastSubmittedAnswer,
    });
  }

  return [...nextRecords.values()]
    .sort((left, right) => {
      const lastSeenComparison = right.lastSeenAt.localeCompare(
        left.lastSeenAt,
      );
      if (lastSeenComparison !== 0) return lastSeenComparison;
      return right.mistakeCount - left.mistakeCount;
    })
    .slice(0, MAX_MISTAKES);
}

function isStageProgressRecord(value: unknown): value is StageProgressRecord {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<StageProgressRecord>;
  return (
    typeof candidate.stageId === "string" &&
    typeof candidate.operation === "string" &&
    typeof candidate.status === "string" &&
    typeof candidate.completedSessions === "number" &&
    typeof candidate.bestFirstTryAccuracy === "number" &&
    typeof candidate.bestStarRating === "number" &&
    typeof candidate.lastFirstTryAccuracy === "number" &&
    typeof candidate.lastPlayedAt === "string"
  );
}

function isLearningSessionSummary(
  value: unknown,
): value is LearningSessionSummary {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<LearningSessionSummary>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.operation === "string" &&
    typeof candidate.stageId === "string" &&
    typeof candidate.startedAt === "string" &&
    typeof candidate.totalQuestions === "number" &&
    typeof candidate.firstTryCorrectCount === "number" &&
    typeof candidate.firstTryAccuracy === "number" &&
    typeof candidate.starRating === "number"
  );
}

function isMistakeRecord(value: unknown): value is MistakeRecord {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<MistakeRecord>;
  return (
    typeof candidate.questionKey === "string" &&
    typeof candidate.operation === "string" &&
    typeof candidate.stageId === "string" &&
    typeof candidate.leftOperand === "number" &&
    typeof candidate.rightOperand === "number" &&
    typeof candidate.answer === "number" &&
    typeof candidate.difficulty === "string" &&
    typeof candidate.mistakeCount === "number" &&
    typeof candidate.firstSeenAt === "string" &&
    typeof candidate.lastSeenAt === "string"
  );
}
