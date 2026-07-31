import { cn } from "@/lib/utils";
import { SYMBOL_LABELS, type SlotSymbol } from "../../domain/symbols";
import styles from "../styles/slotMachine.module.css";

interface SymbolTileProps {
  symbol: SlotSymbol;
  isPayline?: boolean;
  isWinning?: boolean;
}

export function SymbolTile({
  symbol,
  isPayline = false,
  isWinning = false,
}: SymbolTileProps) {
  return (
    <div
      className={cn(
        styles.symbolTile,
        isPayline && styles.paylineTile,
        isWinning && styles.winningTile,
      )}
      aria-label={SYMBOL_LABELS[symbol]}
    >
      <span
        className={cn(styles.symbolShape, styles[symbol])}
        aria-hidden="true"
      >
        {getSymbolText(symbol)}
      </span>
      <span className="sr-only">{SYMBOL_LABELS[symbol]}</span>
    </div>
  );
}

function getSymbolText(symbol: SlotSymbol) {
  if (symbol === "seven") return "7";

  return SYMBOL_LABELS[symbol].slice(0, 1);
}
