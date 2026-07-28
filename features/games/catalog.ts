export type GameSlug =
  | "solitaire"
  | "2048"
  | "minesweeper"
  | "freecell"
  | "sudoku"
  | "match-three";

export interface GameCatalogItem {
  slug: GameSlug;
  title: string;
  description: string;
  href: `/tools/games/${GameSlug}`;
  ariaLabel: string;
  instructions: string;
  updatedAt: string;
}

export const gameCatalog: GameCatalogItem[] = [
  {
    slug: "solitaire",
    title: "Solitaire",
    description: "카드 한 벌로 즐기는 클론다이크 솔리테어",
    href: "/tools/games/solitaire",
    ariaLabel: "Open Solitaire game page",
    instructions: "카드를 옮겨 네 개의 foundation pile을 완성합니다.",
    updatedAt: "2026-07-27",
  },
  {
    slug: "2048",
    title: "2048",
    description: "타일을 합쳐 2048을 만드는 퍼즐 게임",
    href: "/tools/games/2048",
    ariaLabel: "Open 2048 game page",
    instructions: "방향키나 스와이프로 같은 숫자 타일을 합칩니다.",
    updatedAt: "2026-07-27",
  },
  {
    slug: "minesweeper",
    title: "지뢰찾기",
    description: "9×9 보드에서 지뢰 10개를 피해 칸을 여는 클래식 퍼즐 게임",
    href: "/tools/games/minesweeper",
    ariaLabel: "Open Minesweeper game page",
    instructions: "안전한 칸을 열고 지뢰 위치에는 깃발을 표시합니다.",
    updatedAt: "2026-07-27",
  },
  {
    slug: "freecell",
    title: "FreeCell",
    description: "카드 한 벌로 즐기는 프리셀",
    href: "/tools/games/freecell",
    ariaLabel: "Open FreeCell game page",
    instructions: "free cell 네 칸을 활용해 모든 카드를 정리합니다.",
    updatedAt: "2026-07-27",
  },
  {
    slug: "sudoku",
    title: "스도쿠",
    description: "9×9 보드에서 숫자를 채우는 클래식 스도쿠 퍼즐",
    href: "/tools/games/sudoku",
    ariaLabel: "Open Sudoku game page",
    instructions: "각 행, 열, 3x3 박스에 1부터 9까지 중복 없이 채웁니다.",
    updatedAt: "2026-07-27",
  },
  {
    slug: "match-three",
    title: "3-Match",
    description: "보석을 맞바꿔 같은 모양 3개 이상을 연결하는 퍼즐 게임",
    href: "/tools/games/match-three",
    ariaLabel: "Open 3-Match game page",
    instructions: "인접한 보석을 교환해 목표 점수에 도달하세요.",
    updatedAt: "2026-07-27",
  },
];

export const gameSlugs = gameCatalog.map((game) => game.slug);

export function getGameBySlug(slug: string): GameCatalogItem | undefined {
  return gameCatalog.find((game) => game.slug === slug);
}
