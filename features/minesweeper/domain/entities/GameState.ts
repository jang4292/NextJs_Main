import type { Board } from "./Board";
import type { Difficulty } from "./Difficulty";
import type { GameStatus } from "./GameStatus";

/** Internal engine state. See MinesweeperGame.ts for the public, read-only GameSnapshot. */
export interface GameState {
  board: Board;
  status: GameStatus;
  difficulty: Difficulty;
  minesPlaced: boolean;
}
