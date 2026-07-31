export const SLOT_SYMBOLS = [
  "cherry",
  "lemon",
  "bell",
  "star",
  "diamond",
  "seven",
] as const;

export type SlotSymbol = (typeof SLOT_SYMBOLS)[number];

export const SYMBOL_LABELS: Record<SlotSymbol, string> = {
  cherry: "Cherry",
  lemon: "Lemon",
  bell: "Bell",
  star: "Star",
  diamond: "Diamond",
  seven: "Seven",
};

export const PAYOUT_MULTIPLIERS: Record<SlotSymbol, number> = {
  cherry: 2,
  lemon: 3,
  bell: 5,
  star: 8,
  diamond: 12,
  seven: 20,
};

export function isSlotSymbol(value: string): value is SlotSymbol {
  return SLOT_SYMBOLS.includes(value as SlotSymbol);
}
