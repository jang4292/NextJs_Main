"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { isArithmeticOperator } from "../../../application/arithmeticOperatorRegistry";
import type { Operator } from "../../../domain/arithmetic.types";

export type OperationMenuId = Operator | "mixed";

export interface OperationCardItem {
  id: OperationMenuId;
  title: string;
  description: string;
  badge: string;
  enabled: boolean;
  icon: LucideIcon;
  tone: "emerald" | "sky" | "amber" | "rose" | "violet";
}

interface OperationCardProps {
  item: OperationCardItem;
  onSelect: (operator: Operator) => void;
}

const toneClasses: Record<OperationCardItem["tone"], string> = {
  emerald: "border-emerald-200 bg-emerald-50 text-emerald-900",
  sky: "border-sky-200 bg-sky-50 text-sky-900",
  amber: "border-amber-200 bg-amber-50 text-amber-900",
  rose: "border-rose-200 bg-rose-50 text-rose-900",
  violet: "border-violet-200 bg-violet-50 text-violet-900",
};

export function OperationCard({ item, onSelect }: OperationCardProps) {
  const Icon = item.icon;

  return (
    <button
      type="button"
      disabled={!item.enabled}
      aria-disabled={!item.enabled}
      onClick={() => {
        if (item.enabled && isArithmeticOperator(item.id)) {
          onSelect(item.id);
        }
      }}
      className={cn(
        "min-h-[148px] rounded-lg border bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-sm",
        toneClasses[item.tone],
      )}
    >
      <span className="flex items-start justify-between gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/80">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="rounded-lg bg-white/80 px-2 py-1 text-xs font-bold">
          {item.enabled ? item.badge : "준비 중"}
        </span>
      </span>
      <span className="mt-4 block text-lg font-bold">{item.title}</span>
      <span className="mt-1 block text-sm leading-6 opacity-80">
        {item.description}
      </span>
    </button>
  );
}
