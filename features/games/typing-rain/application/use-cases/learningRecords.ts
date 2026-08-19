import type {
  ContentLearningRecord,
  GameHistoryRecord,
  TypingContentResultRecord,
  TypingGameResult,
  TypingGameSettings,
  TypingTargetSessionRecord,
} from "../../domain/typing.types";

export interface RankedLearningRecord extends ContentLearningRecord {
  averageInputDurationMs: number | null;
  accuracy: number;
}

const RECENT_GAMES_LIMIT = 30;

export function toContentResultRecord(
  record: TypingTargetSessionRecord,
): TypingContentResultRecord {
  return {
    targetId: record.targetId,
    contentId: record.contentId,
    text: record.text,
    contentType: record.contentType,
    typoCount: record.typoCount,
    inputDurationMs: record.inputDurationMs,
    exposureDurationMs: record.exposureDurationMs,
    missed: record.missedAt !== null,
    completed: record.completedAt !== null,
  };
}

export function calculateAverageInputDurationMs(
  records: readonly TypingTargetSessionRecord[],
): number | null {
  const durations = records
    .map((record) => record.inputDurationMs)
    .filter((duration): duration is number => duration !== null);

  if (durations.length === 0) return null;

  return Math.round(
    durations.reduce((total, duration) => total + duration, 0) /
      durations.length,
  );
}

export function getFastestContent(
  records: readonly TypingTargetSessionRecord[],
): TypingContentResultRecord | null {
  const completedRecords = records.filter(
    (record) => record.inputDurationMs !== null,
  );

  if (completedRecords.length === 0) return null;

  return toContentResultRecord(
    [...completedRecords].sort(
      (left, right) =>
        (left.inputDurationMs ?? Number.POSITIVE_INFINITY) -
        (right.inputDurationMs ?? Number.POSITIVE_INFINITY),
    )[0],
  );
}

export function getSlowestContent(
  records: readonly TypingTargetSessionRecord[],
): TypingContentResultRecord | null {
  const completedRecords = records.filter(
    (record) => record.inputDurationMs !== null,
  );

  if (completedRecords.length === 0) return null;

  return toContentResultRecord(
    [...completedRecords].sort(
      (left, right) =>
        (right.inputDurationMs ?? 0) - (left.inputDurationMs ?? 0),
    )[0],
  );
}

export function getMostMistypedSessionContents(
  records: readonly TypingTargetSessionRecord[],
  limit = 5,
): TypingContentResultRecord[] {
  return records
    .filter((record) => record.typoCount > 0 || record.missedAt !== null)
    .map(toContentResultRecord)
    .sort((left, right) => {
      if (left.missed !== right.missed) return left.missed ? -1 : 1;
      if (left.typoCount !== right.typoCount) {
        return right.typoCount - left.typoCount;
      }
      return right.exposureDurationMs - left.exposureDurationMs;
    })
    .slice(0, limit);
}

export function applyTargetRecordsToLearningRecords({
  learningRecords,
  targetRecords,
  playedAt,
}: {
  learningRecords: Record<string, ContentLearningRecord>;
  targetRecords: readonly TypingTargetSessionRecord[];
  playedAt: string;
}): Record<string, ContentLearningRecord> {
  return targetRecords.reduce<Record<string, ContentLearningRecord>>(
    (nextRecords, targetRecord) => {
      const previous = nextRecords[targetRecord.contentId] ?? {
        contentId: targetRecord.contentId,
        shownCount: 0,
        attemptedCount: 0,
        correctCount: 0,
        missedCount: 0,
        typoCount: 0,
        totalInputDurationMs: 0,
        fastestInputDurationMs: null,
        lastInputDurationMs: null,
        lastPlayedAt: playedAt,
      };
      const inputDurationMs = targetRecord.inputDurationMs;

      nextRecords[targetRecord.contentId] = {
        ...previous,
        shownCount: previous.shownCount + 1,
        attemptedCount:
          previous.attemptedCount +
          (targetRecord.firstInputAt === null ? 0 : 1),
        correctCount:
          previous.correctCount + (targetRecord.completedAt === null ? 0 : 1),
        missedCount:
          previous.missedCount + (targetRecord.missedAt === null ? 0 : 1),
        typoCount: previous.typoCount + targetRecord.typoCount,
        totalInputDurationMs:
          previous.totalInputDurationMs + (inputDurationMs ?? 0),
        fastestInputDurationMs:
          inputDurationMs === null
            ? previous.fastestInputDurationMs
            : previous.fastestInputDurationMs === null
              ? inputDurationMs
              : Math.min(previous.fastestInputDurationMs, inputDurationMs),
        lastInputDurationMs: inputDurationMs ?? previous.lastInputDurationMs,
        lastPlayedAt: playedAt,
      };

      return nextRecords;
    },
    { ...learningRecords },
  );
}

export function getMostMistypedContents(
  learningRecords: Record<string, ContentLearningRecord>,
  limit = 5,
): RankedLearningRecord[] {
  return Object.values(learningRecords)
    .filter((record) => record.missedCount > 0 || record.typoCount > 0)
    .map(toRankedLearningRecord)
    .sort(compareLearningWeakness)
    .slice(0, limit);
}

export function getMostMissedContents(
  learningRecords: Record<string, ContentLearningRecord>,
  limit = 5,
): RankedLearningRecord[] {
  return Object.values(learningRecords)
    .filter((record) => record.missedCount > 0)
    .map(toRankedLearningRecord)
    .sort((left, right) => right.missedCount - left.missedCount)
    .slice(0, limit);
}

export function getSlowestContents(
  learningRecords: Record<string, ContentLearningRecord>,
  limit = 5,
): RankedLearningRecord[] {
  return Object.values(learningRecords)
    .map(toRankedLearningRecord)
    .filter((record) => record.averageInputDurationMs !== null)
    .sort(
      (left, right) =>
        (right.averageInputDurationMs ?? 0) -
        (left.averageInputDurationMs ?? 0),
    )
    .slice(0, limit);
}

export function limitRecentGames(
  recentGames: readonly GameHistoryRecord[],
): GameHistoryRecord[] {
  return [...recentGames]
    .sort(
      (left, right) =>
        new Date(right.playedAt).getTime() - new Date(left.playedAt).getTime(),
    )
    .slice(0, RECENT_GAMES_LIMIT);
}

export function createGameHistoryRecord({
  id,
  playedAt,
  settings,
  result,
}: {
  id: string;
  playedAt: string;
  settings: TypingGameSettings;
  result: TypingGameResult;
}): GameHistoryRecord {
  return {
    id,
    playedAt,
    language: settings.language,
    contentType: settings.contentType,
    difficulty: settings.difficulty,
    score: result.score,
    correctCount: result.correctCount,
    missedCount: result.missedCount,
    typoCount: result.typoCount,
    accuracy: result.accuracy,
    maxCombo: result.maxCombo,
    playDurationMs: result.elapsedMs,
    averageInputDurationMs: result.averageInputDurationMs,
  };
}

function toRankedLearningRecord(
  record: ContentLearningRecord,
): RankedLearningRecord {
  return {
    ...record,
    averageInputDurationMs:
      record.correctCount > 0
        ? Math.round(record.totalInputDurationMs / record.correctCount)
        : null,
    accuracy:
      record.attemptedCount > 0
        ? record.correctCount / record.attemptedCount
        : 1,
  };
}

function compareLearningWeakness(
  left: RankedLearningRecord,
  right: RankedLearningRecord,
): number {
  if (left.missedCount !== right.missedCount) {
    return right.missedCount - left.missedCount;
  }

  if (left.typoCount !== right.typoCount) {
    return right.typoCount - left.typoCount;
  }

  if (left.accuracy !== right.accuracy) {
    return left.accuracy - right.accuracy;
  }

  if (left.averageInputDurationMs !== right.averageInputDurationMs) {
    return (
      (right.averageInputDurationMs ?? 0) - (left.averageInputDurationMs ?? 0)
    );
  }

  return (
    new Date(right.lastPlayedAt).getTime() -
    new Date(left.lastPlayedAt).getTime()
  );
}
