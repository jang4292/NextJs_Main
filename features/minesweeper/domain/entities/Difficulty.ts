export interface Difficulty {
  rows: number;
  columns: number;
  mineCount: number;
}

export const BEGINNER: Difficulty = { rows: 9, columns: 9, mineCount: 10 };
