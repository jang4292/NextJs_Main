"use client";

import type { FallingWord } from "../../domain/typing.types";
import { FallingWordView } from "./FallingWordView";
import styles from "../styles/typingRain.module.css";

interface GameBoardProps {
  words: FallingWord[];
  inputValue: string;
  highlightedWordIds: string[];
  paused: boolean;
  onFocusInput: () => void;
}

export function GameBoard({
  words,
  inputValue,
  highlightedWordIds,
  paused,
  onFocusInput,
}: GameBoardProps) {
  return (
    <div
      className={styles.board}
      role="application"
      aria-label="낙하 단어 영역"
      onPointerDown={onFocusInput}
    >
      <div className={styles.skyLayer} aria-hidden="true" />
      {words.map((word) => (
        <FallingWordView
          key={word.id}
          word={word}
          inputValue={inputValue}
          highlighted={highlightedWordIds.includes(word.id)}
          paused={paused}
        />
      ))}
      <div className={styles.groundLine} aria-hidden="true" />
    </div>
  );
}
