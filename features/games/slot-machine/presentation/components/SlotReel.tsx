import { cn } from "@/lib/utils";
import type { ReelWindow } from "../../domain/slot.types";
import { SymbolTile } from "./SymbolTile";
import styles from "../styles/slotMachine.module.css";

interface SlotReelProps {
  reel: ReelWindow;
  isSpinning: boolean;
  isWinning: boolean;
}

export function SlotReel({ reel, isSpinning, isWinning }: SlotReelProps) {
  return (
    <div
      className={cn(styles.reel, isSpinning && styles.spinningReel)}
      aria-label={isSpinning ? "회전 중인 릴" : "정지한 릴"}
    >
      <SymbolTile symbol={reel.top} />
      <SymbolTile symbol={reel.middle} isPayline isWinning={isWinning} />
      <SymbolTile symbol={reel.bottom} />
    </div>
  );
}
