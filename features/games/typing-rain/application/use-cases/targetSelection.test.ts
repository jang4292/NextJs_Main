import { describe, expect, it } from "vitest";
import type { FallingWord } from "../../domain/typing.types";
import {
  compareTargetPriority,
  findMatchingTargets,
  selectTypingTarget,
} from "./targetSelection";

describe("targetSelection", () => {
  it("finds active prefix matches only", () => {
    expect(
      findMatchingTargets("학", targets).map((target) => target.id),
    ).toEqual(["school", "student", "study"]);
    expect(findMatchingTargets("바", targets)).toEqual([]);
  });

  it("selects the matching target closest to the bottom", () => {
    expect(
      selectTypingTarget("학", targets, {
        nowMs: 8_000,
      })?.id,
    ).toBe("student");
  });

  it("uses spawned time, sequence, and id as stable tie breakers", () => {
    const tiedTargets = [
      fallingTarget("b", "학습", 1_000, 8_000, 2),
      fallingTarget("a", "학교", 1_000, 8_000, 1),
    ];

    expect(
      [...tiedTargets].sort((left, right) =>
        compareTargetPriority("학", left, right, { nowMs: 2_000 }),
      )[0].id,
    ).toBe("a");
  });
});

const targets: FallingWord[] = [
  fallingTarget("school", "학교", 1_000, 10_000, 1),
  fallingTarget("student", "학생", 1_000, 8_500, 2),
  fallingTarget("study", "학습", 1_000, 11_000, 3),
  fallingTarget("sea", "바다", 1_000, 8_000, 4, "matched"),
];

function fallingTarget(
  id: string,
  text: string,
  spawnedAt: number,
  fallDurationMs: number,
  sequence: number,
  status: FallingWord["status"] = "active",
): FallingWord {
  return {
    id,
    contentId: id,
    text,
    contentType: "word",
    x: 20,
    speed: 1,
    spawnedAt,
    fallDurationMs,
    sequence,
    status,
  };
}
