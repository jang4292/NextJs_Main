# Architecture

## Overview

This is a Next.js 16 App Router application organized as an Interactive Lab:
tools and learning content are the primary user journey, while the portfolio
profile supports credibility and contact.

There is no database. Domain content is stored as typed TypeScript modules
inside feature folders. Admin access uses a signed JWT session in an httpOnly
cookie and `proxy.ts` protects `/admin/**`.

## Route Model

```
app/
  layout.tsx                  # html/body only
  (site)/layout.tsx           # public SiteNav/Footer/BottomNav
  (site)/page.tsx             # /
  (site)/tools/page.tsx       # /tools
  (site)/tools/music/page.tsx # /tools/music
  (site)/tools/tax-calculator/page.tsx
  (site)/tools/games/page.tsx
  (site)/tools/games/[slug]/page.tsx
  (site)/learn/page.tsx
  (site)/learn/blog/[slug]/page.tsx
  (site)/learn/idioms/[slug]/page.tsx
  (site)/learn/vocabulary/page.tsx
  (site)/about/page.tsx
  (site)/contact/page.tsx
  (auth)/login/page.tsx       # no public chrome
  admin/                      # protected admin shell
  api/                        # auth + email route handlers
```

Canonical public URLs are `/tools/*`, `/learn/*`, `/about`, and `/contact`.
Legacy URLs such as `/music-list`, `/DJ_Play_List`, `/tax-calculator`,
`/games/*`, `/blog/*`, and `/projects/*` are redirected from
`features/navigation/siteNavigation.ts` through `next.config.ts`.

## Feature Ownership

```
features/
  navigation/       nav items + legacy redirect source
  tools/            tool catalog
  learning/         learning catalog
  music/            playlists, audio formatting, player state, DJ queue
  games/            game catalog + game feature folders
  blog/             post data + list/detail presentation
  idioms/           idiom data + list/detail presentation
  vocabulary/       vocabulary search/filter/detail experience
  tax-calculator/   tax domain data, calculation, view model, UI
  contact/          contact form view model, API client, UI
  auth/             login form
  admin/            admin layout chrome
```

`app/` should stay thin: route files export metadata, read route params, and
delegate UI to feature or shared presentation components. Static compatibility
modules under `data/` re-export feature-owned data for one release window.

## Shared UI

```
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

## Core Flows

### Music Studio

`/tools/music` renders `features/music/presentation/MusicStudio.tsx`.
The dated playlist mode reads `PLAYLISTS`; the DJ queue starts by deriving
tracks from the first canonical playlist rather than maintaining a second
hardcoded source. URL and local-file tracks are added only to the mutable DJ
queue, and Object URLs are revoked when removed or unmounted.

### Games

`/tools/games/[slug]` uses `features/games/catalog.ts` for slugs, metadata,
and display order. `features/games/presentation/GameHost.tsx` is the single
client registry that dynamically imports each game with `ssr: false`.

### Learning

Blog posts live in `features/blog/domain/data/blogPosts.ts` and are rendered
through `/learn/blog/[slug]` with `generateStaticParams`. Idioms and vocabulary
are grouped under `/learn` so content exploration does not compete with tool
workflows.

### Admin

`/admin/**` remains outside `(site)` so public chrome is not rendered in the
protected dashboard. `app/admin/layout.tsx` verifies the session and delegates
sidebar/logout UI to `features/admin/presentation/AdminLayoutClient.tsx`.
