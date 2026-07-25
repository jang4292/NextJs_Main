"use client";

import { useCallback, useRef } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { GameState } from "../../domain/entities/GameState";
import type { CardLocation } from "../../domain/entities/Move";
import { getMovingCards } from "../../application/use-cases/moveCard";
import { findDropLocation } from "./hitTest";

const DRAG_THRESHOLD_PX = 6;

interface PendingDrag {
  source: CardLocation;
  pointerId: number;
  cardEls: HTMLElement[];
  startX: number;
  startY: number;
  dragging: boolean;
}

interface UseFreecellInteractionsOptions {
  game: GameState;
  isLocked: boolean;
  onCommit: (source: CardLocation, destination: CardLocation) => void;
}

export type BindDragHandle = (source: CardLocation) => {
  onPointerDown: (event: ReactPointerEvent<HTMLElement>) => void;
  onPointerMove: (event: ReactPointerEvent<HTMLElement>) => void;
  onPointerUp: (event: ReactPointerEvent<HTMLElement>) => void;
  onPointerCancel: (event: ReactPointerEvent<HTMLElement>) => void;
};

function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Pointer-Events-based drag gesture (mouse + touch unified, no HTML5 Drag
 * and Drop API). While dragging, only the moving cards' own DOM elements are
 * translated via inline style -- game state is untouched until a successful
 * drop, and this hook never leaks DOM coordinates into the domain layer:
 * `onCommit` only ever receives resolved CardLocation values.
 */
export function useFreecellInteractions({ game, isLocked, onCommit }: UseFreecellInteractionsOptions) {
  const pendingRef = useRef<PendingDrag | null>(null);
  const suppressClickRef = useRef(false);

  const resetCardEls = useCallback((cardEls: HTMLElement[], animateReturn: boolean) => {
    const useTransition = animateReturn && !prefersReducedMotion();
    cardEls.forEach((el) => {
      el.style.transition = useTransition ? "transform 160ms ease" : "";
      el.style.transform = "";
      el.style.zIndex = "";
      el.style.boxShadow = "";
      el.style.touchAction = "";
    });
  }, []);

  const bindDragHandle = useCallback<BindDragHandle>(
    (source) => ({
      onPointerDown(event) {
        if (isLocked || pendingRef.current) return;
        if (event.pointerType === "mouse" && event.button !== 0) return;

        const movingCards = getMovingCards(game, source);
        if (!movingCards) return;

        const originEl = event.currentTarget;
        let cardEls: HTMLElement[] = [originEl];

        if (source.type === "tableau") {
          const columnEl = originEl.closest<HTMLElement>('[data-drop-zone="tableau"]');
          if (columnEl) {
            cardEls = Array.from(columnEl.querySelectorAll<HTMLElement>("[data-card-index]")).filter(
              (el) => Number(el.dataset.cardIndex) >= source.cardIndex,
            );
          }
        }

        pendingRef.current = {
          source,
          pointerId: event.pointerId,
          cardEls,
          startX: event.clientX,
          startY: event.clientY,
          dragging: false,
        };
        originEl.setPointerCapture(event.pointerId);
      },

      onPointerMove(event) {
        const pending = pendingRef.current;
        if (!pending || pending.pointerId !== event.pointerId) return;

        const dx = event.clientX - pending.startX;
        const dy = event.clientY - pending.startY;

        if (!pending.dragging) {
          if (Math.hypot(dx, dy) < DRAG_THRESHOLD_PX) return;
          pending.dragging = true;
          pending.cardEls.forEach((el, index) => {
            el.style.transition = "none";
            el.style.zIndex = String(100 + index);
            el.style.boxShadow = "0 14px 26px rgba(0, 0, 0, 0.38)";
            el.style.touchAction = "none";
          });
        }

        pending.cardEls.forEach((el) => {
          el.style.transform = `translate(${dx}px, ${dy}px)`;
        });
      },

      onPointerUp(event) {
        const pending = pendingRef.current;
        if (!pending || pending.pointerId !== event.pointerId) return;
        pending.cardEls[0]?.releasePointerCapture(event.pointerId);
        pendingRef.current = null;

        if (!pending.dragging) return; // plain tap: let the click handler run

        suppressClickRef.current = true;
        const destination = findDropLocation(event.clientX, event.clientY);
        if (destination) onCommit(pending.source, destination);
        resetCardEls(pending.cardEls, true);
      },

      onPointerCancel(event) {
        const pending = pendingRef.current;
        if (!pending || pending.pointerId !== event.pointerId) return;
        pendingRef.current = null;
        if (!pending.dragging) return;

        suppressClickRef.current = true;
        resetCardEls(pending.cardEls, true);
      },
    }),
    [game, isLocked, onCommit, resetCardEls],
  );

  const consumeSuppressedClick = useCallback(() => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return true;
    }
    return false;
  }, []);

  return { bindDragHandle, consumeSuppressedClick };
}
