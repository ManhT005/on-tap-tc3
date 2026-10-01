# on-tap-tc3

Ứng dụng ôn tiếng Hàn Trung cấp 3 (TC3), hiện tập trung hoàn thiện nền tảng giao diện Phase 1.

## Tech Stack

- React 19, TypeScript, Vite, React Router
- Zod for content schemas
- Vitest and Testing Library for unit/component tests
- Playwright for browser smoke tests

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

- `src/app/`: app shell, route configuration, and global styles
- `src/pages/`: route-level page components
- `src/components/`: reusable UI and learning components
- `src/data/`: course content and schemas
- `src/features/`: feature-specific components and state
- `scripts/`: content validation and data audit tools
- `docs/`: architecture and phase planning

## Branch Strategy

- `main` contains the stable application baseline.
- Use `feature/<phase>-<scope>` branches for focused work and merge through a pull request.
- Sync feature branches with `main` before opening or updating a pull request.

## Current Phase

Phase 1 establishes the app shell, SPA navigation, reusable UI primitives, responsive behavior, accessibility baseline, and CI/E2E checks. Persistence, review/practice engines, progress tracking, listening, AI, and major content expansion remain out of scope for this phase.
