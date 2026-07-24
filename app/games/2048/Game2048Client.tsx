"use client";

import dynamic from "next/dynamic";

// Initial board depends on Math.random() for tile spawn, so the board must
// not be rendered on the server (its output would differ from the client's
// re-spawned tiles on hydration). ssr: false skips server rendering, same
// reasoning as Solitaire's dynamic import.
const Game2048 = dynamic(
  () => import("@/features/2048/presentation/Game2048").then((mod) => mod.Game2048),
  {
    ssr: false,
    loading: () => (
      <div className="flex justify-center py-10 text-sm text-neutral-500">Loading…</div>
    ),
  },
);

export default function Game2048Client() {
  return <Game2048 />;
}
