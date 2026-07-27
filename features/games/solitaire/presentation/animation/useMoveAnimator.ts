"use client";

import { useCallback, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { flyElement } from "./cardMotion";
import { getCardEl, getCardRect } from "./cardRegistry";

const MOVE_DURATION_MS = 220;

/**
 * Shared animation orchestration for every committed move (click-to-target,
 * double-click/tap auto-foundation, and drag-drop). `runFlip` captures the
 * pre-move rect of each affected card, commits the state change synchronously
 * (so React has already re-rendered cards at their new layout position by the
 * time we measure "after"), then plays each card from its old visual offset
 * back to its new resting position. `isAnimating` is a brief lock covering
 * only that in-flight window, never the whole gesture lifecycle.
 */
export function useMoveAnimator() {
  const [isAnimating, setIsAnimating] = useState(false);
  const lockCount = useRef(0);

  const beginLock = useCallback(() => {
    lockCount.current += 1;
    setIsAnimating(true);
  }, []);

  const endLock = useCallback(() => {
    lockCount.current = Math.max(0, lockCount.current - 1);
    if (lockCount.current === 0) setIsAnimating(false);
  }, []);

  const runFlip = useCallback(
    (cardIds: string[], commit: () => void) => {
      if (cardIds.length === 0) {
        commit();
        return;
      }

      const before = new Map(cardIds.map((id) => [id, getCardRect(id)]));
      beginLock();
      flushSync(commit);

      const animations = cardIds.flatMap((id) => {
        const el = getCardEl(id);
        const from = before.get(id);
        const to = el?.getBoundingClientRect();
        if (!el || !from || !to) return [];
        const dx = from.left - to.left;
        const dy = from.top - to.top;
        if (dx === 0 && dy === 0) return [];
        return [flyElement(el, dx, dy, { durationMs: MOVE_DURATION_MS })];
      });

      if (animations.length === 0) {
        endLock();
        return;
      }

      Promise.allSettled(animations.map((a) => a.finished)).finally(endLock);
    },
    [beginLock, endLock],
  );

  /** Lets the drag gesture share the same lock around its own ghost animation. */
  const withLock = useCallback(
    async (run: () => Promise<void>) => {
      beginLock();
      try {
        await run();
      } finally {
        endLock();
      }
    },
    [beginLock, endLock],
  );

  return { isAnimating, runFlip, withLock };
}
