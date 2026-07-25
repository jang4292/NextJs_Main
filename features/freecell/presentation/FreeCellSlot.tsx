"use client";

import { cn } from "@/lib/utils";
import type { Card } from "../domain/entities/Card";
import { rankLabel } from "../domain/value-objects/Rank";
import type { Selection } from "./hooks/useFreecellGame";
import type { BindDragHandle } from "./interaction/useFreecellInteractions";
import { CardFace } from "./CardFace";
import styles from "./styles/freecell.module.css";

interface FreeCellSlotProps {
  slotIndex: number;
  card: Card | null;
  selection: Selection;
  bindDragHandle: BindDragHandle;
  onClick: () => void;
}

export function FreeCellSlot({ slotIndex, card, selection, bindDragHandle, onClick }: FreeCellSlotProps) {
  const isSelected = selection?.type === "freeCell" && selection.slotIndex === slotIndex;
  const label = card
    ? `${rankLabel(card.rank)} of ${card.suit}, free cell ${slotIndex + 1}`
    : `Empty free cell ${slotIndex + 1}`;

  return (
    <button
      type="button"
      onClick={onClick}
      {...(card ? bindDragHandle({ type: "freeCell", slotIndex }) : {})}
      data-drop-zone="freeCell"
      data-slot-index={slotIndex}
      aria-label={label}
      aria-pressed={isSelected}
      className={cn(
        styles.cardFace,
        styles.cardButton,
        "relative block w-full appearance-none rounded-[6%] border border-dashed border-neutral-400 bg-transparent p-0",
        isSelected && styles.selected,
      )}
    >
      {card && <CardFace card={card} />}
    </button>
  );
}
