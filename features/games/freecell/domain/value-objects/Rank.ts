export const MIN_RANK = 1;
export const MAX_RANK = 13;

export const RANKS: readonly number[] = Array.from(
  { length: MAX_RANK - MIN_RANK + 1 },
  (_, index) => index + MIN_RANK,
);

const RANK_LABELS: Record<number, string> = {
  1: "A",
  11: "J",
  12: "Q",
  13: "K",
};

export function rankLabel(rank: number): string {
  return RANK_LABELS[rank] ?? String(rank);
}
