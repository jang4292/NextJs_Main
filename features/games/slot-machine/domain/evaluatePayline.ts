import type { Payline, PaylineEvaluation } from "./slot.types";

export function evaluatePayline(payline: Payline): PaylineEvaluation {
  const [first, second, third] = payline;
  const isWin = first === second && second === third;

  return {
    isWin,
    symbol: isWin ? first : null,
  };
}
