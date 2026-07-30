"use client";

import {
  type ChangeEvent,
  type CompositionEvent,
  type FormEvent,
  type KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  getInputFeedback,
  normalizeTypingInput,
  type InputFeedback,
} from "../../application/use-cases/typingInput";
import {
  compareTypingInput,
  countCorrectInsertedCharacters,
  normalizeTypingForRules,
} from "../../application/use-cases/typingComparison";
import { findMatchingTargets, selectTypingTarget } from "../../application/use-cases/targetSelection";
import { DEFAULT_TYPING_RULES } from "../../domain/difficulty.config";
import type {
  FallingWord,
  TypingComparisonResult,
  TypingRuleOptions,
  TypingSession,
} from "../../domain/typing.types";

export interface TypingInputCommitEvent {
  target: FallingWord | null;
  inputValue: string;
  previousInputValue: string;
  comparison: TypingComparisonResult | null;
  typedCharacterCount: number;
  correctCharacterCount: number;
  mistakePositions: number[];
  occurredAt: number;
}

interface UseTypingInputOptions {
  enabled: boolean;
  words: FallingWord[];
  nowMs: number;
  typingRules?: TypingRuleOptions;
  onMatch: (word: FallingWord, session: TypingSession) => void;
  onInputCommit: (event: TypingInputCommitEvent) => void;
}

export function useTypingInput({
  enabled,
  words,
  nowMs,
  typingRules = DEFAULT_TYPING_RULES,
  onMatch,
  onInputCommit,
}: UseTypingInputOptions) {
  const inputRef = useRef<HTMLInputElement>(null);
  const committedValueRef = useRef("");
  const lockedTargetIdRef = useRef<string | null>(null);
  const ignoredCommittedValueRef = useRef<string | null>(null);
  const [value, setValue] = useState("");
  const [committedValue, setCommittedValue] = useState("");
  const [compositionValue, setCompositionValue] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const [focused, setFocused] = useState(false);
  const [lockedTargetId, setLockedTargetIdState] = useState<string | null>(null);
  const prefixMatchedWordIds = useMemo(
    () =>
      findMatchingTargets(value, words, typingRules).map((word) => word.id),
    [typingRules, value, words],
  );
  const rawFeedback = useMemo(
    () =>
      getInputFeedback(value, words, {
        lockedTargetId,
        rules: typingRules,
      }),
    [lockedTargetId, typingRules, value, words],
  );
  const feedback: InputFeedback =
    isComposing && rawFeedback === "exact" ? "prefix" : rawFeedback;

  const setLockedTargetId = useCallback((nextTargetId: string | null) => {
    lockedTargetIdRef.current = nextTargetId;
    setLockedTargetIdState(nextTargetId);
  }, []);

  const focusInput = useCallback(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  const resetInput = useCallback((options?: { keepIgnoredValue?: boolean }) => {
    committedValueRef.current = "";
    if (!options?.keepIgnoredValue) {
      ignoredCommittedValueRef.current = null;
    }
    setValue("");
    setCommittedValue("");
    setCompositionValue("");
    setLockedTargetId(null);
  }, [setLockedTargetId]);

  useEffect(() => {
    if (!lockedTargetId) return;

    const lockedTargetStillActive = words.some(
      (word) => word.id === lockedTargetId && word.status === "active",
    );

    if (!lockedTargetStillActive) {
      const timeoutId = window.setTimeout(resetInput, 0);
      return () => window.clearTimeout(timeoutId);
    }
  }, [lockedTargetId, resetInput, words]);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const nextValue = event.currentTarget.value;
    const nativeEvent = event.nativeEvent as InputEvent;
    const composing = isComposing || nativeEvent.isComposing;

    setValue(nextValue);

    if (composing) {
      setCompositionValue(nextValue);
      return;
    }

    commitValue(nextValue);
  }

  function handleInput(event: FormEvent<HTMLInputElement>) {
    if (!isComposing) return;
    setCompositionValue(event.currentTarget.value);
  }

  function handleCompositionStart(event: CompositionEvent<HTMLInputElement>) {
    setIsComposing(true);
    setCompositionValue(event.currentTarget.value);
  }

  function handleCompositionUpdate(event: CompositionEvent<HTMLInputElement>) {
    setCompositionValue(event.currentTarget.value);
    setValue(event.currentTarget.value);
  }

  function handleCompositionEnd(event: CompositionEvent<HTMLInputElement>) {
    const nextValue = event.currentTarget.value;

    setIsComposing(false);
    setCompositionValue("");
    setValue(nextValue);
    commitValue(nextValue);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Escape") return;

    event.preventDefault();
    resetInput();
  }

  function handleFocus() {
    setFocused(true);
  }

  function handleBlur() {
    setFocused(false);
  }

  function commitValue(nextValue: string) {
    if (ignoredCommittedValueRef.current === nextValue) {
      ignoredCommittedValueRef.current = null;
      return;
    }

    const previousInputValue = committedValueRef.current;
    committedValueRef.current = nextValue;
    setCommittedValue(nextValue);

    if (!enabled) return;

    const normalizedInput = normalizeTypingInput(nextValue);

    if (!normalizedInput) {
      setLockedTargetId(null);
      return;
    }

    const target = resolveTarget(nextValue);
    const comparison = target
      ? compareTypingInput({
          inputValue: nextValue,
          targetText: target.text,
          rules: typingRules,
        })
      : null;
    const typedCharacterCount = countTypedCharacters(
      previousInputValue,
      nextValue,
      typingRules,
    );
    const correctCharacterCount = target
      ? countCorrectInsertedCharacters({
          previousInputValue,
          inputValue: nextValue,
          targetText: target.text,
          rules: typingRules,
        })
      : 0;

    onInputCommit({
      target,
      inputValue: nextValue,
      previousInputValue,
      comparison,
      typedCharacterCount,
      correctCharacterCount,
      mistakePositions: comparison?.mismatchPositions ?? [],
      occurredAt: nowMs,
    });

    if (!target || !comparison?.isExactMatch) return;

    ignoredCommittedValueRef.current = nextValue;
    window.setTimeout(() => {
      if (ignoredCommittedValueRef.current === nextValue) {
        ignoredCommittedValueRef.current = null;
      }
    }, 0);
    onMatch(target, {
      targetId: target.id,
      startedAt: null,
      completedAt: nowMs,
      inputValue: nextValue,
      previousInputValue,
      mistakeCount: comparison.mismatchPositions.length,
      mistakePositions: comparison.mismatchPositions,
      typedCharacterCount,
      correctCharacterCount,
    });
    resetInput({ keepIgnoredValue: true });
  }

  function resolveTarget(inputValue: string): FallingWord | null {
    const lockedTarget = lockedTargetIdRef.current
      ? words.find(
          (word) =>
            word.id === lockedTargetIdRef.current && word.status === "active",
        )
      : null;

    if (lockedTarget) return lockedTarget;

    const selectedTarget = selectTypingTarget(inputValue, words, {
      nowMs,
      rules: typingRules,
    });

    if (selectedTarget) {
      setLockedTargetId(selectedTarget.id);
    }

    return selectedTarget;
  }

  return {
    value,
    displayValue: value,
    committedValue,
    compositionValue,
    feedback,
    focused,
    isComposing,
    lockedTargetId,
    prefixMatchedWordIds,
    inputRef,
    focusInput,
    resetInput,
    inputProps: {
      ref: inputRef,
      value,
      disabled: !enabled,
      onChange: handleChange,
      onInput: handleInput,
      onCompositionStart: handleCompositionStart,
      onCompositionUpdate: handleCompositionUpdate,
      onCompositionEnd: handleCompositionEnd,
      onKeyDown: handleKeyDown,
      onFocus: handleFocus,
      onBlur: handleBlur,
    },
  };
}

function countTypedCharacters(
  previousValue: string,
  nextValue: string,
  rules: TypingRuleOptions,
): number {
  const previousLength = Array.from(
    normalizeTypingForRules(previousValue, rules),
  ).length;
  const nextLength = Array.from(normalizeTypingForRules(nextValue, rules)).length;
  return Math.max(0, nextLength - previousLength);
}
