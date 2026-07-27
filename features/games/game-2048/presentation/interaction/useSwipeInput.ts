"use client";

import { useCallback, useRef } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { Direction } from "../../domain/entities/Direction";
import { resolveSwipeDirection } from "./swipeGeometry";

const SWIPE_THRESHOLD_PX = 30;

interface PendingSwipe {
  pointerId: number;
  startX: number;
  startY: number;
}

/**
 * Pointer-Events-based swipe/drag detection (mouse + touch unified). Only
 * the start and end position matter - no live ghost or drop target, since a
 * move affects the whole board rather than a single dragged element.
 */
export function useSwipeInput(onSwipe: (direction: Direction) => void) {
  const pendingRef = useRef<PendingSwipe | null>(null);

  const onPointerDown = useCallback((event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    pendingRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }, []);

  const onPointerUp = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      const pending = pendingRef.current;
      if (!pending || pending.pointerId !== event.pointerId) return;
      pendingRef.current = null;
      event.currentTarget.releasePointerCapture(event.pointerId);

      const dx = event.clientX - pending.startX;
      const dy = event.clientY - pending.startY;
      const direction = resolveSwipeDirection(dx, dy, SWIPE_THRESHOLD_PX);
      if (direction) onSwipe(direction);
    },
    [onSwipe],
  );

  const onPointerCancel = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      const pending = pendingRef.current;
      if (!pending || pending.pointerId !== event.pointerId) return;
      pendingRef.current = null;
    },
    [],
  );

  return { onPointerDown, onPointerUp, onPointerCancel };
}
