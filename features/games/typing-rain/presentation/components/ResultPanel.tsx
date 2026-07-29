"use client";

import Link from "next/link";
import { Home, RotateCcw, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getMostMistypedContents,
  type RankedLearningRecord,
} from "../../application/use-cases/learningRecords";
import { typingContents } from "../../data/typingContents";
import {
  CONTENT_TYPE_LABELS,
  DIFFICULTY_LABELS,
} from "../../domain/difficulty.config";
import type {
  ContentLearningRecord,
  TypingContentResultRecord,
  TypingGameResult,
  TypingGameSettings,
} from "../../domain/typing.types";
import {
  formatElapsedTime,
  formatPercent,
} from "../formatTypingStats";

interface ResultPanelProps {
  result: TypingGameResult;
  settings: TypingGameSettings;
  learningRecords: Record<string, ContentLearningRecord>;
  onRestart: () => void;
  onChangeSettings: () => void;
}

export function ResultPanel({
  result,
  settings,
  learningRecords,
  onRestart,
  onChangeSettings,
}: ResultPanelProps) {
  const cumulativeMistypedContents = getMostMistypedContents(learningRecords, 5);

  return (
    <section
      className="mx-auto flex w-full max-w-[720px] flex-col gap-4 px-3 py-5 sm:px-4"
      aria-label="Typing Rain 결과"
    >
      <div className="rounded-lg border border-sky-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-bold text-sky-700">
          {settings.language === "ko" ? "한글" : "English"} ·{" "}
          {DIFFICULTY_LABELS[settings.difficulty]} ·{" "}
          {CONTENT_TYPE_LABELS[settings.contentType]}
        </p>
        <h1 className="mt-1 text-3xl font-bold text-neutral-950">
          {result.isNewHighScore ? "새 최고 기록이에요" : "도전을 마쳤어요"}
        </h1>
        <p className="mt-2 text-sm text-neutral-600">
          최종 점수 {result.score.toLocaleString()}점
        </p>
      </div>

      <section className="rounded-lg border border-neutral-200 bg-white p-4">
        <h2 className="text-lg font-bold text-neutral-950">이번 게임 결과</h2>
        <dl className="mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
          <ResultMetric label="성공" value={`${result.correctCount}개`} />
          <ResultMetric label="실패" value={`${result.missedCount}개`} />
          <ResultMetric label="오타" value={`${result.typoCount}개`} />
          <ResultMetric label="정확도" value={formatPercent(result.accuracy)} />
          <ResultMetric label="최고 콤보" value={`${result.maxCombo}`} />
          <ResultMetric
            label="플레이 시간"
            value={formatElapsedTime(result.elapsedMs)}
          />
          <ResultMetric
            label="평균 입력"
            value={formatNullableDuration(result.averageInputDurationMs)}
          />
          <ResultMetric
            label="분당 완료"
            value={`${Math.round(result.completedCharactersPerMinute)}자`}
          />
        </dl>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-neutral-200 bg-white p-4">
          <h2 className="text-lg font-bold text-neutral-950">입력 속도</h2>
          <dl className="mt-3 grid gap-2 text-sm">
            <ResultMetric
              label="가장 빠름"
              value={formatContentResult(result.fastestContent)}
            />
            <ResultMetric
              label="가장 오래 걸림"
              value={formatContentResult(result.slowestContent)}
            />
          </dl>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white p-4">
          <h2 className="text-lg font-bold text-neutral-950">학습 분석</h2>
          <AnalysisList
            title="이번 게임"
            emptyText="이번 게임에서 기록된 오답이 없어요."
            records={result.mostMistypedContents}
            renderRecord={formatContentResult}
          />
          <AnalysisList
            title="누적 기준"
            emptyText="누적 학습 기록이 아직 충분하지 않아요."
            records={cumulativeMistypedContents}
            renderRecord={formatLearningRecord}
          />
        </div>
      </section>

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

function AnalysisList<T>({
  title,
  emptyText,
  records,
  renderRecord,
}: {
  title: string;
  emptyText: string;
  records: T[];
  renderRecord: (record: T) => string;
}) {
  return (
    <div className="mt-3">
      <h3 className="text-sm font-bold text-neutral-700">{title}</h3>
      {records.length === 0 ? (
        <p className="mt-2 rounded-lg bg-neutral-50 p-3 text-sm text-neutral-500">
          {emptyText}
        </p>
      ) : (
        <ol className="mt-2 grid gap-2 text-sm">
          {records.map((record, index) => (
            <li
              key={`${title}-${index}`}
              className="rounded-lg bg-neutral-50 px-3 py-2 font-medium text-neutral-800"
            >
              {renderRecord(record)}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

function formatNullableDuration(durationMs: number | null): string {
  return durationMs === null ? "-" : formatElapsedTime(durationMs);
}

function formatContentResult(record: TypingContentResultRecord | null): string {
  if (!record) return "-";

  const suffix = record.missed
    ? "실패"
    : formatNullableDuration(record.inputDurationMs);

  return `${record.text} · ${suffix}`;
}

function formatLearningRecord(record: RankedLearningRecord): string {
  const contentText =
    typingContents.find((content) => content.id === record.contentId)?.text ??
    record.contentId;

  return `${contentText} · 실패 ${record.missedCount}회 · 오타 ${record.typoCount}회`;
}
