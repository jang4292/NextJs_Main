# YH Jang — 포트폴리오 & 유틸리티

**Next.js 15 · React 19 · TypeScript · Tailwind CSS**

개인 포트폴리오이자 유틸리티 도구 모음 웹사이트입니다.  
로그인/회원가입, 날짜 기반 음원 리스트, 개발 블로그 등의 기능을 포함합니다.

---

## 주요 기능

| 기능 | 경로 | 설명 |
|---|---|---|
| 홈 | `/` | GSAP 애니메이션 히어로 |
| 로그인 | `/login` | 아이디/비밀번호 로그인 |
| 회원가입 | `/signup` | 신규 계정 등록 |
| 프로필 | `/profile` | 계정 정보 & 회원탈퇴 |
| 음원 리스트 | `/music-list` | 날짜 기반 스윙 재즈 플레이리스트 |
| 블로그 | `/blog` | 개발 보고서 목록 |
| 세금 계산기 | `/tax-calculator` | 2025 한국 소득세 계산기 |
| 문의 | `/contact` | 이메일 문의 폼 |
| DJ 플레이어 | `/DJ_Play_List` | 오디오 플레이어 |

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
│   ├── login/          # 로그인
│   ├── signup/         # 회원가입
│   ├── profile/        # 사용자 프로필 & 탈퇴
│   ├── music-list/     # 날짜 기반 음원 리스트
│   ├── blog/           # 블로그 목록 & 상세
│   ├── DJ_Play_List/   # 오디오 플레이어
│   ├── tax-calculator/ # 세금 계산기
│   └── contact/        # 문의 폼
├── components/         # 공통 UI 컴포넌트
├── context/            # React Context (인증)
├── data/               # 정적 데이터 (음원, 블로그)
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
