"use client";

import { useMemo } from "react";
import { useNumericQuiz } from "@/features/math-learning/shared/hooks/useNumericQuiz";
import { calculateSessionResult } from "../../application/use-cases/calculateSessionResult";
import { generateQuestions } from "../../application/use-cases/generateQuestions";
import type {
  ArithmeticQuestion,
  LearningStage,
} from "../../domain/arithmetic.types";
import {
  formatAnswerSentence,
  formatTryAgainMessage,
} from "../../domain/operatorMeta";

export interface UseArithmeticGameOptions {
  createQuestions?: (stage?: LearningStage) => ArithmeticQuestion[];
  now?: () => number;
}

const MAX_INPUT_LENGTH = 2;

export function useArithmeticGame(options: UseArithmeticGameOptions = {}) {
  const quiz = useNumericQuiz<ArithmeticQuestion>({
    createQuestions: () => options.createQuestions?.() ?? generateQuestions(),
    getAnswer: (question) => question.answer,
    maxInputLength: MAX_INPUT_LENGTH,
    messages: {
      correct: (question) => ({
        title: "정답이에요!",
        message: formatAnswerSentence(question),
      }),
      tryAgain: (question) => ({
        title: "다시 생각해 보세요.",
        message: formatTryAgainMessage(question),
      }),
      revealed: (question) => ({
        title: "정답을 함께 확인해요.",
        message: formatAnswerSentence(question),
      }),
    },
    now: options.now,
    sessionIdPrefix: "arithmetic",
  });
  const analysis = useMemo(
    () => (quiz.session ? calculateSessionResult(quiz.session) : null),
    [quiz.session],
  );

  function startReview() {
    if (!analysis || analysis.wrongResults.length === 0) return;

    quiz.startWithQuestions(
      analysis.wrongResults.map((result) => result.question),
      true,
    );
  }

  return {
    ...quiz,
    analysis,
    startReview,
  };
}
