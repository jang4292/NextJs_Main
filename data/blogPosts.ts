export type BlogPost = {
  slug: string;
  title: string;
  titleKo: string;
  date: string;
  author: string;
  tags: string[];
  summary: string;
  summaryKo: string;
  content: string;
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "project-kickoff",
    title: "Project Kickoff: Building a Next.js Portfolio",
    titleKo: "프로젝트 시작: Next.js 포트폴리오 구축",
    date: "2025-01-05",
    author: "YH Jang",
    tags: ["Next.js", "React", "TypeScript", "포트폴리오"],
    summary:
      "Starting the personal portfolio project using Next.js 15 App Router, React 19, and TypeScript with Tailwind CSS.",
    summaryKo:
      "Next.js 15 App Router, React 19, TypeScript, Tailwind CSS를 사용하여 개인 포트폴리오 프로젝트를 시작했습니다.",
    content: `## 프로젝트 시작

이 포트폴리오 프로젝트는 Next.js 15의 App Router와 React 19를 기반으로 구축되었습니다.

### 선택한 기술 스택

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Animation**: GSAP
- **Icons**: Lucide React

### 초기 설계 원칙

1. 컴포넌트 재사용성을 높이기 위해 공통 컴포넌트 분리
2. 모바일 우선 반응형 디자인 적용
3. 다크모드 지원을 위한 CSS 변수 활용

### 다음 단계

- 로그인/회원가입 기능 구현
- 음원 리스트 페이지 개발
- 블로그 시스템 구축`,
  },
  {
    slug: "auth-implementation",
    title: "Implementing Authentication with React Context",
    titleKo: "React Context를 활용한 인증 기능 구현",
    date: "2025-01-15",
    author: "YH Jang",
    tags: ["인증", "React Context", "localStorage", "보안"],
    summary:
      "Implemented login, logout, registration, and account deletion using React Context API with localStorage for session persistence.",
    summaryKo:
      "React Context API와 localStorage를 이용하여 로그인, 로그아웃, 회원가입, 회원탈퇴 기능을 구현했습니다.",
    content: `## 인증 기능 구현 보고서

### 개요

백엔드 없이 클라이언트 사이드에서 인증 기능을 구현하기 위해 React Context API와 localStorage를 활용했습니다.

### 구현 내용

#### 1. AuthContext 설계
\`\`\`tsx
type AuthContextType = {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  register: (username: string, email: string, password: string) => Result;
  deleteAccount: () => void;
  isLoggedIn: boolean;
};
\`\`\`

#### 2. 데이터 저장 방식
- 사용자 목록: \`localStorage["app_users"]\`
- 현재 세션: \`localStorage["app_session"]\`

#### 3. 보안 고려사항
- 현재 구현은 데모 목적으로 평문 저장
- 실제 프로덕션에서는 bcrypt 해싱 및 서버 사이드 인증 필요

### 기능 목록

- ✅ 로그인 (아이디 + 비밀번호)
- ✅ 로그아웃
- ✅ 회원가입 (아이디, 이메일, 비밀번호)
- ✅ 회원탈퇴
- ✅ 세션 유지 (페이지 새로고침 후에도 로그인 상태 유지)
- ✅ 기본 관리자 계정 (admin/password)`,
  },
  {
    slug: "music-list-feature",
    title: "Building a Date-Based Music List Feature",
    titleKo: "날짜 기반 음원 리스트 기능 구현",
    date: "2025-02-01",
    author: "YH Jang",
    tags: ["음원", "UI", "데이터 설계", "Next.js"],
    summary:
      "Designed a date-based music playlist system where multiple playlists are stored in a single centralized data file.",
    summaryKo:
      "여러 플레이리스트를 하나의 중앙화된 데이터 파일에 보관하는 날짜 기반 음원 리스트 시스템을 설계했습니다.",
    content: `## 날짜 기반 음원 리스트 구현 보고서

### 설계 방향

여러 날짜의 플레이리스트가 존재하지만, 모든 데이터를 \`/data/musicData.ts\` 하나의 파일에 집중 관리합니다.

### 데이터 구조

\`\`\`typescript
type Playlist = {
  date: string;       // YYYY-MM-DD
  label: string;      // 한국어 날짜 표시
  description: string;
  tracks: Track[];
};

type Track = {
  id: string;
  number: number;
  title: string;
  artist: string;
  bpm: number;
  genre: string;
  src: string;
};
\`\`\`

### UI 구성

- 날짜 선택 드롭다운으로 플레이리스트 전환
- 테이블 형식의 트랙 목록 (번호, 제목, 아티스트, BPM)
- 각 트랙 클릭 시 오디오 플레이어 재생
- 고정 오디오 컨트롤러 (재생, 일시정지, 정지, 진행바)

### 확장성

중앙 데이터 파일에 새로운 날짜와 트랙을 추가하기만 하면 자동으로 UI에 반영됩니다.`,
  },
  {
    slug: "blog-system-design",
    title: "Designing a Static Blog System",
    titleKo: "정적 블로그 시스템 설계",
    date: "2025-02-20",
    author: "YH Jang",
    tags: ["블로그", "정적 데이터", "개발 보고서", "Next.js"],
    summary:
      "Created a blog system using static data files to display development reports in a structured list format with detail pages.",
    summaryKo:
      "정적 데이터 파일을 활용하여 개발 보고서를 구조화된 목록 형식으로 보여주는 블로그 시스템을 구축했습니다.",
    content: `## 정적 블로그 시스템 구현 보고서

### 목표

별도의 CMS나 데이터베이스 없이 개발 보고서를 게시글 형식으로 작성하고 표시할 수 있는 시스템 구축.

### 구현 방식

\`/data/blogPosts.ts\`에 모든 게시글 데이터를 저장합니다.

#### 게시글 데이터 구조
\`\`\`typescript
type BlogPost = {
  slug: string;       // URL 경로
  title: string;      // 영문 제목
  titleKo: string;    // 한국어 제목
  date: string;       // 작성일
  author: string;     // 작성자
  tags: string[];     // 태그 목록
  summary: string;    // 영문 요약
  summaryKo: string;  // 한국어 요약
  content: string;    // 마크다운 본문
};
\`\`\`

### 라우팅

- \`/blog\` - 게시글 목록 (날짜 역순 정렬)
- \`/blog/[slug]\` - 게시글 상세 보기

### 특징

- Markdown 형식의 본문 지원
- 한국어/영문 제목 및 요약 동시 지원
- 태그 기반 분류
- 작성일 기준 정렬`,
  },
  {
    slug: "tax-calculator-report",
    title: "Korean 2025 Tax Calculator: Development Report",
    titleKo: "2025 한국 세금 계산기 개발 보고서",
    date: "2025-01-20",
    author: "YH Jang",
    tags: ["세금 계산기", "TypeScript", "2025", "소득세"],
    summary:
      "Developed a Korean income tax calculator for 2025 covering income tax, local income tax, and social insurance deductions.",
    summaryKo:
      "2025년 한국 소득세, 지방소득세, 4대 보험을 계산하는 세금 계산기를 개발했습니다.",
    content: `## 2025 세금 계산기 개발 보고서

### 기능 개요

2025년 기준 한국 세금 구조를 반영한 계산기를 개발했습니다.

### 계산 항목

1. **소득세** (누진세율 적용)
   - 1,200만원 이하: 6%
   - 1,200만~4,600만원: 15%
   - 4,600만~8,800만원: 24%
   - 8,800만~1.5억원: 35%
   - 1.5억~3억원: 38%
   - 3억~5억원: 40%
   - 5억원 초과: 42%

2. **지방소득세**: 소득세의 10%

3. **4대 보험**
   - 국민연금: 4.5%
   - 건강보험: 3.545%
   - 고용보험: 0.9%

### 기술 구현

- \`/app/config/taxRates2025.ts\`: 세율 상수 정의
- \`/app/lib/taxCalculator.ts\`: 계산 로직 함수
- \`/app/tax-calculator/page.tsx\`: UI 컴포넌트`,
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getSortedPosts(): BlogPost[] {
  return [...BLOG_POSTS].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}
