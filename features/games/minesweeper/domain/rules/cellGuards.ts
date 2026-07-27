import type { Cell } from "../entities/Cell";
import type { GameStatus } from "../entities/GameStatus";

export function canReveal(cell: Cell): boolean {
  return !cell.isRevealed && !cell.isFlagged;
}

export function canToggleFlag(cell: Cell): boolean {
  return !cell.isRevealed;
}

export function isInputLocked(status: GameStatus): boolean {
  return status === "won" || status === "lost";
}
