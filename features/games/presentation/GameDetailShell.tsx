import { BackLink } from "@/components/navigation/BackLink";
import { GameHost } from "@/features/games/presentation/GameHost";
import type { GameCatalogItem } from "@/features/games/catalog";

export function GameDetailShell({ game }: { game: GameCatalogItem }) {
  return (
    <div className="space-y-6">
      <BackLink href="/tools/games">Back to games</BackLink>
      <header>
        <h1 className="text-3xl font-bold text-neutral-950">{game.title}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-neutral-600">
          {game.description}
        </p>
        <p className="mt-2 text-xs text-neutral-500">{game.instructions}</p>
      </header>
      <GameHost slug={game.slug} />
    </div>
  );
}
