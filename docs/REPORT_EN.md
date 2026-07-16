# YH Jang Portfolio — Development Report (English)

**Date**: July 2026
**Project**: Personal Portfolio & Utility Tools
**Stack**: Next.js 15 · React 19 · TypeScript · Tailwind CSS

---

## 1. Project Overview

This project is a personal portfolio website built with Next.js 15 App
Router, React 19, and TypeScript. It combines a personal portfolio with
practical utility tools: a music playlist viewer, a development blog, a
Korean tax calculator, a DJ playlist audio player, an email contact form, and
a JWT-session-protected admin dashboard.

---

## 2. Full Route Map

| Path               | Description                    | Composition                                             |
| ------------------ | ------------------------------ | ------------------------------------------------------- |
| `/`                | Home / hero                    | Server `page.tsx` + `components/Hero.tsx` (client)      |
| `/about`           | Bio, tech stack, contact links | Server component                                        |
| `/music-list`      | Date-based music list          | `page.tsx` (server) + `MusicListClient.tsx`             |
| `/blog`            | Blog listing                   | Server component                                        |
| `/blog/[slug]`     | Blog post detail (SSG)         | Server component, `generateStaticParams`                |
| `/DJ_Play_List`    | Audio player                   | `page.tsx` (server) + `DJPlayListClient.tsx`            |
| `/tax-calculator`  | Tax calculator                 | `page.tsx` (server) + `TaxCalculatorClient.tsx`         |
| `/contact`         | Email contact form             | `page.tsx` (server) + `ContactClient.tsx`               |
| `/projects`        | External links                 | Server component                                        |
| `/login`           | Admin login                    | `page.tsx` (server) + `LoginClient.tsx`                 |
| `/admin`           | Admin dashboard home           | Server component, reads username from session cookie    |
| `/admin/users`     | User management                | Server component, shows the single env-configured admin |
| `/api/auth/login`  | Login API                      | Route handler — bcrypt check + JWT session issuance     |
| `/api/auth/logout` | Logout API                     | Route handler — clears session cookie                   |
| `/api/send-email`  | Email send API                 | Route handler — Nodemailer SMTP                         |

All `/admin/**` paths are protected by `middleware.ts`, which verifies the
session cookie on every request.

---

## 3. Authentication

There is no user database — a single admin account is configured entirely
through environment variables.

- `ADMIN_USERNAME` and `ADMIN_PASSWORD_HASH` (a bcrypt hash) define the account
- `POST /api/auth/login` compares the password via `verifyCredentials()`
  (`lib/credentials.ts`)
- On success, `createSessionToken()` (`lib/auth.ts`) signs a JWT with `jose`
  (HS256, 2-hour expiry)
- The session is stored in an httpOnly, `SameSite=Lax` cookie
  (`admin_session`) — unreadable and unforgeable from client JS
- `middleware.ts` verifies that cookie on every `/admin/:path*` request and
  redirects to `/login` if it's missing or invalid
- `POST /api/auth/logout` expires the cookie to log out

> Note: with no user database, there is no multi-user or role-based access
> control. `/admin/users` shows the one registered admin account (from env
> vars) as a read-only row.

---

## 4. Feature Details

### 4.1 Home / Hero (`app/page.tsx`, `components/Hero.tsx`)

- GSAP `bounce.out` easing with `yoyo: true, repeat: -1` for the title
  animation (GSAP is dynamically imported after mount to keep it out of the
  initial bundle)
- "이력서 보기" (`/resume.pdf`) and "프로젝트 보기" (`/projects`) CTA buttons
- 12+ years of experience intro copy

### 4.2 About (`app/about/page.tsx`)

- Bio copy reusing the same tone as the Hero section
- Tech stack badges (shields.io): TypeScript, JavaScript, Next.js,
  TailwindCSS, Node.js, Cocos Creator, HTML5
- Links to GitHub, YouTube, LinkedIn, Naver Blog, and the contact page

### 4.3 Music List (`data/musicData.ts`, `app/music-list/`)

- All playlists are centrally managed in a single `data/musicData.ts` file
  (date + track array)
- Date pill buttons switch playlists; a table shows `#`, title, artist, BPM
- A sticky audio player provides play/pause/stop, a clickable progress bar,
  and highlights the currently playing track

### 4.4 Blog (`data/blogPosts.ts`, `app/blog/`, `app/blog/[slug]/`)

- Posts are stored in a single `data/blogPosts.ts` file (slug, bilingual
  title, date, tags, markdown-ish body)
- The listing page sorts newest-first and shows tags/author
- The detail page uses `generateStaticParams` for SSG and renders headings,
  lists, and paragraphs from the post body

### 4.5 DJ Play List (`app/DJ_Play_List/`)

- Ships with 6 default Swing Jazz tracks streamed from AWS S3 (base URL
  resolved via `audioUrl()` in `lib/audio.ts`)
- Play/pause/stop, seekable progress bar, volume control, repeat/shuffle
  toggles
- Supports adding tracks by URL or local file upload (Object URL), revoking
  Object URLs on unmount to avoid memory leaks

### 4.6 Tax Calculator (`app/tax-calculator/`, `app/lib/taxCalculator.ts`, `app/config/taxRates2025.ts`)

A calculator based on the 2025 Korean tax structure.

| Item                 | Basis                     |
| -------------------- | ------------------------- |
| Income tax           | Progressive rate (6%–45%) |
| Local income tax     | 10% of income tax         |
| National pension     | 4.5% of annual salary     |
| Health insurance     | 3.545% of annual salary   |
| Employment insurance | 0.9% of annual salary     |

Supports monthly/annual toggling, optional 4-insurance inclusion, and
increment/decrement buttons for common amounts (+10K/+100K/+1M KRW).

### 4.7 Contact Form (`app/contact/`, `app/api/send-email/route.ts`)

- Fields: title, sender email, content — with a live HTML email preview
- `POST /api/send-email` sanitizes header values (`lib/email.ts`) to prevent
  header injection, then sends via Nodemailer over SMTP
- Requires env vars: `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`,
  `SMTP_PASS`, `RECEIVER_EMAIL`

### 4.8 Projects Page (`app/projects/page.tsx`)

A collection of link cards: DJ Play List (internal), GitHub, LinkedIn,
YouTube, About (internal).

### 4.9 Admin Dashboard (`app/admin/`)

- Desktop sidebar + mobile Sheet drawer (shadcn/ui `Button`, `Sheet`)
- `/admin`: reads the username from the session cookie for a welcome
  message, with a quick-link card to `/admin/users`
- `/admin/users`: shows the single environment-configured admin account in a
  table, with an explicit note that no user database exists
- `AdminLayoutClient.tsx` handles logout (`POST /api/auth/logout` → redirect
  to `/login`)

### 4.10 Footer Visitor Counter (`components/Footer.tsx`)

- Renders a live visitor count via the `visitor-badge.laobi.icu` external
  badge image, with no backend of its own
- Chosen because Vercel's serverless filesystem is ephemeral — a
  self-hosted counter file would reset on every deploy/instance, so an
  external counting service is used instead

---

## 5. Shared Components & Utilities

| Component / Function                                              | Path                       | Description                                               |
| ----------------------------------------------------------------- | -------------------------- | --------------------------------------------------------- |
| `NavBar`                                                          | `components/NavBar.tsx`    | Sticky header, active link via `usePathname`              |
| `Footer`                                                          | `components/Footer.tsx`    | Tech badges + visitor badge + social links (desktop only) |
| `BottomNav`                                                       | `components/BottomNav.tsx` | Mobile fixed bottom nav                                   |
| `Hero`                                                            | `components/Hero.tsx`      | GSAP bounce-animated hero section                         |
| `createSessionToken()` / `verifySessionToken()`                   | `lib/auth.ts`              | JWT session issuance/verification, cookie options         |
| `verifyCredentials()`                                             | `lib/credentials.ts`       | bcrypt password comparison                                |
| `buildContactHtml()` / `isValidEmail()` / `sanitizeHeaderValue()` | `lib/email.ts`             | Contact email HTML + header sanitization                  |
| `audioUrl()`                                                      | `lib/audio.ts`             | Resolves the audio file base URL                          |
| `cn()`                                                            | `lib/utils.ts`             | clsx + tailwind-merge helper                              |
| `shuffleArray`, `upgradeShuffleArray`                             | `utils/Utils.ts`           | Fisher–Yates / `crypto.getRandomValues` shuffles          |

---

## 6. Full Tech Stack

| Category   | Technology                             | Version       |
| ---------- | -------------------------------------- | ------------- |
| Framework  | Next.js                                | 15.5.18       |
| Runtime    | React                                  | 19.0.0        |
| Language   | TypeScript                             | 5             |
| Styling    | Tailwind CSS                           | 3.4.1         |
| Components | shadcn/ui (Radix UI)                   | —             |
| Animation  | GSAP                                   | 3.13.0        |
| Icons      | Lucide React                           | 0.511.0       |
| Email      | Nodemailer                             | 9.0.1         |
| Auth       | jose (JWT) + bcryptjs                  | 6.2.3 / 3.0.3 |
| Testing    | Vitest                                 | 4.1.10        |
| Formatting | Prettier + prettier-plugin-tailwindcss | 3.9.5 / 0.8.1 |

---

## 7. Testing

Vitest runs all `**/*.test.ts` files (see `vitest.config.ts`).

| File                            | Covers                            |
| ------------------------------- | --------------------------------- |
| `lib/auth.test.ts`              | JWT session issuance/verification |
| `lib/credentials.test.ts`       | Admin credential verification     |
| `lib/email.test.ts`             | Contact email HTML + sanitization |
| `utils/Utils.test.ts`           | Array shuffle utilities           |
| `app/lib/taxCalculator.test.ts` | Tax calculation logic             |

```bash
npm run test            # run once
npm run test:watch       # watch mode
npm run test:coverage     # v8 coverage report
```

---

## 8. Known Limitations & Future Work

1. **Single admin account** — with no user database, there is no multi-user
   or role-based access control.
2. **Static content** — music and blog data live in static files checked into
   the repo; a real CMS/database would be needed for non-developer content
   editing.
3. **Email** — the contact form fails to send if SMTP env vars aren't set.
4. **DJ Play List audio** — default tracks depend on a specific AWS S3
   bucket; only the base URL is configurable, via
   `NEXT_PUBLIC_AUDIO_BASE_URL`.
5. **Visitor counter** — depends on the availability of a free third-party
   badge service.
