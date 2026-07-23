import { Button } from "@/components/ui/button";

interface GameControlsProps {
  won: boolean;
  onNewGame: () => void;
}

export function GameControls({ won, onNewGame }: GameControlsProps) {
  return (
    <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-2 sm:px-4">
      <h1 className="text-lg font-semibold sm:text-xl">Solitaire</h1>
      <div className="flex items-center gap-3">
        {won && (
          <span className="text-sm font-semibold text-emerald-600" role="status">
            Victory!
          </span>
        )}
        <Button size="sm" onClick={onNewGame}>
          New Game
        </Button>
      </div>
    </div>
  );
}
