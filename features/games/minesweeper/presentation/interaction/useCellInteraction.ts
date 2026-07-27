"use client";

import { useCallback, useEffect, useRef } from "react";
import type {
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
} from "react";
import type { Position } from "../../domain/entities/Position";
import { hasExceededMoveThreshold } from "./longPressGeometry";

const LONG_PRESS_MS = 500;
const MOVE_CANCEL_THRESHOLD_PX = 10;
// Some mobile browsers also fire a native `contextmenu` after a long-press
// touch gesture, shortly after our own timer already toggled the flag. If a
// contextmenu event arrives within this window of our own long-press firing,
// treat it as that same gesture (suppress only, don't toggle again) rather
// than a genuine desktop right-click.
const CONTEXT_MENU_ECHO_WINDOW_MS = 800;

interface PendingPress {
  pointerId: number;
  startX: number;
  startY: number;
  longPressFired: boolean;
  timerId: ReturnType<typeof setTimeout> | null;
}

interface UseCellInteractionOptions {
  flagMode: boolean;
  onReveal: (position: Position) => void;
  onToggleFlag: (position: Position) => void;
}

/**
 * One instance for the whole board (not per cell) - handlers take the
 * target cell's position as an argument. Unifies desktop left-click-reveal
 * / right-click-flag and mobile tap-reveal / long-press-flag / flag-mode on
 * Pointer Events, so there is exactly one code path per input (no separate
 * touch/mouse handlers to keep in sync, no double-firing).
 */
export function useCellInteraction({
  flagMode,
  onReveal,
  onToggleFlag,
}: UseCellInteractionOptions) {
  const pendingRef = useRef<PendingPress | null>(null);
  const flagModeRef = useRef(flagMode);
  const lastLongPressAtRef = useRef(0);

  useEffect(() => {
    flagModeRef.current = flagMode;
  }, [flagMode]);

  const clearPending = useCallback(() => {
    if (pendingRef.current?.timerId) clearTimeout(pendingRef.current.timerId);
    pendingRef.current = null;
  }, []);

  useEffect(() => clearPending, [clearPending]);

  const onPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLElement>, position: Position) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;

      event.currentTarget.setPointerCapture(event.pointerId);

      // In flag mode, a tap should flag immediately on release rather than
      // require holding - skip the long-press timer entirely.
      const timerId = flagModeRef.current
        ? null
        : setTimeout(() => {
            if (pendingRef.current) pendingRef.current.longPressFired = true;
            lastLongPressAtRef.current = Date.now();
            onToggleFlag(position);
          }, LONG_PRESS_MS);

      pendingRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        longPressFired: false,
        timerId,
      };
    },
    [onToggleFlag],
  );

  const onPointerMove = useCallback((event: ReactPointerEvent<HTMLElement>) => {
    const pending = pendingRef.current;
    if (!pending || pending.pointerId !== event.pointerId) return;

    const dx = event.clientX - pending.startX;
    const dy = event.clientY - pending.startY;
    if (hasExceededMoveThreshold(dx, dy, MOVE_CANCEL_THRESHOLD_PX)) {
      if (pending.timerId) clearTimeout(pending.timerId);
      pendingRef.current = null;
    }
  }, []);

  const onPointerUp = useCallback(
    (event: ReactPointerEvent<HTMLElement>, position: Position) => {
      const pending = pendingRef.current;
      if (!pending || pending.pointerId !== event.pointerId) return;

      if (pending.timerId) clearTimeout(pending.timerId);
      event.currentTarget.releasePointerCapture(event.pointerId);
      pendingRef.current = null;

      // The long-press timer already toggled the flag - a tap must not also fire a reveal.
      if (pending.longPressFired) return;

      if (flagModeRef.current) {
        onToggleFlag(position);
      } else {
        onReveal(position);
      }
    },
    [onReveal, onToggleFlag],
  );

  const onPointerCancel = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      const pending = pendingRef.current;
      if (!pending || pending.pointerId !== event.pointerId) return;
      if (pending.timerId) clearTimeout(pending.timerId);
      pendingRef.current = null;
    },
    [],
  );

  const onContextMenu = useCallback(
    (event: ReactMouseEvent<HTMLElement>, position: Position) => {
      event.preventDefault();

      const isLongPressEcho =
        Date.now() - lastLongPressAtRef.current < CONTEXT_MENU_ECHO_WINDOW_MS;
      if (isLongPressEcho) return;

      onToggleFlag(position);
    },
    [onToggleFlag],
  );

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    onContextMenu,
  };
}
