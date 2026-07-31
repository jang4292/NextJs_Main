import { PAYOUT_MULTIPLIERS, SLOT_SYMBOLS } from "../../domain/symbols";
import { SymbolTile } from "./SymbolTile";

export function PayoutTable() {
  return (
    <section className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
      <h2 className="text-base font-bold text-neutral-950">Payout Table</h2>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {SLOT_SYMBOLS.map((symbol) => (
          <div
            key={symbol}
            className="flex items-center justify-between gap-2 rounded-md bg-neutral-50 p-2"
          >
            <SymbolTile symbol={symbol} />
            <span className="text-sm font-bold text-neutral-900">
              x{PAYOUT_MULTIPLIERS[symbol]}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs leading-relaxed text-neutral-600">
        가운데 페이라인의 같은 심볼 3개만 당첨으로 계산합니다.
      </p>
    </section>
  );
}
