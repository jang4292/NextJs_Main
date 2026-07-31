export const INITIAL_BALANCE = 1000;
export const BET_OPTIONS = [10, 20, 50, 100] as const;
export const DEFAULT_BET = 10;
export const MIN_BET = BET_OPTIONS[0];
export const MAX_BET = BET_OPTIONS[BET_OPTIONS.length - 1];

export type BetDirection = "increase" | "decrease";
export type AllowedBet = (typeof BET_OPTIONS)[number];

export function isAllowedBet(value: number): value is AllowedBet {
  return BET_OPTIONS.includes(value as AllowedBet);
}

export function assertAllowedBet(value: number): asserts value is AllowedBet {
  if (!isAllowedBet(value)) {
    throw new Error(`Unsupported bet value: ${value}.`);
  }
}

export function getAffordableBetOptions(
  balance: number,
): readonly AllowedBet[] {
  return BET_OPTIONS.filter((bet) => bet <= balance);
}

export function getNextBet(
  currentBet: number,
  direction: BetDirection,
  balance: number,
): AllowedBet {
  const affordableBets = getAffordableBetOptions(balance);

  if (affordableBets.length === 0) {
    return MIN_BET;
  }

  const currentIndex = affordableBets.includes(currentBet as AllowedBet)
    ? affordableBets.indexOf(currentBet as AllowedBet)
    : Math.max(
        0,
        affordableBets.findIndex((bet) => bet >= currentBet),
      );

  const fallbackIndex =
    currentIndex === -1 ? affordableBets.length - 1 : currentIndex;
  const nextIndex =
    direction === "increase"
      ? Math.min(fallbackIndex + 1, affordableBets.length - 1)
      : Math.max(fallbackIndex - 1, 0);

  return affordableBets[nextIndex];
}

export function canCoverBet(balance: number, bet: number): boolean {
  return isAllowedBet(bet) && balance >= bet;
}
