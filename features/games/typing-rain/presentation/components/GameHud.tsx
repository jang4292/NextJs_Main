"use client";

import type { ReactNode } from "react";
import { Heart, Pause, Play, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DIFFICULTY_LABELS } from "../../domain/difficulty.config";
import type {
  DifficultyLevel,
  TypingGameStatus,
} from "../../domain/typing.types";
import { formatElapsedTime } from "../formatTypingStats";

interface GameHudProps {
  status: TypingGameStatus;
  score: number;
  health: number;
  combo: number;
  maxCombo: number;
  difficulty: DifficultyLevel;
  elapsedMs: number;
  onPause: () => void;
  onResume: () => void;
  onQuit: () => void;
}

export function GameHud({
  status,
  score,
  health,
  combo,
  maxCombo,
  difficulty,
  elapsedMs,
  onPause,
  onResume,
  onQuit,
}: GameHudProps) {
  const paused = status === "paused";

  return (
    <header className="rounded-lg border border-sky-200 bg-white/95 p-3 shadow-sm">
      <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-5">
        <HudMetric label="점수" value={score.toLocaleString()} />
        <HudMetric
          label="체력"
          value={`${health}`}
          icon={<Heart className="h-4 w-4 text-rose-600" aria-hidden="true" />}
        />
        <HudMetric label="콤보" value={`${combo}`} />
        <HudMetric label="최고 콤보" value={`${maxCombo}`} />
        <HudMetric label="시간" value={formatElapsedTime(elapsedMs)} />
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <span className="rounded-lg bg-sky-100 px-3 py-2 text-sm font-bold text-sky-900">
          {DIFFICULTY_LABELS[difficulty]}
        </span>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={paused ? onResume : onPause}
            disabled={status !== "playing" && status !== "paused"}
          >
            {paused ? (
              <Play className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Pause className="h-4 w-4" aria-hidden="true" />
            )}
            {paused ? "재개" : "일시정지"}
          </Button>
          <Button type="button" variant="outline" onClick={onQuit}>
            <Square className="h-4 w-4" aria-hidden="true" />
            종료
          </Button>
        </div>
      </div>
    </header>
  );
}

function HudMetric({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: ReactNode;
}) {
  return (
    <div className="rounded-lg bg-neutral-50 px-3 py-2">
      <dt className="text-xs text-neutral-500">{label}</dt>
      <dd className="mt-1 flex items-center gap-1 text-lg font-bold text-neutral-950">
        {icon}
        {value}
      </dd>
    </div>
  );
}
