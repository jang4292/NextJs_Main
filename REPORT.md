# NextJs_Main 저장소 분석 보고서

> 작성일: 2026-03-20  
> 저장소: [jang4292/NextJs_Main](https://github.com/jang4292/NextJs_Main)  
> 목적: 저장소 전체 현황 조사 및 분석

---

## 목차

1. [프로젝트 개요](#1-프로젝트-개요)
2. [디렉토리 구조](#2-디렉토리-구조)
3. [기술 스택](#3-기술-스택)
4. [주요 기능 분석](#4-주요-기능-분석)
5. [컴포넌트 구조](#5-컴포넌트-구조)
6. [세금 계산 로직](#6-세금-계산-로직)
7. [API 및 서버 로직](#7-api-및-서버-로직)
8. [설정 파일 분석](#8-설정-파일-분석)
9. [개선 가능 영역 및 알려진 이슈](#9-개선-가능-영역-및-알려진-이슈)
10. [환경 변수 가이드](#10-환경-변수-가이드)
11. [시작 가이드](#11-시작-가이드)
12. [결론](#12-결론)

---

## 1. 프로젝트 개요

이 프로젝트는 **개발자 YH Jang(장윤환)의 개인 포트폴리오 웹사이트**입니다. 사이트 제목은 **"YH Jang | HOME"** 이며, 경력 소개, 프로젝트 링크, 이메일 연락 기능, 세금 계산기, DJ 재생 목록 플레이어 등 다양한 기능을 포함하고 있습니다.

| 항목 | 내용 |
|------|------|
| 프레임워크 | Next.js 15.5.14 (App Router) |
| 언어 | TypeScript 5 |
| 런타임 | Node.js |
| 배포 대상 | Vercel (권장) |
| 사이트 타이틀 | YH Jang \| HOME |
| 총 페이지 수 | 11개 |
| 총 컴포넌트 수 | 6개 |
| API 라우트 수 | 1개 |

---

## 2. 디렉토리 구조

```
NextJs_Main/
├── .eslintrc.json          # ESLint 설정
├── .gitignore              # Git 무시 파일 목록
├── REPORT.md               # 저장소 분석 보고서 (본 파일)
├── README.md               # Next.js 기본 시작 안내 (gitignore 처리됨)
├── components.json         # shadcn/ui CLI 설정
├── next.config.ts          # Next.js 설정
├── nodemailer.d.ts         # Nodemailer 타입 정의 (커스텀)
├── package.json            # 의존성 및 스크립트
├── package-lock.json       # 의존성 잠금 파일
├── postcss.config.mjs      # PostCSS 설정
├── tailwind.config.ts      # Tailwind CSS 설정
├── tsconfig.json           # TypeScript 컴파일러 설정
│
├── app/                    # Next.js App Router 루트
│   ├── layout.tsx          # 루트 레이아웃 (NavBar, Footer, BottomNav)
│   ├── page.tsx            # 홈 페이지 (Hero 컴포넌트)
│   ├── about/
│   │   └── page.tsx        # About 페이지 (기본 템플릿)
│   ├── projects/
│   │   └── page.tsx        # 프로젝트 & 링크 목록 페이지
│   ├── contact/
│   │   └── page.tsx        # 이메일 연락 폼 페이지
│   ├── login/
│   │   └── page.tsx        # 로그인 페이지 (더미 인증)
│   ├── tax-calculator/
│   │   └── page.tsx        # 2025년 한국 세금 계산기
│   ├── DJ_Play_List/
│   │   └── page.tsx        # DJ 재생 목록 오디오 플레이어
│   ├── admin/
│   │   ├── layout.tsx      # 관리자 레이아웃 (사이드바)
│   │   ├── page.tsx        # 관리자 대시보드 홈 (플레이스홀더)
│   │   └── users/
│   │       └── page.tsx    # 관리자 사용자 관리 (플레이스홀더)
│   ├── api/
│   │   └── send-email/
│   │       └── route.ts    # POST 이메일 발송 API
│   ├── config/
│   │   └── taxRates2025.ts # 2025 한국 세율 데이터
│   ├── lib/
│   │   └── taxCalculator.ts # 세금 계산 비즈니스 로직
│   └── fonts/              # Geist 폰트 파일 (WOFF)
│
├── components/             # React 컴포넌트
│   ├── NavBar.tsx          # 상단 네비게이션 (데스크톱 전용)
│   ├── BottomNav.tsx       # 하단 네비게이션 (모바일 전용)
│   ├── Hero.tsx            # 홈 페이지 메인 히어로 섹션
│   ├── Footer.tsx          # 하단 푸터
│   └── ui/
│       ├── button.tsx      # shadcn/ui Button 컴포넌트
│       └── sheet.tsx       # shadcn/ui Sheet 컴포넌트
│
├── lib/
│   └── utils.ts            # cn() 유틸리티 함수 (Tailwind 클래스 병합)
│
├── utils/
│   └── Utils.ts            # 배열 셔플 유틸리티 함수
│
├── public/                 # 정적 자산
│   ├── favicon.ico
│   ├── file.svg, globe.svg, next.svg, vercel.svg, window.svg
│   └── icons/
│       ├── GitHub.svg, LinkedIn.svg, YouTube.svg
│       ├── NaverBlog.svg, Mail.svg, Link.svg
│
└── styles/
    └── globals.css         # 전역 Tailwind CSS + 색상 변수
```

---

## 3. 기술 스택

### 3.1 프론트엔드

| 카테고리 | 기술 | 버전 |
|---------|------|------|
| 프레임워크 | Next.js | 15.5.14 |
| UI 라이브러리 | React | 19.0.0 |
| 언어 | TypeScript | 5.x |
| 스타일링 | Tailwind CSS | 3.4.1 |
| 컴포넌트 | shadcn/ui (New York 스타일) | - |
| UI 기반 | Radix UI (Dialog, Slot) | 최신 |
| 애니메이션 | GSAP (GreenSock) | 3.13.0 |
| 아이콘 | lucide-react | 0.511.0 |
| 클래스 유틸리티 | clsx + tailwind-merge | - |
| 컴포넌트 변형 | class-variance-authority (CVA) | - |

### 3.2 백엔드

| 카테고리 | 기술 | 버전 |
|---------|------|------|
| 런타임 | Node.js | - |
| 이메일 발송 | Nodemailer | 7.0.13 |
| API 라우트 | Next.js App Router | - |

### 3.3 개발 도구

| 도구 | 버전 | 역할 |
|------|------|------|
| ESLint | 10.0.2 | 코드 품질 검사 |
| PostCSS | - | CSS 변환 |
| Turbopack | 내장 | 고속 번들러 (선택 사용) |

### 3.4 의존성 패키지 전체 목록

**프로덕션 의존성:**
```json
{
  "@radix-ui/react-dialog": "^1.1.14",
  "@radix-ui/react-slot": "^1.2.3",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "gsap": "^3.13.0",
  "lucide-react": "^0.511.0",
  "next": "15.5.14",
  "nodemailer": "^7.0.13",
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "shadcn-ui": "^0.9.5",
  "tailwind-merge": "^3.3.0",
  "tailwindcss-animate": "^1.0.7"
}
```

**개발 의존성:**
```json
{
  "@eslint/eslintrc": "^3",
  "@types/node": "^20",
  "@types/nodemailer": "^6.4.17",
  "@types/react": "^19",
  "@types/react-dom": "^19",
  "eslint": "^9",
  "eslint-config-next": "15.2.4",
  "postcss": "^8",
  "tailwindcss": "^3.4.1",
  "typescript": "^5"
}
```

---

## 4. 주요 기능 분석

### 4.1 홈 페이지 (`/`)

- **파일:** `app/page.tsx` (10줄)
- Hero 컴포넌트를 중앙 배치하는 단순한 레이아웃
- 실제 콘텐츠는 `components/Hero.tsx`에서 관리

**Hero 컴포넌트 주요 내용:**
- GSAP `bounce.out` 이펙트로 제목 애니메이션 (`yoyo: true`, 무한 반복)
- 메인 헤드라인: **"프론트와 백을 자유롭게 오가는 TypeScript 엔지니어"**
- 경력: 12년 이상, 다양한 플랫폼 경험
- CTA 버튼: 이력서 다운로드(파란색), 프로젝트 보기(테두리)

---

### 4.2 프로젝트 페이지 (`/projects`)

- **파일:** `app/projects/page.tsx` (100줄)
- 그리드 레이아웃으로 프로젝트/링크 카드 표시
- 링크 항목:
  - **DJ Play List** (내부 링크, `/DJ_Play_List`)
  - **GitHub** (외부 링크, 새 탭)
  - **LinkedIn** (외부 링크, 새 탭 – 플레이스홀더 URL)
  - **YouTube** (외부 링크, 새 탭 – 플레이스홀더 URL)
  - **About** (내부 링크, `/about`)
- 각 카드에 한국어 설명, hover 효과 포함

---

### 4.3 이메일 연락 페이지 (`/contact`)

- **파일:** `app/contact/page.tsx` (150줄)
- 입력 필드: 제목, 발신자 이메일, 내용
- POST `/api/send-email` 호출
- HTML 이메일 템플릿 생성 (파란색 테마)
- HTML 미리보기(`dangerouslySetInnerHTML`) 지원
- 성공/실패 결과 메시지 표시

> ⚠️ **알려진 이슈:** 42번째 줄에 `debugger` 문이 제거되지 않은 채 남아 있음

---

### 4.4 세금 계산기 (`/tax-calculator`)

- **파일:** `app/tax-calculator/page.tsx` (215줄)
- 2025년 한국 세금 기준 세후 급여 계산
- 기능:
  - 월급/연봉 전환 체크박스
  - 4대보험 포함 여부 선택
  - 10,000 / 100,000 / 1,000,000원 단위 증감 버튼
  - 한국 로케일 숫자 포맷 표시 (예: 3,000,000)
- 결과 표시 항목:
  - 소득세
  - 지방소득세
  - 국민연금
  - 건강보험료
  - 고용보험료
  - 총 공제액
  - **실수령액 (강조 표시)**

---

### 4.5 DJ 재생 목록 (`/DJ_Play_List`)

- **파일:** `app/DJ_Play_List/page.tsx` (183줄)
- Swing Jazz 트랙 6곡 목록 포함 오디오 플레이어
- 오디오 파일은 **AWS S3** 버킷에서 스트리밍
- 기능:
  - Play / Pause / Stop 컨트롤
  - 진행 바 (클릭으로 탐색 가능)
  - 현재 시간 / 총 시간 표시
  - 트랙별 BPM, 장르 정보 표시
  - 배열 셔플(`Utils.ts`의 `upgradeShuffleArray`) 활용

---

### 4.6 관리자 대시보드 (`/admin`)

- **파일:** `app/admin/layout.tsx` (67줄), `app/admin/page.tsx` (8줄), `app/admin/users/page.tsx` (8줄)
- 반응형 2단 레이아웃: 좌측 사이드바 + 우측 콘텐츠
- shadcn/ui `Sheet` 컴포넌트로 모바일 메뉴 구현
- 사이드바 메뉴: 대시보드, 사용자 관리 (lucide-react 아이콘 사용)
- ⚠️ 콘텐츠 영역은 플레이스홀더("1관리자 대시보드", "2관리자 대시보드")만 존재, **미완성 상태**

---

### 4.7 로그인 페이지 (`/login`)

- **파일:** `app/login/page.tsx` (77줄)
- 이메일/비밀번호 입력 폼
- **더미 인증:** 클라이언트 코드에 `admin` / `password` 하드코딩
- 로그인 성공 시 `useRouter`로 홈(`/`)으로 리다이렉트
- ⚠️ 실제 인증 시스템 없음 (보안 위험)

---

## 5. 컴포넌트 구조

### 5.1 레이아웃 계층

```
RootLayout (app/layout.tsx)
  └── <html lang="ko">  ← 한국어 설정
       ├── <NavBar />    ← 데스크톱 전용 상단 네비게이션
       ├── <main>
       │    └── {children}  ← 각 페이지 콘텐츠
       ├── <Footer />    ← 데스크톱 전용 하단 푸터
       └── <BottomNav /> ← 모바일 전용 하단 네비게이션
```

### 5.2 NavBar.tsx

- **역할:** 데스크톱 전용 상단 네비게이션 (`hidden md:flex`)
- Sticky 헤더 + 배경 블러 효과
- 로고: "제이의 포트폴리오"
- 메뉴: Home, Projects, About
- 활성 링크: 파란색 밑줄 (현재 pathname 비교)

### 5.3 BottomNav.tsx

- **역할:** 모바일 전용 하단 네비게이션 (`md:hidden`)
- 고정 하단 바, 4개 아이템
- 아이콘 + 레이블 구성: Home, Projects, About, Contact
- 활성 항목: 파란색 텍스트

### 5.4 Hero.tsx

- **역할:** 홈 페이지 히어로 섹션
- GSAP 애니메이션 (`bounce.out`, `yoyo: true`)
- 헤드라인, 소개 문구, CTA 버튼 2개 포함

### 5.5 Footer.tsx

- **역할:** 데스크톱 전용 하단 푸터 (`hidden md:flex`)
- 좌측: 브랜딩 + 방문자 카운터(하드코딩 0) + 저작권
- 우측: 기술 배지(shields.io) + 소셜 링크 아이콘
  - GitHub, YouTube, LinkedIn, NaverBlog, Contact

### 5.6 UI 컴포넌트 (shadcn/ui)

| 컴포넌트 | 파일 | 설명 |
|---------|------|------|
| Button | `components/ui/button.tsx` | CVA 기반 스타일 변형(variant, size) |
| Sheet | `components/ui/sheet.tsx` | 슬라이드 모달/패널 컴포넌트 |

---

## 6. 세금 계산 로직

### 6.1 세율 데이터 (`app/config/taxRates2025.ts`)

**소득세 누진 구간 (2025년 기준):**

| 연소득 범위 | 세율 | 누진공제 |
|-----------|------|--------|
| 0 ~ 1,200만원 | 6% | 0원 |
| 1,200만원 ~ 4,600만원 | 15% | 108만원 |
| 4,600만원 ~ 8,800만원 | 24% | 522만원 |
| 8,800만원 ~ 1.5억원 | 35% | 1,490만원 |
| 1.5억원 ~ 3억원 | 38% | 1,940만원 |
| 3억원 ~ 5억원 | 40% | 2,540만원 |
| 5억원 초과 | 45% | 3,540만원 |

**사회보험료 (근로자 부담분):**

| 보험 종류 | 요율 |
|---------|------|
| 국민연금 | 4.5% |
| 건강보험 | 3.545% |
| 고용보험 | 0.9% |
| 지방소득세 | 소득세의 10% |

### 6.2 계산 로직 (`app/lib/taxCalculator.ts`)

**인터페이스:**

```typescript
interface TaxInput {
  salary: number;       // 입력 급여
  isMonthly: boolean;   // true = 월급, false = 연봉
  includeInsurance: boolean; // 4대보험 포함 여부
}

interface TaxResult {
  annualSalary: number;        // 연봉
  incomeTax: number;           // 소득세
  localIncomeTax: number;      // 지방소득세
  nationalPension: number;     // 국민연금
  healthInsurance: number;     // 건강보험
  employmentInsurance: number; // 고용보험
  totalDeductions: number;     // 총 공제액
  netSalary: number;           // 실수령액
}
```

**계산 흐름:**

```
1. 월급 입력 시 × 12 → 연봉 환산
2. 연봉으로 누진세 구간 탐색
3. 소득세 = 연봉 × 세율 - 누진공제액
4. 지방소득세 = 소득세 × 10%
5. 국민연금 = 연봉 × 4.5%
6. 건강보험 = 연봉 × 3.545%
7. 고용보험 = 연봉 × 0.9%
8. 총 공제 = 소득세 + 지방소득세 + (includeInsurance ? 보험3종 : 0)
9. 실수령액 = 연봉 - 총 공제
10. 모든 금액 Math.floor() 처리 (정수 반환)
```

---

## 7. API 및 서버 로직

### 7.1 이메일 발송 API (`app/api/send-email/route.ts`)

| 항목 | 내용 |
|------|------|
| 경로 | `POST /api/send-email` |
| 요청 본문 | `{ title: string, sender: string, content: string }` |
| 응답 성공 | `{ message: "이메일이 성공적으로 전송되었습니다." }` |
| 응답 실패 | `{ error: "이메일 전송 실패: ..." }` |

**Nodemailer 설정 (환경변수 필요):**

```typescript
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
```

---

## 8. 설정 파일 분석

### 8.1 `next.config.ts`

```typescript
{
  reactStrictMode: true,
  images: {
    domains: ['img.shields.io']  // 기술 배지 이미지 외부 도메인 허용
  }
}
```

### 8.2 `tsconfig.json`

```typescript
{
  compilerOptions: {
    target: "es2020",
    strict: true,           // 엄격한 타입 검사
    module: "esnext",
    moduleResolution: "bundler",
    paths: { "@/*": ["*"] } // 경로 별칭 (@/ → 루트)
  }
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
    "css": "app/globals.css"
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui"
  },
  "iconLibrary": "lucide"
}
```

### 8.5 `.eslintrc.json`

```json
{ "extends": ["next/core-web-vitals", "next/typescript"] }
```

### 8.6 `.gitignore` (주요 항목)

| 패턴 | 이유 |
|------|------|
| `README.md` | 개별 파일 무시 |
| `*.md` | 모든 마크다운 파일 무시 |
| `!REPORT.md` | 본 보고서 예외 처리 |
| `.env*` | 환경 변수 파일 무시 |
| `/node_modules`, `/.next/` | 빌드/의존성 결과물 |

---

## 9. 개선 가능 영역 및 알려진 이슈

### 9.1 심각도: 높음 (High) — 수정 완료

| 파일 | 이슈 | 상태 |
|------|------|------|
| `app/contact/page.tsx` | `debugger` 문 미제거 | ✅ 수정 완료 |
| `app/login/page.tsx:17` | 하드코딩된 인증 정보 | ⚠️ 개선 필요 (`admin` / `password` 클라이언트 노출) |

### 9.2 심각도: 중간 (Medium)

| 파일 | 이슈 | 설명 |
|------|------|------|
| `app/contact/page.tsx:21` | 기본값 하드코딩 | `user@example.com`이 기본 발신자로 하드코딩 |
| `app/DJ_Play_List/page.tsx` | AWS S3 URL 하드코딩 | 오디오 파일 URL이 코드에 직접 명시됨 |

### 9.3 심각도: 낮음 (Low)

| 파일 | 이슈 | 설명 |
|------|------|------|
| `app/tax-calculator/page.tsx:76` | ESLint 비활성화 주석 | `// eslint-disable-next-line` 사용 (미사용 변수 존재) |
| `components/Footer.tsx` | 방문자 카운터 미구현 | Today: 0, Total: 0으로 하드코딩됨 (TODO 주석 있음) |
| `app/admin/page.tsx` | 관리자 대시보드 미완성 | 플레이스홀더 텍스트만 존재 |
| `app/admin/users/page.tsx` | 사용자 관리 미완성 | 플레이스홀더 텍스트만 존재 |
| `app/about/page.tsx` | About 페이지 미완성 | 기본 템플릿만 존재 |
| `app/projects/page.tsx` | 외부 링크 플레이스홀더 | LinkedIn, YouTube URL이 실제 주소 아님 |

### 9.4 구현 권장 사항

1. **인증 시스템 구축**
   - NextAuth.js 또는 Supabase Auth 도입
   - 하드코딩된 `admin/password` 제거
   - JWT 또는 세션 기반 인증 적용

2. **Contact 디버거 제거**
   - `app/contact/page.tsx` 42번째 줄의 `debugger;` 즉시 제거

3. **About 페이지 콘텐츠 작성**
   - 경력 타임라인, 기술 스택, 자격증 등 추가

4. **방문자 카운터 API 연동**
   - Redis, Supabase, 또는 serverless DB 활용
   - Footer의 `0` 하드코딩 값 실제 API로 교체

5. **관리자 대시보드 기능 구현**
   - 실제 데이터 표시 및 CRUD 기능 추가

6. **환경 변수 처리 강화**
   - `NEXT_PUBLIC_` 접두사 규칙 준수
   - 환경 변수 유효성 검사 로직 추가

---

## 10. 환경 변수 가이드

이메일 발송 기능을 사용하려면 `.env.local` 파일에 아래 변수를 설정해야 합니다.

```bash
# SMTP 서버 설정 (예: Naver SMTP)
SMTP_HOST=smtp.naver.com
SMTP_PORT=465
SMTP_SECURE=true

# 발신 계정
SMTP_USER=your-email@naver.com
SMTP_PASS=your-app-password

# 수신 이메일
RECEIVER_EMAIL=receiver@example.com
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
cp .env.example .env.local  # 또는 직접 .env.local 생성
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

# 8. 코드 린트
npm run lint
```

### 주요 페이지 경로

| URL | 설명 |
|-----|------|
| `/` | 홈 (히어로 섹션) |
| `/projects` | 프로젝트 & 링크 목록 |
| `/about` | 소개 페이지 |
| `/contact` | 이메일 연락 |
| `/login` | 로그인 (더미) |
| `/tax-calculator` | 세금 계산기 |
| `/DJ_Play_List` | DJ 재생 목록 |
| `/admin` | 관리자 대시보드 |
| `/admin/users` | 관리자 사용자 관리 |

---

## 12. 결론

### 현재 완성된 기능 ✅

| 기능 | 상태 |
|------|------|
| 포트폴리오 기본 구조 (홈, 프로젝트, About 레이아웃) | ✅ 완성 |
| 반응형 네비게이션 (데스크톱 NavBar + 모바일 BottomNav) | ✅ 완성 |
| GSAP 히어로 애니메이션 | ✅ 완성 |
| 이메일 연락 폼 + API | ✅ 완성 (환경 변수 필요) |
| 2025년 한국 세금 계산기 | ✅ 완성 |
| DJ 재생 목록 오디오 플레이어 | ✅ 완성 |
| 관리자 레이아웃 (반응형) | ✅ 완성 |
| shadcn/ui 컴포넌트 통합 | ✅ 완성 |
| 다크 모드 지원 (CSS 변수) | ✅ 완성 |
| TypeScript 엄격 모드 | ✅ 완성 |

### 미완성/개선 필요 기능 ⚠️

| 기능 | 상태 |
|------|------|
| About 페이지 상세 콘텐츠 | ⚠️ 플레이스홀더 |
| 관리자 대시보드 실제 기능 | ⚠️ 플레이스홀더 |
| 실제 인증 시스템 | ⚠️ 더미 구현 |
| 방문자 카운터 | ⚠️ 하드코딩 0 |
| `debugger` 문 제거 | ✅ 수정 완료 |
| LinkedIn/YouTube 실제 URL | ⚠️ 플레이스홀더 URL |

### 종합 평가

이 프로젝트는 **최신 Next.js 15 + React 19 + TypeScript** 기반으로 구축된 현대적인 개인 포트폴리오로, 다음과 같은 강점을 가집니다:

- **최신 기술 스택** 적극 도입 (Next.js 15, React 19, GSAP, shadcn/ui)
- **반응형 디자인** (모바일/데스크톱 분리 네비게이션)
- **실용적인 부가 기능** (세금 계산기, 오디오 플레이어, 이메일 연락)
- **깔끔한 코드 구조** (App Router, 타입 안정성, 컴포넌트 분리)

현재 포트폴리오의 핵심 기능은 완성되어 있으며, 관리자 기능, 인증, 방문자 카운터 등 일부 고급 기능은 향후 개발이 예정된 상태입니다.

---

*본 보고서는 저장소 `copilot/investigate-repository-overview` 브랜치 기준으로 작성되었습니다.*
