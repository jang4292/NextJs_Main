# 프리셀 (FreeCell)

> 인덱스: [README.md](./README.md)

## 1. 기획서 / 분류

### 개요

표준 프리셀 규칙의 카드 패션스 게임. 52장을 8개 Tableau 열(7,7,7,7,6,6,6,6장)에 전부 앞면으로 배치하고, FreeCell 4칸과 Foundation 4곳(무늬별 A→K)을 이용해 모든 카드를 Foundation으로 옮기면 승리(`isGameWon`, `winCheck.ts`). 조커 없음, Rank는 내부적으로 1~13 숫자로 표현하고 화면 표시 시에만 A/J/Q/K로 변환한다(`rankLabel`, `Rank.ts`).

### 코드 위치

- 도메인: `features/games/freecell/domain/entities`(Card, Deck, GameState, Move), `domain/value-objects`(Suit, Rank, CardColor), `domain/rules`(tableauRules, freeCellRules, foundationRules), `domain/services`(shuffle, dealInitial, moveCapacity, winCheck)
- 애플리케이션: `features/games/freecell/application/use-cases`(startNewGame, moveCard, undoMove)
- 프레젠테이션: `features/games/freecell/presentation`(FreecellGame, GameHeader, GameControls, FreeCellSlot, FoundationSlot, TableauColumn, CardFace, WinDialog) + `hooks/`(useFreecellGame, usePersistedFreecell) + `interaction/`(useFreecellInteractions, hitTest) + `styles/freecell.module.css`
- 라우트: `app/(site)/tools/games/freecell/page.tsx`(single GameHost dynamic import, `ssr: false`) + `GameHost.tsx`, `app/(site)/tools/page.tsx`에 진입 링크 등록

### 기능 분류

**구현 완료**

- 표준 프리셀 규칙(Tableau/FreeCell/Foundation 룰이 `domain/rules`에 분리, 복수 카드 이동 용량 계산은 `domain/services/moveCapacity.ts`에 별도 순수 함수로 분리)
- 클릭/탭 선택 후 목적지 선택 방식(`useFreecellGame.ts`의 `SELECT_OR_MOVE` 액션)으로 게임 전체 진행 가능
- Pointer Events 기반 드래그 앤 드롭(`useFreecellInteractions.ts`, `hitTest.ts`) — HTML5 Drag and Drop API 미사용, 마우스와 터치를 동일 코드 경로로 처리
- Undo(이전 `GameState` 스냅샷 스택, `undoMove.ts`), Restart(최초 배치로 복원), New Game(재셔플)
- 이동 횟수·경과 시간 표시, 승리 판정 및 승리 다이얼로그(`WinDialog.tsx`)
- `localStorage` 기반 저장/복구(`usePersistedFreecell.ts`, 버전 필드 포함, 파싱 실패 시 새 게임으로 안전하게 폴백)
- 카드와 애니메이션 모두 외부 이미지·라이브러리 없이 CSS로 구현(`CardFace.tsx`, `freecell.module.css`), `prefers-reduced-motion` 대응 포함
- 반응형 카드 크기(`clamp()` 기반 CSS 변수)로 모바일 세로 화면에서도 8열이 가로 스크롤 없이 표시됨

**부분 구현**

- 드래그 중 목적지의 valid/invalid 시각 피드백은 클릭 선택 흐름(선택된 카드의 `selected` 상태)에만 적용되어 있고, 실시간 드래그 호버 중 목적지 하이라이트는 미구현(CSS 상태 클래스 자체는 `freecell.module.css`에 정의되어 있음)

**미구현**

- 자동완성(auto-finish): 남은 이동이 전부 Foundation행으로 확정될 때 한 번에 정리하는 기능 없음(솔리테어와 동일하게 미구현)
- 힌트(가능한 이동 제안) 기능 없음
- 카드 이동 애니메이션은 CSS transform 기반 직접 이동/스냅백만 지원하며, 솔리테어의 `cardMotion.ts`/`useMoveAnimator.ts`류의 FLIP 애니메이션 시스템은 의도적으로 사용하지 않음(MVP 범위에서 CSS 우선 원칙에 따른 선택)

## 2. 개선 방향

- 드래그 중 실시간 valid/invalid 목적지 하이라이트 추가 검토(현재는 pointermove마다 상태를 갱신하지 않아 성능을 아끼는 대신 시각 피드백이 약함)
- 자동완성 기능 부재로 마무리 단계에서 카드를 하나씩 옮겨야 함 — 솔리테어의 기능 개편 방향과 동일한 이슈([solitaire.md](./solitaire.md) 참고)
- 복수 카드 이동 시 이동 가능 여부는 판정되지만, 사용자에게 "왜 이동할 수 없는지"(예: MOVE_CAPACITY_EXCEEDED)를 알려주는 UI 피드백은 없음(현재는 조용히 실패 처리)

## 3. 개발 방향

- 도메인 규칙(`domain/rules`, `domain/services`)에 52개의 단위 테스트가 이미 있어 회귀 방지 기반은 탄탄한 편 — UI 상호작용 테스트(`*.test.tsx`)는 세 기존 게임과 마찬가지로 아직 없음
- `calculateMoveCapacity`가 독립 함수로 분리되어 있어 Cocos Creator 등 다른 런타임으로 코어 규칙을 이식할 때 `domain/`, `application/` 전체를 그대로 재사용할 수 있는 구조([README.md](./README.md)의 "게임 간 공유 코드 없음" 관찰과 별개로, 프리셀 자체는 React/Next.js에 의존하지 않는 순수 TypeScript로 작성됨)
- `app/(site)/tools/games/freecell/page.tsx`의 `dynamic(..., { ssr: false })` 패턴은 2048/솔리테어/마인스위퍼와 동일하게 반복되므로 공통화 검토 여지가 있음([README.md](./README.md) 참고)

## 4. 기능 개편 방향

- **드래그 중 실시간 하이라이트**: `useFreecellInteractions.ts`의 `onPointerMove`에서 `requestAnimationFrame`으로 스로틀링한 히트테스트 결과를 이용해 목적지 후보 요소에 `validTarget`/`invalidTarget` 클래스를 토글하는 방향으로 확장 가능(현재 `freecell.module.css`에 두 클래스가 이미 정의되어 있어 스타일 작업은 불필요)
- **자동완성(auto-finish) 기능**: `isGameWon`과 유사하게 "남은 카드가 전부 Foundation행으로 확정 가능한 상태"를 판별하는 함수를 `domain/services`에 추가하고, 버튼 클릭 시 `moveCard`를 반복 호출해 정리하는 유스케이스 추가
- **게임 허브 페이지**: `app/(site)/tools/games/page.tsx` 가 `features/games/catalog.ts` 기반 진입점을 제공
