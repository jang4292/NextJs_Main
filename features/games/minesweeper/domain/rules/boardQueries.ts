import type { Board } from "../entities/Board";
import type { Position } from "../entities/Position";

export function countMines(board: Board): number {
  let count = 0;
  for (const row of board) {
    for (const cell of row) {
      if (cell.isMine) count++;
    }
  }
  return count;
}

export function countFlags(board: Board): number {
  let count = 0;
  for (const row of board) {
    for (const cell of row) {
      if (cell.isFlagged) count++;
    }
  }
  return count;
}

export function countRemainingMines(board: Board, mineCount: number): number {
  return mineCount - countFlags(board);
}

/** 8-directional neighbors, bounds-checked against the board's own size. */
export function getNeighborPositions(
  board: Board,
  position: Position,
): Position[] {
  const rows = board.length;
  const columns = board[0]?.length ?? 0;
  const neighbors: Position[] = [];

  for (let dRow = -1; dRow <= 1; dRow++) {
    for (let dColumn = -1; dColumn <= 1; dColumn++) {
      if (dRow === 0 && dColumn === 0) continue;

      const row = position.row + dRow;
      const column = position.column + dColumn;
      if (row >= 0 && row < rows && column >= 0 && column < columns) {
        neighbors.push({ row, column });
      }
    }
  }

  return neighbors;
}

/** All non-mine cells are revealed. Flags are a UI aid and play no part in this. */
export function isWon(board: Board): boolean {
  return board.every((row) =>
    row.every((cell) => cell.isMine || cell.isRevealed),
  );
}
