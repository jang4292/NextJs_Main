"use client";

import dynamic from "next/dynamic";

// Initial deal depends on Math.random() for the shuffle, so the board must
// not be rendered on the server (its output would differ from the client's
// re-shuffled deck on hydration). ssr: false skips server rendering.
const FreecellGame = dynamic(
  () => import("@/features/freecell/presentation/FreecellGame").then((mod) => mod.FreecellGame),
  {
    ssr: false,
    loading: () => (
      <div className="flex justify-center py-10 text-sm text-neutral-500">Loading…</div>
    ),
  },
);

export default function FreecellClient() {
  return <FreecellGame />;
}
