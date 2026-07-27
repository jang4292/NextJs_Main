import type { Board } from "../entities/Board";

export function hasEmptyCell(board: Board): boolean {
  return board.some((row) => row.some((value) => value === 0));
}

export function hasAdjacentEqualPair(board: Board): boolean {
  const size = board.length;

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const value = board[row][col];
      if (value === 0) continue;

      const right = col + 1 < size ? board[row][col + 1] : null;
      if (right === value) return true;

      const down = row + 1 < size ? board[row + 1][col] : null;
      if (down === value) return true;
    }
  }

  return false;
}

export function isGameOver(board: Board): boolean {
  return !hasEmptyCell(board) && !hasAdjacentEqualPair(board);
}

export function hasReachedTarget(board: Board, target = 2048): boolean {
  return board.some((row) => row.some((value) => value >= target));
}
