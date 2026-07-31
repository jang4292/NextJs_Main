interface StatusPanelProps {
  balance: number;
  bet: number;
  lastPayout: number;
}

export function StatusPanel({ balance, bet, lastPayout }: StatusPanelProps) {
  return (
    <dl className="grid grid-cols-3 gap-2 rounded-lg border border-neutral-200 bg-white p-3 shadow-sm">
      <StatusItem label="Balance" value={balance} />
      <StatusItem label="Bet" value={bet} />
      <StatusItem label="Last Win" value={lastPayout} />
    </dl>
  );
}

function StatusItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="min-w-0 rounded-md bg-neutral-50 px-3 py-3 text-center">
      <dt className="text-xs font-medium tracking-normal text-neutral-500 uppercase">
        {label}
      </dt>
      <dd className="mt-1 truncate text-lg font-bold text-neutral-950">
        {value.toLocaleString()}
      </dd>
    </div>
  );
}
