"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Card } from "../domain/entities/Card";
import { getCardImagePath } from "./image/getCardImage";

const SUIT_SYMBOL: Record<Card["suit"], string> = {
  spades: "♠",
  hearts: "♥",
  diamonds: "♦",
  clubs: "♣",
};

interface CardFaceProps {
  card: Card;
  className?: string;
}

/**
 * Single point where a Card (pure data) becomes a visual. Renders CSS-only
 * placeholders today; the moment matching files exist under
 * public/images/cards/ (see getCardImage.ts naming convention), the <img>
 * below loads them automatically and this component needs no changes.
 */
export function CardFace({ card, className }: CardFaceProps) {
  const [imageFailed, setImageFailed] = useState(false);

  if (!card.faceUp) {
    return (
      <div
        className={cn(
          "h-full w-full rounded-[6%] border border-blue-950 bg-gradient-to-br from-blue-700 to-blue-950",
          className,
        )}
        aria-hidden="true"
      />
    );
  }

  if (!imageFailed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- static local card art, next/image offers no benefit for many small simultaneously-rendered cards
      <img
        src={getCardImagePath(card)}
        alt={`${card.rank} of ${card.suit}`}
        className={cn("h-full w-full rounded-[6%] object-contain", className)}
        draggable={false}
        onError={() => setImageFailed(true)}
      />
    );
  }

  const suitClassName =
    card.color === "red" ? "text-red-600" : "text-neutral-900";

  return (
    <div
      className={cn(
        "@container flex h-full w-full flex-col justify-between overflow-hidden rounded-[6%] border border-neutral-300 bg-white p-[6%] select-none",
        suitClassName,
        className,
      )}
      role="img"
      aria-label={`${card.rank} of ${card.suit}`}
    >
      <span className="text-[20cqw] leading-none font-semibold whitespace-nowrap">
        {card.rank} {SUIT_SYMBOL[card.suit]}
      </span>
      <span className="self-center text-[40cqw] leading-none">
        {SUIT_SYMBOL[card.suit]}
      </span>
      <span className="rotate-180 self-end text-[20cqw] leading-none font-semibold whitespace-nowrap">
        {card.rank} {SUIT_SYMBOL[card.suit]}
      </span>
    </div>
  );
}
