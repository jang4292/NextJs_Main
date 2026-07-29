"use client";

interface ProgressBarProps {
  value: number;
  max: number;
}

export function ProgressBar({ value, max }: ProgressBarProps) {
  const percentage = max === 0 ? 0 : Math.round((value / max) * 100);

  return (
    <div
      className="h-3 overflow-hidden rounded-lg bg-neutral-200"
      role="progressbar"
      aria-label="문제 진행률"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
    >
      <div
        className="h-full rounded-lg bg-emerald-600 transition-[width] duration-300"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

