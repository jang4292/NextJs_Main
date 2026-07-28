import type { Board } from "./Board";

export type GamePhase =
  | "initializing"
  | "idle"
  | "selecting"
  | "swapping"
  | "checking"
  | "removing"
  | "falling"
  | "refilling"
  | "cascading"
  | "shuffling"
  | "completed"
  | "failed";

export interface GameSession {
  board: Board;
  score: number;
  movesRemaining: number;
  phase: GamePhase;
}
