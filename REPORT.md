# NextJs_Main 저장소 분석 보고서

> - 작성일: 2026-08-11
> - 저장소: `jang4292/NextJs_Main`
> - 기준 브랜치: `feature/play-musics-videos` (`develop` 대비)
> - 목적: 현재 저장소 구조, 기능, API, 테스트, 문서 상태 최신화

---

## 1. 요약

NextJs_Main은 포트폴리오, 도구, 학습 콘텐츠를 결합한 Next.js 16 App Router
애플리케이션입니다. 현재 브랜치의 핵심 변경은 `/tools/media-downloader` 추가와
관련 API, 환경 변수, CSP/Image 설정 보강입니다.

| 항목              | 현재 상태                                    |
| ----------------- | -------------------------------------------- |
| Framework         | Next.js 16.2.11 App Router                   |
| Runtime           | React 19.2.8                                 |
| Language          | TypeScript 6 tooling                         |
| Styling           | Tailwind CSS 4.3.3                           |
| Public page route | 24개 `page.tsx`                              |
| API route         | 5개 route handler                            |
| Test files        | 141개 (`**/*.test.ts`, `**/*.test.tsx`)      |
| Test cases        | 599개 Vitest cases                           |
| Game catalog      | 9개 게임                                     |
| Database          | 없음, 정적 TypeScript 데이터와 env 기반 설정 |

---

## 2. 제품 구조

이 애플리케이션의 canonical route는 크게 네 영역입니다.

| 영역    | 경로                 | 역할                              |
| ------- | -------------------- | --------------------------------- |
| Home    | `/`                  | 도구와 학습 콘텐츠 중심 허브      |
| Tools   | `/tools/*`           | 음악, 미디어, 게임, 세금 계산기   |
| Learn   | `/learn/*`           | 블로그, 언어 단어, 사자성어, 수학 |
| Profile | `/about`, `/contact` | 소개, 외부 링크, 이메일 문의      |
| Admin   | `/login`, `/admin/*` | 환경 변수 계정 기반 보호 화면     |

이전 공개 URL은 `features/navigation/siteNavigation.ts`의 `legacyRedirects`를
통해 canonical route로 임시 연결됩니다.

---

## 3. 라우트와 API

### 3.1 Public Page Routes

```text
/
/tools
/tools/music
/tools/media-downloader
/tools/tax-calculator
/tools/games
/tools/games/[slug]
/learn
/learn/blog
/learn/blog/[slug]
/learn/idioms
/learn/idioms/[slug]
/learn/vocabulary
/learn/japanese-vocabulary
/learn/chinese-vocabulary
/learn/math
/learn/math/sequences
/learn/math/statistics
/learn/math/probability
/about
/contact
/login
/admin
/admin/users
```

### 3.2 API Routes

| API                        | 설명                                   |
| -------------------------- | -------------------------------------- |
| `POST /api/auth/login`     | 관리자 인증 후 JWT 세션 쿠키 발급      |
| `POST /api/auth/logout`    | 관리자 세션 쿠키 만료                  |
| `POST /api/send-email`     | 문의 폼 SMTP 메일 발송                 |
| `POST /api/media/analyze`  | 공개 YouTube 단일 영상 메타데이터 분석 |
| `POST /api/media/download` | 선택한 MP4/MP3 파일 응답               |

---

## 4. 디렉토리 구조

```text
app/
  (site)/              public layout and route pages
  (auth)/login/        login without public chrome
  admin/               protected admin shell
  api/                 auth, media, email route handlers
components/
  cards/               reusable card components
  layout/              PageShell, SectionHeader, ContentGrid
  navigation/          SiteNav, BottomNav, Footer
  ui/                  shadcn/ui primitives
features/
  admin/               admin layout presentation
  auth/                login form
  blog/                blog data and rendering
  contact/             contact form application/presentation
  games/               9-game catalog and game implementations
  idioms/              Korean idiom learning
  learning/            learning catalog
  math-learning/       sequences/statistics/probability learning
  media-downloader/    YouTube analyze/download feature
  music/               playlists and DJ queue
  navigation/          site navigation and redirects
  tax-calculator/      2025 Korean tax calculator
  tools/               tool catalog
  vocabulary*/         English, Japanese, Chinese vocabulary
lib/
  auth, credentials, email, env, rateLimit, audio, utils
data/
  compatibility re-exports
docs/
  architecture, reports, feature notes
proxy.ts
  admin route protection
```

`app/`는 route와 metadata/API만 얇게 담당하고, 실제 도메인/상태/화면 로직은
feature 폴더가 소유합니다.

---

## 5. 주요 기능 분석

### 5.1 Tools

| 기능             | 경로                      | 구현 요약                          |
| ---------------- | ------------------------- | ---------------------------------- |
| Music Studio     | `/tools/music`            | 날짜별 playlist + DJ queue         |
| Media Downloader | `/tools/media-downloader` | YouTube analyze/download local MVP |
| Tax Calculator   | `/tools/tax-calculator`   | 2025 한국 세율 기반 실수령액 계산  |
| Games Hub        | `/tools/games`            | 9개 게임 catalog                   |

### 5.2 Media Downloader

현재 브랜치에서 추가된 핵심 기능입니다.

- UI: `features/media-downloader/presentation/MediaDownloader.tsx`
- Analyze API: `POST /api/media/analyze`
- Download API: `POST /api/media/download`
- Domain types: `MediaInfo`, `MediaFormat`, `DownloadRequest`,
  `MediaErrorResponse`
- Supported input: 공개 YouTube 단일 영상 HTTPS URL
- Supported output: MP4 360p/720p/1080p, MP3 128kbps/192kbps presets
- Local tools: `yt-dlp`, `ffmpeg`, `ffprobe`

보안/안정성 경계:

- non-HTTPS, credentials, localhost, private network, non-YouTube host,
  playlist-style URL 차단
- `spawn(command, args, { shell: false })` 기반 프로세스 실행
- OS temp job directory 생성 후 `finally`에서 삭제
- 완성 파일의 empty/oversized 상태 검증
- 사용자에게는 안정적인 error code/message만 반환
- YouTube thumbnail host를 CSP와 Next Image remote pattern에 추가

### 5.3 Games

게임 catalog는 9개 게임을 관리합니다.

| Slug                  | 설명                        |
| --------------------- | --------------------------- |
| `solitaire`           | 클론다이크 솔리테어         |
| `2048`                | 숫자 타일 퍼즐              |
| `minesweeper`         | 지뢰찾기                    |
| `freecell`            | 프리셀 카드 게임            |
| `sudoku`              | 스도쿠                      |
| `match-three`         | 3-Match 퍼즐                |
| `arithmetic-addition` | 사칙연산 학습 게임          |
| `typing-rain`         | 한글/영문 타자 연습 게임    |
| `slot-machine`        | 3릴 단일 페이라인 슬롯 머신 |

`GameHost.tsx`는 모든 게임을 `ssr: false`로 동적 로드합니다. 게임 관련 테스트
파일은 100개입니다.

### 5.4 Learning

학습 영역은 `/learn` 아래에서 blog, idioms, vocabulary, math learning을
제공합니다. 일본어/중국어 단어장과 수학 subroute가 추가되어 기존 블로그 중심
구조보다 학습 허브 역할이 커졌습니다.

### 5.5 Contact, Auth, Admin

문의 폼은 Nodemailer SMTP 발송을 사용하고, 서버에서 email validation, 입력 길이
제한, IP 기반 rate limit, header value sanitization을 수행합니다.

관리자 인증은 DB 없이 `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`,
`SESSION_SECRET` 환경 변수로 구성합니다. 로그인 성공 시 JWT를 httpOnly 쿠키에
저장하고, `proxy.ts`와 admin layout에서 세션을 검증합니다.

---

## 6. 기술 스택

| 분류      | 패키지/기술                           | 버전          |
| --------- | ------------------------------------- | ------------- |
| Framework | `next`                                | 16.2.11       |
| Runtime   | `react`, `react-dom`                  | 19.2.8        |
| Language  | `@typescript/typescript6`             | ^6.0.2        |
| Styling   | `tailwindcss`, `@tailwindcss/postcss` | 4.3.3         |
| UI        | Radix Dialog/Slot, shadcn primitives  | local         |
| Animation | `gsap`                                | 3.15.0        |
| Icons     | `lucide-react`                        | 1.26.0        |
| Email     | `nodemailer`                          | 9.0.3         |
| Auth      | `jose`, `bcryptjs`                    | 6.2.4 / 3.0.3 |
| Test      | `vitest`, Testing Library             | 4.1.10        |
| Format    | `prettier`, Tailwind plugin           | 3.9.6 / 0.8.1 |

---

## 7. 환경 변수

| 목적  | 변수                                                                                                                           |
| ----- | ------------------------------------------------------------------------------------------------------------------------------ |
| SMTP  | `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `RECEIVER_EMAIL`                                            |
| Admin | `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`, `SESSION_SECRET`                                                                      |
| Music | `NEXT_PUBLIC_AUDIO_BASE_URL`                                                                                                   |
| Media | `YTDLP_PATH`, `FFMPEG_PATH`, `FFPROBE_PATH`, `MEDIA_ANALYZE_TIMEOUT_MS`, `MEDIA_DOWNLOAD_TIMEOUT_MS`, `MEDIA_MAX_OUTPUT_BYTES` |

Media Downloader 기본값:

```env
YTDLP_PATH=yt-dlp
FFMPEG_PATH=ffmpeg
FFPROBE_PATH=ffprobe
MEDIA_ANALYZE_TIMEOUT_MS=45000
MEDIA_DOWNLOAD_TIMEOUT_MS=180000
MEDIA_MAX_OUTPUT_BYTES=367001600
```

---

## 8. 테스트 현황

현재 테스트 파일 수는 141개, 테스트 케이스 수는 599개입니다.

| 범위               | 대표 테스트                                                       |
| ------------------ | ----------------------------------------------------------------- |
| Auth/Admin         | `lib/auth.test.ts`, `lib/adminSession.test.ts`, login route tests |
| Rate Limit         | `lib/rateLimit.test.ts`                                           |
| Contact            | contact view model, API client, form, email route                 |
| Navigation/Catalog | navigation, tools, learning, games catalog tests                  |
| Music              | playlist and track use cases                                      |
| Games              | 9개 게임 domain/use-case/presentation tests                       |
| Math Learning      | sequences/statistics/probability generation + UI                  |
| Media Downloader   | validation, format mapping, env, extractor, downloader, API, UI   |
| Tax Calculator     | tax calculator view model                                         |
| Vocabulary         | English/Japanese/Chinese data and filter tests                    |

권장 확인 명령:

```bash
npm run test
npm run test:coverage
npm run ci
npm run ci:local
```

`npm run ci`는 `format:check`, `lint`, `typecheck`, `test`, `build`를 같은
순서로 실행합니다. `npm run ci:local`은 그 앞에 `git diff --check`를 추가해
작업 diff의 whitespace/patch 문제까지 확인합니다. `.husky/pre-push`는
`npm run prepush`를 통해 동일한 로컬 게이트를 호출합니다.

---

## 9. 보안과 운영 관찰

- Admin 세션은 httpOnly cookie와 JWT 검증으로 보호됩니다.
- Login과 contact API는 메모리 기반 rate limiter를 사용합니다.
- Contact API는 header injection 방지를 위해 제목/발신자 값을 sanitize합니다.
- Media Downloader는 로컬 프로세스 실행을 adapter로 격리하고 shell 실행을
  사용하지 않습니다.
- Media Downloader는 현재 완성 파일을 memory buffer로 응답하므로, 대용량/동시성
  운영에는 적합하지 않습니다.
- CSP는 `default-src 'self'`를 기준으로 하고, YouTube thumbnail host는 이미지
  용도로만 허용합니다.

---

## 10. 알려진 제한 사항과 개선 방향

1. Media Downloader는 local MVP입니다. production에서는 queue, worker, object
   storage, signed download URL 구조가 필요합니다.
2. Media Downloader는 공개 YouTube 단일 영상만 지원하며, 접근권한 우회는 범위
   밖입니다.
3. Rate limiter는 process memory 기반이라 여러 instance 간 공유되지 않습니다.
4. Admin은 단일 환경 변수 계정만 지원합니다.
5. 콘텐츠 데이터는 TypeScript 정적 파일 중심입니다. 운영 편집 경험이 필요하면
   CMS나 DB를 도입해야 합니다.
6. 게임 상세 문서는 일부 게임에만 작성되어 있습니다. 실행 가능한 최신 목록은
   항상 `features/games/catalog.ts`가 기준입니다.

---

## 11. 결론

현재 저장소는 단순 포트폴리오에서 도구/학습 중심 Interactive Lab으로 구조가
확장되었습니다. 이번 브랜치의 Media Downloader는 로컬 MVP로 범위를 좁히되,
URL 검증, 안정적인 에러 계약, 프로세스 adapter, 테스트를 분리해 이후 worker
기반 생산 구조로 이동할 수 있는 발판을 마련했습니다.
