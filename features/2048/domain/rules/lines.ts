import type { Direction } from "../entities/Direction";

export interface Cell {
  row: number;
  col: number;
}

/**
 * Coordinate paths for a board of the given size, one per row/column,
 * ordered so index 0 is always the edge tiles pile up against for that
 * direction. This lets a single left-compaction algorithm (moveRowLeft)
 * drive all four directions without duplicating merge logic.
 */
export function getLines(direction: Direction, size: number): Cell[][] {
  const lines: Cell[][] = [];

  if (direction === "LEFT") {
    for (let row = 0; row < size; row++) {
      lines.push(Array.from({ length: size }, (_, col) => ({ row, col })));
    }
  } else if (direction === "RIGHT") {
    for (let row = 0; row < size; row++) {
      lines.push(Array.from({ length: size }, (_, i) => ({ row, col: size - 1 - i })));
    }
  } else if (direction === "UP") {
    for (let col = 0; col < size; col++) {
      lines.push(Array.from({ length: size }, (_, row) => ({ row, col })));
    }
  } else {
    for (let col = 0; col < size; col++) {
      lines.push(Array.from({ length: size }, (_, i) => ({ row: size - 1 - i, col })));
    }
  }

  return lines;
}
