"use client";

import { useCallback, useRef } from "react";

const DOUBLE_TAP_WINDOW_MS = 300;

/**
 * Detects "the same card tapped/clicked twice quickly" without relying on a
 * native `dblclick` listener, so PC double-click and mobile double-tap share
 * one code path. A second tap on a *different* card (or the same card after
 * the window expires) just re-arms the tracker and does not fire `onDouble`
 * — callers keep running their normal single-tap logic in that case.
 */
export function useDoubleTap() {
  const lastRef = useRef<{ cardId: string; time: number } | null>(null);

  return useCallback((cardId: string, onDouble: () => void) => {
    const now = performance.now();
    const last = lastRef.current;

    if (last && last.cardId === cardId && now - last.time <= DOUBLE_TAP_WINDOW_MS) {
      lastRef.current = null;
      onDouble();
      return;
    }

    lastRef.current = { cardId, time: now };
  }, []);
}
