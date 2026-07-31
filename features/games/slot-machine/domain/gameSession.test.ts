import { describe, expect, it } from "vitest";
import type { SpinResult } from "./slot.types";
import {
  changeSessionBet,
  createInitialGameSession,
  finishSpinSession,
  revealNextReel,
  startSpinSession,
} from "./gameSession";

describe("gameSession", () => {
  it("creates the initial session", () => {
    expect(createInitialGameSession()).toMatchObject({
      balance: 1000,
      bet: 10,
      lastPayout: 0,
      state: { status: "ready" },
    });
  });

  it("deducts the bet when a spin starts", () => {
    const session = createInitialGameSession();
    const nextSession = startSpinSession(session, createResult(20), "spin-1");

    expect(nextSession.balance).toBe(990);
    expect(nextSession.state.status).toBe("spinning");
  });

  it("reveals reels in order and pays winnings when the spin finishes", () => {
    const session = startSpinSession(
      createInitialGameSession(),
      createResult(20),
      "spin-1",
    );
    const firstStop = revealNextReel(session, "spin-1");
    const secondStop = revealNextReel(firstStop, "spin-1");
    const finished = finishSpinSession(secondStop, "spin-1");

    expect(firstStop.state).toMatchObject({
      status: "stopping",
      stoppedReels: 1,
    });
    expect(secondStop.state).toMatchObject({
      status: "stopping",
      stoppedReels: 2,
    });
    expect(finished.balance).toBe(1010);
    expect(finished.lastPayout).toBe(20);
    expect(finished.state).toMatchObject({
      status: "result",
      isWin: true,
    });
  });

  it("ignores duplicate spin starts while spinning", () => {
    const session = startSpinSession(
      createInitialGameSession(),
      createResult(20),
      "spin-1",
    );

    expect(startSpinSession(session, createResult(0), "spin-2")).toBe(session);
  });

  it("ignores stale timer events with an old spin id", () => {
    const session = startSpinSession(
      createInitialGameSession(),
      createResult(20),
      "spin-1",
    );

    expect(revealNextReel(session, "old-spin")).toBe(session);
    expect(finishSpinSession(session, "old-spin")).toBe(session);
  });

  it("blocks invalid bets and keeps the previous bet", () => {
    const session = createInitialGameSession();
    const nextSession = changeSessionBet(session, 30);

    expect(nextSession.bet).toBe(10);
    expect(nextSession.lastMessage).toBe("선택할 수 없는 베팅입니다.");
  });

  it("moves to game over when a finished losing spin leaves too little balance", () => {
    const session = {
      ...createInitialGameSession(),
      balance: 10,
    };
    const spinning = startSpinSession(session, createResult(0), "spin-1");
    const finished = finishSpinSession(spinning, "spin-1");

    expect(finished.balance).toBe(0);
    expect(finished.state.status).toBe("game-over");
  });
});

function createResult(payout: number): SpinResult {
  const isWin = payout > 0;

  return {
    reels: [
      { top: "lemon", middle: "cherry", bottom: "bell" },
      { top: "lemon", middle: "cherry", bottom: "bell" },
      { top: "lemon", middle: "cherry", bottom: "bell" },
    ],
    stopIndexes: [0, 5, 4],
    payline: ["cherry", "cherry", "cherry"],
    isWin,
    winSymbol: isWin ? "cherry" : null,
    multiplier: isWin ? 2 : 0,
    payout,
  };
}
