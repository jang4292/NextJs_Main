# Architecture

## System Overview

Next.js 15 App Router application — no external database. Admin authentication
is a signed JWT session stored in an httpOnly cookie, checked by
`middleware.ts` on every `/admin/**` request. All other domain data (music
playlists, blog posts, tax rates) lives in static, typed TypeScript files.

---

## Layer Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                           Browser                               │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                     React Components                     │  │
│  │                                                          │  │
│  │  NavBar              Hero (GSAP)      BottomNav          │  │
│  │  Footer (visitor badge img)                              │  │
│  │  MusicListClient      BlogList (server)  BlogDetail (server)│
│  │  LoginClient          TaxCalculatorClient                │  │
│  │  ContactClient        DJPlayListClient                   │  │
│  │  AdminLayoutClient (sidebar/logout)                      │  │
│  └────────────────────────┬─────────────────────────────────┘  │
│                           │ fetch() / cookies                    │
│  ┌────────────────────────▼─────────────────────────────────┐  │
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
│  Server components (metadata)   Client components (interaction) │
│  ─────────────────────────────  ────────────────────────────── │
│  app/DJ_Play_List/page.tsx   →  DJPlayListClient.tsx            │
│  app/contact/page.tsx        →  ContactClient.tsx               │
│  app/login/page.tsx          →  LoginClient.tsx                 │
│  app/music-list/page.tsx     →  MusicListClient.tsx              │
│  app/tax-calculator/page.tsx →  TaxCalculatorClient.tsx          │
│  app/about, /projects, /blog, /blog/[slug] → server-only          │
│  app/admin/layout.tsx        →  AdminLayoutClient.tsx (sidebar)   │
│  app/admin, app/admin/users  →  server, reads session cookie      │
│  /api/auth/login, /api/auth/logout, /api/send-email → route handlers│
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│               External Services (optional / required)           │
│                                                                 │
│  AWS S3  ──────────────────────  audio file streaming           │
│  (audiofilestudy bucket,          for /DJ_Play_List             │
│   overridable via                 and /music-list               │
│   NEXT_PUBLIC_AUDIO_BASE_URL)                                    │
│                                                                 │
│  SMTP Server ──────────────────  contact form email sending     │
│  (configured via env vars)       POST /api/send-email           │
│                                                                 │
│  visitor-badge.laobi.icu ──────  live visitor count image       │
│                                  rendered in Footer              │
└─────────────────────────────────────────────────────────────────┘
```

---

## Directory Structure

```
/
├── app/
│   ├── page.tsx                    # Home (Hero component)
│   ├── layout.tsx                  # Root layout — NavBar + Footer + BottomNav
│   ├── about/page.tsx              # About (bio, tech stack, contact links)
│   ├── music-list/
│   │   ├── page.tsx                # Server component, exports metadata
│   │   └── MusicListClient.tsx     # Client — date-based playlist + audio player
│   ├── blog/
│   │   ├── page.tsx                # Blog listing (server, sorted newest-first)
│   │   └── [slug]/page.tsx         # Blog post detail (SSG via generateStaticParams)
│   ├── DJ_Play_List/
│   │   ├── page.tsx                # Server component, exports metadata
│   │   └── DJPlayListClient.tsx    # Client — audio player, URL/local file add
│   ├── tax-calculator/
│   │   ├── page.tsx
│   │   └── TaxCalculatorClient.tsx # Client — form state + calculation
│   ├── contact/
│   │   ├── page.tsx
│   │   └── ContactClient.tsx       # Client — form + HTML preview + fetch
│   ├── login/
│   │   ├── page.tsx
│   │   └── LoginClient.tsx         # Client — POSTs to /api/auth/login
│   ├── projects/page.tsx           # External links (server)
│   ├── admin/
│   │   ├── layout.tsx              # Metadata + wraps AdminLayoutClient
│   │   ├── AdminLayoutClient.tsx   # Client — sidebar / mobile sheet / logout
│   │   ├── page.tsx                # Dashboard home (server, reads session cookie)
│   │   ├── error.tsx, loading.tsx
│   │   └── users/page.tsx          # Shows the single env-configured admin account
│   ├── api/
│   │   ├── auth/login/route.ts     # POST — verify credentials, set session cookie
│   │   ├── auth/logout/route.ts    # POST — clear session cookie
│   │   └── send-email/route.ts     # POST — Nodemailer SMTP send
│   ├── config/taxRates2025.ts      # 2025 Korean tax rate constants
│   └── lib/taxCalculator.ts        # Tax calculation pure functions
│
├── components/
│   ├── NavBar.tsx                  # Header (client, usePathname)
│   ├── Hero.tsx                    # GSAP animated intro (client)
│   ├── Footer.tsx                  # Tech badges + social links + visitor badge (client)
│   ├── BottomNav.tsx               # Mobile fixed bottom nav (client)
│   └── ui/
│       ├── button.tsx              # shadcn/ui Button
│       └── sheet.tsx               # shadcn/ui Sheet (mobile drawer)
│
├── lib/
│   ├── auth.ts                     # JWT session create/verify (jose), cookie options
│   ├── credentials.ts              # bcrypt credential check against env vars
│   ├── email.ts                    # Contact HTML builder + header sanitization
│   ├── audio.ts                    # audioUrl() — resolves S3/CDN base URL
│   └── utils.ts                    # cn() — clsx + tailwind-merge
│
├── data/
│   ├── musicData.ts                # All playlists (single source of truth)
│   └── blogPosts.ts                # All blog posts (single source of truth)
│
├── types/track.ts                  # Track / PlaylistTrack types
├── utils/Utils.ts                  # shuffleArray / upgradeShuffleArray
├── middleware.ts                   # Protects /admin/** — redirects to /login
│
├── styles/globals.css              # Tailwind directives + CSS variables
│
└── docs/
    ├── ARCHITECTURE.md             # This file
    ├── REPORT_KO.md                # Korean development report
    └── REPORT_EN.md                # English development report
```

---

## Key Design Decisions

### 1. JWT Session Auth, No User Database

There is exactly one admin account, configured entirely through environment
variables (`ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`). `POST /api/auth/login`
verifies the password with `bcryptjs` and, on success, signs a JWT
(`lib/auth.ts`, using `jose`) into an httpOnly, `SameSite=Lax` cookie.
`middleware.ts` verifies that cookie on every request under `/admin/**` and
redirects to `/login` if it is missing or invalid.

- ✅ No database or third-party auth provider required
- ✅ Session token can't be read or forged from client JS (httpOnly + signed)
- ⚠️ Single shared admin account — not designed for multi-user access control

### 2. Server Page + Client Component Split

Routes that need client-side interactivity (forms, audio playback, browser
APIs) follow a two-file pattern: `page.tsx` stays a server component that
exports `metadata`, and delegates rendering to a sibling `<Route>Client.tsx`
marked `"use client"`. This avoids a per-route `layout.tsx` whose only job
would be exporting `metadata` for a client-only `page.tsx` (metadata exports
are not allowed in files with `"use client"`).

`app/admin/layout.tsx` is the one route layout kept as-is: it does more than
metadata — it wraps every admin page in `AdminLayoutClient` for the shared
sidebar/mobile-drawer chrome.

### 3. Centralized Static Data Files

Domain data lives in `/data/` as typed TypeScript modules:

| File                         | Consumed by                                     |
| ---------------------------- | ----------------------------------------------- |
| `data/musicData.ts`          | `app/music-list/MusicListClient.tsx`            |
| `data/blogPosts.ts`          | `app/blog/page.tsx`, `app/blog/[slug]/page.tsx` |
| `app/config/taxRates2025.ts` | `app/lib/taxCalculator.ts`                      |

**Benefit**: Adding new content (a playlist date, a blog post) requires
editing exactly one file — no migrations, no CMS.

### 4. Static Site Generation (SSG) for Blog

`/blog/[slug]` uses `generateStaticParams` to pre-render every post at build
time — zero server latency for reads, and posts are crawlable by search
engines.

### 5. Live Visitor Counter via External Badge

The Footer has no backend of its own (and Vercel's serverless filesystem is
ephemeral, so a local counter file wouldn't persist across deploys/instances).
Instead it renders a live `<img>` badge from `visitor-badge.laobi.icu`, keyed
by a stable `page_id`, which tracks and serves the real count itself.

### 6. Styling Strategy

- **Tailwind CSS**: all layout, spacing, and typography
- **CSS custom properties** (`styles/globals.css`): HSL color variables for
  light/dark mode theming
- **`cn()` utility** (`lib/utils.ts`): merges clsx + tailwind-merge
- **Prettier + `prettier-plugin-tailwindcss`**: enforces consistent
  formatting and canonical Tailwind class ordering

---

## Data Flow Examples

### Admin Login Flow

```
User submits login form (LoginClient.tsx)
        │
        ▼
POST /api/auth/login { username, password }
        │
        ├─ verifyCredentials() — bcrypt.compare against ADMIN_PASSWORD_HASH
        │
        ├─ Valid ─→ createSessionToken() (jose, HS256, 2h expiry)
        │           Set-Cookie: admin_session=<jwt> (httpOnly, SameSite=Lax)
        │           router.push("/admin")
        │
        └─ Invalid ─→ 401 { message } ─→ shown as form error
```

### Protected Admin Request Flow

```
Request to /admin/**
        │
        ▼
middleware.ts
        │
        ├─ Read admin_session cookie
        ├─ verifySessionToken() (jose.jwtVerify)
        │
        ├─ Valid ─→ NextResponse.next()
        │
        └─ Invalid/missing ─→ redirect to /login, clear cookie
```

### Music List Page Flow

```
Component mounts (MusicListClient.tsx)
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
User clicks track row / ▶ button
        │
        ▼
handlePlay(track): setCurrent(track), setPlaying(true)
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
generateStaticParams() → getSortedPosts().map(post => ({ slug: post.slug }))
        │
        ▼
For each slug: getPostBySlug(slug) from data/blogPosts.ts
        │
        ▼
Render static HTML at /blog/<slug>
        │
        ▼
Served from CDN at runtime (zero server compute)
```
