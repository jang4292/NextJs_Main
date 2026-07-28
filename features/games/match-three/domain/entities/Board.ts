import type { Position } from "./Position";
import type { Tile } from "./Tile";

export type BoardCell = Tile | null;
export type Board = BoardCell[][];

export interface BoardSize {
  rows: number;
  columns: number;
}

export function createEmptyBoard(rows: number, columns: number): Board {
  return Array.from({ length: rows }, () =>
    Array.from({ length: columns }, () => null as BoardCell),
  );
}

export function cloneBoard(board: Board): Board {
  return board.map((row) => [...row]);
}

export function getBoardSize(board: Board): BoardSize {
  return {
    rows: board.length,
    columns: board[0]?.length ?? 0,
  };
}

export function getCell(board: Board, position: Position): BoardCell {
  return board[position.row]?.[position.column] ?? null;
}

export function swapBoardCells(
  board: Board,
  first: Position,
  second: Position,
): Board {
  const next = cloneBoard(board);
  const firstCell = getCell(next, first);
  next[first.row][first.column] = getCell(next, second);
  next[second.row][second.column] = firstCell;
  return next;
}

export function removeBoardPositions(
  board: Board,
  positions: readonly Position[],
): Board {
  const next = cloneBoard(board);
  for (const position of positions) {
    next[position.row][position.column] = null;
  }
  return next;
}
