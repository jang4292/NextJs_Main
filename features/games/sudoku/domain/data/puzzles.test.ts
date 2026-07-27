import { describe, expect, it } from "vitest";
import { SUDOKU_PUZZLES } from "./puzzles";

const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

function isCompleteUnit(values: readonly number[]): boolean {
  return DIGITS.every((digit) => values.includes(digit)) && values.length === 9;
}

function isValidSolution(solution: SudokuPuzzleGrid): boolean {
  for (let i = 0; i < 9; i++) {
    const row = solution[i];
    const column = solution.map((r) => r[i]);
    if (!isCompleteUnit(row) || !isCompleteUnit(column)) return false;
  }

  for (let boxRow = 0; boxRow < 9; boxRow += 3) {
    for (let boxCol = 0; boxCol < 9; boxCol += 3) {
      const box: number[] = [];
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          box.push(solution[boxRow + r][boxCol + c]);
        }
      }
      if (!isCompleteUnit(box)) return false;
    }
  }

  return true;
}

type SudokuPuzzleGrid = readonly (readonly number[])[];

describe("SUDOKU_PUZZLES", () => {
  it("provides at least 3 puzzles", () => {
    expect(SUDOKU_PUZZLES.length).toBeGreaterThanOrEqual(3);
  });

  it("has unique ids", () => {
    const ids = SUDOKU_PUZZLES.map((puzzle) => puzzle.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it.each(SUDOKU_PUZZLES.map((puzzle) => [puzzle.id, puzzle] as const))(
    "%s has a 9x9 puzzle and solution",
    (_id, puzzle) => {
      expect(puzzle.puzzle).toHaveLength(9);
      expect(puzzle.solution).toHaveLength(9);
      puzzle.puzzle.forEach((row) => expect(row).toHaveLength(9));
      puzzle.solution.forEach((row) => expect(row).toHaveLength(9));
    },
  );

  it.each(SUDOKU_PUZZLES.map((puzzle) => [puzzle.id, puzzle] as const))(
    "%s has a fully valid solution grid",
    (_id, puzzle) => {
      expect(isValidSolution(puzzle.solution)).toBe(true);
    },
  );

  it.each(SUDOKU_PUZZLES.map((puzzle) => [puzzle.id, puzzle] as const))(
    "%s puzzle givens match the solution",
    (_id, puzzle) => {
      for (let row = 0; row < 9; row++) {
        for (let column = 0; column < 9; column++) {
          const given = puzzle.puzzle[row][column];
          if (given !== 0) {
            expect(given).toBe(puzzle.solution[row][column]);
          }
        }
      }
    },
  );

  it.each(SUDOKU_PUZZLES.map((puzzle) => [puzzle.id, puzzle] as const))(
    "%s has between 17 and 64 given cells",
    (_id, puzzle) => {
      const givenCount = puzzle.puzzle
        .flat()
        .filter((value) => value !== 0).length;
      expect(givenCount).toBeGreaterThanOrEqual(17);
      expect(givenCount).toBeLessThanOrEqual(64);
    },
  );

  it("has at least one empty cell per puzzle", () => {
    for (const puzzle of SUDOKU_PUZZLES) {
      expect(puzzle.puzzle.flat().some((value) => value === 0)).toBe(true);
    }
  });
});
