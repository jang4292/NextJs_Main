import { cn } from "@/lib/utils";
import type { Card } from "../domain/entities/Card";
import { rankLabel } from "../domain/value-objects/Rank";

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
 * Card face rendered entirely with HTML + CSS, no images. Purely decorative:
 * the enclosing button carries the accessible name, so this is aria-hidden
 * to avoid the rank/suit text being announced twice by screen readers.
 */
export function CardFace({ card, className }: CardFaceProps) {
  const suitClassName = card.color === "red" ? "text-red-600" : "text-neutral-900";
  const label = rankLabel(card.rank);
  const symbol = SUIT_SYMBOL[card.suit];

  return (
    <div
      aria-hidden="true"
      className={cn(
        "@container flex h-full w-full flex-col justify-between overflow-hidden rounded-[6%] border border-neutral-300 bg-white p-[6%] select-none",
        suitClassName,
        className,
      )}
    >
      <span className="text-[20cqw] leading-none font-semibold whitespace-nowrap">
        {label} {symbol}
      </span>
      <span className="self-center text-[40cqw] leading-none">{symbol}</span>
      <span className="self-end rotate-180 text-[20cqw] leading-none font-semibold whitespace-nowrap">
        {label} {symbol}
      </span>
    </div>
  );
}
