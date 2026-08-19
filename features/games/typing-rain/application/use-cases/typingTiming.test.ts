import { describe, expect, it } from "vitest";
import {
  completeTypingTiming,
  createTypingTimingRecord,
  markFirstInput,
  missTypingTiming,
} from "./typingTiming";

describe("typingTiming", () => {
  it("tracks first input, completion duration, and exposure duration", () => {
    const spawned = createTypingTimingRecord(1_000);
    const started = markFirstInput(spawned, 1_800);
    const completed = completeTypingTiming(started, 3_200);

    expect(completed).toMatchObject({
      spawnedAt: 1_000,
      firstInputAt: 1_800,
      completedAt: 3_200,
      inputDurationMs: 1_400,
      exposureDurationMs: 2_200,
    });
  });

  it("does not overwrite the first input timestamp", () => {
    const timing = markFirstInput(
      markFirstInput(createTypingTimingRecord(0), 100),
      200,
    );

    expect(timing.firstInputAt).toBe(100);
  });

  it("tracks missed exposure without input duration", () => {
    expect(
      missTypingTiming(createTypingTimingRecord(500), 2_500),
    ).toMatchObject({
      missedAt: 2_500,
      inputDurationMs: null,
      exposureDurationMs: 2_000,
    });
  });
});
