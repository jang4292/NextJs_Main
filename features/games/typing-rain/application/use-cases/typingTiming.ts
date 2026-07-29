import type { TypingTimingRecord } from "../../domain/typing.types";

export function createTypingTimingRecord(spawnedAt: number): TypingTimingRecord {
  return {
    spawnedAt,
    firstInputAt: null,
    completedAt: null,
    missedAt: null,
    inputDurationMs: null,
    exposureDurationMs: 0,
  };
}

export function markFirstInput(
  timing: TypingTimingRecord,
  firstInputAt: number,
): TypingTimingRecord {
  if (timing.firstInputAt !== null) return timing;

  return {
    ...timing,
    firstInputAt,
  };
}

export function completeTypingTiming(
  timing: TypingTimingRecord,
  completedAt: number,
): TypingTimingRecord {
  return {
    ...timing,
    completedAt,
    inputDurationMs:
      timing.firstInputAt === null
        ? null
        : Math.max(0, completedAt - timing.firstInputAt),
    exposureDurationMs: Math.max(0, completedAt - timing.spawnedAt),
  };
}

export function missTypingTiming(
  timing: TypingTimingRecord,
  missedAt: number,
): TypingTimingRecord {
  return {
    ...timing,
    missedAt,
    exposureDurationMs: Math.max(0, missedAt - timing.spawnedAt),
  };
}
