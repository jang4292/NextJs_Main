# Architecture

## System Overview

Next.js 15 App Router application — no external database.  
Authentication and all domain data are client-side: auth via React Context + localStorage, domain data via static TypeScript files.

---

## Layer Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                           Browser                               │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                     React Components                     │  │
│  │                                                          │  │
│  │  NavBar (auth UI)   Hero (GSAP)   BottomNav   Footer     │  │
│  │  MusicList          BlogList      BlogDetail             │  │
│  │  LoginPage          SignupPage    ProfilePage            │  │
│  │  TaxCalculator      ContactForm   DJPlayList             │  │
│  └────────────────────────┬─────────────────────────────────┘  │
│                           │ useAuth()                           │
│  ┌────────────────────────▼─────────────────────────────────┐  │
│  │               AuthContext (context/AuthContext.tsx)       │  │
│  │  user: User | null                                       │  │
│  │  login() · logout() · register() · deleteAccount()       │  │
│  └────────────────────────┬─────────────────────────────────┘  │
│                           │ read / write                        │
│  ┌────────────────────────▼─────────────────────────────────┐  │
│  │                     localStorage                          │  │
│  │  "app_users":   User[]  (all registered users)           │  │
│  │  "app_session": User    (current session)                │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              HTML5 Audio API (audioRef)                  │  │
│  │  Used by: /music-list and /DJ_Play_List                  │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      Static Data Layer                          │
│                                                                 │
│  data/musicData.ts              data/blogPosts.ts              │
│  ┌─────────────────────────┐    ┌────────────────────────────┐ │
│  │ PLAYLISTS: Playlist[]   │    │ BLOG_POSTS: BlogPost[]     │ │
│  │ ├─ date (YYYY-MM-DD)    │    │ ├─ slug                    │ │
│  │ ├─ label (Korean)       │    │ ├─ title / titleKo         │ │
│  │ ├─ description          │    │ ├─ date / author / tags    │ │
│  │ └─ tracks[]             │    │ ├─ summary / summaryKo     │ │
│  │    ├─ number            │    │ └─ content (markdown-ish)  │ │
│  │    ├─ title / artist    │    └────────────────────────────┘ │
│  │    ├─ bpm / genre       │                                   │
│  │    └─ src (S3 URL)      │    app/config/taxRates2025.ts     │
│  └─────────────────────────┘    ┌────────────────────────────┐ │
│                                 │ TaxRates2025               │ │
│                                 │ ├─ incomeTaxBrackets[]     │ │
│                                 │ ├─ localIncomeTaxRate      │ │
│                                 │ └─ socialInsuranceRates    │ │
│                                 └────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    Next.js App Router                           │
│                                                                 │
│  Static (○)                    Dynamic / SSG (●/ƒ)             │
│  ─────────────────────         ─────────────────────────────── │
│  / → app/page.tsx              /blog/[slug] → SSG              │
│  /login                        /api/send-email → server fn     │
│  /signup                                                        │
│  /profile                                                       │
│  /music-list                                                    │
│  /blog                                                          │
│  /DJ_Play_List                                                  │
│  /tax-calculator                                                │
│  /contact                                                       │
│  /projects                                                      │
│  /about                                                         │
│  /admin, /admin/users                                           │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│               External Services (optional / required)           │
│                                                                 │
│  AWS S3  ──────────────────────  audio file streaming          │
│  (audiofilestudy bucket)         for /DJ_Play_List             │
│                                  and /music-list               │
│                                                                 │
│  SMTP Server ──────────────────  contact form email sending    │
│  (configured via env vars)       POST /api/send-email          │
└─────────────────────────────────────────────────────────────────┘
```

---

## Directory Structure

```
/
├── app/                        # Next.js App Router pages & API
│   ├── page.tsx                # Home (Hero component)
│   ├── layout.tsx              # Root layout — AuthProvider + NavBar + Footer + BottomNav
│   ├── login/page.tsx          # Login form
│   ├── signup/page.tsx         # Registration form
│   ├── profile/page.tsx        # User profile + account deletion
│   ├── music-list/page.tsx     # Date-based music list + audio player
│   ├── blog/
│   │   ├── page.tsx            # Blog listing (sorted newest-first)
│   │   └── [slug]/page.tsx     # Blog post detail (SSG)
│   ├── DJ_Play_List/page.tsx   # Legacy standalone audio player
│   ├── tax-calculator/page.tsx # 2025 Korean tax calculator UI
│   ├── contact/page.tsx        # Contact form UI
│   ├── projects/page.tsx       # External links
│   ├── about/page.tsx          # About (stub)
│   ├── admin/
│   │   ├── layout.tsx          # Admin sidebar layout
│   │   ├── page.tsx            # Admin dashboard (stub)
│   │   └── users/page.tsx      # User management (stub)
│   ├── api/send-email/
│   │   └── route.ts            # POST endpoint — Nodemailer SMTP
│   ├── config/
│   │   └── taxRates2025.ts     # 2025 Korean tax rate constants
│   └── lib/
│       └── taxCalculator.ts    # Tax calculation pure functions
│
├── components/                 # Shared React components
│   ├── NavBar.tsx              # Header (auth-aware, client component)
│   ├── Hero.tsx                # GSAP animated intro (client component)
│   ├── Footer.tsx              # Tech stack + social links (desktop only)
│   ├── BottomNav.tsx           # Mobile fixed bottom nav
│   └── ui/
│       ├── button.tsx          # shadcn/ui Button
│       └── sheet.tsx           # shadcn/ui Sheet (mobile drawer)
│
├── context/
│   └── AuthContext.tsx         # Auth state: login/logout/register/delete
│
├── data/
│   ├── musicData.ts            # All playlists (single source of truth)
│   └── blogPosts.ts            # All blog posts (single source of truth)
│
├── lib/
│   └── utils.ts                # cn() — clsx + tailwind-merge
│
├── utils/
│   └── Utils.ts                # shuffleArray / upgradeShuffleArray
│
├── styles/
│   └── globals.css             # Tailwind directives + CSS variables
│
└── docs/
    ├── ARCHITECTURE.md         # This file
    ├── REPORT_KO.md            # Korean development report
    └── REPORT_EN.md            # English development report
```

---

## Key Design Decisions

### 1. AuthContext + localStorage (No Backend Auth)

This is a demo/portfolio site with no dedicated backend server. The trade-off:
- ✅ Zero infrastructure required
- ✅ Works fully client-side with static hosting (Vercel)
- ❌ Passwords stored in plaintext (not for production)

The `AuthProvider` is placed at the root layout level, so every page and component can access auth state via `useAuth()`.

---

### 2. Centralized Static Data Files

Domain data lives in `/data/` as typed TypeScript modules:

| File | Consumed by |
|---|---|
| `data/musicData.ts` | `app/music-list/page.tsx` |
| `data/blogPosts.ts` | `app/blog/page.tsx`, `app/blog/[slug]/page.tsx` |
| `app/config/taxRates2025.ts` | `app/lib/taxCalculator.ts` |

**Benefit**: Adding new content (a playlist date, a blog post) requires editing exactly one file.

---

### 3. Static Site Generation (SSG) for Blog

`/blog/[slug]` uses `generateStaticParams` to pre-render all posts at build time:
- Zero server latency for blog reads
- Posts are crawlable by search engines
- Consistent with Next.js App Router conventions

---

### 4. Client vs Server Components

| Component | Type | Reason |
|---|---|---|
| `NavBar` | Client | Needs `useAuth`, `usePathname` |
| `Hero` | Client | GSAP `useEffect` |
| `Footer` | Client | Uses `ExternalLink` icon + `Image` |
| `BottomNav` | Client | `usePathname` |
| `DJPlayListPage` | Client | `useRef`, `useState`, Audio API |
| `MusicListPage` | Client | Audio API + state |
| `LoginPage` | Client | Form state + `useAuth` |
| `SignupPage` | Client | Form state + `useAuth` |
| `ProfilePage` | Client | `useAuth`, `useRouter` |
| `BlogPage` | Server | Pure data rendering |
| `BlogPostPage` | Server | SSG + data rendering |
| `TaxPage` | Client | Form state + calculation |
| `ContactPage` | Client | Form state + fetch |

---

### 5. Styling Strategy

- **Tailwind CSS**: All layout, spacing, and typography
- **CSS custom properties** (`styles/globals.css`): HSL color variables for light/dark mode theming
- **`cn()` utility** (`lib/utils.ts`): Merges clsx + tailwind-merge to safely combine conditional class names
- **Dark mode**: `dark:` Tailwind variants, toggled via `.dark` class on `<html>`

---

## Data Flow Examples

### Authentication Flow

```
User submits login form
        │
        ▼
login(username, password)          ← AuthContext
        │
        ├─ Read localStorage["app_users"]
        ├─ Find matching user
        │
        ├─ Found ─→ save to localStorage["app_session"]
        │           setUser(sessionUser)
        │           return true ─→ router.push("/")
        │
        └─ Not found ─→ return false ─→ show error
```

### Music List Page Flow

```
Component mounts
        │
        ▼
Import PLAYLISTS from data/musicData.ts
        │
        ▼
selectedDate = PLAYLISTS[0].date
        │
        ▼
Render date selector buttons + track table
        │
        ▼
User clicks date button
        │
        ▼
handleDateChange(date):
  - stop current audio
  - setCurrent(null)
  - setSelectedDate(date)
        │
        ▼
Re-render: filter tracks for new date
        │
        ▼
User clicks track row / ▶ button
        │
        ▼
handlePlay(track):
  - setCurrent(track)
  - setPlaying(true)
        │
        ▼
useEffect [current, playing]:
  - audioRef.current.src = track.src
  - audioRef.current.load()
  - audioRef.current.play()
        │
        ▼
timeupdate events → setCurrentTime → progress bar width
```

### Blog Post SSG Flow

```
next build
        │
        ▼
generateStaticParams()
  - returns [{ slug: "project-kickoff" }, { slug: "auth-implementation" }, ...]
        │
        ▼
For each slug:
  getPostBySlug(slug) from data/blogPosts.ts
        │
        ▼
Render static HTML at /blog/<slug>
        │
        ▼
Served from CDN at runtime (zero server compute)
```
