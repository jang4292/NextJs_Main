import { describe, expect, it } from "vitest";
import type { RandomSource } from "../randomSource";
import { finishSpinSession } from "../../domain/gameSession";
import { createInitialGameSession } from "../../domain/gameSession";
import { spinSlot } from "./spinSlot";

describe("spinSlot", () => {
  it("uses a fake random source to create reproducible spin results", () => {
    const randomSource = createFakeRandomSource([0, 5, 4]);
    const session = spinSlot(createInitialGameSession(), {
      randomSource,
      spinId: "spin-1",
    });

    expect(session.state.status).toBe("spinning");

    if (session.state.status !== "spinning") return;

    expect(session.state.result.payline).toEqual([
      "cherry",
      "cherry",
      "cherry",
    ]);
    expect(session.state.result.payout).toBe(20);
    expect(session.balance).toBe(990);
  });

  it("pays out after a winning spin result is finished", () => {
    const spinning = spinSlot(createInitialGameSession(), {
      randomSource: createFakeRandomSource([0, 5, 4]),
      spinId: "spin-1",
    });
    const finished = finishSpinSession(spinning, "spin-1");

    expect(finished.balance).toBe(1010);
    expect(finished.lastPayout).toBe(20);
  });

  it("blocks spins when balance is below the minimum bet", () => {
    const session = {
      ...createInitialGameSession(),
      balance: 5,
    };
    const nextSession = spinSlot(session, {
      randomSource: createFakeRandomSource([0, 5, 4]),
      spinId: "spin-1",
    });

    expect(nextSession.state.status).toBe("game-over");
    expect(nextSession.balance).toBe(5);
  });

  it("does not consume randomness for duplicate spin requests", () => {
    const randomSource = createFakeRandomSource([0, 5, 4, 1, 1, 1]);
    const spinning = spinSlot(createInitialGameSession(), {
      randomSource,
      spinId: "spin-1",
    });
    const duplicate = spinSlot(spinning, {
      randomSource,
      spinId: "spin-2",
    });

    expect(duplicate).toBe(spinning);
    expect(randomSource.calls).toBe(3);
  });
});

function createFakeRandomSource(indexes: number[]) {
  const source: RandomSource & { calls: number } = {
    calls: 0,
    pickStopIndex(stripLength: number) {
      const value = indexes[source.calls++] ?? 0;

      return value % stripLength;
    },
  };

  return source;
}
