export function formatElapsedTime(elapsedMs: number): string {
  return `${(elapsedMs / 1000).toFixed(1)}초`;
}
