"use client";

import { cn } from "@/lib/utils";
import type { Board } from "../domain/entities/Board";
import type { GameStatus } from "../domain/entities/GameStatus";
import { CellView } from "./CellView";
import type { useCellInteraction } from "./interaction/useCellInteraction";
import styles from "./styles/minesweeper.module.css";

interface BoardViewProps {
  board: Board;
  status: GameStatus;
  interaction: ReturnType<typeof useCellInteraction>;
}

export function BoardView({ board, status, interaction }: BoardViewProps) {
  const columns = board[0]?.length ?? 0;

  return (
    <div
      className={cn("mx-auto grid w-full gap-1 rounded-lg p-2", styles.board)}
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      data-status={status}
      role="group"
      aria-label="지뢰찾기 보드"
    >
      {board.map((row) =>
        row.map((cell) => <CellView key={`${cell.row}-${cell.column}`} cell={cell} interaction={interaction} />),
      )}
    </div>
  );
}
