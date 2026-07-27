import { createEmptyBoard, type Board } from "./domain/entities/Board";

/** Returns a deterministic RNG that yields `sequence` in order, then throws if exhausted. */
export function fixedRng(sequence: number[]): () => number {
  let index = 0;
  return () => {
    if (index >= sequence.length) {
      throw new Error(
        "fixedRng exhausted: not enough values queued for this test",
      );
    }
    return sequence[index++];
  };
}

/**
 * Builds a Board from a layout of equal-length strings: "*" places a mine,
 * any other character is a safe cell. Does not compute adjacentMines - call
 * calculateAdjacentMines separately so that function stays independently
 * testable.
 */
export function boardFromLayout(layout: string[]): Board {
  const rows = layout.length;
  const columns = layout[0]?.length ?? 0;
  const board = createEmptyBoard(rows, columns);

  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      board[row][column].isMine = layout[row][column] === "*";
    }
  }

  return board;
}
