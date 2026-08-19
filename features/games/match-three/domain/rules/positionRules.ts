import type { BoardSize } from "../entities/Board";
import type { Direction, Position } from "../entities/Position";

export function positionKey(position: Position): string {
  return `${position.row}:${position.column}`;
}

export function arePositionsEqual(first: Position, second: Position): boolean {
  return first.row === second.row && first.column === second.column;
}

export function isWithinBoard(
  position: Position,
  { rows, columns }: BoardSize,
): boolean {
  return (
    position.row >= 0 &&
    position.row < rows &&
    position.column >= 0 &&
    position.column < columns
  );
}

export function areAdjacent(first: Position, second: Position): boolean {
  const rowDistance = Math.abs(first.row - second.row);
  const columnDistance = Math.abs(first.column - second.column);
  return rowDistance + columnDistance === 1;
}

export function movePosition(
  position: Position,
  direction: Direction,
): Position {
  switch (direction) {
    case "UP":
      return { row: position.row - 1, column: position.column };
    case "DOWN":
      return { row: position.row + 1, column: position.column };
    case "LEFT":
      return { row: position.row, column: position.column - 1 };
    case "RIGHT":
      return { row: position.row, column: position.column + 1 };
  }
}
