# YH Jang 포트폴리오 — 개발 보고서 (한국어)

**작성일**: 2026년 7월
**프로젝트**: 개인 포트폴리오 & 유틸리티 도구
**스택**: Next.js 15 · React 19 · TypeScript · Tailwind CSS

---

## 1. 프로젝트 개요

본 프로젝트는 Next.js 15 App Router와 React 19, TypeScript를 기반으로 개발된 개인 포트폴리오 웹사이트입니다.
개인 포트폴리오이자 실용적인 유틸리티 도구 모음으로서, 음원 리스트, 개발 블로그, 세금 계산기, DJ 플레이리스트,
브라우저 미니게임, 이메일 문의, JWT 세션 기반 관리자 대시보드 등의 기능을 제공합니다.

---

## 2. 전체 라우트 맵

| 경로               | 설명                              | 컴포넌트 구성                                    |
| ------------------ | --------------------------------- | ------------------------------------------------ |
| `/`                | 홈 / 히어로                       | 서버 `page.tsx` + `components/Hero.tsx` (client) |
| `/about`           | 소개 (경력, 기술 스택, 연락 링크) | 서버 컴포넌트                                    |
| `/music-list`      | 날짜 기반 음원 리스트             | `page.tsx`(서버) + `MusicListClient.tsx`         |
| `/blog`            | 블로그 목록                       | 서버 컴포넌트                                    |
| `/blog/[slug]`     | 블로그 상세 (SSG)                 | 서버 컴포넌트, `generateStaticParams`            |
| `/DJ_Play_List`    | 오디오 플레이어                   | `page.tsx`(서버) + `DJPlayListClient.tsx`        |
| `/tax-calculator`  | 세금 계산기                       | `page.tsx`(서버) + `TaxCalculatorClient.tsx`     |
| `/contact`         | 이메일 문의 폼                    | `page.tsx`(서버) + `ContactClient.tsx`           |
| `/projects`        | 외부 링크 모음                    | 서버 컴포넌트                                    |
| `/games`           | 미니게임 허브                     | 서버 컴포넌트                                    |
| `/login`           | 관리자 로그인                     | `page.tsx`(서버) + `LoginClient.tsx`             |
| `/admin`           | 관리자 대시보드 홈                | 서버 컴포넌트, 세션 쿠키에서 사용자명 표시       |
| `/admin/users`     | 사용자 관리                       | 서버 컴포넌트, 환경 변수 관리자 계정 1개 표시    |
| `/api/auth/login`  | 로그인 API                        | Route Handler — bcrypt 검증 + JWT 세션 발급      |
| `/api/auth/logout` | 로그아웃 API                      | Route Handler — 세션 쿠키 제거                   |
| `/api/send-email`  | 이메일 발송 API                   | Route Handler — Nodemailer SMTP                  |

`/admin/**` 경로는 `middleware.ts`에서 세션 쿠키를 검증하여 보호합니다.

---

## 3. 인증 시스템

DB 없이 환경 변수 기반의 단일 관리자 계정만 존재합니다.

- `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH` (bcrypt 해시) 환경 변수로 계정 정의
- `POST /api/auth/login`: `lib/credentials.ts`의 `verifyCredentials()`로 비밀번호 비교
- 성공 시 `lib/auth.ts`의 `createSessionToken()`으로 JWT 생성 (jose, HS256, 2시간 만료)
- 세션은 httpOnly + `SameSite=Lax` 쿠키(`admin_session`)로 저장 — 클라이언트 JS에서 읽거나 위조 불가
- `middleware.ts`가 `/admin/:path*` 요청마다 쿠키를 검증, 없거나 유효하지 않으면 `/login`으로 리다이렉트
- `POST /api/auth/logout`: 쿠키를 만료시켜 제거

> ⚠️ 참고: 별도 사용자 DB가 없어 다중 사용자/역할 관리는 지원하지 않습니다. `/admin/users`는
> 등록된 관리자 계정 1개(환경 변수)를 조회 전용으로 보여줍니다.

---

## 4. 주요 기능 상세

### 4.1 홈 / 히어로 (`app/page.tsx`, `components/Hero.tsx`)

- GSAP `bounce.out` ease + `yoyo: true, repeat: -1`로 제목 바운스 애니메이션 (GSAP는 마운트 후 동적 import로 지연 로드)
- "이력서 보기"(`/resume.pdf`) 및 "프로젝트 보기"(`/projects`) CTA 버튼
- 12년 이상 경력 소개 텍스트

### 4.2 소개 (`app/about/page.tsx`)

- 경력 소개 문구 (Hero와 동일한 톤 재사용)
- 기술 스택 배지 (shields.io): TypeScript, JavaScript, Next.js, TailwindCSS, Node.js, Cocos Creator, HTML5
- GitHub, YouTube, LinkedIn, 네이버 블로그, 이메일 문의 링크

### 4.3 음원 리스트 (`data/musicData.ts`, `app/music-list/`)

- 모든 플레이리스트를 `data/musicData.ts` 한 파일에서 중앙 관리 (날짜 + 트랙 배열)
- 날짜 선택 버튼(pill)으로 플레이리스트 전환, 트랙 테이블(#, 제목, 아티스트, BPM)
- 스티키 오디오 플레이어: 재생/일시정지/정지, 클릭 가능한 진행바, 현재 재생 트랙 강조

### 4.4 블로그 (`data/blogPosts.ts`, `app/blog/`, `app/blog/[slug]/`)

- 게시글을 `data/blogPosts.ts` 단일 파일에 저장 (slug, 제목 한/영, 날짜, 태그, 마크다운형 본문)
- 목록 페이지: 날짜 역순 정렬, 태그/작성자 표시
- 상세 페이지: `generateStaticParams` 기반 SSG, 헤딩/리스트/문단 렌더링

### 4.5 DJ 플레이 리스트 (`app/DJ_Play_List/`)

- 스윙 재즈 트랙 6곡 기본 제공 (AWS S3에서 스트리밍, `lib/audio.ts`의 `audioUrl()`로 베이스 URL 해석)
- Play/Pause/Stop, 진행바 탐색, 볼륨 조절, Repeat/Shuffle 토글
- URL로 트랙 추가, 로컬 파일 업로드(Object URL) 지원, 언마운트 시 Object URL 해제로 메모리 누수 방지

### 4.6 세금 계산기 (`app/tax-calculator/`, `app/lib/taxCalculator.ts`, `app/config/taxRates2025.ts`)

2025년 대한민국 세금 구조 기반 계산기.

| 항목       | 기준              |
| ---------- | ----------------- |
| 소득세     | 누진세율 (6%~45%) |
| 지방소득세 | 소득세의 10%      |
| 국민연금   | 연봉의 4.5%       |
| 건강보험   | 연봉의 3.545%     |
| 고용보험   | 연봉의 0.9%       |

월급/연봉 전환, 4대보험 포함 여부, 단위별 금액 증감 버튼(+1만/+10만/+100만) 지원.

### 4.7 문의 폼 (`app/contact/`, `app/api/send-email/route.ts`)

- 입력: 타이틀, 보내는 사람(이메일), 내용 — HTML 메일 실시간 미리보기
- `POST /api/send-email`: `lib/email.ts`로 헤더 인젝션 방지 새니타이즈 후 Nodemailer로 SMTP 발송
- 필요 환경 변수: `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `RECEIVER_EMAIL`

### 4.8 프로젝트 페이지 (`app/projects/page.tsx`)

DJ Play List(내부), GitHub, LinkedIn, YouTube, About(내부) 링크 카드 모음.

### 4.9 게임 허브 (`app/games/page.tsx`)

Solitaire, 2048, 지뢰찾기, FreeCell, 스도쿠를 별도 `Games` 섹션으로 분류한 링크 카드 모음.

### 4.10 관리자 대시보드 (`app/admin/`)

- 데스크탑 사이드바 + 모바일 Sheet 드로어 (shadcn/ui `Button`, `Sheet`)
- `/admin`: 세션 쿠키에서 사용자명을 읽어 환영 메시지 표시, `/admin/users`로 이동하는 빠른 링크 카드
- `/admin/users`: 환경 변수로 설정된 관리자 계정 1개를 테이블로 표시 (실 사용자 DB 없음을 명시)
- `AdminLayoutClient.tsx`가 로그아웃 처리(`POST /api/auth/logout` → `/login` 이동)

### 4.11 Footer 방문자 카운터 (`components/Footer.tsx`)

- 별도 백엔드/DB 없이 `visitor-badge.laobi.icu` 외부 뱃지 이미지로 실시간 방문자 수 표시
- Vercel 서버리스 환경은 파일시스템이 휘발성이라 자체 카운터 파일 방식은 배포/인스턴스마다 초기화되므로 외부 서비스로 대체

---

## 5. 공통 컴포넌트 & 유틸리티

| 컴포넌트/함수                         | 경로                       | 설명                                                      |
| ------------------------------------- | -------------------------- | --------------------------------------------------------- |
| `NavBar`                              | `components/NavBar.tsx`    | 상단 고정 내비게이션 (`usePathname` 기반 활성 표시)       |
| `Footer`                              | `components/Footer.tsx`    | 기술 스택 배지 + 방문자 뱃지 + SNS 링크 (데스크탑만)      |
| `BottomNav`                           | `components/BottomNav.tsx` | 모바일 하단 고정 내비 (Home/Music/Projects/Games/About) |
| `Hero`                                | `components/Hero.tsx`      | GSAP 바운스 애니메이션 히어로 섹션                        |
| `createSessionToken()` 등             | `lib/auth.ts`              | JWT 세션 생성/검증, 쿠키 옵션                             |
| `verifyCredentials()`                 | `lib/credentials.ts`       | bcrypt 비밀번호 비교                                      |
| `buildContactHtml()` 등               | `lib/email.ts`             | 문의 메일 HTML 생성 + 헤더 새니타이즈                     |
| `audioUrl()`                          | `lib/audio.ts`             | 오디오 베이스 URL 해석                                    |
| `cn()`                                | `lib/utils.ts`             | clsx + tailwind-merge 조합 유틸리티                       |
| `shuffleArray`, `upgradeShuffleArray` | `utils/Utils.ts`           | Fisher-Yates / `crypto.getRandomValues` 기반 셔플         |

---

## 6. 기술 스택 전체

| 분류        | 기술                                   | 버전          |
| ----------- | -------------------------------------- | ------------- |
| 프레임워크  | Next.js                                | 15.5.18       |
| 런타임      | React                                  | 19.0.0        |
| 언어        | TypeScript                             | 5             |
| 스타일링    | Tailwind CSS                           | 3.4.1         |
| UI 컴포넌트 | shadcn/ui (Radix UI)                   | —             |
| 애니메이션  | GSAP                                   | 3.13.0        |
| 아이콘      | Lucide React                           | 0.511.0       |
| 이메일      | Nodemailer                             | 9.0.1         |
| 인증        | jose (JWT) + bcryptjs                  | 6.2.3 / 3.0.3 |
| 테스트      | Vitest                                 | 4.1.10        |
| 포맷터      | Prettier + prettier-plugin-tailwindcss | 3.9.5 / 0.8.1 |

---

## 7. 테스트

Vitest로 `**/*.test.ts` 패턴의 유닛 테스트를 실행합니다 (`vitest.config.ts`).

| 파일                            | 테스트 대상                      |
| ------------------------------- | -------------------------------- |
| `lib/auth.test.ts`              | JWT 세션 생성/검증               |
| `lib/credentials.test.ts`       | 관리자 자격 증명 검증            |
| `lib/email.test.ts`             | 문의 메일 HTML 생성 + 새니타이즈 |
| `utils/Utils.test.ts`           | 배열 셔플 유틸리티               |
| `app/lib/taxCalculator.test.ts` | 세금 계산 로직                   |

```bash
npm run test            # 전체 실행
npm run test:watch       # watch 모드
npm run test:coverage    # 커버리지 리포트 (v8)
```

---

## 8. 알려진 제한 사항 및 향후 과제

1. **단일 관리자 계정**: 사용자 DB가 없어 다중 사용자/역할 기반 접근 제어는 지원하지 않습니다.
2. **정적 데이터**: 음원/블로그 데이터는 코드에 포함된 정적 파일 기반이라, 실제 콘텐츠 관리 시스템이
   필요하다면 별도 DB/CMS 연동이 필요합니다.
3. **이메일**: SMTP 환경 변수 미설정 시 문의 폼 발송이 실패합니다.
4. **DJ Play List 오디오**: 기본 트랙은 특정 AWS S3 버킷에 의존하며, `NEXT_PUBLIC_AUDIO_BASE_URL`로만
   베이스 URL을 교체할 수 있습니다.
5. **방문자 카운터**: 외부 무료 뱃지 서비스에 의존하므로 해당 서비스 가용성에 영향을 받습니다.
