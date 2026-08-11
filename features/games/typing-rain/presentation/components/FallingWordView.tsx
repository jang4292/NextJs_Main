"use client";

import type { CSSProperties } from "react";
import { normalizeTypingInput } from "../../application/use-cases/typingInput";
import type { FallingWord } from "../../domain/typing.types";
import styles from "../styles/typingRain.module.css";

interface FallingWordViewProps {
  word: FallingWord;
  inputValue: string;
  highlighted: boolean;
  locked: boolean;
  paused: boolean;
}

export function FallingWordView({
  word,
  inputValue,
  highlighted,
  locked,
  paused,
}: FallingWordViewProps) {
  const normalizedInput = normalizeTypingInput(inputValue);
  const matchingLength =
    highlighted || locked
      ? Math.min(normalizedInput.length, word.text.length)
      : 0;
  const style = {
    "--word-left": `${word.x}%`,
    "--fall-duration": `${word.fallDurationMs}ms`,
    animationPlayState: paused ? "paused" : "running",
  } as CSSProperties;

  return (
    <span
      className={styles.fallingWord}
      data-status={word.status}
      data-content-type={word.contentType ?? "word"}
      data-highlighted={highlighted}
      data-locked={locked}
      style={style}
    >
      {locked && (
        <span className={styles.targetBadge} aria-hidden="true">
          Target
        </span>
      )}
      {matchingLength > 0 ? (
        <>
          <span className={styles.wordMatchedPart}>
            {word.text.slice(0, matchingLength)}
          </span>
          <span>{word.text.slice(matchingLength)}</span>
        </>
      ) : (
        word.text
      )}
    </span>
  );
}
