export type Rng = () => number;

export function randomIndex(length: number, rng: Rng): number {
  if (length <= 0) {
    throw new Error("Cannot pick a random index from an empty collection.");
  }

  const value = rng();
  const normalized = Number.isFinite(value)
    ? Math.max(0, Math.min(0.999_999_999, value))
    : 0;

  return Math.floor(normalized * length);
}
