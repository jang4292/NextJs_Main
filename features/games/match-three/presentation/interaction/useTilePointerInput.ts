"use client";

import { useCallback, useEffect, useRef } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type {
  Direction,
  Position,
} from "../../domain/entities/Position";
import { resolveSwipeDirection } from "./swipeGeometry";

interface PendingPointer {
  pointerId: number;
  startX: number;
  startY: number;
  position: Position;
  cellSize: number;
}

interface UseTilePointerInputOptions {
  disabled: boolean;
  onTap: (position: Position) => void;
  onSwipe: (position: Position, direction: Direction) => void;
  onDragStart: (position: Position) => void;
  onDragMove: (position: Position, delta: { dx: number; dy: number }) => void;
  onDragEnd: () => void;
}

const SWIPE_THRESHOLD_PX = 24;

export function useTilePointerInput({
  disabled,
  onTap,
  onSwipe,
  onDragStart,
  onDragMove,
  onDragEnd,
}: UseTilePointerInputOptions) {
  const pendingRef = useRef<PendingPointer | null>(null);
  const disabledRef = useRef(disabled);

  useEffect(() => {
    disabledRef.current = disabled;
  }, [disabled]);

  const onPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLElement>, position: Position) => {
      if (disabledRef.current) return;
      if (pendingRef.current) return;
      if (event.pointerType === "mouse" && event.button !== 0) return;

      const rect = event.currentTarget.getBoundingClientRect();
      pendingRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        position,
        cellSize: Math.max(rect.width, rect.height),
      };
      event.currentTarget.setPointerCapture(event.pointerId);
      onDragStart(position);
    },
    [onDragStart],
  );

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      const pending = pendingRef.current;
      if (!pending || pending.pointerId !== event.pointerId) return;

      event.preventDefault();

      const dx = event.clientX - pending.startX;
      const dy = event.clientY - pending.startY;
      onDragMove(pending.position, clampDragDelta(dx, dy, pending.cellSize));
    },
    [onDragMove],
  );

  const onPointerUp = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      const pending = pendingRef.current;
      if (!pending || pending.pointerId !== event.pointerId) return;

      pendingRef.current = null;
      event.currentTarget.releasePointerCapture(event.pointerId);

      const dx = event.clientX - pending.startX;
      const dy = event.clientY - pending.startY;
      const direction = resolveSwipeDirection(dx, dy, SWIPE_THRESHOLD_PX);
      onDragEnd();

      if (disabledRef.current) return;

      if (direction) {
        onSwipe(pending.position, direction);
      } else {
        onTap(pending.position);
      }
    },
    [onSwipe, onTap, onDragEnd],
  );

  const onPointerCancel = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      const pending = pendingRef.current;
      if (!pending || pending.pointerId !== event.pointerId) return;
      pendingRef.current = null;
      onDragEnd();
    },
    [onDragEnd],
  );

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
  };
}

function clampDragDelta(
  dx: number,
  dy: number,
  cellSize: number,
): { dx: number; dy: number } {
  const maxDistance = cellSize || 1;

  if (Math.abs(dx) > Math.abs(dy)) {
    return {
      dx: Math.max(-maxDistance, Math.min(maxDistance, dx)),
      dy: 0,
    };
  }

  return {
    dx: 0,
    dy: Math.max(-maxDistance, Math.min(maxDistance, dy)),
  };
}
