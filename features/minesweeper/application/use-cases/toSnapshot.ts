import { cloneBoard } from "../../domain/entities/Board";
import type { GameState } from "../../domain/entities/GameState";
import { countRemainingMines } from "../../domain/rules/boardQueries";
import type { GameSnapshot } from "../GameSnapshot";

export function toSnapshot(state: GameState): GameSnapshot {
  return {
    board: cloneBoard(state.board),
    status: state.status,
    remainingMines: countRemainingMines(state.board, state.difficulty.mineCount),
  };
}
