import { BOX_SIZE } from "../entities/Board";
import type { CellPosition } from "../entities/CellPosition";

export function getBoxIndex(position: CellPosition): number {
  const boxRow = Math.floor(position.row / BOX_SIZE);
  const boxColumn = Math.floor(position.column / BOX_SIZE);
  return boxRow * BOX_SIZE + boxColumn;
}

export function isSameRow(a: CellPosition, b: CellPosition): boolean {
  return a.row === b.row;
}

export function isSameColumn(a: CellPosition, b: CellPosition): boolean {
  return a.column === b.column;
}

export function isSameBox(a: CellPosition, b: CellPosition): boolean {
  return getBoxIndex(a) === getBoxIndex(b);
}

export function isPeer(a: CellPosition, b: CellPosition): boolean {
  return isSameRow(a, b) || isSameColumn(a, b) || isSameBox(a, b);
}

export function getRowPositions(row: number): CellPosition[] {
  return Array.from({ length: 9 }, (_, column) => ({ row, column }));
}

export function getColumnPositions(column: number): CellPosition[] {
  return Array.from({ length: 9 }, (_, row) => ({ row, column }));
}

export function getBoxPositions(seed: CellPosition): CellPosition[] {
  const boxRow = Math.floor(seed.row / BOX_SIZE) * BOX_SIZE;
  const boxColumn = Math.floor(seed.column / BOX_SIZE) * BOX_SIZE;
  const positions: CellPosition[] = [];
  for (let r = 0; r < BOX_SIZE; r++) {
    for (let c = 0; c < BOX_SIZE; c++) {
      positions.push({ row: boxRow + r, column: boxColumn + c });
    }
  }
  return positions;
}
