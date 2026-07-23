import type { GameState } from "../domain/entities/GameState";
import type { Suit } from "../domain/value-objects/Suit";
import { SUITS } from "../domain/value-objects/Suit";
import type { Selection } from "./hooks/useSolitaireGame";
import { StockView } from "./StockView";
import { WasteView } from "./WasteView";
import { FoundationView } from "./FoundationView";
import { TableauView } from "./TableauView";

interface GameBoardProps {
  game: GameState;
  selection: Selection;
  onDrawOrRecycle: () => void;
  onClickWaste: () => void;
  onClickTableau: (column: number, cardIndex: number) => void;
  onClickFoundation: (suit: Suit) => void;
}

export function GameBoard({
  game,
  selection,
  onDrawOrRecycle,
  onClickWaste,
  onClickTableau,
  onClickFoundation,
}: GameBoardProps) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-3 px-2 sm:px-4">
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        <StockView stock={game.stock} onClick={onDrawOrRecycle} />
        <WasteView waste={game.waste} selected={selection?.zone === "waste"} onClick={onClickWaste} />
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

      <TableauView tableau={game.tableau} selection={selection} onClickCard={onClickTableau} />
    </div>
  );
}
