import { createEmptyBoard, type Board } from "../entities/Board";
import type { Difficulty } from "../entities/Difficulty";

export function createBoard(difficulty: Difficulty): Board {
  return createEmptyBoard(difficulty.rows, difficulty.columns);
}
