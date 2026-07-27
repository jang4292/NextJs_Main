import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import {
  gameCatalog,
  getGameBySlug,
  type GameSlug,
} from "@/features/games/catalog";
import { GameDetailShell } from "@/features/games/presentation/GameDetailShell";

export function generateStaticParams() {
  return gameCatalog.map((game) => ({ slug: game.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const game = getGameBySlug(slug);

  if (!game) {
    return { title: "Game Not Found" };
  }

  return {
    title: game.title,
    description: game.description,
  };
}

export default async function GameDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const game = getGameBySlug(slug);

  if (!game) {
    notFound();
  }

  return (
    <PageShell size="wide">
      <GameDetailShell game={{ ...game, slug: game.slug as GameSlug }} />
    </PageShell>
  );
}
