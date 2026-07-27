import type { Cell } from "../domain/entities/Cell";
import type { GameStatus } from "../domain/entities/GameStatus";

/** Public, read-only projection of GameState - the shape any consumer (React or otherwise) should read. */
export interface GameSnapshot {
  board: readonly Cell[][];
  status: GameStatus;
  remainingMines: number;
}
