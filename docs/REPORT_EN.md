# YH Jang Portfolio — Development Report (English)

**Date**: March 2025  
**Project**: Personal Portfolio & Utility Tools  
**Stack**: Next.js 15 · React 19 · TypeScript · Tailwind CSS

---

## 1. Project Overview

This project is a personal portfolio website built with Next.js 15 App Router, React 19, and TypeScript.  
It combines a personal portfolio with practical utility tools, demonstrating modern web development practices.

---

## 2. Changelog Summary

| Type | File | Description |
|---|---|---|
| **Modified** | `app/login/page.tsx` | Replaced hardcoded dummy auth with AuthContext-based real auth |
| **Modified** | `components/NavBar.tsx` | Added login/logout UI, Music and Blog nav links |
| **Modified** | `app/layout.tsx` | Wrapped with `<AuthProvider>` for global auth state |
| **Added** | `context/AuthContext.tsx` | React Context + localStorage auth state management |
| **Added** | `app/signup/page.tsx` | User registration form |
| **Added** | `app/profile/page.tsx` | Profile view and account deletion |
| **Added** | `data/musicData.ts` | Centralized date-indexed playlist data |
| **Added** | `app/music-list/page.tsx` | Date-based music list UI |
| **Added** | `data/blogPosts.ts` | Static blog post data |
| **Added** | `app/blog/page.tsx` | Blog listing page |
| **Added** | `app/blog/[slug]/page.tsx` | Blog post detail page (SSG) |
| **Unchanged** | `app/DJ_Play_List/page.tsx` | Swing Jazz audio player |
| **Unchanged** | `app/tax-calculator/page.tsx` | 2025 Korean tax calculator |
| **Unchanged** | `app/contact/page.tsx` | Email contact form |
| **Unchanged** | `app/projects/page.tsx` | External links collection |
| **Unchanged** | `app/admin/` | Admin dashboard scaffold |
| **Unchanged** | `components/Hero.tsx` | GSAP animated hero section |
| **Unchanged** | `components/Footer.tsx` | Tech stack badges + social links |
| **Unchanged** | `components/BottomNav.tsx` | Mobile bottom navigation |
| **Unchanged** | `app/api/send-email/route.ts` | Nodemailer SMTP API route |
| **Unchanged** | `app/lib/taxCalculator.ts` | Tax calculation logic |
| **Unchanged** | `utils/Utils.ts` | Array shuffle utilities |

---

## 3. Modified Features

### 3.1 Login Page (`app/login/page.tsx`)

**Before**: Hardcoded credential check against `"admin"` / `"password"`. No global state updated. No link to signup.

**After**: Calls `login()` from `AuthContext`, which saves the session to `localStorage` and updates the global user state. Added a signup link at the bottom of the form.

```tsx
// Before
if (username === "admin" && password === "password") {
  router.push("/");
}

// After
const success = login(username, password);
if (success) {
  router.push("/");
}
```

---

### 3.2 NavBar (`components/NavBar.tsx`)

**Before**: Three static links — Home, PROJECTS, ABOUT.

**After**:
- Added nav links: **Music** (`/music-list`), **Blog** (`/blog`)
- Unauthenticated state: Login + Signup buttons
- Authenticated state: Username link (→ `/profile`) + Logout button
- Subscribes to auth state via `useAuth()` hook

---

### 3.3 Root Layout (`app/layout.tsx`)

**Before**: NavBar, main content, Footer, and BottomNav only.

**After**: `<AuthProvider>` wraps the entire layout, making auth context available in all pages and components.

```tsx
// After
<AuthProvider>
  <NavBar />
  <main>{children}</main>
  <Footer />
  <BottomNav />
</AuthProvider>
```

---

## 4. New Features

### 4.1 Auth System (`context/AuthContext.tsx`)

Client-side authentication using React Context API and `localStorage`.

**Storage keys**:
- `localStorage["app_users"]` — array of all registered users (JSON)
- `localStorage["app_session"]` — current logged-in user (JSON)

**Provided API**:
| Function | Description |
|---|---|
| `login(username, password)` | Validates credentials, saves session, returns success boolean |
| `logout()` | Clears session and resets user state |
| `register(username, email, password)` | Validates uniqueness, creates new user |
| `deleteAccount()` | Removes current user from storage and clears session |

**Default account**: On first load, if no `admin` user exists, one is seeded automatically (`admin` / `password`).

> ⚠️ **Security note**: Passwords are stored in plaintext in localStorage. Production deployments require server-side authentication with bcrypt hashing and proper session management (JWT or cookie-based sessions).

---

### 4.2 Signup Page (`app/signup/page.tsx`)

| Item | Detail |
|---|---|
| Route | `/signup` |
| Fields | Username, Email, Password, Confirm Password |
| Validation | Min 6-char password, passwords must match, duplicate username/email check |
| On success | Shows confirmation message, redirects to `/login` after 1.5s |

---

### 4.3 Profile Page (`app/profile/page.tsx`)

| Item | Detail |
|---|---|
| Route | `/profile` |
| Displays | Username, email, registration date |
| Access control | Redirects to `/login` if not authenticated |
| Logout | Clears session, navigates home |
| Account deletion | Confirmation modal requiring user to re-type their username before deleting |

---

### 4.4 Music List (`data/musicData.ts`, `app/music-list/page.tsx`)

**Data design**: All playlists live in `data/musicData.ts` as a single source of truth. Adding a new date and tracks requires only editing that file.

```typescript
type Playlist = {
  date: string;       // YYYY-MM-DD
  label: string;      // Korean date label
  description: string;
  tracks: Track[];
};

type Track = {
  id: string;
  number: number;    // Display number
  title: string;
  artist: string;
  bpm: number;
  genre: string;
  src: string;       // Audio file URL (AWS S3)
};
```

**UI features**:
- Pill-style date selector buttons to switch playlists
- Table view: `#`, Title, Artist, BPM columns
- Sticky audio player: play/pause/stop, click-to-seek progress bar
- Currently playing track row highlighted + animated "재생중" indicator

**Available dates**: 2025-01-10, 2025-02-14, 2025-03-01 (3–6 tracks each)

---

### 4.5 Blog (`data/blogPosts.ts`, `app/blog/`, `app/blog/[slug]/`)

**Data design**: All posts stored in `data/blogPosts.ts`.

```typescript
type BlogPost = {
  slug: string;       // URL path identifier
  title: string;      // English title
  titleKo: string;    // Korean title
  date: string;       // YYYY-MM-DD
  author: string;
  tags: string[];
  summary: string;    // English summary
  summaryKo: string;  // Korean summary
  content: string;    // Markdown-style body text
};
```

**Listing page** (`/blog`): Posts sorted newest-first; shows bilingual title, Korean summary, date, author, tags.

**Detail page** (`/blog/[slug]`):
- Statically generated at build time via `generateStaticParams`
- Markdown-style rendering (headings, lists, paragraphs)
- "← Back to blog" navigation link

**Seed posts**: 5 posts covering project kickoff, auth implementation, music list, blog system, and tax calculator.

---

## 5. Existing Features (Unchanged)

### 5.1 Home / Hero (`app/page.tsx`, `components/Hero.tsx`)

- GSAP animation: `bounce.out` ease + `yoyo: true, repeat: -1` on the headline
- CTAs: "이력서 보기" (`/resume.pdf`) and "프로젝트 보기" (`/projects`)

---

### 5.2 DJ Play List (`app/DJ_Play_List/page.tsx`)

Standalone audio player that streams Swing Jazz tracks from AWS S3.

| Feature | Detail |
|---|---|
| Controls | Play / Pause / Stop buttons |
| Progress bar | Clickable seek |
| Time display | Current position / total duration |
| Track list | Title, artist, BPM, genre per row |

**Track list**:
| # | Title | Artist | BPM |
|---|---|---|---|
| 1 | Non Stop Flight | Artie Shaw | 200 |
| 2 | Little Brown Jug | Hot Sugar Band | 195 |
| 3 | Georgianna | Naomi & Her Handsome Devils | 198 |
| 4 | Sugar Foot Stomp | Benny Goodman | 195 |
| 5 | It Don't Mean a Thing | Hop's Trio | 200 |
| 6 | Jumpin at The Woodside | Count Basie | 240 |

> 📌 `/DJ_Play_List` continues to exist as a standalone player. The new `/music-list` page manages date-indexed data separately.

---

### 5.3 Tax Calculator (`app/tax-calculator/page.tsx`, `app/lib/taxCalculator.ts`, `app/config/taxRates2025.ts`)

A 2025 Korean income tax calculator.

**Calculated items**:
| Item | Basis |
|---|---|
| Income Tax | Progressive rate (6%–45%) |
| Local Income Tax | 10% of income tax |
| National Pension | 4.5% of annual salary |
| Health Insurance | 3.545% of annual salary |
| Employment Insurance | 0.9% of annual salary |

**Income tax brackets** (from `taxRates2025.ts`):

| Taxable Income | Rate | Deduction |
|---|---|---|
| Up to ₩12M | 6% | ₩0 |
| ₩12M – ₩46M | 15% | ₩1.08M |
| ₩46M – ₩88M | 24% | ₩5.22M |
| ₩88M – ₩150M | 35% | ₩14.9M |
| ₩150M – ₩300M | 38% | ₩19.4M |
| ₩300M – ₩500M | 40% | ₩25.4M |
| Over ₩500M | **45%** | ₩35.4M |

**UI features**: +/- buttons for ₩10K/₩100K/₩1M increments, monthly/annual toggle, social insurance toggle.

---

### 5.4 Contact Form (`app/contact/page.tsx`, `app/api/send-email/route.ts`)

Email submission via SMTP.

**Frontend** (`contact/page.tsx`):
- Fields: Title, Sender email, Message body
- Real-time HTML email preview section
- Send status feedback

**Backend API** (`POST /api/send-email`):
- Sends email using Nodemailer with configurable SMTP
- Required env vars: `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `RECEIVER_EMAIL`

---

### 5.5 Projects Page (`app/projects/page.tsx`)

Card-style link list to:
- DJ Play List (internal)
- GitHub (`github.com/jang4292`)
- LinkedIn
- YouTube
- About (internal)

---

### 5.6 Admin Dashboard (`app/admin/`)

| Route | Description |
|---|---|
| `/admin` | Dashboard home |
| `/admin/users` | User management (stub) |

Desktop sidebar + mobile Sheet drawer using shadcn/ui `Button` and `Sheet` components.

---

### 5.7 Shared Components

| Component | File | Description |
|---|---|---|
| `NavBar` | `components/NavBar.tsx` | Sticky header with auth-aware links |
| `Footer` | `components/Footer.tsx` | Tech stack badges + social icons (desktop only) |
| `BottomNav` | `components/BottomNav.tsx` | Fixed mobile nav (Home, Projects, About, Contact) |
| `Hero` | `components/Hero.tsx` | GSAP bounce-animated intro section |

---

### 5.8 Utilities

| File | Function | Description |
|---|---|---|
| `utils/Utils.ts` | `shuffleArray<T>()` | Fisher-Yates shuffle using `Math.random` |
| `utils/Utils.ts` | `upgradeShuffleArray<T>()` | Cryptographically secure shuffle using `crypto.getRandomValues` |
| `lib/utils.ts` | `cn(...inputs)` | Combines clsx + tailwind-merge for conditional Tailwind classes |

---

## 6. Full Technology Stack

| Category | Technology | Version |
|---|---|---|
| Framework | Next.js | 15.5.14 |
| Runtime | React | 19.0.0 |
| Language | TypeScript | 5 |
| Styling | Tailwind CSS | 3.4.1 |
| UI Components | shadcn/ui (Radix UI) | — |
| Animation | GSAP | 3.13.0 |
| Icons | Lucide React | 0.511.0 |
| Email | Nodemailer | 7.0.13 |
| State Management | React Context API | — |
| Client Storage | localStorage | — |

---

## 7. Full Route Map

| Route | Description | Status |
|---|---|---|
| `/` | Home / Hero | ✅ Live |
| `/login` | Login | ✅ Modified |
| `/signup` | Registration | ✅ New |
| `/profile` | Profile & account deletion | ✅ New |
| `/music-list` | Date-based music list | ✅ New |
| `/blog` | Blog listing | ✅ New |
| `/blog/[slug]` | Blog post detail | ✅ New |
| `/DJ_Play_List` | Audio player | ✅ Unchanged |
| `/tax-calculator` | Tax calculator | ✅ Unchanged |
| `/contact` | Contact form | ✅ Unchanged |
| `/projects` | External links | ✅ Unchanged |
| `/about` | About (empty) | ⚠️ Stub |
| `/admin` | Admin dashboard | ⚠️ Scaffold |
| `/admin/users` | User management | ⚠️ Scaffold |
| `/api/send-email` | Email send API | ✅ Unchanged |

---

## 8. Known Limitations & Future Work

1. **Auth security**: Passwords stored in plaintext in localStorage (demo only). Production requires server-side auth with bcrypt.
2. **No database**: All data is static files. A real service requires a database (e.g. PostgreSQL, MongoDB).
3. **No tests**: No testing infrastructure configured (Jest/Vitest).
4. **About page**: Empty — implementation pending.
5. **Admin dashboard**: Scaffold only, no real functionality.
6. **Visitor counter**: Footer Today/Total counters are hardcoded at 0. Need a real counter API.
7. **Email**: Contact form requires SMTP env vars to function.
8. **Stray `debugger` in contact.tsx**: Line 42 contains a `debugger` statement; should be removed before production deployment.
