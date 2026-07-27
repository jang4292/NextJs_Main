"use client";

import { useCallback, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { Card } from "../../domain/entities/Card";
import type { GameState } from "../../domain/entities/GameState";
import type { MoveSource, MoveTarget } from "../../domain/entities/Move";
import { getMovingCards } from "../../application/use-cases/moveCard";
import { flyElement } from "../animation/cardMotion";
import { getCardRect } from "../animation/cardRegistry";
import { findDropTarget } from "./hitTest";

const DRAG_THRESHOLD_PX = 8;
const SNAP_DURATION_MS = 150;
const RETURN_DURATION_MS = 200;

export interface DragVisual {
  cards: Card[];
  left: number;
  top: number;
  width: number;
  initialDx: number;
  initialDy: number;
}

interface PendingDrag {
  source: MoveSource;
  cards: Card[];
  pointerId: number;
  originEl: HTMLElement;
  originRect: DOMRect;
  startX: number;
  startY: number;
  dragging: boolean;
}

interface UseDragAndDropOptions {
  game: GameState;
  isLocked: boolean;
  /** Synchronously validates+commits the move (flushSync'd) and reports success. */
  onCommit: (source: MoveSource, target: MoveTarget) => boolean;
  withLock: (run: () => Promise<void>) => Promise<void>;
}

export type BindDragHandle = (source: MoveSource) => {
  onPointerDown: (event: ReactPointerEvent<HTMLElement>) => void;
  onPointerMove: (event: ReactPointerEvent<HTMLElement>) => void;
  onPointerUp: (event: ReactPointerEvent<HTMLElement>) => void;
  onPointerCancel: (event: ReactPointerEvent<HTMLElement>) => void;
};

/**
 * Pointer-Events-based drag gesture (mouse + touch unified). GameState is
 * never touched until a successful drop; while dragging, only a floating
 * ghost (rendered by DragGhost) and a set of "hidden" real card ids exist.
 */
export function useDragAndDrop({
  game,
  isLocked,
  onCommit,
  withLock,
}: UseDragAndDropOptions) {
  const [dragVisual, setDragVisual] = useState<DragVisual | null>(null);
  const [hiddenCardIds, setHiddenCardIds] = useState<ReadonlySet<string>>(
    new Set(),
  );
  const ghostRef = useRef<HTMLDivElement | null>(null);
  const pendingRef = useRef<PendingDrag | null>(null);
  const suppressClickRef = useRef(false);

  const cleanup = useCallback((el: HTMLElement) => {
    el.style.touchAction = "";
    pendingRef.current = null;
    setDragVisual(null);
    setHiddenCardIds(new Set());
  }, []);

  const bindDragHandle = useCallback(
    (source: MoveSource) => ({
      onPointerDown(event: ReactPointerEvent<HTMLElement>) {
        if (isLocked || pendingRef.current) return;
        if (event.pointerType === "mouse" && event.button !== 0) return;

        const cards = getMovingCards(game, source);
        if (!cards) return;

        const originEl = event.currentTarget;
        pendingRef.current = {
          source,
          cards,
          pointerId: event.pointerId,
          originEl,
          originRect: originEl.getBoundingClientRect(),
          startX: event.clientX,
          startY: event.clientY,
          dragging: false,
        };
        originEl.setPointerCapture(event.pointerId);
      },

      onPointerMove(event: ReactPointerEvent<HTMLElement>) {
        const pending = pendingRef.current;
        if (!pending || pending.pointerId !== event.pointerId) return;

        const dx = event.clientX - pending.startX;
        const dy = event.clientY - pending.startY;

        if (!pending.dragging) {
          if (Math.hypot(dx, dy) < DRAG_THRESHOLD_PX) return;
          pending.dragging = true;
          pending.originEl.style.touchAction = "none";
          setHiddenCardIds(new Set(pending.cards.map((c) => c.id)));
          setDragVisual({
            cards: pending.cards,
            left: pending.originRect.left,
            top: pending.originRect.top,
            width: pending.originRect.width,
            initialDx: dx,
            initialDy: dy,
          });
          return;
        }

        if (ghostRef.current) {
          ghostRef.current.style.transform = `translate(${dx}px, ${dy}px)`;
        }
      },

      onPointerUp(event: ReactPointerEvent<HTMLElement>) {
        const pending = pendingRef.current;
        if (!pending || pending.pointerId !== event.pointerId) return;
        pending.originEl.releasePointerCapture(event.pointerId);

        if (!pending.dragging) {
          pendingRef.current = null;
          return; // plain tap: never crossed threshold, let the native click fire
        }

        suppressClickRef.current = true;
        const dx = event.clientX - pending.startX;
        const dy = event.clientY - pending.startY;
        const ghostEl = ghostRef.current;
        const target = findDropTarget(event.clientX, event.clientY);
        const leadId = pending.cards[0]?.id;

        void withLock(async () => {
          const moved = target ? onCommit(pending.source, target) : false;

          if (!ghostEl) {
            cleanup(pending.originEl);
            return;
          }

          if (!moved) {
            await flyElement(ghostEl, dx, dy, {
              durationMs: RETURN_DURATION_MS,
            }).finished.catch(() => {});
            cleanup(pending.originEl);
            return;
          }

          const finalRect = leadId ? getCardRect(leadId) : undefined;
          if (finalRect) {
            const correctionX = pending.originRect.left + dx - finalRect.left;
            const correctionY = pending.originRect.top + dy - finalRect.top;
            await flyElement(ghostEl, correctionX, correctionY, {
              durationMs: SNAP_DURATION_MS,
            }).finished.catch(() => {});
          }
          cleanup(pending.originEl);
        });
      },

      onPointerCancel(event: ReactPointerEvent<HTMLElement>) {
        const pending = pendingRef.current;
        if (!pending || pending.pointerId !== event.pointerId) return;

        if (!pending.dragging) {
          pendingRef.current = null;
          return;
        }

        suppressClickRef.current = true;
        cleanup(pending.originEl);
      },
    }),
    [game, isLocked, onCommit, withLock, cleanup],
  );

  const consumeSuppressedClick = useCallback(() => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return true;
    }
    return false;
  }, []);

  return {
    dragVisual,
    hiddenCardIds,
    ghostRef,
    bindDragHandle,
    consumeSuppressedClick,
  };
}
