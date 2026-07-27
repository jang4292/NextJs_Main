# YH Jang — Interactive Lab

**Next.js 16 · React 19 · TypeScript · Tailwind CSS**

도구와 학습 콘텐츠를 중심으로 재구성한 개인 Interactive Lab입니다.
음악 스튜디오, 미니게임, 세금 계산기, 개발 블로그, 언어 학습 콘텐츠, 이메일 문의, 세션 기반 관리자 대시보드를 포함합니다.

---

## 주요 기능

| 기능      | Canonical 경로                         | 설명                                      |
| --------- | -------------------------------------- | ----------------------------------------- |
| 홈        | `/`                                    | 도구 + 학습 콘텐츠 중심 허브             |
| 도구 허브 | `/tools`                               | 음악, 게임, 계산기 진입점                |
| 음악      | `/tools/music`                         | 날짜별 플레이리스트 + DJ 큐 통합         |
| 게임      | `/tools/games`, `/tools/games/[slug]`  | 5개 미니게임 catalog + 동적 실행 route   |
| 세금      | `/tools/tax-calculator`                | 2025 한국 소득세 계산기                  |
| 학습 허브 | `/learn`                               | 블로그, 사자성어, 영어 단어 학습 진입점  |
| 블로그    | `/learn/blog`, `/learn/blog/[slug]`    | 개발 기록 목록 및 상세 (SSG)             |
| 사자성어  | `/learn/idioms`, `/learn/idioms/[slug]` | 사자성어 뜻과 예문                       |
| 영어 단어 | `/learn/vocabulary`                    | 기초 영단어 탐색                         |
| 소개/문의 | `/about`, `/contact`                   | 프로필, 외부 링크, 이메일 문의           |
| 관리자    | `/login`, `/admin`, `/admin/users`     | JWT 세션 기반 보호된 관리자 대시보드     |

기존 `/music-list`, `/DJ_Play_List`, `/tax-calculator`, `/games/*`, `/blog/*`, `/projects/*` URL은 `next.config.ts`에서 임시 redirect로 보호합니다.

---

## 기술 스택

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: TypeScript 6 tooling (`@typescript/typescript6` alias)
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
├── app/                     # Next.js App Router route/metadata/API
│   ├── layout.tsx            # html/body only root layout
│   ├── (site)/               # public chrome: SiteNav/Footer/BottomNav
│   │   ├── page.tsx          # Interactive Lab home
│   │   ├── tools/            # /tools, /tools/music, /tools/games, /tools/tax-calculator
│   │   ├── learn/            # /learn, /learn/blog, /learn/idioms, /learn/vocabulary
│   │   ├── about/
│   │   └── contact/
│   ├── (auth)/login/         # login without public chrome
│   ├── admin/                # protected admin shell
│   ├── api/
│   │   ├── auth/login, logout  # 세션 로그인/로그아웃
│   │   └── send-email          # Nodemailer 이메일 발송
├── components/
│   ├── layout/              # PageShell, SectionHeader, ContentGrid
│   ├── navigation/          # SiteNav, BottomNav, Footer
│   ├── cards/               # FeatureCard, LinkCard, ContentCard
│   └── ui/                  # shadcn/ui primitives
├── features/
│   ├── navigation/          # nav + legacy redirect source
│   ├── tools/               # tool catalog
│   ├── learning/            # learning catalog
│   ├── music/               # playlists + audio player + DJ queue
│   ├── games/               # catalog + game feature folders
│   ├── blog/                # blog data + presentation
│   ├── idioms/              # idiom data + presentation
│   ├── vocabulary/
│   ├── tax-calculator/
│   ├── contact/
│   ├── auth/
│   └── admin/
├── lib/                      # 서버 유틸리티 (auth, credentials, email, audio, utils)
├── data/                     # one-release compatibility re-exports
├── types/                    # 공통 타입 정의
├── utils/                    # 배열 셔플 유틸리티
├── proxy.ts                  # /admin/** 세션 보호
└── docs/                     # 문서 (아키텍처, 개발 보고서)
```

`app/`는 route와 metadata/API에 집중하고, 실제 화면/상태/데이터는 `features/`와 `components/`가 소유합니다.

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

# Music Studio 오디오 소스 (선택, 미설정 시 기본 데모 버킷 사용)
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
