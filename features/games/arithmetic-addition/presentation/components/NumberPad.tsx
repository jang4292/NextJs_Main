"use client";

import { CornerDownLeft, Delete } from "lucide-react";
import { Button } from "@/components/ui/button";
import styles from "../styles/arithmetic.module.css";

interface NumberPadProps {
  canInput: boolean;
  canSubmit: boolean;
  canGoNext: boolean;
  isLastQuestion: boolean;
  onDigit: (digit: number) => void;
  onDelete: () => void;
  onSubmit: () => void;
  onNext: () => void;
}

const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export function NumberPad({
  canInput,
  canSubmit,
  canGoNext,
  isLastQuestion,
  onDigit,
  onDelete,
  onSubmit,
  onNext,
}: NumberPadProps) {
  return (
    <div className="space-y-3">
      <div className={styles.numberPad} role="group" aria-label="숫자 입력 패드">
        {DIGITS.map((digit) => (
          <Button
            key={digit}
            type="button"
            variant="outline"
            disabled={!canInput}
            onClick={() => onDigit(digit)}
            className={styles.padButton}
            aria-label={`${digit} 입력`}
          >
            {digit}
          </Button>
        ))}
        <Button
          type="button"
          variant="outline"
          disabled={!canInput}
          onClick={onDelete}
          className={styles.padButton}
          aria-label="한 자리 지우기"
        >
          <Delete aria-hidden="true" />
          <span className="text-sm">지우기</span>
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={!canInput}
          onClick={() => onDigit(0)}
          className={styles.padButton}
          aria-label="0 입력"
        >
          0
        </Button>
        <Button
          type="button"
          disabled={!canSubmit}
          onClick={onSubmit}
          className={styles.padButton}
          aria-label="정답 확인"
        >
          <CornerDownLeft aria-hidden="true" />
          <span className="text-sm">확인</span>
        </Button>
      </div>

      <Button
        type="button"
        variant="secondary"
        disabled={!canGoNext}
        onClick={onNext}
        className="min-h-11 w-full"
      >
        {isLastQuestion ? "결과 보기" : "다음 문제"}
      </Button>
    </div>
  );
}

