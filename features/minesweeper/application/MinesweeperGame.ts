import { BEGINNER, type Difficulty } from "../domain/entities/Difficulty";
import type { Position } from "../domain/entities/Position";
import type { GameSnapshot } from "./GameSnapshot";
import { restartGame } from "./use-cases/restartGame";
import { revealCell } from "./use-cases/revealCell";
import { startNewGame } from "./use-cases/startNewGame";
import { toggleFlag as toggleFlagUseCase } from "./use-cases/toggleFlag";
import { toSnapshot } from "./use-cases/toSnapshot";

export interface MinesweeperGame {
  start(): GameSnapshot;
  reveal(position: Position): GameSnapshot;
  toggleFlag(position: Position): GameSnapshot;
  restart(): GameSnapshot;
  getSnapshot(): GameSnapshot;
}

/**
 * Framework-independent facade over the same use-cases the React
 * (`useMinesweeper`) hook calls directly - no React/DOM dependency, so it
 * can be driven from any host (e.g. a future Cocos Creator scene) by calling
 * these methods directly, one input at a time.
 */
export function createMinesweeperGame(
  difficulty: Difficulty = BEGINNER,
  rng: () => number = Math.random,
): MinesweeperGame {
  let state = startNewGame(difficulty);

  return {
    start() {
      state = startNewGame(difficulty);
      return toSnapshot(state);
    },
    reveal(position: Position) {
      state = revealCell(state, position, rng);
      return toSnapshot(state);
    },
    toggleFlag(position: Position) {
      state = toggleFlagUseCase(state, position);
      return toSnapshot(state);
    },
    restart() {
      state = restartGame(state);
      return toSnapshot(state);
    },
    getSnapshot() {
      return toSnapshot(state);
    },
  };
}
