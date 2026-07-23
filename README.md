# YH Jang — 포트폴리오 & 유틸리티

**Next.js 16 · React 19 · TypeScript · Tailwind CSS**

개인 포트폴리오이자 유틸리티 도구 모음 웹사이트입니다.
음원 리스트, 개발 블로그, 세금 계산기, DJ 플레이리스트, 이메일 문의, 세션 기반 관리자 대시보드 등의 기능을 포함합니다.

---

## 주요 기능

| 기능           | 경로              | 설명                                          |
| -------------- | ----------------- | --------------------------------------------- |
| 홈             | `/`                | GSAP 애니메이션 히어로                         |
| 소개           | `/about`           | 경력 · 기술 스택 · 연락 링크                   |
| 음원 리스트    | `/music-list`      | 날짜 기반 스윙 재즈 플레이리스트               |
| 블로그         | `/blog`, `/blog/[slug]` | 개발 기록 목록 및 상세 (SSG)               |
| DJ 플레이어    | `/DJ_Play_List`    | 오디오 플레이어 (URL/로컬 파일 추가 지원)      |
| 세금 계산기    | `/tax-calculator`  | 2025 한국 소득세 계산기                        |
| 문의           | `/contact`         | 이메일 문의 폼 (Nodemailer 연동)               |
| 프로젝트       | `/projects`        | 외부 링크 모음                                 |
| 로그인         | `/login`           | 관리자 세션 로그인                             |
| 관리자         | `/admin`, `/admin/users` | JWT 세션 기반 보호된 관리자 대시보드      |

---

## 기술 스택

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: TypeScript 7 compiler + TypeScript 6 tooling API compatibility
- **Styling**: Tailwind CSS 4 + [shadcn/ui](https://ui.shadcn.com/)
- **Animation**: [GSAP](https://gsap.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Email**: [Nodemailer](https://nodemailer.com/)
- **Auth**: [jose](https://github.com/panva/jose) (JWT) + `bcryptjs`, httpOnly 쿠키 세션, `proxy.ts`로 `/admin/**` 보호
- **Testing**: [Vitest](https://vitest.dev/)
- **Formatting**: Prettier (+ `prettier-plugin-tailwindcss`)

---

## 시작하기

```bash
# 의존성 설치
npm install

# 환경 변수 파일 생성 (.env.example 참고)
cp .env.example .env.local

# 개발 서버 실행
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속.

### 관리자 계정

관리자 계정은 DB가 아닌 환경 변수로 설정합니다 (`.env.example` 참고):

```bash
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=<bcrypt 해시>   # node -e "require('bcryptjs').hash('password', 10).then(console.log)"
SESSION_SECRET=<32바이트 랜덤 base64>  # openssl rand -base64 32
```

---

## 디렉토리 구조

```
├── app/                     # Next.js App Router 페이지 & API
│   ├── page.tsx             # 홈 (Hero)
│   ├── about/                # 소개 페이지
│   ├── music-list/           # 날짜 기반 음원 리스트 (page.tsx + Client 컴포넌트)
│   ├── blog/                 # 블로그 목록 & 상세 (SSG)
│   ├── DJ_Play_List/          # 오디오 플레이어 (page.tsx + Client 컴포넌트)
│   ├── tax-calculator/        # 세금 계산기 (page.tsx + Client 컴포넌트)
│   ├── contact/               # 문의 폼 (page.tsx + Client 컴포넌트)
│   ├── login/                 # 로그인 (page.tsx + Client 컴포넌트)
│   ├── projects/              # 외부 링크
│   ├── admin/                 # 관리자 대시보드 (layout에서 세션 사이드바 렌더)
│   ├── api/
│   │   ├── auth/login, logout  # 세션 로그인/로그아웃
│   │   └── send-email          # Nodemailer 이메일 발송
│   ├── config/taxRates2025.ts  # 2025 세율 상수
│   └── lib/taxCalculator.ts    # 세금 계산 로직
├── components/               # 공통 UI 컴포넌트 (NavBar, Footer, Hero, BottomNav, ui/*)
├── lib/                      # 서버 유틸리티 (auth, credentials, email, audio, utils)
├── data/                     # 정적 데이터 (음원, 블로그 게시글)
├── types/                    # 공통 타입 정의
├── utils/                    # 배열 셔플 유틸리티
├── proxy.ts                  # /admin/** 세션 보호
└── docs/                     # 문서 (아키텍처, 개발 보고서)
```

각 클라이언트 인터랙션이 필요한 라우트는 `page.tsx`(서버 컴포넌트, `metadata` export)와
`<Route>Client.tsx`(`"use client"`, 실제 UI/상태)로 분리되어 있습니다. 메타데이터를 위해
라우트마다 별도 `layout.tsx`를 두지 않아도 되는 구조입니다.

---

## 문서

- [아키텍처](./docs/ARCHITECTURE.md)
- [개발 보고서 (한국어)](./docs/REPORT_KO.md)
- [Development Report (English)](./docs/REPORT_EN.md)
- [저장소 분석 보고서](./REPORT.md)

---

## 환경 변수

`.env.example`을 복사해 `.env.local`을 만드세요. 전체 목록은 해당 파일을 참고하세요.

```env
# SMTP (문의 폼 이메일 발송)
SMTP_HOST=smtp.naver.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your-smtp-username
SMTP_PASS=your-smtp-app-password
RECEIVER_EMAIL=you@example.com

# 관리자 인증
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=<bcrypt 해시>
SESSION_SECRET=<32바이트 랜덤 base64>

# DJ Play List / 음원 리스트 오디오 소스 (선택, 미설정 시 기본 데모 버킷 사용)
NEXT_PUBLIC_AUDIO_BASE_URL=https://audiofilestudy.s3.ap-northeast-2.amazonaws.com
```

---

## 테스트 · 린트 · 포맷

```bash
npm run test          # Vitest 실행
npm run test:coverage  # 커버리지 리포트
npm run lint           # ESLint
npm run typecheck      # next typegen + tsc --noEmit
npm run format         # Prettier로 전체 포맷
npm run format:check   # 포맷 확인만 (CI용)
```

---

## 빌드

```bash
npm run build
npm run start
```

## Vercel 배포

[Vercel 배포 문서](https://nextjs.org/docs/app/building-your-application/deploying)
