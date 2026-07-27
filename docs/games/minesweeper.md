# 마인스위퍼

> 인덱스: [README.md](./README.md)

## 1. 기획서 / 분류

### 개요

지뢰가 숨겨진 격자에서 지뢰가 없는 칸을 모두 열면 승리하는 논리 퍼즐. 첫 클릭은 항상 안전하도록 지뢰 배치가 클릭 이후 결정된다.

### 코드 위치

- 도메인: `features/games/minesweeper/domain/entities`(Board, Cell, Position, Difficulty, GameState, GameStatus), `domain/rules`(boardQueries, cellGuards), `domain/services`(createBoard, placeMines, calculateAdjacentMines, floodReveal, setCellFlag, revealAllMines)
- 애플리케이션: `features/games/minesweeper/application`(MinesweeperGame.ts, GameSnapshot.ts), `use-cases`(startNewGame, revealCell, toggleFlag, restartGame, toSnapshot)
- 프레젠테이션: `features/games/minesweeper/presentation`(Minesweeper.tsx, BoardView, CellView, MinesweeperHeader, MinesweeperControls, ResultBanner) + hooks(`useMinesweeper`, `useElapsedTimer`) + interaction(`useCellInteraction`, `longPressGeometry`)
- 라우트: `app/(site)/tools/games/minesweeper/page.tsx`(single GameHost dynamic import, `ssr: false`) + `GameHost.tsx`

### 기능 분류

**구현 완료**

- 첫 클릭 안전 보장(`placeMines`가 `safePositions`를 받아 해당 위치를 제외하고 지뢰 배치)
- 플래그 지정: 데스크톱 우클릭, 모바일 롱프레스(`longPressGeometry.ts`) 또는 플래그 모드 토글(`useCellInteraction.ts`)
- 경과 시간 타이머(`useElapsedTimer.ts`)
- 잔여 지뢰 수 카운터
- 플러드필 방식 빈 칸 자동 열기(`floodReveal.ts`)
- 리듀서(`REVEAL`/`TOGGLE_FLAG`/`RESTART`)는 전적으로 순수 유스케이스에 위임 — "게임 규칙은 여기 없다"는 코드 주석이 명시적으로 존재(`useMinesweeper.ts`)

**부분 구현 (도메인은 있으나 UI로 노출되지 않음)**

- 난이도: `Difficulty` 타입(`domain/entities/Difficulty.ts`)은 `{ rows, columns, mineCount }`로 범용적으로 설계되어 있고, `useMinesweeper(difficulty: Difficulty = BEGINNER)`처럼 함수 시그니처도 난이도를 인자로 받도록 파라미터화되어 있음. 그러나 실제 정의된 값은 `BEGINNER = { rows: 9, columns: 9, mineCount: 10 }` 하나뿐이고, `Minesweeper.tsx`는 `useMinesweeper()`를 인자 없이 호출하므로 항상 Beginner로 고정됨. Intermediate/Expert 프리셋도, 난이도 선택 UI도 없음.

**미구현**

- 난이도 선택 UI (위 항목 참고)
- Undo (마인스위퍼 특성상 일반적으로 불필요한 기능)

## 2. 개선 방향

- 롱프레스(모바일 플래그) 임계값(`longPressGeometry.ts`)이 실수로 칸을 여는 것과 플래그 지정을 오인식하지 않는지 점검
- 플래그 모드 토글 UI의 발견성(모바일에서 우클릭이 불가능하므로 플래그 모드 전환 버튼의 가시성) 점검
- 게임 종료 시(`ResultBanner`) 승리/패배에 따라 지뢰 전체 공개(`revealAllMines`) 애니메이션/타이밍이 자연스러운지 확인
- 타이머(`useElapsedTimer`)가 탭 비활성화(백그라운드) 상태에서도 정확히 흐르는지, 혹은 의도적으로 멈추는지 동작 명확화

## 3. 개발 방향

- 세 게임 중 테스트 파일 수가 가장 많음(15개) — 도메인 로직(특히 `floodReveal`, `placeMines`)이 규칙이 복잡한 만큼 가장 두텁게 테스트되어 있는 것으로 보임. 다른 두 게임의 테스트 보강 시 참고할 만한 기준점.
- `Difficulty`가 이미 매개변수화되어 있어, 난이도 확장은 도메인/애플리케이션 레이어 변경 없이 프레젠테이션 레이어(난이도 선택 UI + `useMinesweeper(difficulty)` 호출부)만 수정하면 되는 구조 — 기능 개편 난이도가 낮은 항목
- `app/(site)/tools/games/minesweeper/page.tsx`의 `dynamic(..., { ssr: false })` 패턴은 2048/솔리테어와 동일하게 반복되므로 공통화 검토([README.md](./README.md) 참고)

## 4. 기능 개편 방향

- **난이도 선택 UI 추가**: `Difficulty` 타입에 `INTERMEDIATE`(예: 16×16, 지뢰 40), `EXPERT`(예: 30×16, 지뢰 99) 등 프리셋을 추가하고, `MinesweeperControls`에 난이도 선택 UI를 붙여 `useMinesweeper(difficulty)`에 전달. 도메인 레이어는 이미 이를 지원하므로 프레젠테이션 레이어 작업 위주.
- **게임 허브 페이지**: `app/(site)/tools/games/page.tsx` 가 `features/games/catalog.ts` 기반 진입점을 제공.
