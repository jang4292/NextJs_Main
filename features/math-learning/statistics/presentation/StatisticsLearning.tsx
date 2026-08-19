"use client";

import Link from "next/link";
import { ArrowLeft, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NumberPad } from "@/features/math-learning/shared/components/NumberPad";
import {
  useNumericQuiz,
  type NumericQuizFeedbackState,
} from "@/features/math-learning/shared/hooks/useNumericQuiz";
import { generateStatisticsQuestions } from "../application/use-cases/generateStatisticsQuestions";
import { STATISTICS_STAGE } from "../domain/stages";
import type {
  StatisticsQuestion,
  StatisticsQuestionKind,
} from "../domain/statistics.types";

interface StatisticsLearningProps {
  createQuestions?: () => StatisticsQuestion[];
}

const MAX_INPUT_LENGTH = 3;

const QUESTION_LABEL: Record<StatisticsQuestionKind, string> = {
  sum: "합계",
  maximum: "최댓값",
  minimum: "최솟값",
  mean: "평균",
  median: "중앙값",
  mode: "최빈값",
};

const QUESTION_PROMPT: Record<StatisticsQuestionKind, string> = {
  sum: "자료의 합계는?",
  maximum: "가장 큰 값은?",
  minimum: "가장 작은 값은?",
  mean: "자료의 평균은?",
  median: "가운데에 오는 값은?",
  mode: "가장 자주 나온 값은?",
};

const ANSWER_PHRASE: Record<StatisticsQuestionKind, string> = {
  sum: "합계는",
  maximum: "최댓값은",
  minimum: "최솟값은",
  mean: "평균은",
  median: "중앙값은",
  mode: "최빈값은",
};

export function StatisticsLearning({
  createQuestions = () => generateStatisticsQuestions(STATISTICS_STAGE),
}: StatisticsLearningProps) {
  const quiz = useNumericQuiz<StatisticsQuestion>({
    autoStart: true,
    createQuestions,
    getAnswer: (question) => question.answer,
    maxInputLength: MAX_INPUT_LENGTH,
    messages: {
      correct: (question) => ({
        title: "정답이에요!",
        message: `자료를 잘 살폈어요. ${formatAnswer(question)}`,
      }),
      tryAgain: () => ({
        title: "다시 생각해 보세요.",
        message: "자료를 차례대로 보고 필요한 값을 찾아봐요.",
      }),
      revealed: (question) => ({
        title: "정답을 함께 확인해요.",
        message: `${formatAnswer(question)} 자료는 ${formatValues(question.values)}이에요.`,
      }),
    },
    sessionIdPrefix: "statistics",
  });
  const currentQuestion = quiz.currentQuestion;
  const results = quiz.session?.results ?? [];
  const correctCount = results.filter((result) =>
    result.attempts.some((attempt) => attempt.isCorrect),
  ).length;
  const firstTryCorrectCount = results.filter(
    (result) => result.firstTryCorrect,
  ).length;

  if (quiz.status === "completed") {
    return (
      <section
        className="mx-auto flex w-full max-w-[640px] flex-col gap-4 px-3 py-6 sm:px-4"
        aria-label="통계 학습 결과"
      >
        <Link
          href="/learn/math"
          className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-emerald-700 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          수학 학습
        </Link>

        <div className="rounded-lg border border-emerald-200 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
              <Sparkles aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-medium text-emerald-700">
                통계 학습 완료
              </p>
              <h1 className="mt-1 text-2xl font-bold text-neutral-950">
                자료를 끝까지 읽어냈어요
              </h1>
              <p className="mt-2 text-sm text-neutral-600">
                전체 {quiz.totalQuestions}문제 중 {correctCount}문제를 맞혔고,
                처음에 맞힌 문제는 {firstTryCorrectCount}문제예요.
              </p>
            </div>
          </div>
        </div>

        <Button
          type="button"
          onClick={() => quiz.startWithQuestions(createQuestions())}
          className="min-h-11 bg-emerald-700 hover:bg-emerald-800"
        >
          <RotateCcw aria-hidden="true" />
          다시 시작
        </Button>
      </section>
    );
  }

  if (!currentQuestion) return null;

  return (
    <section
      className="mx-auto flex w-full max-w-[560px] flex-col gap-4 px-3 py-5 sm:px-4"
      aria-label="통계 기초 학습"
    >
      <header className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex min-w-0 items-start gap-2">
            <Button variant="outline" size="icon" asChild>
              <Link href="/learn/math" aria-label="수학 학습으로 돌아가기">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <div className="min-w-0">
              <p className="text-sm font-medium text-emerald-700">
                Statistics Basic · {STATISTICS_STAGE.title}
              </p>
              <h1 className="text-2xl font-bold text-neutral-950">
                문제 {quiz.currentIndex + 1} / {quiz.totalQuestions}
              </h1>
            </div>
          </div>
          <span className="rounded-lg bg-sky-100 px-3 py-2 text-sm font-semibold text-sky-900">
            {QUESTION_LABEL[currentQuestion.kind]}
          </span>
        </div>

        <div
          className="h-3 overflow-hidden rounded-lg bg-neutral-200"
          aria-label={`진행률 ${quiz.currentIndex + 1} / ${quiz.totalQuestions}`}
        >
          <div
            className="h-full rounded-lg bg-emerald-600 transition-[width] duration-300"
            style={{
              width: `${((quiz.currentIndex + 1) / quiz.totalQuestions) * 100}%`,
            }}
          />
        </div>
      </header>

      <div className="rounded-lg border border-neutral-200 bg-white p-4 text-center shadow-sm">
        <p className="text-sm font-medium text-neutral-500">
          {QUESTION_PROMPT[currentQuestion.kind]}
        </p>
        <ol
          className="mt-4 grid grid-cols-5 gap-2"
          aria-label={formatDataAriaLabel(currentQuestion)}
        >
          {currentQuestion.values.map((value, index) => (
            <li
              key={`${currentQuestion.id}-${index}`}
              className="flex min-h-14 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 text-xl font-black text-neutral-950"
            >
              {value}
            </li>
          ))}
        </ol>
      </div>

      <div
        className="min-h-16 rounded-lg border border-neutral-200 bg-white px-4 py-3 text-center shadow-sm"
        aria-label="현재 입력한 답"
      >
        <p className="text-xs font-semibold text-neutral-500">내 답</p>
        <p className="mt-1 text-3xl font-black text-neutral-950">
          {quiz.inputValue || "?"}
        </p>
      </div>

      <StatisticsFeedback feedback={quiz.feedback} question={currentQuestion} />

      <NumberPad
        canInput={quiz.canInput}
        canSubmit={quiz.canSubmit}
        canGoNext={quiz.canGoNext}
        isLastQuestion={quiz.isLastQuestion}
        onDigit={quiz.inputDigit}
        onDelete={quiz.deleteDigit}
        onSubmit={quiz.submitAnswer}
        onNext={quiz.nextQuestion}
      />
    </section>
  );
}

function StatisticsFeedback({
  feedback,
  question,
}: {
  feedback: NumericQuizFeedbackState | null;
  question: StatisticsQuestion;
}) {
  if (!feedback) {
    return (
      <div className="min-h-[72px]" aria-live="polite" aria-atomic="true" />
    );
  }

  const tone =
    feedback.kind === "correct"
      ? "border-emerald-700 bg-emerald-50 text-emerald-900"
      : feedback.kind === "try-again"
        ? "border-amber-700 bg-amber-50 text-amber-900"
        : "border-rose-700 bg-rose-50 text-rose-900";

  return (
    <div
      className={`min-h-[72px] rounded-lg border p-4 ${tone}`}
      aria-live="polite"
      aria-atomic="true"
    >
      <p className="font-bold">{feedback.title}</p>
      <p className="mt-1 text-sm">{feedback.message}</p>
      {feedback.kind === "answer-revealed" && (
        <p className="mt-2 text-sm font-semibold">
          {QUESTION_LABEL[question.kind]} = {question.answer}
        </p>
      )}
    </div>
  );
}

function formatAnswer(question: StatisticsQuestion): string {
  return `${ANSWER_PHRASE[question.kind]} ${question.answer}이에요.`;
}

function formatValues(values: readonly number[]): string {
  return values.join(", ");
}

function formatDataAriaLabel(question: StatisticsQuestion): string {
  return `자료 ${formatValues(question.values)}`;
}
