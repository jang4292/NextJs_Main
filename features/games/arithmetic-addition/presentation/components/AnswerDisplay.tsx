"use client";

interface AnswerDisplayProps {
  value: string;
}

export function AnswerDisplay({ value }: AnswerDisplayProps) {
  return (
    <div
      className="rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-center"
      role="status"
      aria-label="현재 입력한 답"
      aria-live="polite"
    >
      <p className="text-sm font-medium text-sky-800">내 답</p>
      <div className="mt-1 min-h-12 text-4xl font-black text-sky-950">
        {value || "?"}
      </div>
    </div>
  );
}
