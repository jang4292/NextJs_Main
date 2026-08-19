import type {
  ReelStopIndexes,
  ReelStrip,
  ReelStrips,
  ReelWindow,
  ReelWindows,
} from "./slot.types";

export function normalizeReelIndex(index: number, length: number): number {
  if (length <= 0) {
    throw new Error("Cannot resolve an index for an empty reel strip.");
  }

  return ((index % length) + length) % length;
}

export function getReelWindow(strip: ReelStrip, stopIndex: number): ReelWindow {
  if (strip.length <= 0) {
    throw new Error("Cannot create a reel window from an empty reel strip.");
  }

  const middleIndex = normalizeReelIndex(stopIndex, strip.length);

  return {
    top: strip[normalizeReelIndex(middleIndex - 1, strip.length)],
    middle: strip[middleIndex],
    bottom: strip[normalizeReelIndex(middleIndex + 1, strip.length)],
  };
}

export function createReelWindows(
  strips: ReelStrips,
  stopIndexes: ReelStopIndexes,
): ReelWindows {
  return [
    getReelWindow(strips[0], stopIndexes[0]),
    getReelWindow(strips[1], stopIndexes[1]),
    getReelWindow(strips[2], stopIndexes[2]),
  ];
}

export function getPaylineFromReels(reels: ReelWindows) {
  return [reels[0].middle, reels[1].middle, reels[2].middle] as const;
}
