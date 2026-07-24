"use client";

import type { RefObject } from "react";
import { createPortal } from "react-dom";
import { CardFace } from "../CardFace";
import type { DragVisual } from "./useDragAndDrop";

interface DragGhostProps {
  visual: DragVisual | null;
  rootRef: RefObject<HTMLDivElement | null>;
}

/** Matches the `-mt-[72%]` overlap used by TableauView (100% - 72% = 28%). */
const STACK_OFFSET_PERCENT = 28;

export function DragGhost({ visual, rootRef }: DragGhostProps) {
  if (!visual || typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={rootRef}
      className="pointer-events-none fixed z-50"
      style={{
        left: visual.left,
        top: visual.top,
        width: visual.width,
        transform: `translate(${visual.initialDx}px, ${visual.initialDy}px)`,
      }}
    >
      {visual.cards.map((card, index) => (
        <div
          key={card.id}
          className="absolute inset-x-0 aspect-[63/88] w-full rounded-[6%] shadow-lg"
          style={{ top: `${index * STACK_OFFSET_PERCENT}%`, zIndex: index }}
        >
          <CardFace card={card} />
        </div>
      ))}
    </div>,
    document.body,
  );
}
