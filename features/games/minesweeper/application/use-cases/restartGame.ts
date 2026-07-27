import type { GameState } from "../../domain/entities/GameState";
import { startNewGame } from "./startNewGame";

export function restartGame(state: GameState): GameState {
  return startNewGame(state.difficulty);
}
