import { buildResultMessage } from "./calculatePayout";
import {
  DEFAULT_BET,
  INITIAL_BALANCE,
  MIN_BET,
  canCoverBet,
  isAllowedBet,
} from "./betting";
import { REEL_STRIPS } from "./reelStrips";
import { createReelWindows } from "./reel";
import type { GameSession, SpinResult } from "./slot.types";

const INITIAL_STOP_INDEXES = [0, 0, 0] as const;

export function createInitialGameSession(): GameSession {
  return {
    balance: INITIAL_BALANCE,
    bet: DEFAULT_BET,
    state: { status: "ready" },
    reels: createReelWindows(REEL_STRIPS, INITIAL_STOP_INDEXES),
    lastPayout: 0,
    lastMessage: "베팅을 정하고 SPIN을 눌러 보세요.",
  };
}

export function canRequestSpin(session: GameSession): boolean {
  return (
    (session.state.status === "ready" || session.state.status === "result") &&
    canCoverBet(session.balance, session.bet)
  );
}

export function resolveBlockedSpin(session: GameSession): GameSession {
  if (
    session.state.status === "spinning" ||
    session.state.status === "stopping"
  ) {
    return session;
  }

  if (session.balance < MIN_BET) {
    return {
      ...session,
      state: { status: "game-over" },
      lastPayout: 0,
      lastMessage: "잔액이 부족합니다. NEW GAME으로 다시 시작하세요.",
    };
  }

  if (!canCoverBet(session.balance, session.bet)) {
    return {
      ...session,
      lastPayout: 0,
      lastMessage: "잔액보다 큰 베팅은 할 수 없습니다.",
    };
  }

  return session;
}

export function startSpinSession(
  session: GameSession,
  result: SpinResult,
  spinId: string,
): GameSession {
  if (!canRequestSpin(session)) {
    return resolveBlockedSpin(session);
  }

  return {
    ...session,
    balance: session.balance - session.bet,
    state: { status: "spinning", spinId, result },
    lastPayout: 0,
    lastMessage: "릴이 회전하고 있습니다...",
  };
}

export function revealNextReel(
  session: GameSession,
  spinId: string,
): GameSession {
  const currentState = session.state;

  if (
    currentState.status !== "spinning" &&
    currentState.status !== "stopping"
  ) {
    return session;
  }

  if (currentState.spinId !== spinId) {
    return session;
  }

  const stoppedReels =
    currentState.status === "spinning" ? 1 : currentState.stoppedReels + 1;
  const clampedStoppedReels = Math.min(stoppedReels, 3);
  const nextReels: GameSession["reels"] = [
    clampedStoppedReels > 0 ? currentState.result.reels[0] : session.reels[0],
    clampedStoppedReels > 1 ? currentState.result.reels[1] : session.reels[1],
    clampedStoppedReels > 2 ? currentState.result.reels[2] : session.reels[2],
  ];

  return {
    ...session,
    reels: nextReels,
    state: {
      status: "stopping",
      spinId,
      stoppedReels: clampedStoppedReels,
      result: currentState.result,
    },
  };
}

export function finishSpinSession(
  session: GameSession,
  spinId: string,
): GameSession {
  if (
    session.state.status !== "spinning" &&
    session.state.status !== "stopping"
  ) {
    return session;
  }

  if (session.state.spinId !== spinId) {
    return session;
  }

  const { result } = session.state;
  const nextBalance = session.balance + result.payout;
  const resultMessage = buildResultMessage(result);

  if (nextBalance < MIN_BET) {
    return {
      ...session,
      balance: nextBalance,
      reels: result.reels,
      state: { status: "game-over" },
      lastPayout: result.payout,
      lastMessage: `${resultMessage} 잔액이 부족합니다. NEW GAME으로 다시 시작하세요.`,
    };
  }

  return {
    ...session,
    balance: nextBalance,
    reels: result.reels,
    state: {
      status: "result",
      payout: result.payout,
      resultSymbols: result.payline,
      isWin: result.isWin,
      message: resultMessage,
    },
    lastPayout: result.payout,
    lastMessage: resultMessage,
  };
}

export function changeSessionBet(
  session: GameSession,
  nextBet: number,
): GameSession {
  if (
    session.state.status === "spinning" ||
    session.state.status === "stopping"
  ) {
    return session;
  }

  if (!isAllowedBet(nextBet) || nextBet > session.balance) {
    return {
      ...session,
      lastMessage: "선택할 수 없는 베팅입니다.",
    };
  }

  return {
    ...session,
    bet: nextBet,
    lastMessage: `${nextBet.toLocaleString()} 크레딧으로 베팅을 설정했습니다.`,
  };
}
