import type { FallingWord } from "../../domain/typing.types";
import type { TypingRuleOptions } from "../../domain/typing.types";
import { compareTypingInput } from "./typingComparison";

export type InputFeedback = "empty" | "prefix" | "exact" | "invalid";

export function normalizeTypingInput(value: string): string {
  return value.normalize("NFC").trimStart();
}

export function getMatchingWord(
  inputValue: string,
  words: readonly FallingWord[],
  options: {
    lockedTargetId?: string | null;
    rules?: TypingRuleOptions;
  } = {},
): FallingWord | null {
  const normalizedInput = normalizeTypingInput(inputValue);
  if (!normalizedInput) return null;
  const candidates = options.lockedTargetId
    ? words.filter((word) => word.id === options.lockedTargetId)
    : words;

  return (
    candidates.find(
      (word) =>
        word.status === "active" &&
        compareTypingInput({
          inputValue,
          targetText: word.text,
          rules: options.rules,
        }).isExactMatch,
    ) ?? null
  );
}

export function getPrefixMatchedWordIds(
  inputValue: string,
  words: readonly FallingWord[],
): string[] {
  const normalizedInput = normalizeTypingInput(inputValue);
  if (!normalizedInput) return [];

  return words
    .filter(
      (word) =>
        word.status === "active" &&
        normalizeTypingInput(word.text).startsWith(normalizedInput),
    )
    .map((word) => word.id);
}

export function getInputFeedback(
  inputValue: string,
  words: readonly FallingWord[],
  options: {
    lockedTargetId?: string | null;
    rules?: TypingRuleOptions;
  } = {},
): InputFeedback {
  const normalizedInput = normalizeTypingInput(inputValue);
  if (!normalizedInput) return "empty";

  if (options.lockedTargetId) {
    const lockedTarget = words.find(
      (word) => word.id === options.lockedTargetId && word.status === "active",
    );

    if (!lockedTarget) return "invalid";

    const comparison = compareTypingInput({
      inputValue,
      targetText: lockedTarget.text,
      rules: options.rules,
    });

    if (comparison.isExactMatch) return "exact";
    if (comparison.isPrefixMatch) return "prefix";
    return "invalid";
  }

  if (getMatchingWord(inputValue, words, options)) return "exact";
  if (getPrefixMatchedWordIds(inputValue, words).length > 0) {
    return "prefix";
  }
  return "invalid";
}
