import type { RandomSource } from "../randomSource";
import { calculatePayout } from "../../domain/calculatePayout";
import {
  canRequestSpin,
  resolveBlockedSpin,
  startSpinSession,
} from "../../domain/gameSession";
import { REEL_STRIPS } from "../../domain/reelStrips";
import { createReelWindows, getPaylineFromReels } from "../../domain/reel";
import type {
  GameSession,
  ReelStopIndexes,
  ReelStrips,
  SpinResult,
} from "../../domain/slot.types";

export interface SpinSlotOptions {
  randomSource: RandomSource;
  spinId: string;
  reelStrips?: ReelStrips;
}

export function spinSlot(
  session: GameSession,
  { randomSource, spinId, reelStrips = REEL_STRIPS }: SpinSlotOptions,
): GameSession {
  if (!canRequestSpin(session)) {
    return resolveBlockedSpin(session);
  }

  const result = createSpinResult({
    bet: session.bet,
    randomSource,
    reelStrips,
  });

  return startSpinSession(session, result, spinId);
}

export function createSpinResult({
  bet,
  randomSource,
  reelStrips = REEL_STRIPS,
}: {
  bet: number;
  randomSource: RandomSource;
  reelStrips?: ReelStrips;
}): SpinResult {
  const stopIndexes: ReelStopIndexes = [
    randomSource.pickStopIndex(reelStrips[0].length),
    randomSource.pickStopIndex(reelStrips[1].length),
    randomSource.pickStopIndex(reelStrips[2].length),
  ];
  const reels = createReelWindows(reelStrips, stopIndexes);
  const payline = getPaylineFromReels(reels);
  const payout = calculatePayout(payline, bet);

  return {
    reels,
    stopIndexes,
    payline,
    ...payout,
  };
}
