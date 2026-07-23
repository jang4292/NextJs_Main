export type Rank =
  | "A"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "J"
  | "Q"
  | "K";

export const RANKS: readonly Rank[] = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
];

export function rankValue(rank: Rank): number {
  return RANKS.indexOf(rank) + 1;
}

export function nextRank(rank: Rank): Rank | null {
  const index = RANKS.indexOf(rank);
  return index >= 0 && index < RANKS.length - 1 ? RANKS[index + 1] : null;
}
