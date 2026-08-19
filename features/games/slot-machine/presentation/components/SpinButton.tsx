import { RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SpinButtonProps {
  disabled: boolean;
  isBusy: boolean;
  onSpin: () => void;
}

export function SpinButton({ disabled, isBusy, onSpin }: SpinButtonProps) {
  return (
    <Button
      type="button"
      size="lg"
      className="min-h-14 w-full text-base font-bold"
      disabled={disabled}
      onClick={onSpin}
      aria-label="슬롯 머신 스핀"
    >
      <RotateCw className={isBusy ? "animate-spin" : undefined} aria-hidden />
      {isBusy ? "SPINNING" : "SPIN"}
    </Button>
  );
}
