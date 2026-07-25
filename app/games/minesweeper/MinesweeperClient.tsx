"use client";

import dynamic from "next/dynamic";

// Mine placement depends on Math.random() and only happens after the first
// client-side reveal, so the board must not be rendered on the server (its
// output would differ from the client's own random placement on hydration).
// ssr: false skips server rendering, same reasoning as 2048/Solitaire.
const Minesweeper = dynamic(
  () => import("@/features/minesweeper/presentation/Minesweeper").then((mod) => mod.Minesweeper),
  {
    ssr: false,
    loading: () => (
      <div className="flex justify-center py-10 text-sm text-neutral-500">Loading…</div>
    ),
  },
);

export default function MinesweeperClient() {
  return <Minesweeper />;
}
