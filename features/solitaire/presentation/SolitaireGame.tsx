"use client";

import { useSolitaireGame } from "./hooks/useSolitaireGame";
import { GameBoard } from "./GameBoard";
import { GameControls } from "./GameControls";

export function SolitaireGame() {
  const { game, selection, newGame, drawOrRecycle, clickTableau, clickWaste, clickFoundation } =
    useSolitaireGame();

  return (
    <div className="flex flex-col gap-3 py-3">
      <GameControls won={game.status === "won"} onNewGame={newGame} />
      <GameBoard
        game={game}
        selection={selection}
        onDrawOrRecycle={drawOrRecycle}
        onClickWaste={clickWaste}
        onClickTableau={clickTableau}
        onClickFoundation={clickFoundation}
      />
    </div>
  );
}
