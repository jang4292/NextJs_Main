import { cloneBoard, type Board } from "../entities/Board";
import { getNeighborPositions } from "../rules/boardQueries";

export function calculateAdjacentMines(board: Board): Board {
  const nextBoard = cloneBoard(board);

  for (const row of nextBoard) {
    for (const cell of row) {
      if (cell.isMine) continue;

      const neighbors = getNeighborPositions(nextBoard, { row: cell.row, column: cell.column });
      cell.adjacentMines = neighbors.filter((n) => nextBoard[n.row][n.column].isMine).length;
    }
  }

  return nextBoard;
}
