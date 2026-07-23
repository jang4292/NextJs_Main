import type { Card } from "../domain/entities/Card";
import { CardFace } from "./CardFace";

interface StockViewProps {
  stock: readonly Card[];
  onClick: () => void;
}

export function StockView({ stock, onClick }: StockViewProps) {
  const topCard = stock[stock.length - 1];

  return (
    <button
      type="button"
      onClick={onClick}
      className="aspect-[63/88] w-full appearance-none rounded-[6%] border border-dashed border-neutral-400 bg-transparent p-0"
      aria-label={
        topCard ? "Draw a card from the stock" : "Recycle the waste pile back into the stock"
      }
    >
      {topCard ? (
        <CardFace card={topCard} />
      ) : (
        <span className="flex h-full w-full items-center justify-center text-lg text-neutral-400">
          ↺
        </span>
      )}
    </button>
  );
}
