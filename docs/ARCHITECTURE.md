# Architecture

## Overview

This is a Next.js 16 App Router application organized as an Interactive Lab.
Tools and learning content are the primary user journey, while the portfolio
profile supports credibility and contact.

There is no database. Domain content is stored as typed TypeScript modules
inside feature folders. Admin access uses a signed JWT session in an httpOnly
cookie, and `proxy.ts` protects `/admin/**`.

## Route Model

```text
app/
  layout.tsx                         # html/body only
  (site)/layout.tsx                  # public SiteNav/Footer/BottomNav
  (site)/page.tsx                    # /
  (site)/tools/page.tsx              # /tools
  (site)/tools/music/page.tsx        # /tools/music
  (site)/tools/media-downloader/page.tsx
  (site)/tools/tax-calculator/page.tsx
  (site)/tools/games/page.tsx
  (site)/tools/games/[slug]/page.tsx
  (site)/learn/page.tsx
  (site)/learn/blog/page.tsx
  (site)/learn/blog/[slug]/page.tsx
  (site)/learn/idioms/page.tsx
  (site)/learn/idioms/[slug]/page.tsx
  (site)/learn/vocabulary/page.tsx
  (site)/learn/japanese-vocabulary/page.tsx
  (site)/learn/chinese-vocabulary/page.tsx
  (site)/learn/math/page.tsx
  (site)/learn/math/sequences/page.tsx
  (site)/learn/math/statistics/page.tsx
  (site)/learn/math/probability/page.tsx
  (site)/about/page.tsx
  (site)/contact/page.tsx
  (auth)/login/page.tsx              # no public chrome
  admin/                             # protected admin shell
  api/auth/login/route.ts
  api/auth/logout/route.ts
  api/media/analyze/route.ts
  api/media/download/route.ts
  api/send-email/route.ts
```

Canonical public URLs are grouped under four primary navigation axes:
`Home`, `Tools`, `Learn`, and `Profile`. `Profile` uses `/about` as its
representative route, while `/contact` remains a related Profile route and
keeps Profile active in both desktop and mobile navigation. Legacy public URLs
are redirected from `features/navigation/siteNavigation.ts` through
`next.config.ts`.

## Local Network Development

`npm run dev:network` starts Next.js on `0.0.0.0:3000` for testing from other
devices on the local network. Next.js blocks cross-origin access to development
resources such as HMR WebSockets unless the accessing hostname is explicitly
allowed by `allowedDevOrigins`.

`next.config.ts` applies `allowedDevOrigins` only when
`NODE_ENV === "development"`. Local overrides can be supplied with
`NEXT_ALLOWED_DEV_ORIGINS` as a comma-separated list of hostnames or IPs without
protocols or ports, for example `172.30.1.97`.

## Feature Ownership

```text
features/
  navigation/          nav items + legacy redirect source
  tools/               tool catalog
  learning/            learning catalog
  music/               playlists, audio formatting, player state, DJ queue
  media-downloader/    URL validation, format mapping, yt-dlp/FFmpeg adapters, downloader UI
  games/               10-game catalog + game feature folders
  math-learning/       sequences, statistics, probability learning
  blog/                post data + list/detail presentation
  idioms/              idiom data + list/detail presentation
  vocabulary/          English vocabulary
  vocabulary-japanese/ Japanese vocabulary
  vocabulary-chinese/  Chinese vocabulary
  tax-calculator/      tax domain data, calculation, view model, UI
  contact/             contact form view model, API client, UI
  auth/                login form
  admin/               admin layout chrome
```

`app/` should stay thin: route files export metadata, read route params, and
delegate UI to feature or shared presentation components. Static compatibility
modules under `data/` re-export feature-owned data for one release window.

## Shared UI

```text
components/
  layout/PageShell.tsx
  layout/SectionHeader.tsx
  layout/ContentGrid.tsx
  cards/FeatureCard.tsx
  cards/LinkCard.tsx
  cards/ContentCard.tsx
  navigation/SiteNav.tsx
  navigation/BottomNav.tsx
  navigation/Footer.tsx
  ui/
```

List-style pages use `PageShell`, `SectionHeader`, `ContentGrid`, and
`FeatureCard` to keep spacing, heading scale, and card density consistent.
Tools, Learn, and Games hubs render grouped catalog sections from feature-owned
category order and label helpers.

## Core Flows

### Music Studio

`/tools/music` renders `features/music/presentation/MusicStudio.tsx`.
The dated playlist mode reads `PLAYLISTS`; the DJ queue starts by deriving
tracks from the first canonical playlist rather than maintaining a second
hardcoded source. URL and local-file tracks are added only to the mutable DJ
queue, and Object URLs are revoked when removed or unmounted.

### Media Downloader

`/tools/media-downloader` renders
`features/media-downloader/presentation/MediaDownloader.tsx`. The route supports
public YouTube single-video URLs in local Node.js runtime through thin
`/api/media/analyze` and `/api/media/download` handlers.

The feature is split into pure application utilities and infrastructure
adapters:

- URL validation rejects non-HTTPS input, credentials, localhost, private
  network addresses, non-YouTube hosts, and playlist-style URLs.
- Platform resolution, format mapping, filename sanitization, status labels,
  and stable error messages stay inside `features/media-downloader/application`.
- `youtubeExtractor.ts` runs `yt-dlp --dump-single-json --no-playlist`.
- `mediaDownloader.ts` creates an OS temp job directory, runs `yt-dlp` with
  FFmpeg, rejects empty/oversized files, buffers the result, and removes the job
  directory in `finally`.
- `mediaEnvironment.ts` reads `YTDLP_PATH`, `FFMPEG_PATH`, `FFPROBE_PATH`,
  timeout settings, and max output bytes, then performs lightweight readiness
  checks before analysis/download.

`next.config.ts` allows YouTube thumbnail hosts (`i.ytimg.com`,
`i9.ytimg.com`) in both CSP `img-src` and Next Image `remotePatterns`.

### Games

`/tools/games/[slug]` uses `features/games/catalog.ts` for slugs, metadata,
category, and display order. `features/games/presentation/GameHost.tsx` is the
single client registry that dynamically imports all 10 games with
`ssr: false`.

### Learning

Blog posts live in `features/blog/domain/data/blogPosts.ts` and are rendered
through `/learn/blog/[slug]` with `generateStaticParams`. Idioms and vocabulary
are grouped under `/learn`, and math learning exposes sequences, statistics,
and probability as focused subroutes.

### Contact

`/contact` delegates UI state to `features/contact`. `POST /api/send-email`
validates shape, email format, and input length, rate-limits by client IP, then
sends sanitized HTML mail through Nodemailer.

### Admin

`/admin/**` remains outside `(site)` so public chrome is not rendered in the
protected dashboard. `proxy.ts` verifies the `admin_session` JWT cookie and
redirects invalid requests to `/login`. `app/admin/layout.tsx` verifies the
session again for server rendering and delegates sidebar/logout UI to
`features/admin/presentation/AdminLayoutClient.tsx`.

### API Guardrails

- Login is rate-limited by client IP and normalized username.
- Contact email is rate-limited by client IP.
- Media API routes use stable error codes/messages and avoid exposing raw
  process stderr to the browser.
- Process execution uses `spawn(command, args, { shell: false })`; user input
  is passed as an argument, not concatenated into a shell command.

## Quality Gates

The shared CI gate is `npm run ci`, which runs format check, lint, typecheck,
tests, and build in that order. Local handoff and Husky pre-push use
`npm run ci:local`, adding `git diff --check` before the shared gate. GitHub
Actions runs the same `npm run ci` command for pushes and pull requests targeting
`main` or `develop`.
