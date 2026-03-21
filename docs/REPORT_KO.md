# YH Jang 포트폴리오 — 개발 보고서 (한국어)

**작성일**: 2025년 3월  
**프로젝트**: 개인 포트폴리오 & 유틸리티 도구  
**스택**: Next.js 15 · React 19 · TypeScript · Tailwind CSS

---

## 1. 프로젝트 개요

본 프로젝트는 Next.js 15 App Router와 React 19, TypeScript를 기반으로 개발된 개인 포트폴리오 웹사이트입니다.  
개인 포트폴리오이자 실용적인 유틸리티 도구 모음으로서, 현대적인 웹 개발 기법을 실습하고 시연합니다.

---

## 2. 변경 이력 요약

| 분류 | 파일 | 내용 |
|---|---|---|
| **수정** | `app/login/page.tsx` | 더미 인증 → AuthContext 기반 실제 인증으로 교체 |
| **수정** | `components/NavBar.tsx` | 로그인/로그아웃 버튼 추가, Music·Blog 메뉴 추가 |
| **수정** | `app/layout.tsx` | `<AuthProvider>` 래퍼 추가로 전역 인증 상태 공유 |
| **추가** | `context/AuthContext.tsx` | React Context + localStorage 기반 인증 상태 관리 |
| **추가** | `app/signup/page.tsx` | 회원가입 폼 |
| **추가** | `app/profile/page.tsx` | 프로필 보기 및 회원탈퇴 |
| **추가** | `data/musicData.ts` | 날짜별 플레이리스트 중앙 데이터 |
| **추가** | `app/music-list/page.tsx` | 날짜 기반 음원 리스트 UI |
| **추가** | `data/blogPosts.ts` | 블로그 게시글 정적 데이터 |
| **추가** | `app/blog/page.tsx` | 블로그 목록 페이지 |
| **추가** | `app/blog/[slug]/page.tsx` | 블로그 상세 페이지 (SSG) |
| **기존 유지** | `app/DJ_Play_List/page.tsx` | 스윙 재즈 오디오 플레이어 (변경 없음) |
| **기존 유지** | `app/tax-calculator/page.tsx` | 2025 세금 계산기 (변경 없음) |
| **기존 유지** | `app/contact/page.tsx` | 이메일 문의 폼 (변경 없음) |
| **기존 유지** | `app/projects/page.tsx` | 외부 링크 모음 (변경 없음) |
| **기존 유지** | `app/admin/` | 관리자 대시보드 스캐폴드 (변경 없음) |
| **기존 유지** | `components/Hero.tsx` | GSAP 애니메이션 히어로 (변경 없음) |
| **기존 유지** | `components/Footer.tsx` | 기술 스택 뱃지 + SNS 링크 (변경 없음) |
| **기존 유지** | `components/BottomNav.tsx` | 모바일 하단 네비게이션 (변경 없음) |
| **기존 유지** | `app/api/send-email/route.ts` | Nodemailer SMTP API (변경 없음) |
| **기존 유지** | `app/lib/taxCalculator.ts` | 세금 계산 로직 (변경 없음) |
| **기존 유지** | `utils/Utils.ts` | 배열 셔플 유틸리티 (변경 없음) |

---

## 3. 수정된 기능 상세

### 3.1 로그인 페이지 (`app/login/page.tsx`)

**변경 전**: 하드코딩된 더미 인증 (`admin` / `password` 비교만 수행, 전역 상태 없음)

**변경 후**: `AuthContext`의 `login()` 함수 호출로 교체. 인증 성공 시 전역 상태 업데이트 및 localStorage 세션 저장. 회원가입 링크 추가.

```tsx
// 변경 전
if (username === "admin" && password === "password") {
  router.push("/");
}

// 변경 후
const success = login(username, password);
if (success) {
  router.push("/");
}
```

---

### 3.2 NavBar (`components/NavBar.tsx`)

**변경 전**: 정적 링크 3개 (Home, PROJECTS, ABOUT)만 표시.

**변경 후**:
- 메뉴 링크 추가: **Music** (`/music-list`), **Blog** (`/blog`)
- 미로그인 상태: 로그인 + 회원가입 버튼 표시
- 로그인 상태: 사용자명 클릭 시 `/profile` 이동 + 로그아웃 버튼 표시
- `useAuth()` 훅으로 인증 상태 구독

---

### 3.3 루트 레이아웃 (`app/layout.tsx`)

**변경 전**: NavBar, Footer, BottomNav만 래핑.

**변경 후**: `<AuthProvider>`를 최상위에 추가하여 모든 페이지에서 인증 컨텍스트 접근 가능.

```tsx
// 변경 후
<AuthProvider>
  <NavBar />
  <main>{children}</main>
  <Footer />
  <BottomNav />
</AuthProvider>
```

---

## 4. 새로 추가된 기능 상세

### 4.1 인증 시스템 (`context/AuthContext.tsx`)

React Context API와 `localStorage`를 활용한 클라이언트 사이드 인증.

**저장 구조**:
- `localStorage["app_users"]` — 전체 사용자 목록 (JSON)
- `localStorage["app_session"]` — 현재 로그인 세션 (JSON)

**제공 기능**:
| 함수 | 설명 |
|---|---|
| `login(username, password)` | 자격증명 검사 후 세션 저장, 성공 여부 반환 |
| `logout()` | 세션 삭제, user 상태 초기화 |
| `register(username, email, password)` | 중복 검사 후 사용자 등록 |
| `deleteAccount()` | 현재 로그인 사용자 계정 및 세션 삭제 |

**기본 계정**: 앱 최초 로딩 시 `admin` / `password` 계정이 없으면 자동 생성.

> ⚠️ **보안 참고**: 현재 비밀번호가 평문으로 localStorage에 저장됩니다. 프로덕션 환경에서는 서버 사이드 인증 및 bcrypt 해싱 필수.

---

### 4.2 회원가입 페이지 (`app/signup/page.tsx`)

| 항목 | 내용 |
|---|---|
| 경로 | `/signup` |
| 입력 필드 | 아이디, 이메일, 비밀번호, 비밀번호 확인 |
| 유효성 검사 | 비밀번호 6자 이상, 비밀번호 일치 여부, 중복 아이디/이메일 |
| 완료 처리 | 성공 메시지 표시 후 1.5초 뒤 `/login`으로 이동 |

---

### 4.3 프로필 페이지 (`app/profile/page.tsx`)

| 항목 | 내용 |
|---|---|
| 경로 | `/profile` |
| 표시 정보 | 아이디, 이메일, 가입일 |
| 접근 제어 | 비로그인 상태에서 접근 시 `/login`으로 리다이렉트 |
| 로그아웃 | 세션 삭제 후 홈으로 이동 |
| 회원탈퇴 | 아이디 재입력 확인 모달 → 확인 시 계정 삭제 및 홈 이동 |

---

### 4.4 음원 리스트 (`data/musicData.ts`, `app/music-list/page.tsx`)

**데이터 설계**: 모든 플레이리스트를 `data/musicData.ts` 하나의 파일에 집중 관리. 날짜와 트랙을 추가하면 UI에 자동 반영.

```typescript
type Playlist = {
  date: string;       // YYYY-MM-DD
  label: string;      // 한국어 날짜 표시
  description: string;
  tracks: Track[];
};

type Track = {
  id: string;
  number: number;    // 목록 번호
  title: string;
  artist: string;
  bpm: number;
  genre: string;
  src: string;       // 오디오 파일 URL (AWS S3)
};
```

**UI 기능**:
- 날짜 선택 버튼(pill 형태)으로 플레이리스트 전환
- 테이블 뷰: `#`, 제목, 아티스트, BPM 컬럼
- 스티키 오디오 플레이어: 재생/일시정지/정지, 클릭 가능한 진행바
- 재생 중인 트랙 행 강조 표시 + "재생중" 애니메이션 인디케이터

**수록 날짜**: 2025-01-10, 2025-02-14, 2025-03-01 (각 3~6개 트랙)

---

### 4.5 블로그 (`data/blogPosts.ts`, `app/blog/`, `app/blog/[slug]/`)

**데이터 설계**: 모든 게시글을 `data/blogPosts.ts` 단일 파일에 저장.

```typescript
type BlogPost = {
  slug: string;       // URL 경로 식별자
  title: string;      // 영문 제목
  titleKo: string;    // 한국어 제목
  date: string;       // YYYY-MM-DD
  author: string;
  tags: string[];
  summary: string;    // 영문 요약
  summaryKo: string;  // 한국어 요약
  content: string;    // 마크다운 형식 본문
};
```

**목록 페이지** (`/blog`):
- 날짜 역순 정렬
- 한/영 제목, 한국어 요약, 날짜, 작성자, 태그 표시

**상세 페이지** (`/blog/[slug]`):
- `generateStaticParams` 기반 SSG (빌드 타임 사전 렌더링)
- 마크다운형 본문 렌더링 (헤딩, 리스트, 문단)
- "블로그 목록으로" 뒤로 가기 링크

**수록 게시글**: 총 5개 (프로젝트 시작, 인증 구현, 음원 리스트, 블로그 설계, 세금 계산기)

---

## 5. 기존 기능 상세 (변경 없음)

### 5.1 홈 / 히어로 (`app/page.tsx`, `components/Hero.tsx`)

- GSAP `bounce.out` ease + `yoyo: true, repeat: -1`로 제목 바운스 애니메이션
- "이력서 보기" (`/resume.pdf`) 및 "프로젝트 보기" (`/projects`) CTA 버튼
- 12년 경력 소개 텍스트

---

### 5.2 DJ 플레이 리스트 (`app/DJ_Play_List/page.tsx`)

스윙 재즈 트랙 6곡을 AWS S3에서 스트리밍하는 오디오 플레이어.

| 기능 | 내용 |
|---|---|
| 플레이어 컨트롤 | Play / Pause / Stop 버튼 |
| 진행바 | 클릭으로 임의 위치 탐색 |
| 시간 표시 | 현재 재생 위치 / 총 길이 |
| 트랙 목록 | 제목, 아티스트, BPM, 장르 표시 |

**내장 트랙 목록**:
| # | 제목 | 아티스트 | BPM |
|---|---|---|---|
| 1 | Non Stop Flight | Artie Shaw | 200 |
| 2 | Little Brown Jug | Hot Sugar Band | 195 |
| 3 | Georgianna | Naomi & Her Handsome Devils | 198 |
| 4 | Sugar Foot Stomp | Benny Goodman | 195 |
| 5 | It Don't Mean a Thing | Hop's Trio | 200 |
| 6 | Jumpin at The Woodside | Count Basie | 240 |

> 📌 `/music-list` 페이지 추가 이후, DJ_Play_List는 날짜 기반 데이터 분리 없이 단독 플레이어로 계속 유지됩니다.

---

### 5.3 세금 계산기 (`app/tax-calculator/page.tsx`, `app/lib/taxCalculator.ts`, `app/config/taxRates2025.ts`)

2025년 대한민국 세금 구조 기반 계산기.

**계산 항목**:
| 항목 | 기준 |
|---|---|
| 소득세 | 누진세율 (6%~45%) |
| 지방소득세 | 소득세의 10% |
| 국민연금 | 연봉의 4.5% |
| 건강보험 | 연봉의 3.545% |
| 고용보험 | 연봉의 0.9% |

**소득세 누진세율 구간** (`taxRates2025.ts`):

| 과세표준 | 세율 | 누진공제 |
|---|---|---|
| ~1,200만 원 | 6% | 0 |
| 1,200만~4,600만 원 | 15% | 108만 |
| 4,600만~8,800만 원 | 24% | 522만 |
| 8,800만~1.5억 원 | 35% | 1,490만 |
| 1.5억~3억 원 | 38% | 1,940만 |
| 3억~5억 원 | 40% | 2,540만 |
| 5억 원 초과 | **45%** | 3,540만 |

**UI 기능**: 단위별 금액 증감 버튼(+1만/+10만/+100만), 월급/연봉 전환 체크박스, 4대보험 포함 여부.

---

### 5.4 문의 폼 (`app/contact/page.tsx`, `app/api/send-email/route.ts`)

SMTP를 통해 실제 이메일을 발송하는 문의 기능.

**프론트엔드** (`contact/page.tsx`):
- 입력 필드: 타이틀, 보내는 사람(이메일), 내용
- HTML 메일 미리보기 (실시간)
- 발송 결과 메시지 표시

**백엔드 API** (`/api/send-email`):
- Nodemailer SMTP 전송
- 환경변수: `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `RECEIVER_EMAIL`

---

### 5.5 프로젝트 페이지 (`app/projects/page.tsx`)

외부 링크 목록:
- DJ Play List (내부)
- GitHub (`github.com/jang4292`)
- LinkedIn
- YouTube
- About (내부)

---

### 5.6 관리자 대시보드 (`app/admin/`)

| 경로 | 설명 |
|---|---|
| `/admin` | 대시보드 홈 |
| `/admin/users` | 사용자 관리 (스텁) |

**레이아웃**: 데스크탑 사이드바(Dashboard, Users 메뉴) + 모바일 Sheet 드로어.  
shadcn/ui `Button`, `Sheet` 컴포넌트 사용.

---

### 5.7 공통 컴포넌트

| 컴포넌트 | 경로 | 설명 |
|---|---|---|
| `NavBar` | `components/NavBar.tsx` | 상단 고정 내비게이션 (인증 상태 반응형) |
| `Footer` | `components/Footer.tsx` | 기술 스택 배지 + SNS 아이콘 (데스크탑만 표시) |
| `BottomNav` | `components/BottomNav.tsx` | 모바일 하단 고정 내비 (Home, Projects, About, Contact) |
| `Hero` | `components/Hero.tsx` | GSAP 바운스 애니메이션 히어로 섹션 |

---

### 5.8 유틸리티

| 파일 | 함수 | 설명 |
|---|---|---|
| `utils/Utils.ts` | `shuffleArray<T>()` | Fisher-Yates 알고리즘 (`Math.random`) |
| `utils/Utils.ts` | `upgradeShuffleArray<T>()` | 암호학적으로 안전한 셔플 (`crypto.getRandomValues`) |
| `lib/utils.ts` | `cn(...inputs)` | clsx + tailwind-merge 조합 유틸리티 |

---

## 6. 기술 스택 전체

| 분류 | 기술 | 버전 |
|---|---|---|
| 프레임워크 | Next.js | 15.5.14 |
| 런타임 | React | 19.0.0 |
| 언어 | TypeScript | 5 |
| 스타일링 | Tailwind CSS | 3.4.1 |
| UI 컴포넌트 | shadcn/ui (Radix UI) | — |
| 애니메이션 | GSAP | 3.13.0 |
| 아이콘 | Lucide React | 0.511.0 |
| 이메일 | Nodemailer | 7.0.13 |
| 상태 관리 | React Context API | — |
| 클라이언트 저장소 | localStorage | — |

---

## 7. 전체 라우트 맵

| 경로 | 설명 | 상태 |
|---|---|---|
| `/` | 홈 / 히어로 | ✅ 운영 |
| `/login` | 로그인 | ✅ 수정됨 |
| `/signup` | 회원가입 | ✅ 신규 |
| `/profile` | 프로필 & 회원탈퇴 | ✅ 신규 |
| `/music-list` | 날짜 기반 음원 리스트 | ✅ 신규 |
| `/blog` | 블로그 목록 | ✅ 신규 |
| `/blog/[slug]` | 블로그 상세 | ✅ 신규 |
| `/DJ_Play_List` | 오디오 플레이어 | ✅ 기존 유지 |
| `/tax-calculator` | 세금 계산기 | ✅ 기존 유지 |
| `/contact` | 문의 폼 | ✅ 기존 유지 |
| `/projects` | 외부 링크 목록 | ✅ 기존 유지 |
| `/about` | 소개 (미개발) | ⚠️ 빈 페이지 |
| `/admin` | 관리자 대시보드 | ⚠️ 스캐폴드 |
| `/admin/users` | 사용자 관리 | ⚠️ 스캐폴드 |
| `/api/send-email` | 이메일 발송 API | ✅ 기존 유지 |

---

## 8. 알려진 제한 사항 및 향후 과제

1. **인증 보안**: localStorage 평문 저장. 프로덕션에서는 서버 사이드 인증 + bcrypt 필요.
2. **데이터베이스 없음**: 모든 데이터 정적 파일 기반. 실제 서비스에는 DB 연동 필요.
3. **테스트 없음**: 테스트 인프라 미구성 (Jest/Vitest 등).
4. **About 페이지**: 내용 없음, 구현 예정.
5. **Admin 대시보드**: 스캐폴드 수준, 실제 기능 없음.
6. **방문자 수**: Footer의 Today/Total 카운터가 하드코딩 0. 실제 카운터 API 연동 필요.
7. **이메일**: SMTP 환경변수 미설정 시 문의 폼 발송 불가.
8. **contact.tsx debugger 문**: 프로덕션 배포 전 제거 권장 (line 42).
