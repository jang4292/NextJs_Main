import type { Direction } from "../../domain/entities/Direction";

/**
 * Resolves a pointer start->end delta into a Direction, or null if the
 * gesture is too small to count as an intentional swipe. When the
 * horizontal and vertical deltas tie, vertical wins (arbitrary but
 * deterministic).
 */
export function resolveSwipeDirection(
  dx: number,
  dy: number,
  threshold = 30,
): Direction | null {
  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);

  if (absDx < threshold && absDy < threshold) return null;

  if (absDx > absDy) {
    return dx > 0 ? "RIGHT" : "LEFT";
  }
  return dy > 0 ? "DOWN" : "UP";
}
