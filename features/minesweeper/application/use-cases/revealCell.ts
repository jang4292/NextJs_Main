import type { GameState } from "../../domain/entities/GameState";
import type { Position } from "../../domain/entities/Position";
import { isWon } from "../../domain/rules/boardQueries";
import { canReveal, isInputLocked } from "../../domain/rules/cellGuards";
import { calculateAdjacentMines } from "../../domain/services/calculateAdjacentMines";
import { floodReveal } from "../../domain/services/floodReveal";
import { placeMines } from "../../domain/services/placeMines";
import { revealAllMines } from "../../domain/services/revealAllMines";

/**
 * Reveals a cell, deferring mine placement until this first reveal (the
 * clicked cell is guaranteed safe). Floods connected zero cells, and ends
 * the game on a mine hit (lost) or once every safe cell is open (won).
 */
export function revealCell(state: GameState, position: Position, rng: () => number = Math.random): GameState {
  if (isInputLocked(state.status)) return state;

  const targetCell = state.board[position.row][position.column];
  if (!canReveal(targetCell)) return state;

  let board = state.board;
  let minesPlaced = state.minesPlaced;

  if (!minesPlaced) {
    board = placeMines(board, state.difficulty.mineCount, [position], rng);
    board = calculateAdjacentMines(board);
    minesPlaced = true;
  }

  board = floodReveal(board, position);

  const hitMine = board[position.row][position.column].isMine;
  if (hitMine) {
    return { ...state, board: revealAllMines(board), minesPlaced, status: "lost" };
  }

  return { ...state, board, minesPlaced, status: isWon(board) ? "won" : "playing" };
}
