export interface GameCatalogItem {
  title: string;
  description: string;
  href: `/games/${string}`;
  ariaLabel: string;
}

export const gameCatalog: GameCatalogItem[] = [
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
