"use client";

import {
  type ChangeEvent,
  type CompositionEvent,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  getInputFeedback,
  getMatchingWord,
  getPrefixMatchedWordIds,
  normalizeTypingInput,
  type InputFeedback,
} from "../../application/use-cases/typingInput";
import type { FallingWord } from "../../domain/typing.types";

interface UseTypingInputOptions {
  enabled: boolean;
  words: FallingWord[];
  onMatch: (word: FallingWord) => void;
  onTypedCharacters: (count: number) => void;
}

export function useTypingInput({
  enabled,
  words,
  onMatch,
  onTypedCharacters,
}: UseTypingInputOptions) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const prefixMatchedWordIds = useMemo(
    () => getPrefixMatchedWordIds(value, words),
    [value, words],
  );
  const rawFeedback = useMemo(
    () => getInputFeedback(value, words),
    [value, words],
  );
  const feedback: InputFeedback =
    isComposing && rawFeedback === "exact" ? "prefix" : rawFeedback;

  const focusInput = useCallback(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  const resetInput = useCallback(() => {
    setValue("");
  }, []);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const nextValue = event.currentTarget.value;
    const nativeEvent = event.nativeEvent as InputEvent;
    const composing = isComposing || nativeEvent.isComposing;

    setValue((previousValue) => {
      onTypedCharacters(countTypedCharacters(previousValue, nextValue));
      return nextValue;
    });

    if (!enabled || composing) return;
    matchIfComplete(nextValue);
  }

  function handleCompositionStart() {
    setIsComposing(true);
  }

  function handleCompositionUpdate(event: CompositionEvent<HTMLInputElement>) {
    setValue(event.currentTarget.value);
  }

  function handleCompositionEnd(event: CompositionEvent<HTMLInputElement>) {
    const nextValue = event.currentTarget.value;
    setIsComposing(false);
    setValue(nextValue);

    if (!enabled) return;
    matchIfComplete(nextValue);
  }

  function matchIfComplete(nextValue: string) {
    const matchedWord = getMatchingWord(nextValue, words);
    if (!matchedWord) return;

    onMatch(matchedWord);
    setValue("");
  }

  return {
    value,
    feedback,
    isComposing,
    prefixMatchedWordIds,
    inputRef,
    focusInput,
    resetInput,
    inputProps: {
      ref: inputRef,
      value,
      disabled: !enabled,
      onChange: handleChange,
      onCompositionStart: handleCompositionStart,
      onCompositionUpdate: handleCompositionUpdate,
      onCompositionEnd: handleCompositionEnd,
    },
  };
}

function countTypedCharacters(previousValue: string, nextValue: string): number {
  const previousLength = normalizeTypingInput(previousValue).length;
  const nextLength = normalizeTypingInput(nextValue).length;
  return Math.max(0, nextLength - previousLength);
}
