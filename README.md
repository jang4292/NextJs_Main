# YH Jang — 포트폴리오 & 유틸리티

**Next.js 15 · React 19 · TypeScript · Tailwind CSS**

개인 포트폴리오이자 유틸리티 도구 모음 웹사이트입니다.  
로그인/회원가입, 날짜 기반 음원 리스트, 개발 블로그 등의 기능을 포함합니다.

---

## 주요 기능

| 기능 | 경로 | 상태 | 설명 |
|---|---|---|---|
| 홈 | `/` | 기존 | GSAP 애니메이션 히어로 |
| 로그인 | `/login` | **수정됨** | AuthContext 기반 로그인 |
| 회원가입 | `/signup` | **신규** | 신규 계정 등록 |
| 프로필 | `/profile` | **신규** | 계정 정보 & 회원탈퇴 |
| 음원 리스트 | `/music-list` | **신규** | 날짜 기반 스윙 재즈 플레이리스트 |
| 블로그 | `/blog` | **신규** | 개발 보고서 목록 |
| DJ 플레이어 | `/DJ_Play_List` | 기존 | 스윙 재즈 오디오 플레이어 |
| 세금 계산기 | `/tax-calculator` | 기존 | 2025 한국 소득세 계산기 |
| 문의 | `/contact` | 기존 | 이메일 문의 폼 |
| 프로젝트 | `/projects` | 기존 | 외부 링크 모음 |
| 소개 | `/about` | 미개발 | 소개 페이지 (내용 없음) |
| 관리자 | `/admin` | 스캐폴드 | 관리자 대시보드 |

---

## 기술 스택

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3 + [shadcn/ui](https://ui.shadcn.com/)
- **Animation**: [GSAP](https://gsap.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Email**: [Nodemailer](https://nodemailer.com/)
- **State**: React Context API + localStorage

---

## 시작하기

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속.

### 기본 계정
- **아이디**: `admin`
- **비밀번호**: `password`

---

## 디렉토리 구조

```
├── app/                # Next.js App Router 페이지
│   ├── login/          # 로그인 (수정됨)
│   ├── signup/         # 회원가입 (신규)
│   ├── profile/        # 사용자 프로필 & 탈퇴 (신규)
│   ├── music-list/     # 날짜 기반 음원 리스트 (신규)
│   ├── blog/           # 블로그 목록 & 상세 (신규)
│   ├── DJ_Play_List/   # 오디오 플레이어
│   ├── tax-calculator/ # 세금 계산기
│   ├── contact/        # 문의 폼
│   ├── projects/       # 외부 링크
│   ├── about/          # 소개 (미개발)
│   ├── admin/          # 관리자 대시보드
│   ├── api/            # API 라우트 (이메일 발송)
│   ├── config/         # 세율 상수
│   └── lib/            # 세금 계산 로직
├── components/         # 공통 UI 컴포넌트
├── context/            # React Context (인증) (신규)
├── data/               # 정적 데이터 (음원, 블로그) (신규)
├── utils/              # 배열 셔플 유틸리티
└── docs/               # 문서 (아키텍처, 보고서)
```

---

## 문서

- [아키텍처](./docs/ARCHITECTURE.md)
- [개발 보고서 (한국어)](./docs/REPORT_KO.md)
- [Development Report (English)](./docs/REPORT_EN.md)

---

## 이메일 설정 (선택사항)

문의 폼의 이메일 발송 기능을 사용하려면 `.env.local` 파일을 생성하세요:

```env
SMTP_HOST=smtp.example.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your@email.com
SMTP_PASS=yourpassword
RECEIVER_EMAIL=receiver@email.com
```

---

## 빌드

```bash
npm run build
npm run start
```

## Vercel 배포

[Vercel 배포 문서](https://nextjs.org/docs/app/building-your-application/deploying)
