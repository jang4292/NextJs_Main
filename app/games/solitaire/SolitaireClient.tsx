"use client";

import dynamic from "next/dynamic";

// Initial game state depends on Math.random() for the shuffle, so the board
// must not be rendered on the server (its output would differ from the
// client's re-shuffled deck on hydration). ssr: false skips server rendering.
const SolitaireGame = dynamic(
  () => import("@/features/solitaire/presentation/SolitaireGame").then((mod) => mod.SolitaireGame),
  {
    ssr: false,
    loading: () => (
      <div className="flex justify-center py-10 text-sm text-neutral-500">Loading…</div>
    ),
  },
);

export default function SolitaireClient() {
  return <SolitaireGame />;
}
