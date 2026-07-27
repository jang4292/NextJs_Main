"use client";

import { useSolitaireInteractions } from "./interaction/useSolitaireInteractions";
import { GameBoard } from "./GameBoard";
import { GameControls } from "./GameControls";

export function SolitaireGame() {
  const {
    game,
    selection,
    newGame,
    drawOrRecycle,
    clickTableau,
    clickWaste,
    clickFoundation,
    hiddenCardIds,
    bindDragHandle,
    dragVisual,
    ghostRef,
  } = useSolitaireInteractions();

  return (
    <div className="flex flex-col gap-3 py-3">
      <GameControls won={game.status === "won"} onNewGame={newGame} />
      <GameBoard
        game={game}
        selection={selection}
        hiddenCardIds={hiddenCardIds}
        bindDragHandle={bindDragHandle}
        dragVisual={dragVisual}
        ghostRef={ghostRef}
        onDrawOrRecycle={drawOrRecycle}
        onClickWaste={clickWaste}
        onClickTableau={clickTableau}
        onClickFoundation={clickFoundation}
      />
    </div>
  );
}
