"use client";

import type { SudokuBoard as SudokuBoardGrid } from "../domain/entities/Board";
import type { CellPosition } from "../domain/entities/CellPosition";
import type { SudokuGameStatus } from "../domain/entities/GameStatus";
import { getHighlightState } from "../domain/rules/highlightRules";
import { SudokuCellView } from "./SudokuCellView";
import styles from "./styles/sudoku.module.css";

interface SudokuBoardProps {
  board: SudokuBoardGrid;
  selectedCell: CellPosition | null;
  status: SudokuGameStatus;
  onSelectCell: (position: CellPosition) => void;
}

function positionKey(position: CellPosition): string {
  return `${position.row}-${position.column}`;
}

export function SudokuBoard({
  board,
  selectedCell,
  status,
  onSelectCell,
}: SudokuBoardProps) {
  const { peers, sameValue } = getHighlightState(board, selectedCell);

  return (
    <div className={styles.boardWrapper}>
      <div className={styles.board}>
        {board.map((row) =>
          row.map((cell) => {
            const position: CellPosition = {
              row: cell.row,
              column: cell.column,
            };
            const isSelected =
              selectedCell !== null &&
              selectedCell.row === cell.row &&
              selectedCell.column === cell.column;

            return (
              <SudokuCellView
                key={positionKey(position)}
                cell={cell}
                isSelected={isSelected}
                isPeer={!isSelected && peers.has(positionKey(position))}
                isSameValue={
                  !isSelected && sameValue.has(positionKey(position))
                }
                onSelect={() => onSelectCell(position)}
              />
            );
          }),
        )}
      </div>

      {status === "paused" && (
        <div className={styles.pauseOverlay} role="status" aria-live="polite">
          <p className="text-lg font-semibold">일시정지됨</p>
          <p className="text-muted-foreground text-sm">
            재개 버튼을 눌러 계속하세요
          </p>
        </div>
      )}
    </div>
  );
}
