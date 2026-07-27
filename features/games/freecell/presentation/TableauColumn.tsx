"use client";

import { cn } from "@/lib/utils";
import type { Card } from "../domain/entities/Card";
import { rankLabel } from "../domain/value-objects/Rank";
import type { Selection } from "./hooks/useFreecellGame";
import type { BindDragHandle } from "./interaction/useFreecellInteractions";
import { CardFace } from "./CardFace";
import styles from "./styles/freecell.module.css";

interface TableauColumnProps {
  columnIndex: number;
  pile: readonly Card[];
  selection: Selection;
  bindDragHandle: BindDragHandle;
  onClickCard: (columnIndex: number, cardIndex: number) => void;
}

export function TableauColumn({
  columnIndex,
  pile,
  selection,
  bindDragHandle,
  onClickCard,
}: TableauColumnProps) {
  return (
    <div
      className="flex min-h-24 flex-col sm:min-h-32"
      data-drop-zone="tableau"
      data-column-index={columnIndex}
      onClick={() => pile.length === 0 && onClickCard(columnIndex, 0)}
    >
      {pile.length === 0 ? (
        <div
          aria-hidden="true"
          className={cn(
            styles.cardFace,
            "w-full rounded-[6%] border border-dashed border-neutral-300",
          )}
        />
      ) : (
        pile.map((card, cardIndex) => {
          const isSelected =
            selection?.type === "tableau" &&
            selection.columnIndex === columnIndex &&
            cardIndex >= selection.cardIndex;
          const label = `${rankLabel(card.rank)} of ${card.suit}, tableau column ${columnIndex + 1}`;

          return (
            <button
              key={card.id}
              type="button"
              data-card-index={cardIndex}
              onClick={(event) => {
                event.stopPropagation();
                onClickCard(columnIndex, cardIndex);
              }}
              {...bindDragHandle({ type: "tableau", columnIndex, cardIndex })}
              aria-label={label}
              aria-pressed={isSelected}
              className={cn(
                styles.cardFace,
                styles.cardButton,
                "relative block w-full appearance-none rounded-[6%] bg-transparent p-0",
                isSelected && styles.selected,
              )}
              style={{
                marginTop:
                  cardIndex > 0
                    ? "calc(var(--card-height) * -0.62)"
                    : undefined,
                zIndex: cardIndex,
              }}
            >
              <CardFace card={card} />
            </button>
          );
        })
      )}
    </div>
  );
}
