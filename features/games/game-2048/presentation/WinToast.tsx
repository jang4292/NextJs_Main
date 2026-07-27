"use client";

interface WinToastProps {
  onDismiss: () => void;
}

export function WinToast({ onDismiss }: WinToastProps) {
  return (
    <div className="absolute inset-x-0 top-2 z-20 mx-auto flex w-fit items-center gap-3 rounded-md bg-amber-400 px-4 py-2 text-sm font-semibold text-amber-950 shadow-md">
      <span>You reached 2048!</span>
      <button
        type="button"
        onClick={onDismiss}
        className="rounded bg-amber-950/10 px-2 py-1 text-xs font-bold transition-colors hover:bg-amber-950/20"
        aria-label="Dismiss and keep playing"
      >
        Continue
      </button>
    </div>
  );
}
