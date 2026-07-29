"use client";

import Link from "next/link";
import { Home, RotateCcw, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import type {
  TypingGameResult,
  TypingGameSettings,
} from "../../domain/typing.types";
import { DIFFICULTY_LABELS } from "../../domain/difficulty.config";
import {
  formatElapsedTime,
  formatPercent,
} from "../formatTypingStats";

interface ResultPanelProps {
  result: TypingGameResult;
  settings: TypingGameSettings;
  onRestart: () => void;
  onChangeSettings: () => void;
}

export function ResultPanel({
  result,
  settings,
  onRestart,
  onChangeSettings,
}: ResultPanelProps) {
  return (
    <section
      className="mx-auto flex w-full max-w-[720px] flex-col gap-4 px-3 py-5 sm:px-4"
      aria-label="Typing Rain 결과"
    >
      <div className="rounded-lg border border-sky-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-bold text-sky-700">
          {settings.language === "ko" ? "한글" : "English"} ·{" "}
          {DIFFICULTY_LABELS[settings.difficulty]}
        </p>
        <h1 className="mt-1 text-3xl font-bold text-neutral-950">
          {result.isNewHighScore ? "새 최고 기록이에요" : "도전을 마쳤어요"}
        </h1>
        <p className="mt-2 text-sm text-neutral-600">
          최종 점수 {result.score.toLocaleString()}점
        </p>
      </div>

      <dl className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
        <ResultMetric label="성공 단어" value={`${result.correctCount}개`} />
        <ResultMetric label="놓친 단어" value={`${result.missedCount}개`} />
        <ResultMetric label="정확도" value={formatPercent(result.accuracy)} />
        <ResultMetric label="최고 콤보" value={`${result.maxCombo}`} />
        <ResultMetric
          label="플레이 시간"
          value={formatElapsedTime(result.elapsedMs)}
        />
        <ResultMetric
          label="입력 글자"
          value={`${result.typedCharacterCount}자`}
        />
        <ResultMetric
          label="완료 글자"
          value={`${result.correctCharacterCount}자`}
        />
        <ResultMetric
          label="분당 완료"
          value={`${Math.round(result.completedCharactersPerMinute)}자`}
        />
      </dl>

      <div className="grid gap-2 sm:grid-cols-3">
        <Button
          type="button"
          onClick={onRestart}
          className="min-h-11 bg-sky-700 hover:bg-sky-800"
        >
          <RotateCcw aria-hidden="true" />
          다시 시작
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onChangeSettings}
          className="min-h-11"
        >
          <Settings aria-hidden="true" />
          설정 변경
        </Button>
        <Button asChild variant="secondary" className="min-h-11">
          <Link href="/tools/games">
            <Home aria-hidden="true" />
            게임 목록
          </Link>
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
