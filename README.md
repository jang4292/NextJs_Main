# YH Jang - Interactive Lab

**Next.js 16.2.11 · React 19.2.8 · TypeScript 6 tooling · Tailwind CSS 4**

도구와 학습 콘텐츠를 중심으로 재구성한 개인 Interactive Lab입니다.
음악 스튜디오, 미디어 다운로더, 미니게임, 세금 계산기, 개발 블로그,
언어/수학 학습 콘텐츠, 이메일 문의, 세션 기반 관리자 대시보드를 포함합니다.

---

## 주요 기능

| 기능      | Canonical 경로                         | 설명                                      |
| --------- | -------------------------------------- | ----------------------------------------- |
| 홈        | `/`                                    | 도구 + 학습 콘텐츠 중심 허브             |
| 도구 허브 | `/tools`                               | 음악, 미디어, 게임, 계산기 진입점        |
| 음악      | `/tools/music`                         | 날짜별 플레이리스트 + DJ 큐 통합         |
| 미디어    | `/tools/media-downloader`              | 공개 YouTube 단일 영상 분석/다운로드     |
| 게임      | `/tools/games`, `/tools/games/[slug]`  | 10개 미니게임 catalog + 동적 실행 route  |
| 세금      | `/tools/tax-calculator`                | 2025 한국 소득세 계산기                  |
| 학습 허브 | `/learn`                               | 블로그, 언어 학습, 수학 학습 진입점      |
| 블로그    | `/learn/blog`, `/learn/blog/[slug]`    | 개발 기록 목록 및 상세 (SSG)             |
| 사자성어  | `/learn/idioms`, `/learn/idioms/[slug]` | 사자성어 뜻과 예문                       |
| 영어 단어 | `/learn/vocabulary`                    | 기초 영어 단어 탐색                      |
| 일본어    | `/learn/japanese-vocabulary`           | N5 수준 기초 일본어 단어                 |
| 중국어    | `/learn/chinese-vocabulary`            | 기초 중국어 단어                         |
| 수학      | `/learn/math`, `/learn/math/*`         | 수열, 통계, 확률 학습                    |
| Profile   | `/about`, `/contact`                   | 프로필 허브, 외부 링크, 이메일 문의      |
| 관리자    | `/login`, `/admin`, `/admin/users`     | JWT 세션 기반 보호된 관리자 대시보드     |

상단 메뉴와 모바일 하단 메뉴는 `Home`, `Tools`, `Learn`, `Profile` 4개 축을
동일하게 사용합니다. `/contact`는 Profile 내부 연결로 유지되며 Profile 메뉴가
활성화됩니다.

기존 공개 URL은 `next.config.ts`의 redirect 설정으로 canonical route에 임시
연결합니다.

---

## 기술 스택

- **Framework**: [Next.js 16](https://nextjs.org/) App Router
- **Language**: TypeScript 6 tooling (`@typescript/typescript6` alias)
- **Styling**: Tailwind CSS 4 + [shadcn/ui](https://ui.shadcn.com/)
- **Animation**: [GSAP](https://gsap.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Email**: [Nodemailer](https://nodemailer.com/)
- **Auth**: [jose](https://github.com/panva/jose) + `bcryptjs`, httpOnly 쿠키 세션, `proxy.ts`로 `/admin/**` 보호
- **Media Tooling**: `yt-dlp`, FFmpeg, FFprobe (로컬 Node.js runtime)
- **Testing**: [Vitest](https://vitest.dev/) + Testing Library
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

브라우저에서 [http://localhost:3000](http://localhost:3000)에 접속합니다.

같은 로컬 네트워크의 모바일 기기에서 테스트할 때는 `.env.local`의
`NEXT_ALLOWED_DEV_ORIGINS`에 접속할 호스트 IP를 추가한 뒤 아래 명령을
사용합니다.

```bash
npm run dev:network
```

### 관리자 계정

관리자 계정은 DB가 아닌 환경 변수로 설정합니다 (`.env.example` 참고):

```bash
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=<bcrypt 해시>   # node -e "require('bcryptjs').hash('password', 10).then(console.log)"
SESSION_SECRET=<32바이트 랜덤 base64>  # openssl rand -base64 32
```

`.env`에서 bcrypt 해시의 `$` 문자는 `\$`로 이스케이프해야 합니다.

---

## 디렉토리 구조

```text
├── app/                     # Next.js App Router route/metadata/API
│   ├── layout.tsx            # html/body only root layout
│   ├── (site)/               # public chrome: SiteNav/Footer/BottomNav
│   │   ├── page.tsx          # Interactive Lab home
│   │   ├── tools/            # /tools, /tools/music, /tools/media-downloader, /tools/games, /tools/tax-calculator
│   │   ├── learn/            # /learn, blog, idioms, vocabulary, math
│   │   ├── about/
│   │   └── contact/
│   ├── (auth)/login/         # login without public chrome
│   ├── admin/                # protected admin shell
│   └── api/
│       ├── auth/login, logout  # 세션 로그인/로그아웃
│       ├── media/analyze       # YouTube metadata analyze
│       ├── media/download      # MP4/MP3 download response
│       └── send-email          # Nodemailer 이메일 발송
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
│   ├── media-downloader/    # YouTube analyze/download feature
│   ├── games/               # 10-game catalog + game feature folders
│   ├── math-learning/       # sequences/statistics/probability learning
│   ├── blog/                # blog data + presentation
│   ├── idioms/              # idiom data + presentation
│   ├── vocabulary*/         # English/Japanese/Chinese vocabulary
│   ├── tax-calculator/
│   ├── contact/
│   ├── auth/
│   └── admin/
├── lib/                      # 서버 유틸리티 (auth, credentials, email, env, rateLimit, audio, utils)
├── data/                     # one-release compatibility re-exports
├── types/                    # 공통 타입 정의
├── utils/                    # 배열 셔플 유틸리티
├── proxy.ts                  # /admin/** 세션 보호
└── docs/                     # 아키텍처, 보고서, 기능 문서
```

`app/`는 route와 metadata/API에 집중하고, 실제 화면/상태/데이터는
`features/`와 `components/`가 소유합니다.

---

## 문서

- [아키텍처](./docs/ARCHITECTURE.md)
- [테스트와 로컬 CI](./docs/TESTING.md)
- [Media Downloader](./docs/media-downloader.md)
- [Media Downloader 배포 아키텍처](./docs/media-downloader-deployment.md)
- [게임 문서 인덱스](./docs/games/README.md)
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

# 로컬 네트워크 개발 접속 허용 (프로토콜/포트 없이 hostname 또는 IP만 입력)
NEXT_ALLOWED_DEV_ORIGINS=172.30.1.23,172.30.1.60

# Music Studio 오디오 소스 (선택, 미설정 시 기본 데모 버킷 사용)
NEXT_PUBLIC_AUDIO_BASE_URL=https://audiofilestudy.s3.ap-northeast-2.amazonaws.com

# Media Downloader 로컬 도구 (yt-dlp + FFmpeg)
YTDLP_PATH=yt-dlp
FFMPEG_PATH=ffmpeg
FFPROBE_PATH=ffprobe
MEDIA_ANALYZE_TIMEOUT_MS=45000
MEDIA_DOWNLOAD_TIMEOUT_MS=180000
MEDIA_MAX_OUTPUT_BYTES=367001600
```

Media Downloader는 로컬 Node.js runtime에서 `yt-dlp`, `ffmpeg`,
`ffprobe`가 PATH에 있어야 동작합니다. 공개 YouTube 단일 영상만 MVP 범위로
지원하며, 로그인/쿠키/DRM/비공개/유료 콘텐츠 우회는 지원하지 않습니다.
자세한 제한과 차기 Worker 구조는 [Media Downloader 문서](./docs/media-downloader.md)를 참고하세요.

---

## 테스트 · 린트 · 포맷

```bash
npm run test            # Vitest 실행
npm run test:watch      # 개발 중 watch 모드
npm run test:coverage   # 커버리지 리포트
npm run lint            # ESLint
npm run typecheck       # next typegen + tsc --noEmit
npm run format          # Prettier로 전체 포맷
npm run format:check    # 포맷 확인만 (CI용)
npm run ci              # format/lint/typecheck/test/build 통합 CI
npm run ci:local        # git diff --check + 통합 CI
```

현재 저장소 테스트는 `**/*.test.ts`, `**/*.test.tsx` 패턴의 148개 파일을
대상으로 하며, 현재 전체 suite는 651개 테스트 케이스로 구성됩니다.
`.husky/pre-push`는 `npm run prepush`를 통해 `npm run ci:local`과 같은 로컬
품질 게이트를 실행합니다. 자세한 테스트 운영 기준은
[테스트와 로컬 CI](./docs/TESTING.md)를 참고하세요.

---

## 빌드

```bash
npm run build
npm run start
```

## Vercel 배포

[Vercel 배포 문서](https://nextjs.org/docs/app/building-your-application/deploying)
