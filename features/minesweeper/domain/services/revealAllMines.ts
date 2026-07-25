import { cloneBoard, type Board } from "../entities/Board";

/** Reveals every mine cell. Used when the player hits a mine and loses. */
export function revealAllMines(board: Board): Board {
  const nextBoard = cloneBoard(board);

  for (const row of nextBoard) {
    for (const cell of row) {
      if (cell.isMine) cell.isRevealed = true;
    }
  }

  return nextBoard;
}
