"use client";

import { RotateCcw, Stars } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SessionAnalysis } from "../../domain/arithmetic.types";
import { formatElapsedTime } from "../formatElapsedTime";

interface ResultSummaryProps {
  analysis: SessionAnalysis;
  reviewMode: boolean;
  onRestart: () => void;
  onReviewWrong: () => void;
}

export function ResultSummary({
  analysis,
  reviewMode,
  onRestart,
  onReviewWrong,
}: ResultSummaryProps) {
  return (
    <section
      className="mx-auto flex w-full max-w-[640px] flex-col gap-4 px-3 py-6 sm:px-4"
      aria-label="덧셈 학습 결과"
    >
      <div className="rounded-lg border border-emerald-200 bg-white p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
            <Stars aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-medium text-emerald-700">
              {reviewMode ? "복습 완료" : "학습 완료"}
            </p>
            <h2 className="mt-1 text-2xl font-bold text-neutral-950">
              끝까지 잘 해냈어요
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              {analysis.evaluation.message}
            </p>
          </div>
        </div>

        <div
          className="mt-5 text-3xl tracking-normal text-amber-500"
          aria-label={`별 ${analysis.starRating}개`}
        >
          {"★".repeat(analysis.starRating)}
          <span className="text-neutral-300">
            {"★".repeat(3 - analysis.starRating)}
          </span>
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
        <ResultMetric label="전체 문제" value={`${analysis.totalQuestions}문제`} />
        <ResultMetric
          label="처음에 맞힌 문제"
          value={`${analysis.firstTryCorrectCount}문제`}
        />
        <ResultMetric
          label="다시 풀어서 맞힌 문제"
          value={`${analysis.retryCorrectCount}문제`}
        />
        <ResultMetric
          label="평균 풀이 시간"
          value={formatElapsedTime(analysis.averageElapsedMs)}
        />
        <ResultMetric
          label="평균 시도 횟수"
          value={`${analysis.averageAttemptCount.toFixed(1)}회`}
        />
        <ResultMetric
          label="최대 연속 정답"
          value={`${analysis.maxStreak}문제`}
        />
      </dl>

      <div className="rounded-lg border border-neutral-200 bg-white p-4">
        <h3 className="font-bold text-neutral-950">{analysis.evaluation.title}</h3>
        <p className="mt-1 text-sm text-neutral-600">
          최초 정답률 {Math.round(analysis.firstTryAccuracy * 100)}%
        </p>

        <div className="mt-4">
          <h4 className="text-sm font-semibold text-neutral-800">
            틀린 문제 목록
          </h4>
          {analysis.wrongResults.length > 0 ? (
            <ul className="mt-2 grid gap-2 text-sm text-neutral-700">
              {analysis.wrongResults.map((result) => (
                <li
                  key={result.question.id}
                  className="rounded-lg bg-rose-50 px-3 py-2 text-rose-950"
                >
                  {result.question.leftOperand} + {result.question.rightOperand} ={" "}
                  {result.question.answer}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
              처음부터 모두 맞혔어요.
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <Button
          type="button"
          onClick={onRestart}
          className="min-h-11 bg-emerald-700 hover:bg-emerald-800"
        >
          <RotateCcw aria-hidden="true" />
          다시 시작
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={analysis.wrongResults.length === 0}
          onClick={onReviewWrong}
          className="min-h-11"
        >
          틀린 문제만 다시 풀기
        </Button>
      </div>
    </section>
  );
}

function ResultMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-3">
      <dt className="text-neutral-500">{label}</dt>
      <dd className="mt-1 text-lg font-bold text-neutral-950">{value}</dd>
    </div>
  );
}

