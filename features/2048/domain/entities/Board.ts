export const BOARD_SIZE = 4;

export type Board = number[][];

export function createEmptyBoard(size: number = BOARD_SIZE): Board {
  return Array.from({ length: size }, () => Array(size).fill(0));
}

export function cloneBoard(board: Board): Board {
  return board.map((row) => [...row]);
}

export interface BoardCell {
  row: number;
  col: number;
}

export function getEmptyCells(board: Board): BoardCell[] {
  const cells: BoardCell[] = [];
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      if (board[row][col] === 0) cells.push({ row, col });
    }
  }
  return cells;
}
