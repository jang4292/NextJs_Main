interface ResultMessageProps {
  message: string;
  isGameOver: boolean;
}

export function ResultMessage({ message, isGameOver }: ResultMessageProps) {
  return (
    <div
      className="rounded-lg border border-neutral-200 bg-white px-4 py-3 text-center shadow-sm"
      role="status"
      aria-live="polite"
    >
      <p className="text-sm font-semibold text-neutral-950">{message}</p>
      {isGameOver && (
        <p className="mt-1 text-xs text-red-700">
          최소 베팅보다 잔액이 적어 새 게임이 필요합니다.
        </p>
      )}
    </div>
  );
}
