import { describe, expect, it } from "vitest";
import type { MistakeRecord } from "../../domain/learningProgress.types";
import { getFrequentMistakes, getRecentMistakes } from "./reviewSelectors";

describe("reviewSelectors", () => {
  it("selects recent mistakes by last seen time", () => {
    const mistakes = [
      mistake("old", 1, "2026-07-27T00:00:00.000Z"),
      mistake("new", 1, "2026-07-29T00:00:00.000Z"),
      mistake("middle", 1, "2026-07-28T00:00:00.000Z"),
    ];

    expect(
      getRecentMistakes({ mistakes }, 2).map((record) => record.questionKey),
    ).toEqual(["new", "middle"]);
  });

  it("selects frequent mistakes by count and recency", () => {
    const mistakes = [
      mistake("less", 1, "2026-07-29T00:00:00.000Z"),
      mistake("frequent-old", 3, "2026-07-27T00:00:00.000Z"),
      mistake("frequent-new", 3, "2026-07-28T00:00:00.000Z"),
    ];

    expect(
      getFrequentMistakes({ mistakes }, 2).map((record) => record.questionKey),
    ).toEqual(["frequent-new", "frequent-old"]);
  });
});

function mistake(
  questionKey: string,
  mistakeCount: number,
  lastSeenAt: string,
): MistakeRecord {
  return {
    questionKey,
    operation: "addition",
    stageId: "addition-within-10",
    leftOperand: 4,
    rightOperand: 5,
    answer: 9,
    difficulty: "medium",
    mistakeCount,
    firstSeenAt: "2026-07-27T00:00:00.000Z",
    lastSeenAt,
  };
}
