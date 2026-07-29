"use client";

import type { QuestionResult } from "../../../domain/arithmetic.types";
import { formatAnswerSentence } from "../../../domain/operatorMeta";

interface MistakeSummaryProps {
  wrongResults: QuestionResult[];
}

export function MistakeSummary({ wrongResults }: MistakeSummaryProps) {
  return (
    <div className="mt-4">
      <h4 className="text-sm font-semibold text-neutral-800">틀린 문제 목록</h4>
      {wrongResults.length > 0 ? (
        <ul className="mt-2 grid gap-2 text-sm text-neutral-700">
          {wrongResults.map((result) => (
            <li
              key={result.question.id}
              className="rounded-lg bg-rose-50 px-3 py-2 text-rose-950"
            >
              {formatAnswerSentence(result.question)}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
          처음부터 모두 맞혔어요.
        </p>
      )}
    </div>
  );
}
