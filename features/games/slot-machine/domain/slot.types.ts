import type { SlotSymbol } from "./symbols";

export type Bet = number;
export type Balance = number;
export type ReelStrip = readonly SlotSymbol[];
export type ReelStrips = readonly [ReelStrip, ReelStrip, ReelStrip];
export type ReelStopIndexes = readonly [number, number, number];
export type Payline = readonly [SlotSymbol, SlotSymbol, SlotSymbol];
export type ReelWindows = readonly [ReelWindow, ReelWindow, ReelWindow];

export interface ReelWindow {
  top: SlotSymbol;
  middle: SlotSymbol;
  bottom: SlotSymbol;
}

export interface PaylineEvaluation {
  isWin: boolean;
  symbol: SlotSymbol | null;
}

export interface SpinResult {
  reels: ReelWindows;
  stopIndexes: ReelStopIndexes;
  payline: Payline;
  isWin: boolean;
  winSymbol: SlotSymbol | null;
  multiplier: number;
  payout: number;
}

export type SlotGameState =
  | { status: "ready" }
  | { status: "spinning"; spinId: string; result: SpinResult }
  | {
      status: "stopping";
      spinId: string;
      stoppedReels: number;
      result: SpinResult;
    }
  | {
      status: "result";
      payout: number;
      resultSymbols: Payline;
      isWin: boolean;
      message: string;
    }
  | { status: "game-over" };

export interface GameSession {
  balance: Balance;
  bet: Bet;
  state: SlotGameState;
  reels: ReelWindows;
  lastPayout: number;
  lastMessage: string;
}
