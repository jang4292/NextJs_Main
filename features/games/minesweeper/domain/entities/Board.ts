import type { Cell } from "./Cell";

/** Indexed as board[row][column]. */
export type Board = Cell[][];

export function createEmptyBoard(rows: number, columns: number): Board {
  return Array.from({ length: rows }, (_, row) =>
    Array.from({ length: columns }, (_, column) => ({
      row,
      column,
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      adjacentMines: 0,
    })),
  );
}

export function cloneBoard(board: Board): Board {
  return board.map((row) => row.map((cell) => ({ ...cell })));
}
