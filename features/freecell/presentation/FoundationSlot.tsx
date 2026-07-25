"use client";

import { cn } from "@/lib/utils";
import type { Card } from "../domain/entities/Card";
import type { Suit } from "../domain/value-objects/Suit";
import { rankLabel } from "../domain/value-objects/Rank";
import type { Selection } from "./hooks/useFreecellGame";
import { CardFace } from "./CardFace";
import styles from "./styles/freecell.module.css";

const SUIT_SYMBOL: Record<Suit, string> = {
  spades: "♠",
  hearts: "♥",
  diamonds: "♦",
  clubs: "♣",
};

interface FoundationSlotProps {
  suit: Suit;
  pile: readonly Card[];
  selection: Selection;
  onClick: () => void;
}

/** Foundation is a move destination only -- cards never leave it once
 * placed, so this slot intentionally does not accept a drag handle. */
export function FoundationSlot({ suit, pile, selection, onClick }: FoundationSlotProps) {
  const topCard = pile[pile.length - 1] ?? null;
  const isSelected = selection?.type === "foundation" && selection.suit === suit;
  const label = topCard
    ? `${rankLabel(topCard.rank)} of ${suit}, ${suit} foundation`
    : `Empty ${suit} foundation`;

  return (
    <button
      type="button"
      onClick={onClick}
      data-drop-zone="foundation"
      data-suit={suit}
      aria-label={label}
      aria-pressed={isSelected}
      className={cn(
        styles.cardFace,
        styles.cardButton,
        "relative block w-full appearance-none rounded-[6%] border border-dashed border-neutral-400 bg-transparent p-0",
        isSelected && styles.selected,
      )}
    >
      {topCard ? (
        <CardFace card={topCard} />
      ) : (
        <span aria-hidden="true" className="flex h-full w-full items-center justify-center text-lg text-neutral-300">
          {SUIT_SYMBOL[suit]}
        </span>
      )}
    </button>
  );
}
