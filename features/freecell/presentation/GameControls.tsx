import { Button } from "@/components/ui/button";

interface GameControlsProps {
  canUndo: boolean;
  onNewGame: () => void;
  onRestart: () => void;
  onUndo: () => void;
}

export function GameControls({ canUndo, onNewGame, onRestart, onUndo }: GameControlsProps) {
  return (
    <div className="mx-auto flex w-full max-w-3xl items-center justify-end gap-2 px-2 sm:px-4">
      <Button size="sm" variant="outline" onClick={onUndo} disabled={!canUndo} aria-label="실행 취소">
        실행 취소
      </Button>
      <Button size="sm" variant="outline" onClick={onRestart} aria-label="같은 게임 다시 시작">
        다시 시작
      </Button>
      <Button size="sm" onClick={onNewGame} aria-label="새 게임">
        새 게임
      </Button>
    </div>
  );
}
