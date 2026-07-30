export function formatElapsedTime(elapsedMs: number): string {
  const totalSeconds = Math.max(0, Math.floor(elapsedMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes === 0) return `${seconds}초`;
  return `${minutes}분 ${seconds.toString().padStart(2, "0")}초`;
}

export function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`;
}
