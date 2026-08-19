export function calculateAccuracy({
  typedCharacterCount,
  correctCharacterCount,
}: {
  typedCharacterCount: number;
  correctCharacterCount: number;
}): number {
  if (typedCharacterCount <= 0) return 1;
  return Math.max(0, Math.min(1, correctCharacterCount / typedCharacterCount));
}

export function calculateCompletedCharactersPerMinute({
  correctCharacterCount,
  elapsedMs,
}: {
  correctCharacterCount: number;
  elapsedMs: number;
}): number {
  if (elapsedMs <= 0) return 0;
  return correctCharacterCount / (elapsedMs / 60000);
}
