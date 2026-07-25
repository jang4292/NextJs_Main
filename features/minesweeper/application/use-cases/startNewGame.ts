import { BEGINNER, type Difficulty } from "../../domain/entities/Difficulty";
import type { GameState } from "../../domain/entities/GameState";
import { createBoard } from "../../domain/services/createBoard";

export function startNewGame(difficulty: Difficulty = BEGINNER): GameState {
  return {
    board: createBoard(difficulty),
    status: "ready",
    difficulty,
    minesPlaced: false,
  };
}
