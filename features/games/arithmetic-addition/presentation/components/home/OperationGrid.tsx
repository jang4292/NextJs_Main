"use client";

import {
  Divide,
  Minus,
  Plus,
  Shuffle,
  X,
} from "lucide-react";
import type { Operator } from "../../../domain/arithmetic.types";
import {
  OperationCard,
  type OperationCardItem,
} from "./OperationCard";

interface OperationGridProps {
  onSelectOperation: (operator: Operator) => void;
}

const OPERATIONS: OperationCardItem[] = [
  {
    id: "addition",
    title: "덧셈",
    description: "작은 수부터 한 자리 수 종합까지 단계별로 풀어요.",
    badge: "6단계",
    enabled: true,
    icon: Plus,
    tone: "emerald",
  },
  {
    id: "subtraction",
    title: "뺄셈",
    description: "0 만들기와 10에서 빼기를 차근차근 연습해요.",
    badge: "5단계",
    enabled: true,
    icon: Minus,
    tone: "sky",
  },
  {
    id: "multiplication",
    title: "곱셈",
    description: "구구단 단계는 다음 업데이트에서 열려요.",
    badge: "예정",
    enabled: false,
    icon: X,
    tone: "amber",
  },
  {
    id: "division",
    title: "나눗셈",
    description: "나머지 없는 나눗셈부터 준비하고 있어요.",
    badge: "예정",
    enabled: false,
    icon: Divide,
    tone: "rose",
  },
  {
    id: "mixed",
    title: "혼합",
    description: "연산을 섞어 푸는 흐름은 나중에 만나요.",
    badge: "예정",
    enabled: false,
    icon: Shuffle,
    tone: "violet",
  },
];

export function OperationGrid({ onSelectOperation }: OperationGridProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2" aria-label="연산 선택">
      {OPERATIONS.map((operation) => (
        <OperationCard
          key={operation.id}
          item={operation}
          onSelect={onSelectOperation}
        />
      ))}
    </div>
  );
}
