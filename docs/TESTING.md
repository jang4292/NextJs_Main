# Testing and Local CI

## Current Test Inventory

The repository uses Vitest for `**/*.test.ts` and `**/*.test.tsx` files.
Vitest is configured with the `threads` pool so repeated local CI and pre-push
runs do not depend on fork worker startup timing.
Current inventory:

| Metric     | Count |
| ---------- | ----- |
| Test files | 141   |
| Test cases | 599   |

Primary coverage areas:

- Auth/session, admin access, and rate limiting
- Contact form view model, API client, HTML email rendering, and route handler
- Tool, learning, navigation, and game catalogs
- Music playlist and track formatting
- 9 game implementations across domain rules, use cases, persistence, and
  selected presentation interactions
- Math learning question generation and quiz UI
- Media Downloader URL validation, format mapping, runtime environment,
  extractor/downloader adapters, API route handlers, and presentation state
- Tax calculator view model
- English, Japanese, and Chinese vocabulary data/filtering

## Command Matrix

| Command                 | Purpose                                                |
| ----------------------- | ------------------------------------------------------ |
| `npm run test`          | Run the full Vitest suite once                         |
| `npm run test:watch`    | Run Vitest in watch mode while developing              |
| `npm run test:coverage` | Generate V8 text and HTML coverage reports             |
| `npm run format:check`  | Verify Prettier formatting without rewriting files     |
| `npm run lint`          | Run ESLint                                             |
| `npm run typecheck`     | Generate Next route types, then run `tsc6 --noEmit`    |
| `npm run build`         | Build the Next.js app with webpack                     |
| `npm run diff:check`    | Check the current Git diff for whitespace/patch issues |
| `npm run ci`            | Run format, lint, typecheck, test, and build checks    |
| `npm run ci:local`      | Run `diff:check`, then the shared CI checks            |
| `npm run prepush`       | Same gate used by `.husky/pre-push`                    |

## Local CI and Pre-push

Use the local CI gate before handing off or opening a PR:

```bash
npm run ci:local
```

The command order is intentionally strict:

```text
git diff --check
  -> prettier --check .
  -> eslint .
  -> next typegen && tsc6 --noEmit
  -> vitest run
  -> next build --webpack
```

Husky runs the same gate from `.husky/pre-push` via `npm run prepush`. This keeps
manual local checks, pre-push checks, and GitHub Actions aligned around the same
core `npm run ci` script.

## GitHub Actions CI

`.github/workflows/ci.yml` runs on pushes and pull requests targeting `main` or
`develop`. The workflow installs dependencies with `npm ci`, pins npm to
`11.11.0`, then runs `npm run ci`.

## Test Authoring Guidelines

- Put pure domain and application logic tests next to the implementation as
  `*.test.ts`.
- Use `*.test.tsx` for React presentation and interaction tests.
- Keep game rules deterministic by injecting fixed random sources or explicit
  board/session fixtures.
- Keep Media Downloader tests process-free: inject a fake process runner and
  assert generated `yt-dlp`/FFmpeg arguments, error mapping, temp cleanup, and
  response contracts.
- Route handler tests should cover invalid JSON, invalid request shape,
  validation failures, success payloads, and stable error responses.
- Prefer focused regression tests for each bug fix before broad snapshot tests.

## Useful Inventory Commands

```bash
rg --files -g '*.test.ts' -g '*.test.tsx' | wc -l
npm run test -- --reporter=verbose
npm run test:coverage
```
