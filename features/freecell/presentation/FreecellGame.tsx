"use client";

import { SUITS } from "../domain/value-objects/Suit";
import type { CardLocation } from "../domain/entities/Move";
import { usePersistedFreecell } from "./hooks/usePersistedFreecell";
import { useFreecellInteractions } from "./interaction/useFreecellInteractions";
import { GameHeader } from "./GameHeader";
import { GameControls } from "./GameControls";
import { FreeCellSlot } from "./FreeCellSlot";
import { FoundationSlot } from "./FoundationSlot";
import { TableauColumn } from "./TableauColumn";
import { WinDialog } from "./WinDialog";
import styles from "./styles/freecell.module.css";

export function FreecellGame() {
  const { game, selection, canUndo, newGame, restart, undo, selectOrMove, commitMove } =
    usePersistedFreecell();

  const { bindDragHandle, consumeSuppressedClick } = useFreecellInteractions({
    game,
    isLocked: game.status === "won",
    onCommit: commitMove,
  });

  function handleLocationClick(location: CardLocation) {
    if (consumeSuppressedClick()) return;
    selectOrMove(location);
  }

  return (
    <div className={`flex flex-col gap-3 py-3 ${styles.board}`}>
      <GameHeader elapsedSeconds={game.elapsedSeconds} moveCount={game.moveCount} />
      <GameControls canUndo={canUndo} onNewGame={newGame} onRestart={restart} onUndo={undo} />

      <div className="mx-auto grid w-full max-w-3xl grid-cols-8 gap-1.5 px-2 sm:gap-2 sm:px-4">
        {game.freeCells.map((freeCellCard, slotIndex) => (
          <FreeCellSlot
            key={slotIndex}
            slotIndex={slotIndex}
            card={freeCellCard}
            selection={selection}
            bindDragHandle={bindDragHandle}
            onClick={() => handleLocationClick({ type: "freeCell", slotIndex })}
          />
        ))}
        {SUITS.map((suit) => (
          <FoundationSlot
            key={suit}
            suit={suit}
            pile={game.foundations[suit]}
            selection={selection}
            onClick={() => handleLocationClick({ type: "foundation", suit })}
          />
        ))}
      </div>

      <div className="mx-auto grid w-full max-w-3xl grid-cols-8 gap-1.5 px-2 sm:gap-2 sm:px-4">
        {game.tableau.map((pile, columnIndex) => (
          <TableauColumn
            key={columnIndex}
            columnIndex={columnIndex}
            pile={pile}
            selection={selection}
            bindDragHandle={bindDragHandle}
            onClickCard={(column, cardIndex) =>
              handleLocationClick({ type: "tableau", columnIndex: column, cardIndex })
            }
          />
        ))}
      </div>

      {game.status === "won" && (
        <WinDialog
          moveCount={game.moveCount}
          elapsedSeconds={game.elapsedSeconds}
          onNewGame={newGame}
          onRestart={restart}
        />
      )}
    </div>
  );
}
