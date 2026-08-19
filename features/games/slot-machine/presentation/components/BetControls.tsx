import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BetControlsProps {
  bet: number;
  disabled: boolean;
  onDecrease: () => void;
  onIncrease: () => void;
}

export function BetControls({
  bet,
  disabled,
  onDecrease,
  onIncrease,
}: BetControlsProps) {
  return (
    <div className="grid grid-cols-[minmax(44px,1fr)_minmax(96px,1.4fr)_minmax(44px,1fr)] items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="min-h-11 px-3"
        disabled={disabled}
        onClick={onDecrease}
        aria-label="베팅 줄이기"
      >
        <Minus aria-hidden="true" />
        <span className="hidden sm:inline">Bet</span>
      </Button>
      <div className="rounded-md border border-neutral-200 bg-white px-3 py-2 text-center">
        <span className="block text-xs font-medium text-neutral-500">
          Current Bet
        </span>
        <strong className="text-xl text-neutral-950">
          {bet.toLocaleString()}
        </strong>
      </div>
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="min-h-11 px-3"
        disabled={disabled}
        onClick={onIncrease}
        aria-label="베팅 올리기"
      >
        <Plus aria-hidden="true" />
        <span className="hidden sm:inline">Bet</span>
      </Button>
    </div>
  );
}
