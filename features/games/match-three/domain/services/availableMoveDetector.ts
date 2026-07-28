import {
  getBoardSize,
  getCell,
  swapBoardCells,
  type Board,
} from "../entities/Board";
import type { Position } from "../entities/Position";
import { isWithinBoard } from "../rules/positionRules";
import { findMatches } from "./matchDetector";

export interface AvailableMove {
  from: Position;
  to: Position;
}

const CANDIDATE_OFFSETS = [
  { row: 0, column: 1 },
  { row: 1, column: 0 },
] as const;

export function findAvailableMove(board: Board): AvailableMove | null {
  const size = getBoardSize(board);

  for (let row = 0; row < size.rows; row++) {
    for (let column = 0; column < size.columns; column++) {
      const from = { row, column };
      const fromTile = getCell(board, from);
      if (!fromTile) continue;

      for (const offset of CANDIDATE_OFFSETS) {
        const to = {
          row: row + offset.row,
          column: column + offset.column,
        };
        if (!isWithinBoard(to, size) || !getCell(board, to)) continue;
        if (fromTile.type === getCell(board, to)?.type) continue;

        const swapped = swapBoardCells(board, from, to);
        if (findMatches(swapped).length > 0) return { from, to };
      }
    }
  }

  return null;
}

export function hasAvailableMove(board: Board): boolean {
  return findAvailableMove(board) !== null;
}
