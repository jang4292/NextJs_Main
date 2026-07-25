"use client";

import dynamic from "next/dynamic";

// The puzzle is chosen via Math.random() on mount, so the board must not be
// rendered on the server (its output would differ from the client's
// re-picked puzzle on hydration). ssr: false skips server rendering.
const SudokuGame = dynamic(
  () =>
    import("@/features/sudoku/presentation/SudokuGame").then(
      (mod) => mod.SudokuGame,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex justify-center py-10 text-sm text-neutral-500">
        Loading…
      </div>
    ),
  },
);

export default function SudokuClient() {
  return <SudokuGame />;
}
