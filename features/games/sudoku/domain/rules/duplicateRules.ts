import type { SudokuBoard } from "../entities/Board";
import type { CellPosition } from "../entities/CellPosition";
import {
  getBoxPositions,
  getColumnPositions,
  getRowPositions,
} from "./unitRules";

function positionKey(position: CellPosition): string {
  return `${position.row}-${position.column}`;
}

function allUnits(): CellPosition[][] {
  const units: CellPosition[][] = [];
  for (let i = 0; i < 9; i++) units.push(getRowPositions(i));
  for (let i = 0; i < 9; i++) units.push(getColumnPositions(i));
  for (let boxRow = 0; boxRow < 9; boxRow += 3) {
    for (let boxColumn = 0; boxColumn < 9; boxColumn += 3) {
      units.push(getBoxPositions({ row: boxRow, column: boxColumn }));
    }
  }
  return units;
}

/**
 * Positions whose entered value duplicates another value within the same
 * row/column/box. Fixed (given) cells are never reported - only cells the
 * player entered can be flagged as erroneous.
 */
export function computeErrorPositions(board: SudokuBoard): CellPosition[] {
  const errorKeys = new Set<string>();

  for (const unit of allUnits()) {
    const positionsByValue = new Map<number, CellPosition[]>();
    for (const position of unit) {
      const cell = board[position.row][position.column];
      if (cell.value === 0) continue;
      const positions = positionsByValue.get(cell.value) ?? [];
      positions.push(position);
      positionsByValue.set(cell.value, positions);
    }

    for (const positions of positionsByValue.values()) {
      if (positions.length <= 1) continue;
      for (const position of positions) {
        const cell = board[position.row][position.column];
        if (!cell.isFixed) {
          errorKeys.add(positionKey(position));
        }
      }
    }
  }

  return Array.from(errorKeys, (key) => {
    const [row, column] = key.split("-").map(Number);
    return { row, column };
  });
}

/** Returns a new board with each cell's `isError` flag recomputed. */
export function applyErrorFlags(board: SudokuBoard): SudokuBoard {
  const errorKeys = new Set(computeErrorPositions(board).map(positionKey));
  return board.map((row) =>
    row.map((cell) => ({ ...cell, isError: errorKeys.has(positionKey(cell)) })),
  );
}
