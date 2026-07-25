import { cloneBoard, type Board } from "../entities/Board";
import { positionKey, type Position } from "../entities/Position";

/**
 * Places `mineCount` mines on random cells, excluding `safePositions`
 * (typically just the first-clicked cell). `rng` is injectable so callers
 * can test deterministically instead of depending on Math.random.
 */
export function placeMines(
  board: Board,
  mineCount: number,
  safePositions: Position[],
  rng: () => number = Math.random,
): Board {
  const safeKeys = new Set(safePositions.map(positionKey));
  const candidates: Position[] = [];
  for (const row of board) {
    for (const cell of row) {
      const position = { row: cell.row, column: cell.column };
      if (!safeKeys.has(positionKey(position))) candidates.push(position);
    }
  }

  const nextBoard = cloneBoard(board);
  const minesToPlace = Math.min(mineCount, candidates.length);

  for (let i = 0; i < minesToPlace; i++) {
    const index = Math.floor(rng() * candidates.length);
    const [picked] = candidates.splice(index, 1);
    nextBoard[picked.row][picked.column].isMine = true;
  }

  return nextBoard;
}
