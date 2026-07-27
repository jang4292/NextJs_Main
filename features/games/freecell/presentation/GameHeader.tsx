interface GameHeaderProps {
  elapsedSeconds: number;
  moveCount: number;
}

function formatElapsed(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function GameHeader({ elapsedSeconds, moveCount }: GameHeaderProps) {
  return (
    <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-2 sm:px-4">
      <h1 className="text-lg font-semibold sm:text-xl">FreeCell</h1>
      <div
        className="flex items-center gap-4 text-sm text-neutral-600"
        role="status"
      >
        <span aria-label={`경과 시간 ${formatElapsed(elapsedSeconds)}`}>
          ⏱ {formatElapsed(elapsedSeconds)}
        </span>
        <span aria-label={`이동 횟수 ${moveCount}회`}>이동 {moveCount}회</span>
      </div>
    </div>
  );
}
