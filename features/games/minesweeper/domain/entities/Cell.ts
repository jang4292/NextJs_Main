export interface Cell {
  row: number;
  column: number;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  /** Count of mined neighbors (0-8). Only meaningful when isMine is false. */
  adjacentMines: number;
}
