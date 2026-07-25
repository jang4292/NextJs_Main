/**
 * (emptyFreeCellCount + 1) * 2 ^ usableEmptyTableauCount cards can move as one
 * "supermove". When the destination column is itself empty, it must be
 * excluded from the empty-tableau count -- it is the target, not a buffer.
 */
export function calculateMoveCapacity(
  emptyFreeCellCount: number,
  emptyTableauCount: number,
  destinationIsEmpty: boolean,
): number {
  const usableEmptyTableauCount = destinationIsEmpty
    ? Math.max(emptyTableauCount - 1, 0)
    : emptyTableauCount;

  return (emptyFreeCellCount + 1) * 2 ** usableEmptyTableauCount;
}
