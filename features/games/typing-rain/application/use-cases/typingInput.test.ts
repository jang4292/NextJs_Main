import { describe, expect, it } from "vitest";
import type { FallingWord } from "../../domain/typing.types";
import {
  getInputFeedback,
  getMatchingWord,
  getPrefixMatchedWordIds,
  normalizeTypingInput,
} from "./typingInput";

describe("typingInput", () => {
  it("normalizes input without removing intentional trailing spaces", () => {
    expect(normalizeTypingInput("  학교 ")).toBe("학교 ");
  });

  it("finds prefix matches across Korean and English words", () => {
    expect(getPrefixMatchedWordIds("학", words)).toEqual(["w1", "w2"]);
    expect(getPrefixMatchedWordIds("st", words)).toEqual(["w3"]);
  });

  it("finds exact matches only for active words", () => {
    expect(getMatchingWord("학교", words)?.id).toBe("w1");
    expect(getMatchingWord("바다", words)).toBeNull();
  });

  it("returns empty, prefix, exact, and invalid feedback states", () => {
    expect(getInputFeedback("", words)).toBe("empty");
    expect(getInputFeedback("학", words)).toBe("prefix");
    expect(getInputFeedback("학교", words)).toBe("exact");
    expect(getInputFeedback("틀림", words)).toBe("invalid");
  });

  it("keeps feedback scoped to a locked target", () => {
    expect(
      getInputFeedback("학생", words, {
        lockedTargetId: "w1",
      }),
    ).toBe("invalid");
    expect(
      getInputFeedback("학교", words, {
        lockedTargetId: "w1",
      }),
    ).toBe("exact");
  });
});

const words: FallingWord[] = [
  fallingWord("w1", "학교", "active"),
  fallingWord("w2", "학생", "active"),
  fallingWord("w3", "star", "active"),
  fallingWord("w4", "바다", "matched"),
];

function fallingWord(
  id: string,
  text: string,
  status: FallingWord["status"],
): FallingWord {
  return {
    id,
    contentId: id,
    text,
    x: 20,
    speed: 1,
    spawnedAt: 1000,
    fallDurationMs: 8000,
    status,
  };
}
