# 게임 문서 인덱스

`/tools/games`는 `features/games/catalog.ts`를 기준으로 10개 게임을 노출하고,
`features/games/presentation/GameHost.tsx`에서 각 게임을 클라이언트 전용으로
동적 로드한다.

이 폴더는 게임별 기획/개선/개발/기능개편 문서를 모아두는 공간이다. 현재 상세
문서가 작성된 게임은 2048, 솔리테어, 마인스위퍼, 프리셀 4개이며, 나머지 게임은
catalog와 feature 폴더 구현을 기준 문서로 본다.

## 게임별 문서

| 게임          | 상태      | 문서                               | 코드 경로                             |
| ------------- | --------- | ---------------------------------- | ------------------------------------- |
| Solitaire     | 상세 문서 | [solitaire.md](./solitaire.md)     | `features/games/solitaire/`           |
| 2048          | 상세 문서 | [2048.md](./2048.md)               | `features/games/game-2048/`           |
| 지뢰찾기      | 상세 문서 | [minesweeper.md](./minesweeper.md) | `features/games/minesweeper/`         |
| FreeCell      | 상세 문서 | [freecell.md](./freecell.md)       | `features/games/freecell/`            |
| 스도쿠        | catalog   | -                                  | `features/games/sudoku/`              |
| 3-Match       | catalog   | -                                  | `features/games/match-three/`         |
| 사칙연산 학습 | catalog   | -                                  | `features/games/arithmetic-addition/` |
| Typing Rain   | catalog   | -                                  | `features/games/typing-rain/`         |
| Slot Machine  | catalog   | -                                  | `features/games/slot-machine/`        |

## 공통 구조

- 모든 게임은 `/tools/games/[slug]` 하나의 route 패턴을 공유한다.
- slug, 제목, 설명, 안내 문구, 업데이트 날짜는 `features/games/catalog.ts`가
  소유한다.
- `GameHost.tsx`가 10개 게임 컴포넌트를 `dynamic(..., { ssr: false })`로
  로드해 초기 난수/브라우저 상태로 인한 hydration 불일치를 피한다.
- 게임 구현은 대체로 `domain`, `application`, `presentation` 계층을 따르며,
  복잡한 규칙은 순수 함수와 유스케이스 테스트로 검증한다.
- 현재 게임 관련 테스트 파일은 101개이며, 전체 저장소 테스트 148개 중 가장 큰
  비중을 차지한다.

## 참고

개별 상세 문서 4개는 작성 당시의 기획과 개선 방향을 보존하는 문서다. 현재
실행 가능한 게임 목록과 노출 순서는 항상 `features/games/catalog.ts`를 최종
기준으로 확인한다.
