import { cn } from "@/lib/utils";
import type { Card } from "../domain/entities/Card";
import type { BindDragHandle } from "./interaction/useDragAndDrop";
import { registerCardEl } from "./animation/cardRegistry";
import { CardFace } from "./CardFace";

interface WasteViewProps {
  waste: readonly Card[];
  selected: boolean;
  hidden: boolean;
  bindDragHandle: BindDragHandle;
  onClick: () => void;
}

export function WasteView({ waste, selected, hidden, bindDragHandle, onClick }: WasteViewProps) {
  const topCard = waste[waste.length - 1];
  const underCard = waste[waste.length - 2];

  return (
    <div className="relative aspect-[63/88] w-full">
      {underCard && (
        <div className="absolute inset-0 rounded-[6%]" aria-hidden="true">
          <CardFace card={underCard} />
        </div>
      )}
      <button
        type="button"
        ref={(el) => topCard && registerCardEl(topCard.id, el)}
        onClick={onClick}
        {...(topCard ? bindDragHandle({ zone: "waste" }) : {})}
        disabled={!topCard}
        className={cn(
          "absolute inset-0 appearance-none rounded-[6%] bg-transparent p-0",
          selected && "ring-2 ring-offset-1 ring-blue-500",
          hidden && "invisible",
        )}
        aria-label={
          topCard
            ? `Select ${topCard.rank} of ${topCard.suit} from the waste pile`
            : "Waste pile is empty"
        }
      >
        {topCard && <CardFace card={topCard} />}
      </button>
    </div>
  );
}
