"use client";

import { Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GameStartProps {
  onStart: () => void;
}

export function GameStart({ onStart }: GameStartProps) {
  return (
    <section
      className="mx-auto flex w-full max-w-[560px] flex-col gap-5 px-3 py-6 sm:px-4"
      aria-label="덧셈 학습 시작"
    >
      <div className="rounded-lg border border-emerald-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
            <Calculator aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-2xl font-bold text-neutral-950">
              한 자리 덧셈
            </h2>
            <p className="mt-1 text-sm text-neutral-600">
              10문제를 풀며 덧셈 감각을 연습해요.
            </p>
          </div>
        </div>

        <dl className="mt-5 grid grid-cols-3 gap-2 text-center text-sm">
          <div className="rounded-lg bg-sky-50 p-3">
            <dt className="text-neutral-500">범위</dt>
            <dd className="mt-1 font-semibold text-sky-900">1~9</dd>
          </div>
          <div className="rounded-lg bg-amber-50 p-3">
            <dt className="text-neutral-500">문제</dt>
            <dd className="mt-1 font-semibold text-amber-900">10개</dd>
          </div>
          <div className="rounded-lg bg-rose-50 p-3">
            <dt className="text-neutral-500">방식</dt>
            <dd className="mt-1 font-semibold text-rose-900">연습</dd>
          </div>
        </dl>
      </div>

      <Button
        type="button"
        size="lg"
        onClick={onStart}
        className="min-h-12 bg-emerald-700 text-base hover:bg-emerald-800"
      >
        학습 시작
      </Button>
    </section>
  );
}

