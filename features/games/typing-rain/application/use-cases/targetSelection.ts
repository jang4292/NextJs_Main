import { DEFAULT_TYPING_RULES } from "../../domain/difficulty.config";
import type { FallingWord, TypingRuleOptions } from "../../domain/typing.types";
import { isPrefixMatch } from "./typingComparison";

interface TargetSelectionOptions {
  nowMs: number;
  rules?: TypingRuleOptions;
}

export function findMatchingTargets(
  inputValue: string,
  targets: readonly FallingWord[],
  rules: TypingRuleOptions = DEFAULT_TYPING_RULES,
): FallingWord[] {
  return targets.filter(
    (target) =>
      target.status === "active" &&
      isPrefixMatch({
        inputValue,
        targetText: target.text,
        rules,
      }),
  );
}

export function compareTargetPriority(
  inputValue: string,
  left: FallingWord,
  right: FallingWord,
  { nowMs, rules = DEFAULT_TYPING_RULES }: TargetSelectionOptions,
): number {
  const leftMatches = isPrefixMatch({
    inputValue,
    targetText: left.text,
    rules,
  });
  const rightMatches = isPrefixMatch({
    inputValue,
    targetText: right.text,
    rules,
  });

  if (leftMatches !== rightMatches) {
    return leftMatches ? -1 : 1;
  }

  const leftRemainingMs = left.fallDurationMs - (nowMs - left.spawnedAt);
  const rightRemainingMs = right.fallDurationMs - (nowMs - right.spawnedAt);

  if (leftRemainingMs !== rightRemainingMs) {
    return leftRemainingMs - rightRemainingMs;
  }

  if (left.spawnedAt !== right.spawnedAt) {
    return left.spawnedAt - right.spawnedAt;
  }

  if ((left.sequence ?? 0) !== (right.sequence ?? 0)) {
    return (left.sequence ?? 0) - (right.sequence ?? 0);
  }

  return left.id.localeCompare(right.id);
}

export function selectTypingTarget(
  inputValue: string,
  targets: readonly FallingWord[],
  options: TargetSelectionOptions,
): FallingWord | null {
  const matchingTargets = findMatchingTargets(
    inputValue,
    targets,
    options.rules,
  );

  if (matchingTargets.length === 0) return null;

  return [...matchingTargets].sort((left, right) =>
    compareTargetPriority(inputValue, left, right, options),
  )[0];
}
