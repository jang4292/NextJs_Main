"use client";

import { GameControls } from "./GameControls";
import { GameHeader } from "./GameHeader";
import { useSudokuGame } from "./hooks/useSudokuGame";
import { useSudokuKeyboardInput } from "./interaction/useSudokuKeyboardInput";
import { NumberPad } from "./NumberPad";
import { SudokuBoard } from "./SudokuBoard";
import { WinDialog } from "./WinDialog";

export function SudokuGame() {
  const game = useSudokuGame();

  useSudokuKeyboardInput({
    onDigit: game.inputValue,
    onDelete: () => game.inputValue(0),
    onMove: game.moveSelection,
    onEscape: game.deselect,
  });

  const inputDisabled = game.status === "paused" || game.status === "completed";

  return (
    <div className="flex flex-col gap-4">
      <GameHeader
        elapsedSeconds={game.elapsedSeconds}
        errorCount={game.errorCount}
        status={game.status}
      />

      <SudokuBoard
        board={game.board}
        selectedCell={game.selectedCell}
        status={game.status}
        onSelectCell={game.selectCell}
      />

      <NumberPad
        onInput={game.inputValue}
        onClear={() => game.inputValue(0)}
        disabled={inputDisabled}
      />

      <GameControls
        status={game.status}
        onNewGame={game.newGame}
        onRestart={game.restart}
        onPause={game.pause}
        onResume={game.resume}
      />

      {game.status === "completed" && (
        <WinDialog
          elapsedSeconds={game.elapsedSeconds}
          errorCount={game.errorCount}
          onNewGame={game.newGame}
          onRestart={game.restart}
        />
      )}
    </div>
  );
}
