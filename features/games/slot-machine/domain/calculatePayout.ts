import { PAYOUT_MULTIPLIERS } from "./symbols";
import type { Payline, SpinResult } from "./slot.types";
import { evaluatePayline } from "./evaluatePayline";

export function calculatePayout(payline: Payline, bet: number) {
  const evaluation = evaluatePayline(payline);

  if (!evaluation.symbol) {
    return {
      isWin: false,
      winSymbol: null,
      multiplier: 0,
      payout: 0,
    };
  }

  const multiplier = PAYOUT_MULTIPLIERS[evaluation.symbol];

  if (typeof multiplier !== "number") {
    throw new Error(`Missing payout multiplier for ${evaluation.symbol}.`);
  }

  return {
    isWin: true,
    winSymbol: evaluation.symbol,
    multiplier,
    payout: bet * multiplier,
  };
}

export function buildResultMessage(
  result: Pick<SpinResult, "isWin" | "payout">,
) {
  return result.isWin
    ? `당첨! ${result.payout.toLocaleString()} 크레딧을 받았습니다.`
    : "아쉽게도 당첨이 아닙니다. 다시 도전해 보세요.";
}
