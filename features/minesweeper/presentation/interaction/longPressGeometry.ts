export function hasExceededMoveThreshold(dx: number, dy: number, thresholdPx: number): boolean {
  return Math.hypot(dx, dy) > thresholdPx;
}
