"use client";

import type { InputHTMLAttributes, Ref } from "react";
import { cn } from "@/lib/utils";
import type { InputFeedback } from "../../application/use-cases/typingInput";
import styles from "../styles/typingRain.module.css";

interface TypingInputProps {
  value: string;
  feedback: InputFeedback;
  isComposing: boolean;
  inputProps: InputHTMLAttributes<HTMLInputElement> & {
    ref: Ref<HTMLInputElement>;
  };
}

const FEEDBACK_LABEL: Record<InputFeedback, string> = {
  empty: "입력을 기다리고 있어요",
  prefix: "이어 입력하면 맞출 수 있어요",
  exact: "정답",
  invalid: "화면의 단어와 아직 맞지 않아요",
};

export function TypingInput({
  value,
  feedback,
  isComposing,
  inputProps,
}: TypingInputProps) {
  return (
    <div className={styles.inputDock}>
      <label className="text-sm font-bold text-neutral-800" htmlFor="typing-rain-input">
        현재 입력
      </label>
      <input
        {...inputProps}
        id="typing-rain-input"
        type="text"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        inputMode="text"
        className={cn(
          styles.typingInput,
          feedback === "prefix" && styles.typingInputPrefix,
          feedback === "invalid" && value.length > 0 && styles.typingInputInvalid,
        )}
        aria-invalid={feedback === "invalid" && value.length > 0}
      />
      <p
        className={cn(
          "text-sm font-medium",
          feedback === "invalid" && value.length > 0
            ? "text-rose-700"
            : "text-neutral-600",
        )}
        aria-live="polite"
      >
        {isComposing ? "한글 조합 중" : FEEDBACK_LABEL[feedback]}
      </p>
    </div>
  );
}
