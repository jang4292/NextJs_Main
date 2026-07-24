import type { RefObject } from "react";
import type { GameState } from "../domain/entities/GameState";
import type { Suit } from "../domain/value-objects/Suit";
import { SUITS } from "../domain/value-objects/Suit";
import type { Selection } from "./hooks/useSolitaireGame";
import type { BindDragHandle, DragVisual } from "./interaction/useDragAndDrop";
import { DragGhost } from "./interaction/DragGhost";
import { StockView } from "./StockView";
import { WasteView } from "./WasteView";
import { FoundationView } from "./FoundationView";
import { TableauView } from "./TableauView";

interface GameBoardProps {
  game: GameState;
  selection: Selection;
  hiddenCardIds: ReadonlySet<string>;
  bindDragHandle: BindDragHandle;
  dragVisual: DragVisual | null;
  ghostRef: RefObject<HTMLDivElement | null>;
  onDrawOrRecycle: () => void;
  onClickWaste: () => void;
  onClickTableau: (column: number, cardIndex: number) => void;
  onClickFoundation: (suit: Suit) => void;
}

export function GameBoard({
  game,
  selection,
  hiddenCardIds,
  bindDragHandle,
  dragVisual,
  ghostRef,
  onDrawOrRecycle,
  onClickWaste,
  onClickTableau,
  onClickFoundation,
}: GameBoardProps) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-3 px-2 sm:px-4">
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        <StockView stock={game.stock} onClick={onDrawOrRecycle} />
        <WasteView
          waste={game.waste}
          selected={selection?.zone === "waste"}
          hidden={hiddenCardIds.has(game.waste[game.waste.length - 1]?.id ?? "")}
          bindDragHandle={bindDragHandle}
          onClick={onClickWaste}
        />
        <div aria-hidden="true" />
        {SUITS.map((suit) => (
          <FoundationView
            key={suit}
            suit={suit}
            pile={game.foundations[suit]}
            onClick={() => onClickFoundation(suit)}
          />
        ))}
      </div>

      <TableauView
        tableau={game.tableau}
        selection={selection}
        hiddenCardIds={hiddenCardIds}
        bindDragHandle={bindDragHandle}
        onClickCard={onClickTableau}
      />

      <DragGhost visual={dragVisual} rootRef={ghostRef} />
    </div>
  );
}
