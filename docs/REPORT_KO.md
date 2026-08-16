# YH Jang Interactive Lab - 개발 보고서 (한국어)

- **작성일**: 2026-08-11
- **프로젝트**: 개인 Interactive Lab & 유틸리티 도구 모음
- **스택**: Next.js 16.2.11 · React 19.2.8 · TypeScript 6 tooling · Tailwind CSS 4

---

## 1. 프로젝트 개요

이 프로젝트는 포트폴리오, 실용 도구, 학습 콘텐츠를 하나의 App Router
애플리케이션으로 묶은 개인 Interactive Lab입니다. 홈 화면은 도구와 학습 콘텐츠
진입을 우선 배치하고, 소개/문의/관리자 영역은 보조 흐름으로 구성합니다.

현재 주요 기능은 Music Studio, Media Downloader, 9개 미니게임, 2025 한국 세금
계산기, 개발 블로그, 사자성어/영어/일본어/중국어 단어 학습, 수학 학습, 이메일
문의, JWT 세션 기반 관리자 대시보드입니다.

| 항목              | 현재 상태                                     |
| ----------------- | --------------------------------------------- |
| Framework         | Next.js 16 App Router                         |
| Runtime           | React 19                                      |
| 언어              | TypeScript 6 tooling                          |
| Public page route | 24개 `page.tsx`                               |
| API route         | 5개 route handler                             |
| 테스트            | Vitest 테스트 141개 파일 / 599개 케이스       |
| 기준 브랜치       | `feature/play-musics-videos` (`develop` 대비) |

---

## 2. 라우트 맵

| 경로                                    | 설명                  | 구성                      |
| --------------------------------------- | --------------------- | ------------------------- |
| `/`                                     | Interactive Lab 홈    | `(site)` public chrome    |
| `/tools`                                | 도구 허브             | tool catalog              |
| `/tools/music`                          | Music Studio          | playlist + DJ queue       |
| `/tools/media-downloader`               | Media Downloader      | client UI + media API     |
| `/tools/tax-calculator`                 | 2025 한국 세금 계산기 | tax view model + UI       |
| `/tools/games`                          | 게임 허브             | 9-game catalog            |
| `/tools/games/[slug]`                   | 개별 게임 실행        | `GameHost` dynamic import |
| `/learn`                                | 학습 허브             | learning catalog          |
| `/learn/blog`, `/learn/blog/[slug]`     | 개발 블로그 목록/상세 | SSG detail route          |
| `/learn/idioms`, `/learn/idioms/[slug]` | 사자성어 목록/상세    | typed idiom data          |
| `/learn/vocabulary`                     | 영어 단어 학습        | search/filter/detail      |
| `/learn/japanese-vocabulary`            | 일본어 단어 학습      | speech + filter           |
| `/learn/chinese-vocabulary`             | 중국어 단어 학습      | speech + filter           |
| `/learn/math`                           | 수학 학습 허브        | math catalog              |
| `/learn/math/sequences`                 | 수열 학습             | quiz flow                 |
| `/learn/math/statistics`                | 통계 학습             | quiz flow                 |
| `/learn/math/probability`               | 확률 학습             | quiz flow                 |
| `/about`                                | 소개/외부 링크        | server route              |
| `/contact`                              | 이메일 문의 폼        | contact feature           |
| `/login`                                | 관리자 로그인         | auth-only layout          |
| `/admin`, `/admin/users`                | 보호된 관리자 화면    | session required          |

이전 공개 URL은 `features/navigation/siteNavigation.ts`의 `legacyRedirects`와
`next.config.ts`를 통해 canonical route로 임시 연결됩니다.

---

## 3. API와 서버 흐름

| API                        | 역할                              | 주요 보호 장치                         |
| -------------------------- | --------------------------------- | -------------------------------------- |
| `POST /api/auth/login`     | 관리자 로그인, JWT 세션 쿠키 발급 | IP/username rate limit, 입력 길이 제한 |
| `POST /api/auth/logout`    | 세션 쿠키 만료                    | httpOnly cookie 삭제                   |
| `POST /api/send-email`     | 문의 메일 발송                    | IP rate limit, email/length validation |
| `POST /api/media/analyze`  | YouTube 단일 영상 메타데이터 분석 | URL allowlist, stable error mapping    |
| `POST /api/media/download` | MP4/MP3 파일 응답                 | format validation, temp cleanup        |

`proxy.ts`는 `/admin/**` 요청의 `admin_session` 쿠키를 검증하고, 유효하지 않은
요청을 `/login`으로 리다이렉트합니다. 서버 렌더링 단계에서도
`app/admin/layout.tsx`가 세션을 확인합니다.

---

## 4. 주요 기능 상세

### 4.1 Music Studio

`/tools/music`는 날짜별 플레이리스트와 DJ 큐를 한 화면에 통합합니다.
기본 트랙은 `features/music/domain/data/musicPlaylists.ts`가 소유하며,
URL/로컬 파일로 추가한 트랙은 DJ 큐에서만 관리합니다. Object URL은 제거 또는
언마운트 시 해제합니다.

### 4.2 Media Downloader

`/tools/media-downloader`는 공개 YouTube 단일 영상을 분석하고 MP4 또는 MP3로
저장하는 로컬 MVP입니다.

- Analyze: `POST /api/media/analyze` with `{ url: string }`
- Download: `POST /api/media/download` with `{ url, type, formatId, quality? }`
- Video presets: `video-mp4-360`, `video-mp4-720`, `video-mp4-1080`
- Audio presets: `audio-mp3-128`, `audio-mp3-192`
- Runtime tools: `yt-dlp`, `ffmpeg`, `ffprobe`

URL validation, platform resolution, format mapping, filename sanitization,
status label, error mapping은 feature 내부 순수 유틸리티로 분리되어 있고,
프로세스 실행은 infrastructure adapter에 격리되어 있습니다.

### 4.3 Games

게임 catalog는 9개 slug를 관리합니다: Solitaire, 2048, 지뢰찾기, FreeCell,
스도쿠, 3-Match, 사칙연산 학습, Typing Rain, Slot Machine.
`GameHost.tsx`가 각 게임을 `ssr: false`로 동적 로드해 초기 난수와 브라우저
전용 상태로 인한 hydration 불일치를 피합니다.

### 4.4 Learning

학습 콘텐츠는 `/learn` 아래로 모여 있습니다. 블로그와 사자성어는 상세 route를
갖고, 영어/일본어/중국어 단어 학습은 검색/필터/발음 흐름을 제공합니다. 수학
학습은 수열, 통계, 확률을 독립 subroute로 제공합니다.

### 4.5 Contact

문의 폼은 title, sender, content를 입력받고 HTML 메일 미리보기와 API client를
feature로 분리합니다. 서버는 Nodemailer로 SMTP 발송하며, 헤더 인젝션 방지를
위해 제목/발신자 값을 sanitize합니다.

### 4.6 Admin

관리자 계정은 DB 없이 환경 변수로 설정합니다. `jose`로 JWT를 발급하고
httpOnly `SameSite=Lax` 쿠키에 저장합니다. 관리자 UI는 public chrome과 분리된
route tree에서 렌더링됩니다.

---

## 5. 구조와 소유권

```text
app/            route, metadata, API handler
components/     layout, navigation, card, ui primitives
features/       feature-owned domain/application/presentation code
lib/            auth, credentials, email, env, rateLimit, audio, utils
data/           compatibility re-exports
types/          shared types
utils/          small legacy utilities
docs/           architecture, reports, feature notes
```

핵심 원칙은 `app/`를 얇게 유지하고, 화면 상태와 도메인 로직을 feature 폴더가
소유하게 하는 것입니다.

---

## 6. 기술 스택

| 분류       | 기술                                   | 버전/비고                 |
| ---------- | -------------------------------------- | ------------------------- |
| Framework  | Next.js                                | 16.2.11                   |
| Runtime    | React / React DOM                      | 19.2.8                    |
| Language   | TypeScript                             | `@typescript/typescript6` |
| Styling    | Tailwind CSS                           | 4.3.3                     |
| UI         | shadcn/ui, Radix Dialog/Slot           | local primitives          |
| Animation  | GSAP                                   | 3.15.0                    |
| Icons      | Lucide React                           | 1.26.0                    |
| Email      | Nodemailer                             | 9.0.3                     |
| Auth       | jose + bcryptjs                        | 6.2.4 / 3.0.3             |
| Media      | yt-dlp, FFmpeg, FFprobe                | local PATH or env path    |
| Testing    | Vitest, Testing Library                | 4.1.10                    |
| Formatting | Prettier + prettier-plugin-tailwindcss | 3.9.6 / 0.8.1             |

---

## 7. 환경 변수

| 그룹  | 변수                                                                                                                           |
| ----- | ------------------------------------------------------------------------------------------------------------------------------ |
| SMTP  | `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `RECEIVER_EMAIL`                                            |
| Admin | `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`, `SESSION_SECRET`                                                                      |
| Music | `NEXT_PUBLIC_AUDIO_BASE_URL`                                                                                                   |
| Media | `YTDLP_PATH`, `FFMPEG_PATH`, `FFPROBE_PATH`, `MEDIA_ANALYZE_TIMEOUT_MS`, `MEDIA_DOWNLOAD_TIMEOUT_MS`, `MEDIA_MAX_OUTPUT_BYTES` |

`ADMIN_PASSWORD_HASH`의 bcrypt `$` 문자는 `.env`에서 `\$`로 이스케이프해야 합니다.

---

## 8. 테스트

Vitest는 `**/*.test.ts`, `**/*.test.tsx`를 실행합니다. 현재 저장소 기준 테스트
파일은 141개, 테스트 케이스는 599개이며, 게임 기능 테스트가 100개 파일로 가장 큰
비중을 차지합니다.

주요 테스트 범위:

- 인증/세션/관리자 rate limit
- 문의 폼 view model, API client, email HTML/sanitize
- Music playlist/track formatting
- 도구/학습/navigation catalog
- 9개 게임의 domain rule, use case, 일부 presentation interaction
- 수학 학습 문제 생성과 UI
- Media Downloader URL validation, format mapping, runtime env, extractor,
  downloader, API route, presentation

실행 명령:

```bash
npm run test
npm run test:coverage
npm run lint
npm run typecheck
npm run format:check
npm run ci
npm run ci:local
```

`npm run ci`는 format check, lint, typecheck, test, build를 실행합니다.
`npm run ci:local`은 `git diff --check`까지 포함하며, `.husky/pre-push`가
`npm run prepush`를 통해 같은 로컬 게이트를 사용합니다.

---

## 9. 알려진 제한 사항과 향후 과제

1. Media Downloader는 로컬 Node.js runtime MVP입니다. 운영 환경에서는 queue,
   worker, object storage, signed URL 구조로 옮겨야 합니다.
2. Media Downloader는 공개 YouTube 단일 영상만 지원합니다. playlist, private,
   paid, DRM, login/cookie 기반 접근은 범위 밖입니다.
3. 관리자 기능은 단일 환경 변수 계정만 지원하며, 다중 사용자/역할 관리는 없습니다.
4. 문의 폼과 관리자 rate limit은 메모리 기반이므로 서버리스 다중 인스턴스에서
   전역 제한으로 동작하지 않습니다.
5. 학습/블로그/게임 데이터는 코드에 포함된 정적 데이터입니다. 비개발자 편집이
   필요하면 CMS나 DB 연동이 필요합니다.
6. Music Studio 기본 오디오 소스는 외부 S3/CDN URL에 의존합니다.
