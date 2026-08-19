import { DIFFICULTY_MULTIPLIERS } from "./difficulty.config";
import type { DifficultyLevel } from "./typing.types";

export const BASE_SCORE = 100;
export const COMBO_BONUS_STEP = 10;

export function calculateComboBonus(combo: number): number {
  return Math.max(0, combo) * COMBO_BONUS_STEP;
}

export function calculateScore({
  combo,
  difficulty,
}: {
  combo: number;
  difficulty: DifficultyLevel;
}): number {
  return Math.round(
    (BASE_SCORE + calculateComboBonus(combo)) *
      DIFFICULTY_MULTIPLIERS[difficulty],
  );
}
