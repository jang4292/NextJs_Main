"use client";

import { BoardView } from "./BoardView";
import { useMinesweeper } from "./hooks/useMinesweeper";
import { useCellInteraction } from "./interaction/useCellInteraction";
import { MinesweeperControls } from "./MinesweeperControls";
import { MinesweeperHeader } from "./MinesweeperHeader";
import { ResultBanner } from "./ResultBanner";

export function Minesweeper() {
  const { board, status, remainingMines, elapsedSeconds, flagMode, reveal, toggleFlag, restart, toggleFlagMode } =
    useMinesweeper();

  const interaction = useCellInteraction({ flagMode, onReveal: reveal, onToggleFlag: toggleFlag });

  return (
    <div className="mx-auto flex w-full flex-col items-center px-4 py-6">
      <div className="w-full max-w-[520px]">
        <MinesweeperHeader
          remainingMines={remainingMines}
          elapsedSeconds={elapsedSeconds}
          status={status}
          onRestart={restart}
        />

        <div className="relative mx-auto w-[min(92vw,480px)]">
          <BoardView board={board} status={status} interaction={interaction} />
          <ResultBanner status={status} onRestart={restart} />
        </div>

        <MinesweeperControls flagMode={flagMode} onToggleFlagMode={toggleFlagMode} />
      </div>
    </div>
  );
}
