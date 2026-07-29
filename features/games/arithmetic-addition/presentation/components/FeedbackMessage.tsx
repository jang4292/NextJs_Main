"use client";

import { CheckCircle2, Lightbulb, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  ArithmeticQuestion,
  FeedbackState,
} from "../../domain/arithmetic.types";
import { QuantityVisualizer } from "./QuantityVisualizer";
import styles from "../styles/arithmetic.module.css";

interface FeedbackMessageProps {
  feedback: FeedbackState | null;
  question: ArithmeticQuestion;
}

export function FeedbackMessage({
  feedback,
  question,
}: FeedbackMessageProps) {
  if (!feedback) {
    return (
      <div
        className="min-h-[72px]"
        aria-live="polite"
        aria-atomic="true"
      />
    );
  }

  const Icon =
    feedback.kind === "correct"
      ? CheckCircle2
      : feedback.kind === "try-again"
        ? Lightbulb
        : Sparkles;

  return (
    <div
      className={cn(
        styles.feedback,
        feedback.kind === "correct" && styles.feedbackCorrect,
        feedback.kind === "try-again" && styles.feedbackTryAgain,
        feedback.kind === "answer-revealed" && styles.feedbackRevealed,
      )}
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="flex items-start gap-3">
        <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
        <div>
          <p className="font-bold">{feedback.title}</p>
          <p className="mt-1 text-sm">{feedback.message}</p>
        </div>
      </div>

      {feedback.kind === "answer-revealed" && (
        <div className="mt-3 border-t border-current/20 pt-3">
          <QuantityVisualizer
            leftOperand={question.leftOperand}
            rightOperand={question.rightOperand}
            operator={question.operator}
          />
        </div>
      )}
    </div>
  );
}
