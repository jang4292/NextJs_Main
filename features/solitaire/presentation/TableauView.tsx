import { cn } from "@/lib/utils";
import type { Card } from "../domain/entities/Card";
import type { Selection } from "./hooks/useSolitaireGame";
import { CardFace } from "./CardFace";

interface TableauViewProps {
  tableau: readonly (readonly Card[])[];
  selection: Selection;
  onClickCard: (column: number, cardIndex: number) => void;
}

export function TableauView({ tableau, selection, onClickCard }: TableauViewProps) {
  return (
    <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
      {tableau.map((pile, column) => (
        <div
          key={column}
          className="flex flex-col"
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
                  onClick={(event) => {
                    event.stopPropagation();
                    onClickCard(column, cardIndex);
                  }}
                  className={cn(
                    "relative w-full appearance-none rounded-[6%] bg-transparent p-0",
                    "aspect-[63/88]",
                    cardIndex > 0 && "-mt-[72%]",
                    isSelected && "ring-2 ring-offset-1 ring-blue-500",
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
