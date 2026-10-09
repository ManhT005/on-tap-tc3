# on-tap-tc3

Ứng dụng ôn tiếng Hàn Trung cấp 3 (TC3) — Phase 2: Learning Core & Spaced Repetition Engine.

## Tech Stack

- React 19, TypeScript, Vite, React Router
- IndexedDB via `idb` with automatic in-memory fallback for degraded environments
- Zod for content schemas and runtime data validation
- Vitest and Testing Library for unit/component tests
- Playwright for browser smoke and end-to-end testing

## Requirements

- Node.js 20 or newer
- npm 10 or newer
- Playwright Chromium for E2E tests

## Install And Run

```bash
npm ci
npm run dev
```

## Checks

```bash
npm run typecheck
npm run lint
npm run format:check
npm test
npm run validate:content
npm run audit:data
npm run build
npx playwright install chromium
npm run test:e2e
```

## Project Structure

- `src/app/`: app shell, route configuration, storage providers, and global styles
- `src/pages/`: route-level page components (Learn, Review, Practice, Progress)
- `src/components/`: reusable UI primitives and learning components
- `src/data/`: course curriculum, vocabulary/grammar banks, reading & writing banks
- `src/domain/`: core business logic (review SRS engine, practice scoring, progress calculations)
- `src/repositories/`: storage layer (IndexedDB, in-memory, resilient fallback wrapper)
- `src/features/`: feature-specific components, hooks, and flows
- `scripts/`: content validation and data audit tools
- `docs/`: architecture specifications, progress audits, and milestone plans

## Current Phase

**Phase 2: Learning Core (Stabilized Release Candidate)**
- 15-lesson structured course navigation
- Resilient storage with atomic multi-store completion transactions and idempotency guards
- Spaced repetition (SRS) review queue with Leitner-style box intervals
- Practice modes (Quiz, Reading with text evidence, Writing with controlled keyword checks)
- Aggregated progress dashboard with persistent metrics and degraded storage indicators
- Strict content validation gate enforcing question integrity and valid answer indices
