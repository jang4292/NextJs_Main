# NextJs_Main 저장소 분석 보고서

> 작성일: 2026-07-16
> 저장소: [jang4292/NextJs_Main](https://github.com/jang4292/NextJs_Main)
> 목적: 저장소 전체 현황 조사 및 분석

---

## 목차

1. [프로젝트 개요](#1-프로젝트-개요)
2. [디렉토리 구조](#2-디렉토리-구조)
3. [기술 스택](#3-기술-스택)
4. [주요 기능 분석](#4-주요-기능-분석)
5. [컴포넌트 구조](#5-컴포넌트-구조)
6. [인증 및 미들웨어](#6-인증-및-미들웨어)
7. [API 및 서버 로직](#7-api-및-서버-로직)
8. [설정 파일 분석](#8-설정-파일-분석)
9. [개선 가능 영역 및 알려진 이슈](#9-개선-가능-영역-및-알려진-이슈)
10. [환경 변수 가이드](#10-환경-변수-가이드)
11. [시작 가이드](#11-시작-가이드)
12. [결론](#12-결론)

---

## 1. 프로젝트 개요

이 프로젝트는 **개발자 YH Jang(장윤환)의 개인 포트폴리오 웹사이트**입니다. 경력 소개, 프로젝트 링크,
이메일 연락 기능, 세금 계산기, DJ 재생 목록 플레이어, 브라우저 미니게임, 날짜 기반 음원 리스트, 개발 블로그, JWT 세션
기반 관리자 대시보드 등 다양한 기능을 포함하고 있습니다.

| 항목             | 내용                                                                                                                                                                                                                                                                 |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 프레임워크       | Next.js 15.5.18 (App Router)                                                                                                                                                                                                                                         |
| 언어             | TypeScript 5                                                                                                                                                                                                                                                         |
| 런타임           | Node.js                                                                                                                                                                                                                                                              |
| 배포 대상        | Vercel (권장)                                                                                                                                                                                                                                                        |
| 사이트 타이틀    | YH Jang                                                                                                                                                                                                                                                              |
| 총 페이지 수     | 18개 (`/`, `/about`, `/music-list`, `/blog`, `/blog/[slug]`, `/DJ_Play_List`, `/tax-calculator`, `/contact`, `/projects`, `/games`, `/games/2048`, `/games/minesweeper`, `/games/solitaire`, `/games/freecell`, `/games/sudoku`, `/login`, `/admin`, `/admin/users`) |
| 총 API 라우트 수 | 3개 (`/api/auth/login`, `/api/auth/logout`, `/api/send-email`)                                                                                                                                                                                                       |
| 테스트           | Vitest, 유닛 테스트 5개 파일                                                                                                                                                                                                                                         |

---

## 2. 디렉토리 구조

```
NextJs_Main/
├── .eslintrc.json           # ESLint 설정 (+ eslint-config-prettier)
├── .prettierrc.json         # Prettier 설정 (+ prettier-plugin-tailwindcss)
├── .prettierignore
├── .gitignore
├── .env.example              # 환경 변수 예시
├── REPORT.md                 # 저장소 분석 보고서 (본 파일)
├── README.md
├── components.json           # shadcn/ui CLI 설정
├── middleware.ts              # /admin/** 세션 보호
├── next.config.ts             # Next.js 설정
├── nodemailer.d.ts            # Nodemailer 타입 정의 (커스텀)
├── package.json               # 의존성 및 스크립트
├── package-lock.json
├── postcss.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── vitest.config.ts
│
├── app/                       # Next.js App Router 루트
│   ├── layout.tsx             # 루트 레이아웃 (NavBar, Footer, BottomNav)
│   ├── page.tsx                # 홈 페이지 (Hero 컴포넌트)
│   ├── error.tsx, global-error.tsx, loading.tsx, not-found.tsx
│   ├── about/
│   │   └── page.tsx            # About 페이지 (경력/기술스택/연락 링크)
│   ├── projects/
│   │   └── page.tsx            # 프로젝트 & 링크 목록 페이지
│   ├── games/
│   │   ├── page.tsx            # 미니게임 허브 페이지
│   │   ├── 2048/page.tsx
│   │   ├── minesweeper/page.tsx
│   │   ├── solitaire/page.tsx
│   │   ├── freecell/page.tsx
│   │   └── sudoku/page.tsx
│   ├── contact/
│   │   ├── page.tsx            # 서버 컴포넌트 (metadata)
│   │   └── ContactClient.tsx   # 이메일 연락 폼 (client)
│   ├── login/
│   │   ├── page.tsx            # 서버 컴포넌트 (metadata)
│   │   └── LoginClient.tsx      # 로그인 폼 (client)
│   ├── tax-calculator/
│   │   ├── page.tsx
│   │   └── TaxCalculatorClient.tsx  # 2025년 한국 세금 계산기
│   ├── DJ_Play_List/
│   │   ├── page.tsx
│   │   └── DJPlayListClient.tsx     # DJ 재생 목록 오디오 플레이어
│   ├── music-list/
│   │   ├── page.tsx
│   │   └── MusicListClient.tsx      # 날짜 기반 음원 리스트
│   ├── blog/
│   │   ├── page.tsx             # 블로그 목록
│   │   └── [slug]/page.tsx       # 블로그 상세 (SSG)
│   ├── admin/
│   │   ├── layout.tsx            # 관리자 레이아웃 (metadata + 사이드바 래핑)
│   │   ├── AdminLayoutClient.tsx # 사이드바 / 모바일 Sheet / 로그아웃 (client)
│   │   ├── page.tsx              # 관리자 대시보드 홈
│   │   ├── error.tsx, loading.tsx
│   │   └── users/
│   │       └── page.tsx          # 관리자 사용자 관리
│   ├── api/
│   │   ├── auth/login/route.ts   # POST 로그인 (세션 발급)
│   │   ├── auth/logout/route.ts  # POST 로그아웃 (세션 제거)
│   │   └── send-email/route.ts   # POST 이메일 발송 API
│   ├── config/
│   │   └── taxRates2025.ts       # 2025 한국 세율 데이터
│   ├── lib/
│   │   ├── taxCalculator.ts      # 세금 계산 비즈니스 로직
│   │   └── taxCalculator.test.ts
│   └── fonts/                    # Geist 폰트 파일 (WOFF)
│
├── components/                # React 컴포넌트
│   ├── NavBar.tsx              # 상단 네비게이션 (데스크톱 전용)
│   ├── BottomNav.tsx            # 하단 네비게이션 (모바일 전용)
│   ├── Hero.tsx                 # 홈 페이지 메인 히어로 섹션
│   ├── Footer.tsx                # 하단 푸터 (방문자 뱃지 포함)
│   └── ui/
│       ├── button.tsx           # shadcn/ui Button 컴포넌트
│       └── sheet.tsx             # shadcn/ui Sheet 컴포넌트
│
├── lib/                        # 서버/공용 유틸리티
│   ├── auth.ts, auth.test.ts     # JWT 세션 생성/검증 (jose)
│   ├── credentials.ts, credentials.test.ts  # bcrypt 자격 증명 검증
│   ├── email.ts, email.test.ts   # 문의 메일 HTML 생성 + 새니타이즈
│   ├── audio.ts                  # 오디오 베이스 URL 해석
│   └── utils.ts                  # cn() 유틸리티 함수
│
├── data/
│   ├── musicData.ts              # 날짜별 음원 리스트 데이터
│   └── blogPosts.ts               # 블로그 게시글 데이터
│
├── types/
│   └── track.ts                  # Track / PlaylistTrack 타입
│
├── utils/
│   ├── Utils.ts                   # 배열 셔플 유틸리티
│   └── Utils.test.ts
│
├── hooks/                        # (현재 비어 있음, .gitkeep)
│
├── public/                       # 정적 자산
│   └── icons/
│       ├── GitHub.svg, LinkedIn.svg, YouTube.svg
│       ├── NaverBlog.svg, Mail.svg, Link.svg
│
├── styles/
│   └── globals.css               # 전역 Tailwind CSS + 색상 변수
│
└── docs/
    ├── ARCHITECTURE.md
    ├── REPORT_KO.md
    ├── REPORT_EN.md
    └── migration/
        └── nextjs-pages-router-to-app-router-analysis.md
```

---

## 3. 기술 스택

### 3.1 프론트엔드

| 카테고리        | 기술                           | 버전    |
| --------------- | ------------------------------ | ------- |
| 프레임워크      | Next.js                        | 15.5.18 |
| UI 라이브러리   | React                          | 19.0.0  |
| 언어            | TypeScript                     | 5.x     |
| 스타일링        | Tailwind CSS                   | 3.4.1   |
| 컴포넌트        | shadcn/ui (New York 스타일)    | -       |
| UI 기반         | Radix UI (Dialog, Slot)        | 최신    |
| 애니메이션      | GSAP (GreenSock)               | 3.13.0  |
| 아이콘          | lucide-react                   | 0.511.0 |
| 클래스 유틸리티 | clsx + tailwind-merge          | -       |
| 컴포넌트 변형   | class-variance-authority (CVA) | -       |

### 3.2 백엔드 / 인증

| 카테고리      | 기술               | 버전  |
| ------------- | ------------------ | ----- |
| 런타임        | Node.js            | -     |
| 이메일 발송   | Nodemailer         | 9.0.1 |
| 세션 토큰     | jose (JWT)         | 6.2.3 |
| 비밀번호 해싱 | bcryptjs           | 3.0.3 |
| API 라우트    | Next.js App Router | -     |

### 3.3 개발 도구

| 도구                        | 버전   | 역할                      |
| --------------------------- | ------ | ------------------------- |
| ESLint                      | 9.39.0 | 코드 품질 검사            |
| Prettier                    | 3.9.5  | 코드 포맷팅               |
| prettier-plugin-tailwindcss | 0.8.1  | Tailwind 클래스 자동 정렬 |
| Vitest                      | 4.1.10 | 유닛 테스트 러너          |
| PostCSS                     | -      | CSS 변환                  |
| Turbopack                   | 내장   | 고속 번들러 (선택 사용)   |

### 3.4 의존성 패키지 전체 목록

**프로덕션 의존성:**

```json
{
  "@radix-ui/react-dialog": "^1.1.14",
  "@radix-ui/react-slot": "^1.2.3",
  "bcryptjs": "^3.0.3",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "gsap": "^3.13.0",
  "jose": "^6.2.3",
  "lucide-react": "^0.511.0",
  "next": "15.5.18",
  "nodemailer": "^9.0.1",
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "tailwind-merge": "^3.3.0",
  "tailwindcss-animate": "^1.0.7"
}
```

**개발 의존성:**

```json
{
  "@types/bcryptjs": "^2.4.6",
  "@types/node": "^20",
  "@types/react": "^19",
  "@types/react-dom": "^19",
  "@vitest/coverage-v8": "^4.1.10",
  "eslint": "^9.39.0",
  "eslint-config-next": "15.5.14",
  "eslint-config-prettier": "^10.1.8",
  "postcss": "^8",
  "prettier": "^3.9.5",
  "prettier-plugin-tailwindcss": "^0.8.1",
  "shadcn-ui": "^0.9.5",
  "tailwindcss": "^3.4.1",
  "typescript": "^5",
  "vitest": "^4.1.10"
}
```

---

## 4. 주요 기능 분석

### 4.1 홈 페이지 (`/`)

- **파일:** `app/page.tsx`
- Hero 컴포넌트를 중앙 배치하는 단순한 레이아웃
- 실제 콘텐츠는 `components/Hero.tsx`에서 관리

**Hero 컴포넌트 주요 내용:**

- GSAP `bounce.out` 이펙트로 제목 애니메이션 (`yoyo: true`, 무한 반복), 마운트 후 동적 import로 지연 로드
- 메인 헤드라인: **"프론트와 백을 자유롭게 오가는 TypeScript 엔지니어"**
- 경력: 12년 이상, 다양한 플랫폼 경험
- CTA 버튼: 이력서 다운로드(파란색), 프로젝트 보기(테두리)

### 4.2 About 페이지 (`/about`)

- **파일:** `app/about/page.tsx` (서버 컴포넌트)
- 경력 소개 문구, 기술 스택 배지(shields.io), 소셜/연락 링크로 구성
- 별도 `layout.tsx` 없이 `page.tsx`에서 직접 `metadata` export

### 4.3 프로젝트 페이지 (`/projects`)

- **파일:** `app/projects/page.tsx`
- 그리드 레이아웃으로 프로젝트/링크 카드 표시
- 링크 항목: DJ Play List(내부), GitHub, LinkedIn, YouTube, About(내부)

### 4.4 게임 허브 (`/games`)

- **파일:** `app/games/page.tsx`
- `/projects`에 섞여 있던 게임 링크를 별도 `Games` 섹션으로 분류
- 링크 항목: Solitaire, 2048, 지뢰찾기, FreeCell, 스도쿠

### 4.5 이메일 연락 페이지 (`/contact`)

- **파일:** `app/contact/page.tsx`(서버, metadata) + `ContactClient.tsx`(client)
- 입력 필드: 제목, 발신자 이메일, 내용
- POST `/api/send-email` 호출, HTML 이메일 미리보기(`dangerouslySetInnerHTML`) 지원

### 4.6 세금 계산기 (`/tax-calculator`)

- **파일:** `app/tax-calculator/page.tsx`(서버) + `TaxCalculatorClient.tsx`(client)
- 2025년 한국 세금 기준 세후 급여 계산
- 월급/연봉 전환, 4대보험 포함 여부, 단위별 증감 버튼(+1만/+10만/+100만원)
- 결과: 소득세, 지방소득세, 국민연금, 건강보험료, 고용보험료, 총 공제액, **실수령액**

### 4.7 DJ 재생 목록 (`/DJ_Play_List`)

- **파일:** `app/DJ_Play_List/page.tsx`(서버) + `DJPlayListClient.tsx`(client)
- Swing Jazz 트랙 6곡 기본 제공, AWS S3 버킷에서 스트리밍 (`lib/audio.ts`)
- Play/Pause/Stop, 진행바 탐색, 볼륨, Repeat/Shuffle
- URL/로컬 파일로 트랙 추가 가능, Object URL 언마운트 시 해제

### 4.8 음원 리스트 (`/music-list`)

- **파일:** `app/music-list/page.tsx`(서버) + `MusicListClient.tsx`(client)
- `data/musicData.ts`에서 날짜별 플레이리스트 로드
- 날짜 선택 pill 버튼, 트랙 테이블, 스티키 오디오 플레이어

### 4.9 블로그 (`/blog`, `/blog/[slug]`)

- `data/blogPosts.ts` 단일 파일에서 게시글 관리
- 목록: 날짜 역순 정렬, 태그/작성자 표시
- 상세: `generateStaticParams` 기반 SSG, 마크다운형 본문 렌더링

### 4.10 관리자 대시보드 (`/admin`, `/admin/users`)

- **파일:** `app/admin/layout.tsx`, `AdminLayoutClient.tsx`, `page.tsx`, `users/page.tsx`
- 반응형 2단 레이아웃: 좌측 사이드바 + 우측 콘텐츠, shadcn/ui `Sheet`로 모바일 메뉴
- `/admin`: 세션 쿠키에서 사용자명을 읽어 환영 메시지 표시 + 사용자 관리 바로가기 카드
- `/admin/users`: 환경 변수로 설정된 관리자 계정 1개를 테이블로 표시 (별도 사용자 DB 없음을 명시)
- `middleware.ts`가 `/admin/:path*`를 세션 쿠키로 보호

### 4.11 로그인 페이지 (`/login`)

- **파일:** `app/login/page.tsx`(서버) + `LoginClient.tsx`(client)
- 아이디/비밀번호 입력 폼, `POST /api/auth/login` 호출
- 성공 시 `/admin`으로 이동 + `router.refresh()`

---

## 5. 컴포넌트 구조

### 5.1 레이아웃 계층

```
RootLayout (app/layout.tsx)
  └── <html lang="ko">
       ├── <NavBar />    ← 데스크톱 전용 상단 네비게이션
       ├── <main>
       │    └── {children}  ← 각 페이지 콘텐츠
       ├── <Footer />    ← 데스크톱 전용 하단 푸터
       └── <BottomNav /> ← 모바일 전용 하단 네비게이션
```

클라이언트 인터랙션이 필요한 라우트(`contact`, `login`, `music-list`, `DJ_Play_List`,
`tax-calculator`)는 `page.tsx`(서버, `metadata` export) + `<Route>Client.tsx`(`"use client"`)
2파일 구조를 사용합니다. `metadata`는 `"use client"` 파일에서 export할 수 없기 때문에, 메타데이터
전용 `layout.tsx`를 라우트마다 추가하는 대신 이 구조로 통합했습니다. `admin/layout.tsx`만은
예외로 유지되는데, 사이드바 UI(`AdminLayoutClient`)를 감싸는 역할까지 겸하기 때문입니다.

### 5.2 NavBar.tsx

- **역할:** 데스크톱 전용 상단 네비게이션 (`hidden md:flex`)
- Sticky 헤더 + 배경 블러 효과
- 메뉴: Home, Music, Blog, Projects, Games, About
- 활성 링크: 파란색 밑줄 (현재 pathname 비교)

### 5.3 BottomNav.tsx

- **역할:** 모바일 전용 하단 네비게이션 (`md:hidden`)
- 고정 하단 바, 5개 아이템: Home, Music, Projects, Games, About

### 5.4 Hero.tsx

- GSAP 애니메이션 (`bounce.out`, `yoyo: true`), 헤드라인 + CTA 버튼 2개

### 5.5 Footer.tsx

- **역할:** 데스크톱 전용 하단 푸터 (`hidden md:block`)
- 좌측: 브랜딩 + 방문자 뱃지(외부 서비스) + 저작권
- 우측: 기술 배지(shields.io) + 소셜 링크 아이콘 (GitHub, YouTube, LinkedIn, NaverBlog, Contact)

### 5.6 UI 컴포넌트 (shadcn/ui)

| 컴포넌트 | 파일                       | 설명                                |
| -------- | -------------------------- | ----------------------------------- |
| Button   | `components/ui/button.tsx` | CVA 기반 스타일 변형(variant, size) |
| Sheet    | `components/ui/sheet.tsx`  | 슬라이드 모달/패널 컴포넌트         |

---

## 6. 인증 및 미들웨어

- **계정 저장소:** 별도 DB 없이 환경 변수 `ADMIN_USERNAME` / `ADMIN_PASSWORD_HASH`(bcrypt 해시)로 단일 관리자 계정 정의
- **로그인:** `POST /api/auth/login` → `lib/credentials.ts`의 `verifyCredentials()`로 비밀번호 검증 →
  성공 시 `lib/auth.ts`의 `createSessionToken()`으로 JWT 발급(HS256, 2시간 만료) → httpOnly + `SameSite=Lax`
  쿠키(`admin_session`)로 저장
- **로그아웃:** `POST /api/auth/logout` → 쿠키 만료 처리
- **보호:** `middleware.ts`가 `/admin/:path*` 요청마다 `verifySessionToken()`으로 쿠키 검증, 실패 시
  `/login`으로 리다이렉트하며 쿠키 삭제

---

## 7. API 및 서버 로직

### 7.1 로그인 API (`app/api/auth/login/route.ts`)

| 항목      | 내용                                                       |
| --------- | ---------------------------------------------------------- |
| 경로      | `POST /api/auth/login`                                     |
| 요청 본문 | `{ username: string, password: string }`                   |
| 응답 성공 | `{ message: "로그인 성공" }` + `Set-Cookie: admin_session` |
| 응답 실패 | `{ message: string }` (400/401)                            |

### 7.2 로그아웃 API (`app/api/auth/logout/route.ts`)

| 항목 | 내용                                      |
| ---- | ----------------------------------------- |
| 경로 | `POST /api/auth/logout`                   |
| 동작 | `admin_session` 쿠키를 즉시 만료시켜 제거 |

### 7.3 이메일 발송 API (`app/api/send-email/route.ts`)

| 항목      | 내용                                                 |
| --------- | ---------------------------------------------------- |
| 경로      | `POST /api/send-email`                               |
| 요청 본문 | `{ title: string, sender: string, content: string }` |
| 응답 성공 | `{ message: "메일이 성공적으로 발송되었습니다." }`   |
| 응답 실패 | `{ message: string }` (400/500)                      |

```typescript
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
```

발신자 이메일 형식 검증, 제목/본문 길이 제한(200자/5000자), 헤더 인젝션 방지 새니타이즈(`lib/email.ts`)를 거칩니다.

---

## 8. 설정 파일 분석

### 8.1 `next.config.ts`

```typescript
{
  reactStrictMode: true,
  images: {
    domains: ["img.shields.io"], // 기술 배지 이미지 외부 도메인 허용
  },
}
```

### 8.2 `tsconfig.json`

```typescript
{
  compilerOptions: {
    target: "es2020",
    strict: true,
    module: "esnext",
    moduleResolution: "bundler",
    paths: { "@/*": ["*"] },
  },
}
```

### 8.3 `tailwind.config.ts`

- `darkMode: ['class']` 사용 (클래스 기반 다크 모드)
- 콘텐츠 경로: `app/**/*`, `pages/**/*`, `components/**/*`
- 확장 색상: HSL CSS 변수 참조
- 플러그인: `tailwindcss-animate`

### 8.4 `components.json` (shadcn/ui 설정)

```json
{
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "styles/globals.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

### 8.5 `.eslintrc.json`

```json
{ "extends": ["next/core-web-vitals", "next/typescript", "prettier"] }
```

### 8.6 `.prettierrc.json`

```json
{
  "semi": true,
  "singleQuote": false,
  "trailingComma": "all",
  "printWidth": 80,
  "tabWidth": 2,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

### 8.7 `vitest.config.ts`

- `environment: "node"`, `include: ["**/*.test.ts"]`
- `@/*` 경로 별칭을 `resolve.alias`로 매핑
- coverage provider: v8 (`text`, `html` 리포터)

### 8.8 `.gitignore` (주요 항목)

| 패턴                               | 이유                                                                    |
| ---------------------------------- | ----------------------------------------------------------------------- |
| `.env*`                            | 환경 변수 파일 무시                                                     |
| `/node_modules`, `/.next/`         | 빌드/의존성 결과물                                                      |
| `*.md` / `!REPORT.md` / `!docs/**` | 루트의 기타 마크다운은 무시하되 본 보고서와 docs/ 아래 문서는 예외 처리 |

---

## 9. 개선 가능 영역 및 알려진 이슈

### 9.1 이번 정비에서 해결된 항목

| 파일                                                                    | 이슈                                         | 상태                                           |
| ----------------------------------------------------------------------- | -------------------------------------------- | ---------------------------------------------- |
| `components/Footer.tsx`                                                 | 방문자 카운터 Today/Total 하드코딩 0         | ✅ 해결 (외부 뱃지 연동)                       |
| `app/about/page.tsx`                                                    | 콘텐츠 없는 스텁                             | ✅ 해결                                        |
| `app/admin/page.tsx`, `app/admin/users/page.tsx`                        | 플레이스홀더 텍스트만 존재                   | ✅ 해결                                        |
| `app/{DJ_Play_List,contact,login,music-list,tax-calculator}/layout.tsx` | metadata 전용 layout.tsx 보일러플레이트      | ✅ 해결 (page.tsx로 통합, layout.tsx 5개 제거) |
| Prettier 미설정                                                         | 포맷터 없음                                  | ✅ 해결                                        |
| REPORT.md / README.md / docs 버전 정보 stale                            | 존재하지 않는 라우트·구버전 의존성 버전 언급 | ✅ 해결 (본 갱신)                              |

### 9.2 남아있는 심각도: 중간 (Medium)

| 파일                                    | 이슈                | 설명                                         |
| --------------------------------------- | ------------------- | -------------------------------------------- |
| `app/DJ_Play_List/DJPlayListClient.tsx` | AWS S3 URL 하드코딩 | 기본 트랙의 오디오 URL이 특정 S3 버킷에 의존 |
| `app/admin/users/page.tsx`              | 실제 사용자 DB 없음 | 단일 환경 변수 계정만 조회 가능, CRUD 불가   |

### 9.3 남아있는 심각도: 낮음 (Low)

| 파일                            | 이슈             | 설명                                         |
| ------------------------------- | ---------------- | -------------------------------------------- |
| `components/Footer.tsx`         | 외부 서비스 의존 | 방문자 카운터가 무료 외부 뱃지 서비스에 의존 |
| `app/contact/ContactClient.tsx` | 기본값 하드코딩  | `user@example.com`이 기본 발신자로 하드코딩  |

### 9.4 구현 권장 사항 (향후)

1. **실제 사용자 DB 도입**: 다중 사용자/역할 관리가 필요하면 Supabase/Postgres 등 연동
2. **DJ Play List 오디오 소스 설정 가능화**: 트랙별 URL을 데이터 파일 또는 환경 변수로 분리
3. **방문자 카운터 자체 구축**: 트래픽이 늘어나면 Vercel KV/Upstash Redis 기반 자체 API로 전환 검토

---

## 10. 환경 변수 가이드

`.env.example`을 복사해 `.env.local`을 생성하세요.

```bash
# --- SMTP (문의 폼) ---
SMTP_HOST=smtp.naver.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your-smtp-username
SMTP_PASS=your-smtp-app-password
RECEIVER_EMAIL=you@example.com

# --- 관리자 인증 ---
ADMIN_USERNAME=admin
# 생성: node -e "require('bcryptjs').hash('실제비밀번호', 10).then(console.log)"
# 주의: Next.js는 .env 파일 내 $VAR 참조를 확장하므로, bcrypt 해시의 `$` 문자는
# 반드시 `\$`로 이스케이프해야 합니다 (그렇지 않으면 해시가 조용히 손상되어 로그인이 원인 불명으로 실패합니다).
ADMIN_PASSWORD_HASH=\$2b\$10\$replace-with-generated-bcrypt-hash
# 생성: openssl rand -base64 32
SESSION_SECRET=replace-with-32-byte-random-base64-string

# --- 음원 / DJ Play List 오디오 소스 (선택) ---
# 미설정 시 기본 데모 S3 버킷 사용. 클라이언트에 노출되므로 비밀 값 금지.
NEXT_PUBLIC_AUDIO_BASE_URL=https://audiofilestudy.s3.ap-northeast-2.amazonaws.com
```

> ⚠️ `.env*` 파일은 `.gitignore`에 의해 저장소에 커밋되지 않습니다.

---

## 11. 시작 가이드

### 사전 요구사항

- Node.js 18.x 이상
- npm 9.x 이상

### 설치 및 실행

```bash
# 1. 의존성 설치
npm install

# 2. 환경 변수 파일 생성
cp .env.example .env.local
# (위 환경 변수 섹션 참고)

# 3. 개발 서버 실행
npm run dev
# → http://localhost:3000

# 4. (선택) Turbopack 사용 시 빠른 개발 서버
npm run dev:turbo

# 5. (선택) 네트워크 접근 가능 서버 (모바일 테스트 등)
npm run dev:network
# → http://0.0.0.0:3000

# 6. 프로덕션 빌드
npm run build

# 7. 프로덕션 서버 실행
npm start

# 8. 코드 린트 / 타입 체크 / 포맷
npm run lint
npm run typecheck
npm run format:check

# 9. 테스트
npm run test
```

### 주요 페이지 경로

| URL                     | 설명                  |
| ----------------------- | --------------------- |
| `/`                     | 홈 (히어로 섹션)      |
| `/about`                | 소개 페이지           |
| `/music-list`           | 날짜 기반 음원 리스트 |
| `/blog`, `/blog/[slug]` | 블로그 목록 & 상세    |
| `/DJ_Play_List`         | DJ 재생 목록          |
| `/tax-calculator`       | 세금 계산기           |
| `/contact`              | 이메일 연락           |
| `/projects`             | 프로젝트 & 링크 목록  |
| `/games`                | 미니게임 허브         |
| `/games/*`              | 개별 미니게임         |
| `/login`                | 관리자 로그인         |
| `/admin`                | 관리자 대시보드       |
| `/admin/users`          | 관리자 사용자 관리    |

---

## 12. 결론

### 현재 완성된 기능 ✅

| 기능                                                   | 상태                     |
| ------------------------------------------------------ | ------------------------ |
| 포트폴리오 기본 구조 (홈, About, 프로젝트)             | ✅ 완성                  |
| 반응형 네비게이션 (데스크톱 NavBar + 모바일 BottomNav) | ✅ 완성                  |
| GSAP 히어로 애니메이션                                 | ✅ 완성                  |
| 이메일 연락 폼 + API                                   | ✅ 완성 (환경 변수 필요) |
| 2025년 한국 세금 계산기                                | ✅ 완성                  |
| DJ 재생 목록 오디오 플레이어                           | ✅ 완성                  |
| 브라우저 미니게임 허브 및 개별 게임                    | ✅ 완성                  |
| 날짜 기반 음원 리스트                                  | ✅ 완성                  |
| 개발 블로그 (SSG)                                      | ✅ 완성                  |
| JWT 세션 기반 관리자 인증 + 대시보드                   | ✅ 완성                  |
| Footer 실시간 방문자 카운터                            | ✅ 완성 (외부 뱃지)      |
| shadcn/ui 컴포넌트 통합                                | ✅ 완성                  |
| 다크 모드 지원 (CSS 변수)                              | ✅ 완성                  |
| TypeScript 엄격 모드                                   | ✅ 완성                  |
| 유닛 테스트 (Vitest)                                   | ✅ 완성                  |
| Prettier 코드 포맷팅                                   | ✅ 완성                  |

### 종합 평가

이 프로젝트는 **최신 Next.js 15 + React 19 + TypeScript** 기반으로 구축된 현대적인 개인 포트폴리오로,
다음과 같은 강점을 가집니다:

- **최신 기술 스택** 적극 도입 (Next.js 15, React 19, GSAP, shadcn/ui)
- **반응형 디자인** (모바일/데스크톱 분리 네비게이션)
- **실용적인 부가 기능** (세금 계산기, 오디오 플레이어, 음원 리스트, 블로그, 이메일 연락)
- **깔끔한 코드 구조** (App Router, 서버/클라이언트 컴포넌트 분리, 타입 안정성)
- **DB 없이 동작하는 경량 인증** (JWT + httpOnly 쿠키, 미들웨어 보호)
- **일관된 코드 포맷팅** (Prettier + Tailwind 클래스 자동 정렬)

향후 개선 여지는 실제 사용자 데이터베이스 도입(다중 사용자 관리)과 오디오 소스 설정 가능화 정도이며,
핵심 기능은 모두 완성되어 있습니다.
