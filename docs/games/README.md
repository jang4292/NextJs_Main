# 게임 문서 인덱스

`app/games/` 하위에 있는 2048, 솔리테어(클론다이크), 마인스위퍼 세 미니게임에 대한 기획/개선/개발/기능개편 문서 모음이다.

이 게임들은 최근 커밋(2048 #29, 솔리테어 #27, 마인스위퍼 #30)으로 추가되었지만, 기존 저장소 문서(`README.md`, `REPORT.md`, `docs/ARCHITECTURE.md`, `docs/REPORT_KO.md`, `docs/REPORT_EN.md`)는 모두 그 이전에 작성되어 게임 관련 내용을 다루지 않는다. 이 폴더는 게임 세 개를 기준으로 별도로 문서를 정리하기 위해 신설했다.

## 게임별 문서

| 게임 | 문서 |
|---|---|
| 2048 | [2048.md](./2048.md) |
| 솔리테어 (클론다이크) | [solitaire.md](./solitaire.md) |
| 마인스위퍼 | [minesweeper.md](./minesweeper.md) |

각 문서는 동일하게 4개 섹션(①기획서/분류 ②개선 방향 ③개발 방향 ④기능 개편 방향)으로 구성된다.

## 게임 분류표

| 항목 | 2048 | 솔리테어 | 마인스위퍼 |
|---|---|---|---|
| 장르 | 숫자 타일 퍼즐 | 카드 패션스(클론다이크) | 논리 퍼즐 |
| 코드 경로 | `features/2048/`, `app/games/2048/` | `features/solitaire/`, `app/games/solitaire/` | `features/minesweeper/`, `app/games/minesweeper/` |
| 상태 관리 | `useReducer`(MOVE/RESTART/CLEAR_TILE_FLAGS) + 순수 유스케이스 | `useReducer`(NEW_GAME/DRAW_OR_RECYCLE/CLICK_TABLEAU/CLICK_WASTE/CLICK_FOUNDATION/COMMIT_MOVE) + 별도 드래그앤드롭 인터랙션 레이어 | `useReducer`(REVEAL/TOGGLE_FLAG/RESTART) + 순수 유스케이스, 타이머/모바일 플래그모드는 `useState` |
| 파일 수 (테스트 제외) | 25 | 37 | 33 |
| 테스트 파일 수 | 9 | 10 | 15 |
| 코드 라인 수 (테스트 제외, 대략) | ~870 | ~1,354 | ~861 |
| 입력 방식 | 키보드 + 스와이프 | 드래그앤드롭 + 클릭 선택 + 더블탭 | 클릭/우클릭 + 롱프레스/모바일 플래그모드 |
| 저장 상태 | 최고 점수(localStorage) | 없음 | 없음 |
| 난이도/설정 UI | 없음 (보드 4×4 고정) | 없음 | 없음 (Beginner 9×9/지뢰10 고정) |
| Undo | 없음 | 없음 | 해당 없음(마인스위퍼 특성상 불필요) |

## 공통 관찰 사항

- **게임 간 공유 코드 없음**: 세 게임 모두 `features/{game}/{domain,application,presentation}` 구조를 독립적으로 갖고 있고, 공유되는 게임 전용 UI 컴포넌트·훅·유틸이 없다. 공유되는 것은 사이트 공통 UI(`components/NavBar.tsx`, `Footer.tsx`, `ui/button.tsx` 등)뿐이다.
- **`dynamic import ssr:false` 패턴 중복**: 세 게임의 `app/games/{game}/page.tsx`가 각각 동일한 이유(초기 보드/딜 상태가 `Math.random()`에 의존해 하이드레이션 불일치 방지)로 클라이언트 전용 동적 임포트를 개별 구현하고 있다.
- **게임 허브 페이지 부재**: `app/games/page.tsx`가 존재하지 않아, 세 게임에 대한 진입점을 한 곳에서 모아 보여주는 목록 페이지가 없다.
- **테스트 커버리지 편차**: 마인스위퍼(15개)에 비해 2048(9개)·솔리테어(10개)의 테스트 파일 수가 적다.
