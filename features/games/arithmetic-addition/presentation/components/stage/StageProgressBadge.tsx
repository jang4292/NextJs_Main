"use client";

import { cn } from "@/lib/utils";
import type { StageProgressStatus } from "../../../domain/learningProgress.types";

interface StageProgressBadgeProps {
  status?: StageProgressStatus;
  recommended?: boolean;
}

const labelByStatus: Record<StageProgressStatus, string> = {
  "not-started": "처음",
  practicing: "연습 중",
  confident: "익숙해짐",
  completed: "완료",
};

const classByStatus: Record<StageProgressStatus, string> = {
  "not-started": "bg-neutral-100 text-neutral-700",
  practicing: "bg-amber-100 text-amber-900",
  confident: "bg-sky-100 text-sky-900",
  completed: "bg-emerald-100 text-emerald-900",
};

export function StageProgressBadge({
  status = "not-started",
  recommended = false,
}: StageProgressBadgeProps) {
  return (
    <span className="flex flex-wrap gap-1">
      <span
        className={cn(
          "rounded-lg px-2 py-1 text-xs font-bold",
          classByStatus[status],
        )}
      >
        {labelByStatus[status]}
      </span>
      {recommended && (
        <span className="rounded-lg bg-rose-100 px-2 py-1 text-xs font-bold text-rose-900">
          현재 추천
        </span>
      )}
    </span>
  );
}
