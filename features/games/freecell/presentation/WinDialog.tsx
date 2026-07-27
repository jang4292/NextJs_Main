import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import styles from "./styles/freecell.module.css";

interface WinDialogProps {
  moveCount: number;
  elapsedSeconds: number;
  onNewGame: () => void;
  onRestart: () => void;
}

function formatElapsed(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}분 ${String(seconds).padStart(2, "0")}초`;
}

export function WinDialog({
  moveCount,
  elapsedSeconds,
  onNewGame,
  onRestart,
}: WinDialogProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4",
        styles.winDialogOverlay,
      )}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="freecell-win-title"
        className={cn(
          "bg-background w-full max-w-sm rounded-lg border p-6 text-center shadow-lg",
          styles.winDialog,
        )}
      >
        <h2 id="freecell-win-title" className="text-xl font-semibold">
          🎉 승리했습니다!
        </h2>
        <p className="text-muted-foreground mt-2 text-sm">
          이동 횟수 {moveCount}회 · 경과 시간 {formatElapsed(elapsedSeconds)}
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <Button variant="outline" onClick={onRestart}>
            같은 게임 다시 시작
          </Button>
          <Button onClick={onNewGame}>새 게임</Button>
        </div>
      </div>
    </div>
  );
}
