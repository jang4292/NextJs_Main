"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { GameSlug } from "@/features/games/catalog";

const gameComponents = {
  solitaire: dynamic(
    () =>
      import("@/features/games/solitaire/presentation/SolitaireGame").then(
        (mod) => mod.SolitaireGame,
      ),
    {
      ssr: false,
      loading: () => <GameLoading />,
    },
  ),
  "2048": dynamic(
    () =>
      import("@/features/games/game-2048/presentation/Game2048").then(
        (mod) => mod.Game2048,
      ),
    {
      ssr: false,
      loading: () => <GameLoading />,
    },
  ),
  minesweeper: dynamic(
    () =>
      import("@/features/games/minesweeper/presentation/Minesweeper").then(
        (mod) => mod.Minesweeper,
      ),
    {
      ssr: false,
      loading: () => <GameLoading />,
    },
  ),
  freecell: dynamic(
    () =>
      import("@/features/games/freecell/presentation/FreecellGame").then(
        (mod) => mod.FreecellGame,
      ),
    {
      ssr: false,
      loading: () => <GameLoading />,
    },
  ),
  sudoku: dynamic(
    () =>
      import("@/features/games/sudoku/presentation/SudokuGame").then(
        (mod) => mod.SudokuGame,
      ),
    {
      ssr: false,
      loading: () => <GameLoading />,
    },
  ),
  "match-three": dynamic(
    () =>
      import("@/features/games/match-three/presentation/MatchThreeGame").then(
        (mod) => mod.MatchThreeGame,
      ),
    {
      ssr: false,
      loading: () => <GameLoading />,
    },
  ),
  "arithmetic-addition": dynamic(
    () =>
      import(
        "@/features/games/arithmetic-addition/presentation/ArithmeticGame"
      ).then((mod) => mod.ArithmeticGame),
    {
      ssr: false,
      loading: () => <GameLoading />,
    },
  ),
} satisfies Record<GameSlug, ComponentType>;

export function GameHost({ slug }: { slug: GameSlug }) {
  const GameComponent = gameComponents[slug];

  return <GameComponent />;
}

function GameLoading() {
  return (
    <div className="flex justify-center py-10 text-sm text-neutral-500">
      Loading...
    </div>
  );
}
