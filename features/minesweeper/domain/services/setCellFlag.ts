import { cloneBoard, type Board } from "../entities/Board";
import type { Position } from "../entities/Position";
import { canToggleFlag } from "../rules/cellGuards";

/** Toggles the flag on a closed cell. Returns the same board reference (no-op) for a revealed cell. */
export function setCellFlag(board: Board, position: Position): Board {
  const cell = board[position.row][position.column];
  if (!canToggleFlag(cell)) return board;

  const nextBoard = cloneBoard(board);
  nextBoard[position.row][position.column].isFlagged = !cell.isFlagged;
  return nextBoard;
}
