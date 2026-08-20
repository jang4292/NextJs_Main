# YH Jang Interactive Lab - Development Report (English)

- **Date**: 2026-08-11
- **Project**: Personal Interactive Lab & Utility Tools
- **Stack**: Next.js 16.2.11 · React 19.2.8 · TypeScript 6 tooling · Tailwind CSS 4

---

## 1. Project Overview

This project is a personal Interactive Lab that combines portfolio content,
practical tools, and learning experiences in one App Router application. The
home page prioritizes entry points into tools and learning content, while the
profile, contact form, and admin dashboard support the broader portfolio flow.

Current capabilities include Music Studio, Media Downloader, 9 mini-games, a
2025 Korean tax calculator, a development blog, Korean idioms, English,
Japanese, and Chinese vocabulary learning, math learning, email contact, and a
JWT-session-protected admin dashboard.

| Item              | Current State                                        |
| ----------------- | ---------------------------------------------------- |
| Framework         | Next.js 16 App Router                                |
| Runtime           | React 19                                             |
| Language          | TypeScript 6 tooling                                 |
| Public page route | 24 `page.tsx` files                                  |
| API route         | 5 route handlers                                     |
| Tests             | 148 Vitest test files / 651 test cases               |
| Baseline branch   | `feature/play-musics-videos` compared with `develop` |

---

## 2. Route Map

| Path                                    | Description                  | Composition               |
| --------------------------------------- | ---------------------------- | ------------------------- |
| `/`                                     | Interactive Lab home         | `(site)` public chrome    |
| `/tools`                                | Tools hub                    | tool catalog              |
| `/tools/music`                          | Music Studio                 | playlist + DJ queue       |
| `/tools/media-downloader`               | Media Downloader             | client UI + media API     |
| `/tools/tax-calculator`                 | 2025 Korean tax calculator   | tax view model + UI       |
| `/tools/games`                          | Games hub                    | 10-game catalog           |
| `/tools/games/[slug]`                   | Individual game host         | `GameHost` dynamic import |
| `/learn`                                | Learning hub                 | learning catalog          |
| `/learn/blog`, `/learn/blog/[slug]`     | Development blog list/detail | SSG detail route          |
| `/learn/idioms`, `/learn/idioms/[slug]` | Korean idiom list/detail     | typed idiom data          |
| `/learn/vocabulary`                     | English vocabulary           | search/filter/detail      |
| `/learn/japanese-vocabulary`            | Japanese vocabulary          | speech + filter           |
| `/learn/chinese-vocabulary`             | Chinese vocabulary           | speech + filter           |
| `/learn/math`                           | Math learning hub            | math catalog              |
| `/learn/math/sequences`                 | Sequence learning            | quiz flow                 |
| `/learn/math/statistics`                | Statistics learning          | quiz flow                 |
| `/learn/math/probability`               | Probability learning         | quiz flow                 |
| `/about`                                | Profile hub                  | profile route             |
| `/contact`                              | Profile contact form         | contact feature           |
| `/login`                                | Admin login                  | auth-only layout          |
| `/admin`, `/admin/users`                | Protected admin screens      | session required          |

Older public URLs are temporarily connected to canonical routes through
`legacyRedirects` in `features/navigation/siteNavigation.ts` and
`next.config.ts`.

---

## 3. API and Server Flows

| API                        | Role                                     | Guardrails                             |
| -------------------------- | ---------------------------------------- | -------------------------------------- |
| `POST /api/auth/login`     | Admin login and JWT session cookie issue | IP/username rate limit, input length   |
| `POST /api/auth/logout`    | Session cookie expiration                | httpOnly cookie deletion               |
| `POST /api/send-email`     | Contact email delivery                   | IP rate limit, email/length validation |
| `POST /api/media/analyze`  | YouTube single-video metadata analyze    | URL allowlist, stable error mapping    |
| `POST /api/media/download` | MP4/MP3 file response                    | format validation, temp cleanup        |

`proxy.ts` verifies the `admin_session` cookie for `/admin/**` requests and
redirects invalid requests to `/login`. `app/admin/layout.tsx` also verifies
the session during server rendering.

---

## 4. Feature Details

### 4.1 Music Studio

`/tools/music` combines dated playlists and a DJ queue. Canonical tracks live in
`features/music/domain/data/musicPlaylists.ts`; URL and local-file additions
are kept only in the mutable DJ queue. Object URLs are revoked when removed or
when the component unmounts.

### 4.2 Media Downloader

`/tools/media-downloader` is a local MVP for analyzing public YouTube
single-video URLs and saving them as MP4 or MP3 files.

- Analyze: `POST /api/media/analyze` with `{ url: string }`
- Download: `POST /api/media/download` with `{ url, type, formatId, quality? }`
- Video presets: `video-mp4-360`, `video-mp4-720`, `video-mp4-1080`
- Audio presets: `audio-mp3-128`, `audio-mp3-192`
- Runtime tools: `yt-dlp`, `ffmpeg`, `ffprobe`

URL validation, platform resolution, format mapping, filename sanitization,
status labels, and error mapping are pure feature utilities. Process execution
is isolated behind infrastructure adapters so a future worker-backed backend
can replace the local process boundary.

### 4.3 Games

The games catalog manages 9 slugs: Solitaire, 2048, Minesweeper, FreeCell,
Sudoku, 3-Match, Arithmetic Learning, Typing Rain, Slot Machine, and Bulls and
Cows. The Games hub groups entries as Card, Puzzle, Learning, and Casual.
`GameHost.tsx` loads each game with `ssr: false` to avoid hydration mismatches
from initial random state and browser-only storage.

### 4.4 Learning

Learning content is grouped under `/learn`. Blog and idiom content have detail
routes, English/Japanese/Chinese vocabulary pages provide search/filter/speech
flows, and math learning exposes sequences, statistics, and probability as
focused subroutes.

### 4.5 Contact

The contact form accepts title, sender, and content, and separates HTML preview
and API client state into the contact feature. The server sends mail through
Nodemailer and sanitizes title/sender values to prevent header injection.

### 4.6 Admin

The admin account is configured through environment variables instead of a
database. `jose` signs a JWT and stores it in an httpOnly `SameSite=Lax` cookie.
Admin UI renders in a separate route tree without public site chrome.

---

## 5. Structure and Ownership

```text
app/            routes, metadata, API handlers
components/     layout, navigation, card, ui primitives
features/       feature-owned domain/application/presentation code
lib/            auth, credentials, email, env, rateLimit, audio, utils
data/           compatibility re-exports
types/          shared types
utils/          small legacy utilities
docs/           architecture, reports, feature notes
```

The core rule is to keep `app/` thin while feature folders own screen state,
domain logic, and presentation components.

---

## 6. Tech Stack

| Category   | Technology                             | Version / Notes           |
| ---------- | -------------------------------------- | ------------------------- |
| Framework  | Next.js                                | 16.2.11                   |
| Runtime    | React / React DOM                      | 19.2.8                    |
| Language   | TypeScript                             | `@typescript/typescript6` |
| Styling    | Tailwind CSS                           | 4.3.3                     |
| UI         | shadcn/ui, Radix Dialog/Slot           | local primitives          |
| Animation  | GSAP                                   | 3.15.0                    |
| Icons      | Lucide React                           | 1.26.0                    |
| Email      | Nodemailer                             | 9.0.3                     |
| Auth       | jose + bcryptjs                        | 6.2.4 / 3.0.3             |
| Media      | yt-dlp, FFmpeg, FFprobe                | local PATH or env path    |
| Testing    | Vitest, Testing Library                | 4.1.10                    |
| Formatting | Prettier + prettier-plugin-tailwindcss | 3.9.6 / 0.8.1             |

---

## 7. Environment Variables

| Group | Variables                                                                                                                      |
| ----- | ------------------------------------------------------------------------------------------------------------------------------ |
| SMTP  | `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `RECEIVER_EMAIL`                                            |
| Admin | `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`, `SESSION_SECRET`                                                                      |
| Music | `NEXT_PUBLIC_AUDIO_BASE_URL`                                                                                                   |
| Media | `YTDLP_PATH`, `FFMPEG_PATH`, `FFPROBE_PATH`, `MEDIA_ANALYZE_TIMEOUT_MS`, `MEDIA_DOWNLOAD_TIMEOUT_MS`, `MEDIA_MAX_OUTPUT_BYTES` |

Literal `$` characters in the bcrypt `ADMIN_PASSWORD_HASH` must be escaped as
`\$` in `.env` files.

---

## 8. Testing

Vitest runs `**/*.test.ts` and `**/*.test.tsx`. The repository currently has
148 test files and 651 test cases, with game tests accounting for 101 files.

Primary coverage areas:

- Auth/session/admin rate limiting
- Contact form view model, API client, email HTML, and sanitization
- Music playlist and track formatting
- Tool, learning, and navigation catalogs
- Domain rules, use cases, and selected presentation interactions for 10 games
- Math learning question generation and UI
- Media Downloader URL validation, format mapping, runtime env, extractor,
  downloader, API routes, and presentation

Commands:

```bash
npm run test
npm run test:coverage
npm run lint
npm run typecheck
npm run format:check
npm run ci
npm run ci:local
```

`npm run ci` runs format check, lint, typecheck, test, and build. `npm run
ci:local` adds `git diff --check`, and `.husky/pre-push` calls the same local
gate through `npm run prepush`.

---

## 9. Known Limitations and Future Work

1. Media Downloader is a local Node.js runtime MVP. Production should move
   long-running work to a queue, worker, object storage, and signed URLs.
2. Media Downloader only supports public YouTube single-video URLs. Playlists,
   private videos, paid videos, DRM, login, and cookie-based access are out of
   scope.
3. Admin supports one environment-configured account and has no multi-user or
   role-based access control.
4. Contact and admin rate limits are memory-based, so they are not global across
   multiple serverless instances.
5. Learning, blog, and game data are static code-owned data. Non-developer
   editing would require a CMS or database.
6. Music Studio default audio depends on an external S3/CDN base URL.
