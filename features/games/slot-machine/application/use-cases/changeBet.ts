import { getNextBet, type BetDirection } from "../../domain/betting";
import { changeSessionBet } from "../../domain/gameSession";
import type { GameSession } from "../../domain/slot.types";

export function changeBet(
  session: GameSession,
  direction: BetDirection,
): GameSession {
  const nextBet = getNextBet(session.bet, direction, session.balance);

  return changeSessionBet(session, nextBet);
}
