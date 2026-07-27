import type { SudokuBoard } from "../entities/Board";
import type { CellPosition } from "../entities/CellPosition";
import {
  getBoxPositions,
  getColumnPositions,
  getRowPositions,
} from "./unitRules";

export interface HighlightState {
  readonly peers: Set<string>;
  readonly sameValue: Set<string>;
}

function positionKey(position: CellPosition): string {
  return `${position.row}-${position.column}`;
}

const EMPTY_HIGHLIGHT: HighlightState = {
  peers: new Set(),
  sameValue: new Set(),
};

/** Computes which cells to highlight for the selected cell: its row/column/box peers and cells sharing its value. */
export function getHighlightState(
  board: SudokuBoard,
  selected: CellPosition | null,
): HighlightState {
  if (!selected) return EMPTY_HIGHLIGHT;

  const peers = new Set<string>();
  for (const position of [
    ...getRowPositions(selected.row),
    ...getColumnPositions(selected.column),
    ...getBoxPositions(selected),
  ]) {
    peers.add(positionKey(position));
  }

  const selectedCell = board[selected.row][selected.column];
  const sameValue = new Set<string>();
  if (selectedCell.value !== 0) {
    for (const row of board) {
      for (const cell of row) {
        if (cell.value === selectedCell.value) {
          sameValue.add(positionKey(cell));
        }
      }
    }
  }

  return { peers, sameValue };
}
