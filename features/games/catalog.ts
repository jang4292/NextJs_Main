export type GameSlug =
  | "solitaire"
  | "2048"
  | "minesweeper"
  | "freecell"
  | "sudoku"
  | "match-three"
  | "arithmetic-addition"
  | "typing-rain"
  | "slot-machine"
  | "bulls-and-cows";

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
  {
    slug: "arithmetic-addition",
    title: "사칙연산 학습",
    description:
      "덧셈, 뺄셈, 곱셈, 나눗셈을 단계별로 풀며 기초 연산 감각을 키우는 학습 게임",
    href: "/tools/games/arithmetic-addition",
    ariaLabel: "Open arithmetic learning game page",
    instructions:
      "연산과 단계를 고른 뒤 숫자 패드로 답을 입력하고 10문제 학습을 완료합니다.",
    updatedAt: "2026-07-28",
  },
  {
    slug: "typing-rain",
    title: "Typing Rain",
    description:
      "떨어지는 한글과 영문 단어를 입력해 점수를 올리는 타자 연습 게임",
    href: "/tools/games/typing-rain",
    ariaLabel: "Open Typing Rain game page",
    instructions:
      "하단 입력창에 떨어지는 단어를 정확히 입력해 체력이 다하기 전까지 도전합니다.",
    updatedAt: "2026-07-29",
  },
  {
    slug: "slot-machine",
    title: "Slot Machine",
    description: "가상 크레딧으로 즐기는 3릴 단일 페이라인 슬롯 머신",
    href: "/tools/games/slot-machine",
    ariaLabel: "Open Slot Machine game page",
    instructions: "베팅을 선택하고 가운데 페이라인에 같은 심볼 3개를 맞춥니다.",
    updatedAt: "2026-07-30",
  },
  {
    slug: "bulls-and-cows",
    title: "숫자 야구",
    description: "중복 없는 세 자리 숫자를 추리하는 Bulls and Cows 게임",
    href: "/tools/games/bulls-and-cows",
    ariaLabel: "Open Bulls and Cows game page",
    instructions:
      "0은 첫 자리를 제외하고 사용할 수 있으며, 10번 안에 3 Strike를 맞히면 승리합니다.",
    updatedAt: "2026-08-19",
  },
];

export const gameSlugs = gameCatalog.map((game) => game.slug);

export function getGameBySlug(slug: string): GameCatalogItem | undefined {
  return gameCatalog.find((game) => game.slug === slug);
}
