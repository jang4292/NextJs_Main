"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { FilledSudokuValue } from "../domain/entities/SudokuValue";
import styles from "./styles/sudoku.module.css";

interface NumberPadProps {
  onInput: (value: FilledSudokuValue) => void;
  onClear: () => void;
  disabled: boolean;
}

const DIGITS: FilledSudokuValue[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export function NumberPad({ onInput, onClear, disabled }: NumberPadProps) {
  return (
    <div
      className={cn(styles.numberPad, "mx-auto w-full max-w-[480px]")}
      role="group"
      aria-label="숫자 입력 패드"
    >
      {DIGITS.map((digit) => (
        <Button
          key={digit}
          type="button"
          variant="outline"
          disabled={disabled}
          onClick={() => onInput(digit)}
          className={styles.padButton}
          aria-label={`${digit} 입력`}
        >
          {digit}
        </Button>
      ))}
      <Button
        type="button"
        variant="outline"
        disabled={disabled}
        onClick={onClear}
        className={styles.padButton}
        aria-label="선택한 칸 지우기"
      >
        지우기
      </Button>
    </div>
  );
}
