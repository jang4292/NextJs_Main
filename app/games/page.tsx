import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Games",
  description: "브라우저에서 즐기는 미니게임 모음",
};

const games = [
  {
    title: "Solitaire",
    description: "카드 한 벌로 즐기는 클론다이크 솔리테어",
    href: "/games/solitaire",
    ariaLabel: "Open Solitaire game page",
  },
  {
    title: "2048",
    description: "타일을 합쳐 2048을 만드는 퍼즐 게임",
    href: "/games/2048",
    ariaLabel: "Open 2048 game page",
  },
  {
    title: "지뢰찾기",
    description: "9×9 보드에서 지뢰 10개를 피해 칸을 여는 클래식 퍼즐 게임",
    href: "/games/minesweeper",
    ariaLabel: "Open Minesweeper game page",
  },
  {
    title: "FreeCell",
    description: "카드 한 벌로 즐기는 프리셀",
    href: "/games/freecell",
    ariaLabel: "Open FreeCell game page",
  },
  {
    title: "스도쿠",
    description: "9×9 보드에서 숫자를 채우는 클래식 스도쿠 퍼즐",
    href: "/games/sudoku",
    ariaLabel: "Open Sudoku game page",
  },
];

export default function GamesPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <h1 className="mb-6 text-3xl font-bold">Games</h1>

      <div className="w-full max-w-3xl px-4">
        <p className="mb-4 text-gray-600">
          브라우저에서 바로 즐길 수 있는 미니게임 모음입니다.
        </p>

        <ul className="grid gap-4">
          {games.map((game) => (
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
