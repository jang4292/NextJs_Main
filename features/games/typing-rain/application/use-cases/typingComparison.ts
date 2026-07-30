import { DEFAULT_TYPING_RULES } from "../../domain/difficulty.config";
import type {
  TypingComparisonResult,
  TypingRuleOptions,
} from "../../domain/typing.types";

const PUNCTUATION_PATTERN = /[.,!?;:。！？]/g;

export function normalizeTypingForRules(
  value: string,
  rules: TypingRuleOptions = DEFAULT_TYPING_RULES,
): string {
  let normalized = value.normalize("NFC");

  if (rules.trimWhitespace) {
    normalized = normalized.trim();
  }

  if (rules.collapseWhitespace) {
    normalized = normalized.replace(/\s+/g, " ");
  }

  if (!rules.punctuationRequired) {
    normalized = normalized.replace(PUNCTUATION_PATTERN, "");
  }

  if (!rules.caseSensitive) {
    normalized = normalized.toLocaleLowerCase();
  }

  return normalized;
}

export function compareTypingInput({
  inputValue,
  targetText,
  rules = DEFAULT_TYPING_RULES,
}: {
  inputValue: string;
  targetText: string;
  rules?: TypingRuleOptions;
}): TypingComparisonResult {
  const normalizedInput = normalizeTypingForRules(inputValue, rules);
  const normalizedTarget = normalizeTypingForRules(targetText, rules);
  const inputCharacters = Array.from(normalizedInput);
  const targetCharacters = Array.from(normalizedTarget);
  const sharedLength = Math.min(inputCharacters.length, targetCharacters.length);
  const mismatchPositions = getMismatchPositions({
    inputValue: normalizedInput,
    targetText: normalizedTarget,
    alreadyNormalized: true,
  });
  let correctCharacterCount = 0;

  for (let index = 0; index < sharedLength; index += 1) {
    if (inputCharacters[index] === targetCharacters[index]) {
      correctCharacterCount += 1;
    }
  }

  return {
    isExactMatch: normalizedInput === normalizedTarget,
    isPrefixMatch:
      normalizedInput.length > 0 && normalizedTarget.startsWith(normalizedInput),
    correctCharacterCount,
    mismatchPositions,
    missingCharacterCount: Math.max(
      0,
      targetCharacters.length - inputCharacters.length,
    ),
    extraCharacterCount: Math.max(
      0,
      inputCharacters.length - targetCharacters.length,
    ),
  };
}

export function getMismatchPositions({
  inputValue,
  targetText,
  rules = DEFAULT_TYPING_RULES,
  alreadyNormalized = false,
}: {
  inputValue: string;
  targetText: string;
  rules?: TypingRuleOptions;
  alreadyNormalized?: boolean;
}): number[] {
  const normalizedInput = alreadyNormalized
    ? inputValue
    : normalizeTypingForRules(inputValue, rules);
  const normalizedTarget = alreadyNormalized
    ? targetText
    : normalizeTypingForRules(targetText, rules);
  const inputCharacters = Array.from(normalizedInput);
  const targetCharacters = Array.from(normalizedTarget);
  const maxLength = Math.max(inputCharacters.length, targetCharacters.length);
  const positions: number[] = [];

  for (let index = 0; index < maxLength; index += 1) {
    const inputCharacter = inputCharacters[index];
    const targetCharacter = targetCharacters[index];

    if (
      inputCharacter !== undefined &&
      targetCharacter !== undefined &&
      inputCharacter !== targetCharacter
    ) {
      positions.push(index);
    }

    if (inputCharacter !== undefined && targetCharacter === undefined) {
      positions.push(index);
    }
  }

  return positions;
}

export function isPrefixMatch({
  inputValue,
  targetText,
  rules = DEFAULT_TYPING_RULES,
}: {
  inputValue: string;
  targetText: string;
  rules?: TypingRuleOptions;
}): boolean {
  const normalizedInput = normalizeTypingForRules(inputValue, rules);
  const normalizedTarget = normalizeTypingForRules(targetText, rules);
  return normalizedInput.length > 0 && normalizedTarget.startsWith(normalizedInput);
}

export function countCorrectInsertedCharacters({
  previousInputValue,
  inputValue,
  targetText,
  rules = DEFAULT_TYPING_RULES,
}: {
  previousInputValue: string;
  inputValue: string;
  targetText: string;
  rules?: TypingRuleOptions;
}): number {
  const previousInput = Array.from(
    normalizeTypingForRules(previousInputValue, rules),
  );
  const nextInput = Array.from(normalizeTypingForRules(inputValue, rules));
  const target = Array.from(normalizeTypingForRules(targetText, rules));

  if (nextInput.length <= previousInput.length) return 0;

  let correctCount = 0;
  for (let index = previousInput.length; index < nextInput.length; index += 1) {
    if (nextInput[index] === target[index]) {
      correctCount += 1;
    }
  }

  return correctCount;
}
