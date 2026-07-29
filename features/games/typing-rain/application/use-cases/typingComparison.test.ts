import { describe, expect, it } from "vitest";
import {
  compareTypingInput,
  countCorrectInsertedCharacters,
  getMismatchPositions,
  isPrefixMatch,
  normalizeTypingForRules,
} from "./typingComparison";

describe("typingComparison", () => {
  it("detects prefix and exact matches", () => {
    expect(isPrefixMatch({ inputValue: "학", targetText: "학교" })).toBe(true);
    expect(
      compareTypingInput({ inputValue: "학교", targetText: "학교" }),
    ).toMatchObject({
      isExactMatch: true,
      isPrefixMatch: true,
      correctCharacterCount: 2,
      mismatchPositions: [],
    });
  });

  it("reports mismatch, missing, and extra character positions", () => {
    const result = compareTypingInput({
      inputValue: "학새x",
      targetText: "학생",
    });

    expect(result.isExactMatch).toBe(false);
    expect(result.correctCharacterCount).toBe(1);
    expect(result.mismatchPositions).toEqual([1, 2]);
    expect(result.extraCharacterCount).toBe(1);
    expect(result.missingCharacterCount).toBe(0);
    expect(
      getMismatchPositions({ inputValue: "abc", targetText: "adc" }),
    ).toEqual([1]);
  });

  it("applies case, whitespace, and punctuation rules", () => {
    expect(
      normalizeTypingForRules("  Hello,   World.  ", {
        caseSensitive: false,
        punctuationRequired: false,
        trimWhitespace: true,
        collapseWhitespace: true,
      }),
    ).toBe("hello world");
    expect(
      compareTypingInput({
        inputValue: "hello world",
        targetText: "Hello, World.",
        rules: {
          caseSensitive: false,
          punctuationRequired: false,
          trimWhitespace: true,
          collapseWhitespace: true,
        },
      }).isExactMatch,
    ).toBe(true);
  });

  it("counts only newly inserted correct characters", () => {
    expect(
      countCorrectInsertedCharacters({
        previousInputValue: "s",
        inputValue: "sk",
        targetText: "sky",
      }),
    ).toBe(1);
    expect(
      countCorrectInsertedCharacters({
        previousInputValue: "sx",
        inputValue: "s",
        targetText: "sky",
      }),
    ).toBe(0);
  });
});
