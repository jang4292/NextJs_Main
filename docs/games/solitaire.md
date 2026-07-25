# 솔리테어 (클론다이크)

> 인덱스: [README.md](./README.md)

## 1. 기획서 / 분류

### 개요
표준 클론다이크(Klondike) 규칙의 카드 패션스 게임. 카드를 파운데이션(foundation) 4곳에 무늬별로 A부터 K까지 쌓아 52장 전체를 옮기면 승리(`isGameWon`, `winCheck.ts`).

### 코드 위치
- 도메인: `features/solitaire/domain/entities`(Card, Deck, Move, GameState), `domain/value-objects`(Suit, Rank, CardColor), `domain/rules`(tableauRules, foundationRules, stockRules), `domain/services`(dealInitial, shuffle, winCheck)
- 애플리케이션: `features/solitaire/application/use-cases`(drawFromStock, recycleWaste, moveCard, flipTableauTop, startNewGame)
- 프레젠테이션: `features/solitaire/presentation`(GameBoard, FoundationView, StockView, TableauView, WasteView, CardFace, GameControls) + `animation/`(cardMotion, useMoveAnimator, cardRegistry) + `interaction/`(useDragAndDrop, useDoubleTap, useSolitaireInteractions, hitTest, DragGhost) + `image/getCardImage.ts`
- 라우트: `app/games/solitaire/page.tsx`(동적 임포트, `ssr: false`) + `SolitaireClient.tsx`

### 기능 분류

**구현 완료**
- 표준 클론다이크 규칙(스톡/웨이스트/타블로/파운데이션 룰이 `domain/rules`에 분리)
- 드래그앤드롭 이동(`useDragAndDrop.ts`, `hitTest.ts`, `DragGhost.tsx`) + 클릭 선택 후 목적지 클릭 방식 병행
- 더블탭/더블클릭으로 카드 1장을 파운데이션으로 자동 이동(`useDoubleTap.ts` — PC 더블클릭과 모바일 더블탭을 하나의 코드 경로로 처리, 300ms 윈도우)
- 카드 이동 애니메이션 시스템(`animation/cardMotion.ts`, `useMoveAnimator.ts`, `cardRegistry.ts`)
- 승리 판정(파운데이션 52장 완성 시)

**부분 구현**
- 없음 (도메인 레이어에 미노출 파라미터 형태의 확장 포인트는 발견되지 않음)

**미구현**
- Undo: `useSolitaireGame.ts`의 리듀서 액션은 `NEW_GAME`/`DRAW_OR_RECYCLE`/`CLICK_TABLEAU`/`CLICK_WASTE`/`CLICK_FOUNDATION`/`COMMIT_MOVE`뿐이며 되돌리기 액션이 없음.
- 자동완성(auto-finish): 더블탭은 카드 한 장 단위 자동 이동만 지원하며, "남은 패가 모두 확정적으로 승리 가능할 때 한 번에 정리"하는 전체 자동완성 기능은 없음.
- 힌트(가능한 이동 제안) 기능 없음.

## 2. 개선 방향

- 드래그앤드롭과 클릭 선택 두 인터랙션 경로가 공존하는 만큼(`useDragAndDrop` + `useSolitaireInteractions`의 클릭 로직), 두 경로 간 상태 동기화 엣지 케이스(드래그 중 클릭 이벤트 발생 등) 점검
- 모바일에서 드래그 제스처와 스크롤 제스처가 충돌하지 않는지 확인
- 카드 이동 애니메이션(`cardMotion.ts`)이 저사양 기기에서도 끊기지 않는지 성능 점검
- 스톡 리사이클(`recycleWaste`) 시 안내 UX(예: 남은 리사이클 횟수 제한이 있는 변형 규칙 지원 여부) 명확화

## 3. 개발 방향

- 세 게임 중 파일 수(47)·코드 라인 수(~1,354)가 가장 커서 복잡도가 높음 — `domain/rules`(tableauRules/foundationRules/stockRules)의 규칙 조합 테스트를 우선 보강
- 드래그앤드롭(`useDragAndDrop.ts`)과 애니메이션(`useMoveAnimator.ts`) 레이어가 분리되어 있어, 향후 접근성 대응(키보드만으로 카드 이동) 추가 시 클릭 선택 경로(`useSolitaireInteractions.ts`)를 확장하는 방향이 드래그 로직보다 수월할 것으로 예상
- `app/games/solitaire/page.tsx`의 `dynamic(..., { ssr: false })` 패턴은 2048/마인스위퍼와 동일하게 반복되므로 공통화 검토([README.md](./README.md) 참고)

## 4. 기능 개편 방향

- **Undo 기능 추가**: `COMMIT_MOVE` 시점마다 직전 `GameState` 스냅샷을 스택에 쌓아 `UNDO` 액션으로 복원. 카드 이동 애니메이션(`useMoveAnimator`)과 되감기 시 시각적 처리를 함께 설계해야 함.
- **자동완성(auto-finish) 기능**: 모든 타블로 카드가 뒤집혀 있고 남은 이동이 파운데이션행으로 결정 가능한 상태를 감지해, 버튼 한 번으로 나머지를 자동 정리하는 기능. `isGameWon` 판정 로직과 유사하게 "승리 확정 여부"를 판별하는 함수를 도메인에 추가하는 것이 선행 작업.
- **게임 허브 페이지**: `app/games/page.tsx` 부재는 세 게임 공통 이슈 — [README.md](./README.md) 참고.
