import type { Direction } from "../../domain/entities/Position";

export function resolveSwipeDirection(
  dx: number,
  dy: number,
  threshold = 24,
): Direction | null {
  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);

  if (absDx < threshold && absDy < threshold) return null;

  if (absDx > absDy) return dx > 0 ? "RIGHT" : "LEFT";
  return dy > 0 ? "DOWN" : "UP";
}
