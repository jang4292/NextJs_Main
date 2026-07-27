import type { Board } from "./Board";

export type GameStatus = "playing" | "game-over";

export interface GameState {
  board: Board;
  score: number;
  status: GameStatus;
  hasWon: boolean;
}
