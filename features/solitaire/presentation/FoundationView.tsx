import type { Card } from "../domain/entities/Card";
import type { Suit } from "../domain/value-objects/Suit";
import { CardFace } from "./CardFace";

const SUIT_SYMBOL: Record<Suit, string> = {
  spades: "♠",
  hearts: "♥",
  diamonds: "♦",
  clubs: "♣",
};

interface FoundationViewProps {
  suit: Suit;
  pile: readonly Card[];
  onClick: () => void;
}

export function FoundationView({ suit, pile, onClick }: FoundationViewProps) {
  const topCard = pile[pile.length - 1];

  return (
    <button
      type="button"
      onClick={onClick}
      className="aspect-[63/88] w-full appearance-none rounded-[6%] border border-dashed border-neutral-400 bg-transparent p-0"
      aria-label={`${suit} foundation, ${pile.length} cards`}
    >
      {topCard ? (
        <CardFace card={topCard} />
      ) : (
        <span className="flex h-full w-full items-center justify-center text-lg text-neutral-300">
          {SUIT_SYMBOL[suit]}
        </span>
      )}
    </button>
  );
}
