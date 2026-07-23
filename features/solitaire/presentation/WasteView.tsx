import { cn } from "@/lib/utils";
import type { Card } from "../domain/entities/Card";
import { CardFace } from "./CardFace";

interface WasteViewProps {
  waste: readonly Card[];
  selected: boolean;
  onClick: () => void;
}

export function WasteView({ waste, selected, onClick }: WasteViewProps) {
  const topCard = waste[waste.length - 1];

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!topCard}
      className={cn(
        "aspect-[63/88] w-full appearance-none rounded-[6%] bg-transparent p-0",
        selected && "ring-2 ring-offset-1 ring-blue-500",
      )}
      aria-label={
        topCard
          ? `Select ${topCard.rank} of ${topCard.suit} from the waste pile`
          : "Waste pile is empty"
      }
    >
      {topCard && <CardFace card={topCard} />}
    </button>
  );
}
