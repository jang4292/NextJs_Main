export function createTileIdGenerator(): () => string {
  let count = 0;
  return () => `tile-${count++}`;
}
