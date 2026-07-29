import type { MistakeRecord } from "../../domain/learningProgress.types";

export function getRecentMistakes(
  data: { mistakes: MistakeRecord[] },
  limit = 10,
): MistakeRecord[] {
  return [...data.mistakes]
    .sort((left, right) => right.lastSeenAt.localeCompare(left.lastSeenAt))
    .slice(0, limit);
}

export function getFrequentMistakes(
  data: { mistakes: MistakeRecord[] },
  limit = 10,
): MistakeRecord[] {
  return [...data.mistakes]
    .sort((left, right) => {
      if (right.mistakeCount !== left.mistakeCount) {
        return right.mistakeCount - left.mistakeCount;
      }

      return right.lastSeenAt.localeCompare(left.lastSeenAt);
    })
    .slice(0, limit);
}
