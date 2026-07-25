import Link from "next/link";
import { Metadata } from "next";
import { gameCatalog } from "@/data/games";

export const metadata: Metadata = {
  title: "Games",
  description: "브라우저에서 즐기는 미니게임 모음",
};

export default function GamesPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <h1 className="mb-6 text-3xl font-bold">Games</h1>

      <div className="w-full max-w-3xl px-4">
        <p className="mb-4 text-gray-600">
          브라우저에서 바로 즐길 수 있는 미니게임 모음입니다.
        </p>

        <ul className="grid gap-4">
          {gameCatalog.map((game) => (
            <li key={game.href}>
              <Link
                href={game.href}
                className="block rounded-lg border bg-white p-4 transition-shadow hover:shadow-md"
                aria-label={game.ariaLabel}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold">{game.title}</h2>
                    <p className="text-sm text-gray-500">{game.description}</p>
                  </div>
                  <div className="text-sm text-blue-500">→</div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
