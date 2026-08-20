# 프로젝트 아키텍처 전수 감사 보고서

> - 작성일: 2026-08-20
> - 기준: Clean Architecture, MVVM, DDD 엄격 기준
> - 대상 브랜치: `feature/navigator-logics`
> - 대상 HEAD: `d725ab2 temp`
> - 감사 범위: `app`, `features`, `components`, `lib`, `data`, `types`, `utils`, `docs`
> - 이번 작업 범위: 리팩터링 없이 감사 보고서 작성

---

## 1. Executive Summary

현재 저장소는 Next.js App Router 위에 feature 중심 구조를 갖추고 있으며,
핵심 게임, 미디어 다운로더, 연락처, 음악, 세금 계산기 일부는
`domain/application/presentation/infrastructure` 분리를 이미 적용하고 있다.
특히 게임 도메인 규칙과 use case 테스트는 탄탄한 편이고, 감사 시점 품질
게이트도 모두 통과했다.

엄격 기준에서의 전체 판단은 **부분 준수**다. 런타임 품질 문제가 아니라
장기 유지보수 관점의 아키텍처 부채가 남아 있다. 가장 큰 리스크는 다음 5개다.

1. `application` 계층 일부가 브라우저 API, `process.env`, `lib` 같은 구체
   런타임 세부사항에 직접 의존한다.
2. `app/api` route handler가 프레임워크 어댑터를 넘어 요청 검증, rate limit,
   비즈니스 흐름, 외부 adapter 호출을 함께 수행한다.
3. 일부 ViewModel hook이 `infrastructure`를 직접 import해 presentation과
   concrete adapter 사이 결합이 생긴다.
4. `vocabulary`, `vocabulary-japanese`, `vocabulary-chinese`, `idioms`는
   feature 구조가 다른 핵심 feature들과 달라 DDD bounded context 일관성이 낮다.
5. Freecell/Solitaire 카드 모델, 어휘 화면/음성 서비스, timer hook 등
   반복 코드가 shared kernel 후보로 남아 있다.

감사 시점 baseline:

| 항목                | 결과                      |
| ------------------- | ------------------------- |
| TypeScript/TSX 파일 | 629개                     |
| `npm run lint`      | 통과                      |
| `npm run typecheck` | 통과                      |
| `npm run test`      | 148 files, 651 tests 통과 |
| 작업 전 git 상태    | clean                     |

---

## 2. 감사 기준

### Clean Architecture

- `domain`은 React, Next.js, 브라우저 API, `lib`, infrastructure, presentation에
  의존하지 않아야 한다.
- `application`은 domain/use case/port 중심이어야 하며 React, Next.js,
  브라우저 API, 구체 infrastructure, 전역 env 접근에 직접 의존하지 않아야 한다.
- `app`과 `app/api`는 프레임워크 adapter로 보고, request/response 변환 외의
  비즈니스 정책은 feature application으로 밀어내는 것을 기준으로 판단했다.

### MVVM

- React component는 렌더링에 집중해야 한다.
- 상태 전이, 명령, 비동기 흐름은 ViewModel hook 또는 application use case로
  분리되어야 한다.
- direct `fetch`, `localStorage`, `window`, `document`, `speechSynthesis`는
  presentation adapter 또는 infrastructure로 격리하는 것을 기준으로 판단했다.

### DDD

- feature는 bounded context로 보고, 각 context 내부의 domain model, use case,
  adapter, presentation 책임이 일관되게 배치되어야 한다.
- 여러 context가 공유하는 개념은 의도적 shared kernel로 명명하고, public API를
  통해 참조해야 한다.
- 단순 중복 제거보다 도메인 결합도와 변경 방향을 우선해 판단했다.

---

## 3. Architecture Findings

### CA-01. Application 계층의 브라우저/env 세부사항 누수

Severity: High

엄격 기준에서 `application`은 브라우저와 Node/Next 런타임을 몰라야 한다.
하지만 다음 파일들은 구체 실행 환경에 직접 접근한다.

| 위치                                                             | 문제                                                      |
| ---------------------------------------------------------------- | --------------------------------------------------------- |
| `features/music/application/use-cases/audioSupport.ts:48`        | `document` 존재 여부로 브라우저 판별                      |
| `features/music/application/use-cases/audioSupport.ts:52`        | `document.createElement("audio")` 직접 호출               |
| `features/music/application/use-cases/musicSource.ts:37`         | `process.env.NEXT_PUBLIC_MUSIC_SOURCE_MODE` 직접 접근     |
| `features/music/application/use-cases/musicSource.ts:39`         | `process.env.NEXT_PUBLIC_LOCAL_MUSIC_JSON_URL` 직접 접근  |
| `features/music/application/use-cases/musicSource.ts:41`         | `process.env.NEXT_PUBLIC_REMOTE_MUSIC_JSON_URL` 직접 접근 |
| `features/games/typing-rain/application/use-cases/storage.ts:47` | `window` 기반 storage fallback                            |
| `features/games/typing-rain/application/use-cases/storage.ts:51` | `window.localStorage` 직접 접근                           |
| `features/games/typing-rain/application/use-cases/storage.ts:69` | `window.localStorage` 직접 접근                           |

개선 방향:

- `audioSupport.ts`는 `canPlayType` 같은 capability를 외부에서 주입받는 순수
  application 함수와 브라우저 adapter로 분리한다.
- `musicSource.ts`는 이미 `resolveMusicSourceConfig(env)` 순수 함수가 있으므로
  `getConfiguredMusicSource()`만 presentation/infrastructure adapter로 이동한다.
- Typing Rain storage는 `TypingGameStoragePort`를 application에 정의하고,
  localStorage 구현은 `presentation` 또는 `infrastructure` adapter로 옮긴다.

### CA-02. Application 계층의 `lib` 직접 의존

Severity: Medium

`features/music/application/use-cases/playlists.ts:1`이 `@/lib/audio`를 직접
import한다. `lib/audio.ts`는 `getAudioBaseUrl()`을 통해 env 설정을 읽으므로,
application 계층이 간접적으로 런타임 설정에 묶인다.

개선 방향:

- domain에는 `audioPath`만 둔다.
- application의 `hydratePlaylist`는 `resolveAudioUrl: (path: string) => string`
  같은 port를 인자로 받게 한다.
- 기본 adapter는 `features/music/infrastructure/audioUrlResolver.ts` 또는
  route/page composition root에서 연결한다.

### CA-03. Fat API route handler

Severity: High

Next.js route handler는 외부 adapter여야 하지만, 일부 route가 use case 수준의
흐름을 직접 수행한다.

| 위치                              | 관찰                                                                                                   |
| --------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `app/api/auth/login/route.ts`     | 140 lines, `NextResponse.json` 10회, rate limit, body validation, credential 검증, session cookie 생성 |
| `app/api/send-email/route.ts`     | 133 lines, `NextResponse.json` 8회, rate limit, body validation, SMTP adapter 생성, mail 발송          |
| `app/api/media/analyze/route.ts`  | 74 lines, body validation, media validation, extractor adapter 호출                                    |
| `app/api/media/download/route.ts` | 86 lines, body validation, download adapter 호출, response header 조립                                 |

개선 방향:

- `features/auth/application/use-cases/loginAdmin.ts`:
  `LoginRequestDto` 검증, rate limit port, credential port, session issuer port를
  조합하고 결과를 discriminated union으로 반환한다.
- `features/contact/application/use-cases/sendContactMessage.ts`:
  문의 메시지 검증, rate limit port, mail sender port를 조합한다.
- `features/media-downloader/application/use-cases/analyzeMedia.ts`,
  `downloadMedia.ts`:
  URL/format 검증과 안정적 error mapping을 application에 모으고, yt-dlp/FFmpeg는
  infrastructure port 구현으로 둔다.
- route handler는 `request -> DTO -> use case -> HTTP presenter`만 담당하게 한다.

### CA-04. Presentation에서 concrete infrastructure 직접 import

Severity: Medium

다음 ViewModel hook은 presentation 계층에서 infrastructure adapter를 직접
import한다.

| 위치                                                                             | 문제                                                   |
| -------------------------------------------------------------------------------- | ------------------------------------------------------ |
| `features/contact/presentation/hooks/useContactFormViewModel.ts:11`              | `../../infrastructure/contactApi` 직접 import          |
| `features/media-downloader/presentation/hooks/useMediaDownloaderViewModel.ts:11` | `../../infrastructure/mediaDownloaderApi` 직접 import  |
| `features/games/slot-machine/presentation/hooks/useSlotMachine.ts:15`            | `../../infrastructure/browserRandomSource` 직접 import |

개선 방향:

- application에 gateway/port type을 정의한다.
- ViewModel hook은 기본 adapter를 직접 잡기보다 optional dependency로 받거나,
  feature의 composition module에서 연결한다.
- 테스트에서는 mock port만 주입해 UI 상태 흐름과 adapter 실패를 분리 검증한다.

### CA-05. Cross-feature import가 shared kernel로 명명되지 않음

Severity: Medium

`features/games/arithmetic-addition` presentation이 `features/math-learning/shared`를
직접 사용한다.

| 위치                                                                           | 참조                                                   |
| ------------------------------------------------------------------------------ | ------------------------------------------------------ |
| `features/games/arithmetic-addition/presentation/ArithmeticGame.tsx:6`         | `@/features/math-learning/shared/components/NumberPad` |
| `features/games/arithmetic-addition/presentation/hooks/useArithmeticGame.ts:4` | `@/features/math-learning/shared/hooks/useNumericQuiz` |

현재 동작상 문제는 없지만, 엄격 DDD 기준에서는 `math-learning`이라는 특정
bounded context 내부 shared 폴더를 다른 bounded context가 직접 참조한다.

개선 방향:

- `features/quiz` 또는 `components/quiz` 같은 명시적 shared kernel로 승격한다.
- 또는 `features/math-learning/shared`를 공식 public shared kernel로 문서화하고
  `index.ts`를 통해서만 접근하게 한다.

### CA-06. Domain 계층은 대체로 깨끗함

Severity: Positive

정적 스캔 기준 `domain`이 React, Next.js, presentation, infrastructure를 직접
import하는 후보는 발견되지 않았다. 게임 규칙, 세금 계산, 음악 playlist source,
미디어 타입 등 순수 domain이 잘 유지된 영역이 많다.

단, `features/blog/domain/data/blogPosts.ts`는 블로그 본문 데이터 안에
`localStorage` 같은 문자열이 포함되어 있다. 이는 코드 의존이 아니므로 위반은
아니다.

---

## 4. MVVM Findings

### MV-01. ViewModel 적용은 feature별로 편차가 큼

Severity: Medium

좋은 예:

- `features/contact/presentation/hooks/useContactFormViewModel.ts`
- `features/tax-calculator/presentation/hooks/useTaxCalculatorViewModel.ts`
- `features/music/presentation/hooks/useMusicStudioViewModel.ts`
- 여러 게임의 `use*Game.ts` hooks

편차:

- `features/auth/presentation/LoginForm.tsx`는 component 안에서 form state,
  submit flow, `fetch("/api/auth/login")`, router 이동을 모두 처리한다.
- `features/vocabulary-japanese/components/JapaneseVocabularyPage.tsx`와
  `features/vocabulary-chinese/components/ChineseVocabularyPage.tsx`는 filter,
  selected item, previous/next 계산, event handler를 component 내부에서 처리한다.
- English vocabulary는 일부 selection use case가 있으나 화면 scroll/focus와
  selection 흐름이 component에 많이 남아 있다.

개선 방향:

- Auth는 `useLoginViewModel`과 `authApi` adapter로 분리한다.
- Vocabulary는 언어별 page component를 `VocabularyLearningView`와
  `useVocabularyBrowserViewModel`로 공통화하고, 언어별 차이는 data/search strategy/
  label adapter로 주입한다.

### MV-02. ViewModel hook이 상태 머신, adapter, formatting을 과도하게 함께 보유

Severity: Medium

`features/media-downloader/presentation/hooks/useMediaDownloaderViewModel.ts`는
다음 책임을 함께 갖는다.

- 다운로드 상태 전이
- media API 호출
- 포맷 선택
- duration/bytes/status label formatting
- `document.createElement("a")` 기반 브라우저 파일 저장

개선 방향:

- status transition과 formatting은 application/presentation pure helper로 분리한다.
- API 호출은 `MediaDownloaderGateway` port로 분리한다.
- 브라우저 저장은 `BrowserDownloadPort` adapter로 분리한다.

### MV-03. 브라우저 API는 대부분 presentation에 있으나 adapter 경계가 약함

Severity: Low to Medium

`window.localStorage`, `document`, `speechSynthesis`, `matchMedia`,
`requestAnimationFrame` 사용은 대부분 client presentation/hook에 위치한다.
이는 Next.js 앱에서는 허용 가능한 선택이지만, 엄격 MVVM 기준에서는 ViewModel의
testability를 낮춘다.

개선 방향:

- localStorage, speech synthesis, media query, browser download는 작은 adapter
  함수로 감싼다.
- ViewModel은 adapter 인터페이스만 사용하고, 기본 구현은 hook 생성 시 주입한다.

---

## 5. DDD Findings

### DDD-01. Bounded context 구조가 feature별로 다름

Severity: Medium

일관된 구조를 가진 feature:

- `contact`: `domain/application/infrastructure/presentation`
- `media-downloader`: `domain/application/infrastructure/presentation`
- `tax-calculator`: `domain/application/presentation`
- 많은 게임 하위 feature: `domain/application/presentation`

구조 편차가 있는 feature:

- `auth`: `presentation`만 존재하고 인증 use case는 `app/api`와 `lib`에 분산
- `admin`: `presentation`만 존재하고 session 검증은 `lib/adminSession.ts`
- `idioms`: `components/data/presentation/types/utils`
- `vocabulary`: `application/components/data/domain/services/types/utils`
- `vocabulary-japanese`, `vocabulary-chinese`: `components/data/services/types/utils`
- `learning`, `tools`, `navigation`: catalog 파일만 존재

개선 방향:

- 모든 사용자-facing feature에 최소 구조를 맞출 필요는 없지만, 상태/검색/검증/외부
  adapter가 있는 feature는 `domain/application/presentation/infrastructure`를
  기준으로 정렬한다.
- catalog-only feature는 현 구조를 유지하되, README나 architecture 문서에
  "catalog context"로 예외를 명시한다.

### DDD-02. Vocabulary 계열은 shared kernel 없이 언어별 bounded context가 반복됨

Severity: High

세 어휘 feature는 학습 UI, 검색, 필터, 리스트, 상세, 음성 재생 흐름이 유사하지만
각 언어별로 별도 구현되어 있다. 특히 일본어/중국어는 영어 feature보다 계층 분리가
약하고, page component가 application 역할까지 수행한다.

개선 방향:

- `features/vocabulary-core` 또는 `features/learning-vocabulary/shared`를 만든다.
- 공통 domain: `VocabularyEntry`, `VocabularyFilter`, `VocabularySearchStrategy`,
  `SpeechRequest`.
- 공통 application: selection 유지, previous/next 계산, filter orchestration.
- 공통 presentation: search/filter/list/detail shell.
- 언어별 feature는 data, labels, search strategy, speech locale adapter만 보유한다.

### DDD-03. Idioms route가 domain data와 util을 직접 소비함

Severity: Medium

`app/(site)/learn/idioms/[slug]/page.tsx`가 `idioms` data와 `getIdiomBySlug` util을
직접 import한다. route가 SSG params와 metadata를 처리하는 것은 정상이나,
엄격 기준에서는 feature application의 query use case를 통해 읽는 편이 좋다.

개선 방향:

- `features/idioms/domain/entities/Idiom.ts`
- `features/idioms/domain/data/idioms.ts`
- `features/idioms/application/use-cases/getIdiomBySlug.ts`
- `features/idioms/application/use-cases/listIdioms.ts`
- route는 feature public API만 import한다.

### DDD-04. 카드 게임 공통 모델은 shared kernel 후보

Severity: Medium

Freecell과 Solitaire는 같은 52장 카드 모델을 공유한다. 현재는 context별 독립
구현이라 도메인 격리는 좋지만, 정확히 동일한 파일이 여러 개 존재한다.

개선 방향:

- `features/games/cards/domain` 또는 `features/games/shared/playing-cards`를 만든다.
- 우선 추출 대상은 `Suit`, `Rank`, `CardColor`, `createDeck`, `shuffleDeck`처럼
  게임 규칙과 독립적인 카드 표준 모델이다.
- `dealInitial`, `moveCard`, tableau/foundation rules는 게임별 규칙 차이가 생길 수
  있으므로 바로 공통화하지 않는다.

---

## 6. Duplicate Analysis

### 정확히 동일한 파일

정규화된 파일 내용 기준으로 다음 exact duplicate가 발견되었다.

| 중복 파일                                                                                                                          | 권장                                                                   |
| ---------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `features/games/freecell/application/use-cases/startNewGame.ts` / `features/games/solitaire/application/use-cases/startNewGame.ts` | 카드 shared kernel 추출 후 각 게임 use case는 얇게 유지                |
| `features/games/freecell/domain/services/shuffle.ts` / `features/games/solitaire/domain/services/shuffle.ts`                       | 즉시 공통화 후보                                                       |
| `features/games/freecell/domain/services/winCheck.ts` / `features/games/solitaire/domain/services/winCheck.ts`                     | foundation 52장 조건은 공통 helper 후보, 게임별 win policy 이름은 유지 |
| `features/games/freecell/domain/value-objects/CardColor.ts` / `features/games/solitaire/domain/value-objects/CardColor.ts`         | 즉시 공통화 후보                                                       |
| `features/games/freecell/domain/value-objects/Suit.ts` / `features/games/solitaire/domain/value-objects/Suit.ts`                   | 즉시 공통화 후보                                                       |
| `features/games/minesweeper/presentation/hooks/useElapsedTimer.ts` / `features/games/sudoku/presentation/hooks/useElapsedTimer.ts` | `components` 또는 `features/games/shared/presentation` 공통 hook 후보  |

### 유사 반복 구조

| 영역                       | 관찰                                                                            | 권장                                                                       |
| -------------------------- | ------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Vocabulary speech service  | 영어/일본어/중국어가 support check, cancel, utterance 생성, `speak` 호출을 반복 | `createSpeechSynthesisSpeaker({ lang, rate, pitch, volume })` adapter 추출 |
| Vocabulary page            | 일본어/중국어 page는 선택 유지, 필터, 이전/다음 흐름이 거의 동일                | 공통 browser ViewModel + 언어별 config                                     |
| Vocabulary components      | Search, Filter, List, ListItem, Detail, SpeechButton 반복                       | generic shell + slot/render prop 또는 언어별 adapter                       |
| Freecell/Solitaire card UI | `CardFace`, hit-test, drag interaction 일부 유사                                | domain shared kernel 먼저 추출, UI는 이미지/접근성 차이를 비교 후 추출     |
| Numeric quiz               | 수열/통계/확률/사칙연산이 `NumberPad`, `useNumericQuiz`를 공유                  | 공식 shared kernel 위치로 승격                                             |

### 바로 공통화하지 않을 후보

- 2048과 Match Three의 `swipeGeometry`는 이름은 같지만 도메인 의미가 다르므로
  무리한 통합보다 인터페이스 안정화 이후 판단한다.
- `GameHeader`, `GameControls`, `WinDialog`는 게임별 UX 문맥이 달라 추상화 비용이
  클 수 있다.
- 카드 `dealInitial`, tableau/foundation rules는 게임별 규칙 차이가 커질 수 있어
  중복 제거 우선순위를 낮춘다.

---

## 7. Improvement Roadmap

### P0. 유지보수/테스트 리스크가 큰 의존성 정리

1. `application`의 브라우저/env 접근 제거
   - `audioSupport`, `musicSource`, Typing Rain storage를 port + adapter 구조로 분리한다.
   - 기존 pure function 테스트를 유지하고 adapter 테스트를 추가한다.
2. Fat API route thin adapter화
   - login/contact/media route에서 DTO validation, rate limit orchestration,
     success/error mapping을 feature application으로 이동한다.
   - route handler는 HTTP parsing과 response presenter만 담당한다.
3. Presentation -> infrastructure 직접 import 제거
   - contact/media/slot-machine hook에 port 주입 구조를 도입한다.

### P1. Shared kernel과 bounded context 정리

1. Playing card shared kernel
   - `Suit`, `Rank`, `CardColor`, `createDeck`, `shuffleDeck`부터 추출한다.
   - Freecell/Solitaire 테스트를 그대로 통과시키며 import 경로만 정리한다.
2. Vocabulary core
   - selection/filter orchestration, speech adapter factory, list/detail shell을
     공통화한다.
   - 일본어/중국어 feature에 application 계층을 추가한다.
3. Quiz shared kernel
   - `features/math-learning/shared`를 독립 shared context로 승격하거나
     `components/quiz`/`features/quiz`로 이동한다.

### P2. 구조 규칙 자동화와 문서화

1. 아키텍처 boundary lint 도입 검토
   - 예: `dependency-cruiser`, `eslint-plugin-boundaries`, 또는 커스텀 스크립트.
   - 금지 규칙: `domain -> presentation/infrastructure`, `application -> presentation`,
     `application -> @/lib`, `presentation -> infrastructure`.
2. `docs/ARCHITECTURE.md` 업데이트
   - catalog-only feature 예외, shared kernel 위치, route handler 책임 범위를 명시한다.
3. feature public API 규칙 정리
   - route/page는 가능하면 feature root `index.ts` 또는 명시된 public module만 import한다.

---

## 8. Suggested Acceptance Criteria

후속 리팩터링을 진행한다면 각 단계의 완료 조건은 다음처럼 잡는 것이 좋다.

- `application` 계층에서 `window`, `document`, `localStorage`, `speechSynthesis`,
  `process.env`, `@/lib` 직접 접근이 0건이다.
- `app/api/*/route.ts`는 각 파일 50 lines 이하 또는 "HTTP adapter only" 예외 사유가
  문서화되어 있다.
- presentation hook의 `../infrastructure` import가 0건이다.
- Freecell/Solitaire의 카드 value object 중복이 shared kernel로 제거되어도 모든
  기존 게임 테스트가 통과한다.
- Vocabulary 3개 언어 feature가 공통 selection/filter 흐름을 사용하고, 언어별 차이는
  config/data/search strategy로 제한된다.
- 아키텍처 스캔 명령이 CI 또는 local quality gate에서 실행 가능하다.

---

## 9. Appendix

### 정적 감사 명령

감사 중 사용한 주요 명령:

```bash
rg --files -g "*.ts" -g "*.tsx" -g "*.md"
rg -n "\\b(window|document|localStorage|sessionStorage|speechSynthesis|fetch\\(|process\\.env|NextRequest|NextResponse|notFound\\(|cookies\\()\\b" app features components lib proxy.ts -g "*.ts" -g "*.tsx"
rg -n "document|process\\.env|@/lib/audio|@/features/math-learning|\\.\\./\\.\\./infrastructure|fetch\\(|localStorage|speechSynthesis|createRateLimiter|nodemailer|verifyCredentials|downloadYoutubeMedia|analyzeYoutubeVideo" app features lib -g "*.ts" -g "*.tsx"
```

추가로 Node 기반 정적 스캔을 실행해 다음 항목을 계산했다.

- 계층별 import 후보
- application 계층의 browser/env 접근
- presentation -> infrastructure import
- cross-feature import
- API route line count와 response count
- normalized exact duplicate 파일

### 품질 게이트 결과

```text
npm run lint
결과: 통과

npm run typecheck
결과: 통과
출력: next typegen, tsc6 --noEmit 성공

npm run test
결과: 148 files, 651 tests 통과
Duration: 9.64s

npx prettier --check docs/ARCHITECTURE_AUDIT_KO.md
결과: 통과

npm run format:check
결과: 실패
사유: 기존 저장소 전반의 Prettier 불일치 624건 감지. 이번 보고서 파일은 별도
Prettier 체크 통과.
```

### 원자료 요약

Feature top-level structure:

```text
admin: presentation
auth: presentation
blog: domain, presentation
contact: application, domain, infrastructure, presentation
games: arithmetic-addition, bulls-and-cows, freecell, game-2048, match-three,
       minesweeper, presentation, slot-machine, solitaire, sudoku, typing-rain
idioms: components, data, presentation, types, utils
learning: files only
math-learning: probability, sequences, shared, statistics
media-downloader: application, domain, infrastructure, presentation
music: application, domain, presentation
navigation: files only
tax-calculator: application, domain, presentation
tools: files only
vocabulary: application, components, data, domain, services, types, utils
vocabulary-chinese: components, data, services, types, utils
vocabulary-japanese: components, data, services, types, utils
```

API route stats:

```text
app/api/auth/login/route.ts: 140 lines, 10 json responses
app/api/auth/logout/route.ts: 9 lines, 1 json response
app/api/media/analyze/route.ts: 74 lines, 5 json responses
app/api/media/download/route.ts: 86 lines, 3 json responses
app/api/send-email/route.ts: 133 lines, 8 json responses
```
