"use client";

import { useCallback } from "react";
import { flushSync } from "react-dom";
import type { MoveSource, MoveTarget } from "../../domain/entities/Move";
import type { Suit } from "../../domain/value-objects/Suit";
import { moveCard, getMovingCards } from "../../application/use-cases/moveCard";
import { useSolitaireGame } from "../hooks/useSolitaireGame";
import { useMoveAnimator } from "../animation/useMoveAnimator";
import { useDoubleTap } from "./useDoubleTap";
import { useDragAndDrop } from "./useDragAndDrop";

/**
 * Composition root: click/tap select-then-target (existing), drag & drop, and
 * double-click/double-tap auto-move all funnel into the same `moveCard`
 * validated use-case and the same `runFlip` animation primitive. No input
 * method re-implements move rules of its own.
 */
export function useSolitaireInteractions() {
  const gameApi = useSolitaireGame();
  const { game, selection } = gameApi;
  const { isAnimating, runFlip, withLock } = useMoveAnimator();
  const noteTap = useDoubleTap();

  const commitMove = useCallback(
    (source: MoveSource, target: MoveTarget): boolean => {
      const probe = moveCard(gameApi.game, source, target);
      if (!probe.moved) return false;
      flushSync(() => gameApi.commitMove(source, target));
      return true;
    },
    [gameApi],
  );

  const drag = useDragAndDrop({ game, isLocked: isAnimating, onCommit: commitMove, withLock });

  const tryAutoMove = useCallback(
    (source: MoveSource, suit: Suit) => {
      if (isAnimating) return;
      const cards = getMovingCards(game, source);
      if (!cards || cards.length !== 1) return; // not alone on top -> silent no-op

      if (moveCard(game, source, { zone: "foundation", suit }).moved) {
        runFlip([cards[0].id], () => gameApi.commitMove(source, { zone: "foundation", suit }));
        return;
      }

      const column = game.tableau.findIndex(
        (_, col) => moveCard(game, source, { zone: "tableau", column: col }).moved,
      );
      if (column === -1) return; // no legal foundation or tableau destination -> silent no-op
      runFlip([cards[0].id], () => gameApi.commitMove(source, { zone: "tableau", column }));
    },
    [game, isAnimating, runFlip, gameApi],
  );

  const clickTableau = useCallback(
    (column: number, cardIndex: number) => {
      if (isAnimating || drag.consumeSuppressedClick()) return;

      const card = game.tableau[column]?.[cardIndex];

      if (selection) {
        const probe = moveCard(game, selection, { zone: "tableau", column });
        if (probe.moved) {
          const ids = (getMovingCards(game, selection) ?? []).map((c) => c.id);
          runFlip(ids, () => gameApi.clickTableau(column, cardIndex));
          return;
        }
      }

      gameApi.clickTableau(column, cardIndex);
      if (card?.faceUp) {
        noteTap(card.id, () =>
          tryAutoMove({ zone: "tableau", column, cardIndex }, card.suit),
        );
      }
    },
    [game, selection, isAnimating, drag, runFlip, gameApi, noteTap, tryAutoMove],
  );

  const clickWaste = useCallback(() => {
    if (isAnimating || drag.consumeSuppressedClick()) return;

    const topCard = game.waste[game.waste.length - 1];
    gameApi.clickWaste();
    if (topCard) {
      noteTap(topCard.id, () => tryAutoMove({ zone: "waste" }, topCard.suit));
    }
  }, [game, isAnimating, drag, gameApi, noteTap, tryAutoMove]);

  const clickFoundation = useCallback(
    (suit: Suit) => {
      if (isAnimating || !selection) return;

      const probe = moveCard(game, selection, { zone: "foundation", suit });
      if (probe.moved) {
        const ids = (getMovingCards(game, selection) ?? []).map((c) => c.id);
        runFlip(ids, () => gameApi.clickFoundation(suit));
        return;
      }

      gameApi.clickFoundation(suit);
    },
    [game, selection, isAnimating, runFlip, gameApi],
  );

  return {
    game: gameApi.game,
    selection: gameApi.selection,
    newGame: gameApi.newGame,
    drawOrRecycle: gameApi.drawOrRecycle,
    clickTableau,
    clickWaste,
    clickFoundation,
    isAnimating,
    dragVisual: drag.dragVisual,
    hiddenCardIds: drag.hiddenCardIds,
    ghostRef: drag.ghostRef,
    bindDragHandle: drag.bindDragHandle,
  };
}
