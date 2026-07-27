import { cn } from "@/lib/utils";
import type { Card } from "../domain/entities/Card";
import type { Selection } from "./hooks/useSolitaireGame";
import type { BindDragHandle } from "./interaction/useDragAndDrop";
import { registerCardEl } from "./animation/cardRegistry";
import { CardFace } from "./CardFace";

interface TableauViewProps {
  tableau: readonly Card[][];
  selection: Selection;
  hiddenCardIds: ReadonlySet<string>;
  bindDragHandle: BindDragHandle;
  onClickCard: (column: number, cardIndex: number) => void;
}

export function TableauView({
  tableau,
  selection,
  hiddenCardIds,
  bindDragHandle,
  onClickCard,
}: TableauViewProps) {
  return (
    <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
      {tableau.map((pile, column) => (
        <div
          key={column}
          className="flex min-h-24 flex-col sm:min-h-32"
          data-drop-zone="tableau"
          data-column={column}
          onClick={() => pile.length === 0 && onClickCard(column, -1)}
        >
          {pile.length === 0 ? (
            <div className="aspect-[63/88] w-full rounded-[6%] border border-dashed border-neutral-300" />
          ) : (
            pile.map((card, cardIndex) => {
              const isSelected =
                selection?.zone === "tableau" &&
                selection.column === column &&
                cardIndex >= selection.cardIndex;

              return (
                <button
                  key={card.id}
                  type="button"
                  ref={(el) => registerCardEl(card.id, el)}
                  onClick={(event) => {
                    event.stopPropagation();
                    onClickCard(column, cardIndex);
                  }}
                  {...bindDragHandle({ zone: "tableau", column, cardIndex })}
                  className={cn(
                    "relative w-full appearance-none rounded-[6%] bg-transparent p-0",
                    "aspect-[63/88]",
                    cardIndex > 0 && "-mt-[72%]",
                    isSelected && "ring-2 ring-blue-500 ring-offset-1",
                    hiddenCardIds.has(card.id) && "invisible",
                  )}
                  style={{ zIndex: cardIndex }}
                >
                  <CardFace card={card} />
                </button>
              );
            })
          )}
        </div>
      ))}
    </div>
  );
}
