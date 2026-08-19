"use client";

import { useCallback, useEffect, useReducer, useRef } from "react";
import type { RandomSource } from "../../application/randomSource";
import { changeBet } from "../../application/use-cases/changeBet";
import { resetGame } from "../../application/use-cases/resetGame";
import { spinSlot } from "../../application/use-cases/spinSlot";
import {
  canRequestSpin,
  createInitialGameSession,
  finishSpinSession,
  revealNextReel,
} from "../../domain/gameSession";
import type { GameSession } from "../../domain/slot.types";
import { browserRandomSource } from "../../infrastructure/browserRandomSource";
import type { BetDirection } from "../../domain/betting";

type StopDelaysMs = readonly [number, number, number, number];

export interface UseSlotMachineOptions {
  initialSession?: GameSession;
  randomSource?: RandomSource;
  stopDelaysMs?: StopDelaysMs;
  createSpinId?: () => string;
}

type SlotMachineAction =
  | { type: "spin"; spinId: string; randomSource: RandomSource }
  | { type: "reel-stopped"; spinId: string }
  | { type: "finish-spin"; spinId: string }
  | { type: "change-bet"; direction: BetDirection }
  | { type: "reset" };

const DEFAULT_STOP_DELAYS_MS: StopDelaysMs = [420, 760, 1100, 1260];

export function useSlotMachine({
  initialSession,
  randomSource = browserRandomSource,
  stopDelaysMs = DEFAULT_STOP_DELAYS_MS,
  createSpinId,
}: UseSlotMachineOptions = {}) {
  const [session, dispatch] = useReducer(
    slotMachineReducer,
    initialSession,
    (value) => value ?? createInitialGameSession(),
  );
  const sessionRef = useRef(session);
  const timeoutIdsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const spinSequenceRef = useRef(0);

  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  const clearScheduledStops = useCallback(() => {
    for (const timeoutId of timeoutIdsRef.current) {
      clearTimeout(timeoutId);
    }
    timeoutIdsRef.current = [];
  }, []);

  useEffect(() => {
    return clearScheduledStops;
  }, [clearScheduledStops]);

  const scheduleSpinStops = useCallback(
    (spinId: string) => {
      clearScheduledStops();

      const [firstStopMs, secondStopMs, thirdStopMs, finishMs] = stopDelaysMs;
      const schedule = (callback: () => void, delayMs: number) => {
        const timeoutId = setTimeout(() => {
          timeoutIdsRef.current = timeoutIdsRef.current.filter(
            (candidate) => candidate !== timeoutId,
          );
          callback();
        }, delayMs);
        timeoutIdsRef.current.push(timeoutId);
      };

      for (const delayMs of [firstStopMs, secondStopMs, thirdStopMs]) {
        schedule(() => dispatch({ type: "reel-stopped", spinId }), delayMs);
      }

      schedule(() => dispatch({ type: "finish-spin", spinId }), finishMs);
    },
    [clearScheduledStops, stopDelaysMs],
  );

  const spin = useCallback(() => {
    const currentSession = sessionRef.current;
    const spinId =
      createSpinId?.() ??
      `slot-spin-${Date.now()}-${++spinSequenceRef.current}`;
    const shouldSchedule = canRequestSpin(currentSession);

    dispatch({ type: "spin", spinId, randomSource });

    if (shouldSchedule) {
      scheduleSpinStops(spinId);
    }
  }, [createSpinId, randomSource, scheduleSpinStops]);

  const increaseBet = useCallback(() => {
    dispatch({ type: "change-bet", direction: "increase" });
  }, []);

  const decreaseBet = useCallback(() => {
    dispatch({ type: "change-bet", direction: "decrease" });
  }, []);

  const newGame = useCallback(() => {
    clearScheduledStops();
    dispatch({ type: "reset" });
  }, [clearScheduledStops]);

  const isBusy =
    session.state.status === "spinning" || session.state.status === "stopping";
  const stoppedReels =
    session.state.status === "stopping"
      ? session.state.stoppedReels
      : session.state.status === "spinning"
        ? 0
        : 3;

  return {
    session,
    isBusy,
    isGameOver: session.state.status === "game-over",
    stoppedReels,
    canSpin: canRequestSpin(session),
    spin,
    increaseBet,
    decreaseBet,
    newGame,
  };
}

function slotMachineReducer(
  session: GameSession,
  action: SlotMachineAction,
): GameSession {
  switch (action.type) {
    case "spin":
      try {
        return spinSlot(session, {
          randomSource: action.randomSource,
          spinId: action.spinId,
        });
      } catch (error) {
        return {
          ...session,
          lastPayout: 0,
          lastMessage:
            error instanceof Error
              ? error.message
              : "스핀을 시작할 수 없습니다.",
        };
      }
    case "reel-stopped":
      return revealNextReel(session, action.spinId);
    case "finish-spin":
      return finishSpinSession(session, action.spinId);
    case "change-bet":
      return changeBet(session, action.direction);
    case "reset":
      return resetGame();
    default:
      return session;
  }
}
