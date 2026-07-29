import type { FallingWord } from "../../domain/typing.types";

export type InputFeedback = "empty" | "prefix" | "exact" | "invalid";

export function normalizeTypingInput(value: string): string {
  return value.normalize("NFC").trimStart();
}

export function getMatchingWord(
  inputValue: string,
  words: readonly FallingWord[],
): FallingWord | null {
  const normalizedInput = normalizeTypingInput(inputValue);
  if (!normalizedInput) return null;

  return (
    words.find(
      (word) =>
        word.status === "active" &&
        normalizeTypingInput(word.text) === normalizedInput,
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
): InputFeedback {
  const normalizedInput = normalizeTypingInput(inputValue);
  if (!normalizedInput) return "empty";
  if (getMatchingWord(normalizedInput, words)) return "exact";
  if (getPrefixMatchedWordIds(normalizedInput, words).length > 0) {
    return "prefix";
  }
  return "invalid";
}
