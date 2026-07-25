import { cloneBoard, type Board } from "../entities/Board";
import { positionKey, type Position } from "../entities/Position";
import { getNeighborPositions } from "../rules/boardQueries";

/**
 * Reveals the cell at `start`. If it has no adjacent mines, iteratively
 * flood-fills connected safe cells via an explicit queue - no recursion, no
 * revisits (visited set). Never floods through a flagged or mined cell; if
 * `start` itself is a mine, only that single cell is revealed.
 */
export function floodReveal(board: Board, start: Position): Board {
  const nextBoard = cloneBoard(board);
  const visited = new Set<string>();
  const queue: Position[] = [start];

  while (queue.length > 0) {
    const position = queue.shift()!;
    const key = positionKey(position);
    if (visited.has(key)) continue;
    visited.add(key);

    const cell = nextBoard[position.row][position.column];
    if (cell.isFlagged || cell.isRevealed) continue;

    cell.isRevealed = true;
    if (cell.isMine) continue;

    if (cell.adjacentMines === 0) {
      for (const neighbor of getNeighborPositions(nextBoard, position)) {
        const neighborCell = nextBoard[neighbor.row][neighbor.column];
        const alreadyQueued = visited.has(positionKey(neighbor));
        if (!alreadyQueued && !neighborCell.isRevealed && !neighborCell.isFlagged && !neighborCell.isMine) {
          queue.push(neighbor);
        }
      }
    }
  }

  return nextBoard;
}
