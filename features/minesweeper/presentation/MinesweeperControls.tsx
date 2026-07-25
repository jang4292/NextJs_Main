"use client";

import { cn } from "@/lib/utils";

interface MinesweeperControlsProps {
  flagMode: boolean;
  onToggleFlagMode: () => void;
}

export function MinesweeperControls({ flagMode, onToggleFlagMode }: MinesweeperControlsProps) {
  return (
    <div className="mt-4 flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={onToggleFlagMode}
        aria-pressed={flagMode}
        className={cn(
          "rounded-md px-4 py-2 text-sm font-semibold transition-colors active:scale-95",
          flagMode
            ? "bg-amber-500 text-neutral-900 hover:bg-amber-400"
            : "bg-neutral-700 text-neutral-50 hover:bg-neutral-600",
        )}
      >
        {flagMode ? "🚩 깃발 모드 켜짐" : "깃발 모드로 전환"}
      </button>
      <p className="max-w-xs text-center text-xs text-neutral-500">
        PC: 좌클릭으로 열기, 우클릭으로 깃발. 모바일: 짧게 탭하여{" "}
        {flagMode ? "깃발을 표시" : "열기"}, 길게 누르면 깃발을 전환합니다.
      </p>
    </div>
  );
}
