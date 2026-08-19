"use client";

import { ArrowLeft, BookOpen, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { MistakeRecord } from "../../../domain/learningProgress.types";
import { FrequentMistakeList } from "./FrequentMistakeList";
import { RecentMistakeList } from "./RecentMistakeList";

interface ReviewMenuProps {
  recentMistakes: MistakeRecord[];
  frequentMistakes: MistakeRecord[];
  onBack: () => void;
  onStartLearning: () => void;
  onStartReview: (mistakes: MistakeRecord[]) => void;
}

export function ReviewMenu({
  recentMistakes,
  frequentMistakes,
  onBack,
  onStartLearning,
  onStartReview,
}: ReviewMenuProps) {
  const hasMistakes = recentMistakes.length > 0 || frequentMistakes.length > 0;

  return (
    <section
      className="mx-auto flex w-full max-w-[720px] flex-col gap-4 px-3 py-5 sm:px-4"
      aria-label="오답 복습"
    >
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-rose-700">오답 복습</p>
          <h1 className="mt-1 text-2xl font-bold text-neutral-950">
            다시 만나볼 문제
          </h1>
        </div>
        <Button type="button" variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          뒤로
        </Button>
      </header>

      {!hasMistakes ? (
        <div className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
          <BookOpen className="h-6 w-6 text-emerald-700" aria-hidden="true" />
          <h2 className="mt-3 text-xl font-bold text-neutral-950">
            복습할 문제가 아직 없어요
          </h2>
          <p className="mt-2 text-sm leading-6 text-neutral-600">
            단계를 하나 마치면 헷갈렸던 문제가 이곳에 모여요.
          </p>
          <Button
            type="button"
            onClick={onStartLearning}
            className="mt-4 min-h-11 bg-emerald-700 hover:bg-emerald-800"
          >
            학습 시작
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <section className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-bold text-neutral-950">최근 틀린 문제</h2>
              <Button
                type="button"
                size="sm"
                disabled={recentMistakes.length === 0}
                onClick={() => onStartReview(recentMistakes)}
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                풀기
              </Button>
            </div>
            <div className="mt-3">
              <RecentMistakeList mistakes={recentMistakes} />
            </div>
          </section>

          <section className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-bold text-neutral-950">자주 틀린 문제</h2>
              <Button
                type="button"
                size="sm"
                disabled={frequentMistakes.length === 0}
                onClick={() => onStartReview(frequentMistakes)}
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                풀기
              </Button>
            </div>
            <div className="mt-3">
              <FrequentMistakeList mistakes={frequentMistakes} />
            </div>
          </section>
        </div>
      )}
    </section>
  );
}
