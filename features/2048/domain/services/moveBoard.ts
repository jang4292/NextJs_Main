import { cloneBoard, type Board } from "../entities/Board";
import type { Direction } from "../entities/Direction";
import { getLines, type Cell } from "../rules/lines";
import { moveRowLeft } from "../rules/moveRowLeft";

export interface CellTrace {
  type: "move" | "merge";
  from: Cell[];
  to: Cell;
  value: number;
}

export interface MoveBoardResult {
  board: Board;
  scoreGained: number;
  moved: boolean;
  traces: CellTrace[];
}

/**
 * Applies the left-compaction algorithm to every row/column line for the
 * given direction. Returns the exact same board reference (not a clone)
 * when nothing changes, so callers can skip spawning a new tile on a no-op
 * move using referential equality.
 */
export function moveBoard(board: Board, direction: Direction): MoveBoardResult {
  const size = board.length;
  const lines = getLines(direction, size);
  const nextBoard = cloneBoard(board);
  const traces: CellTrace[] = [];
  let moved = false;
  let scoreGained = 0;

  for (const line of lines) {
    const values = line.map(({ row, col }) => board[row][col]);
    const result = moveRowLeft(values);

    if (result.moved) moved = true;
    scoreGained += result.scoreGained;

    line.forEach((cell, index) => {
      nextBoard[cell.row][cell.col] = result.row[index];
    });

    for (const cellTrace of result.trace) {
      traces.push({
        type: cellTrace.type,
        from: cellTrace.fromIndices.map((index) => line[index]),
        to: line[cellTrace.toIndex],
        value: cellTrace.value,
      });
    }
  }

  if (!moved) {
    return { board, scoreGained: 0, moved: false, traces: [] };
  }

  return { board: nextBoard, scoreGained, moved: true, traces };
}
