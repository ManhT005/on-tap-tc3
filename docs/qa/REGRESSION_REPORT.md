# Final local regression — 2026-10-11

Artifact: **0.3.0-beta.1**. Source is the final P5 technical commit `039de18` followed by documentation-only integration. Baseline before this work: `50a4fa7`. Environment: Windows, Node.js 24.12.0, Playwright 1.63.0; Chromium and Firefox; production Vite preview, two E2E workers.

| Command / check | Final result |
| --- | --- |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS |
| `npm run format:check` | PASS |
| `npm run test:coverage` | PASS: 28 files, 144 tests; 12.31 seconds |
| `npm run test:e2e` | PASS: 46 tests, about 1.0 minute; 23 Chromium + 23 Firefox |
| `npm run check:manifest` | PASS |
| `npm run validate:content` | PASS: 15 lessons, 180 quiz, 39 reading, 30 writing; Listening schemas tested |
| `npm run audit:data` | PASS report generation; 30 TTS scripts, 0 approved recorded files |
| `npm audit --audit-level=high` | PASS: 0 vulnerabilities reported |
| Production `build` through E2E webServer | PASS |
| `npm run check:bundle` | PASS: 19 JS chunks, total about 315 KiB gzip |
| `git diff --check` | PASS |
| `npm run validate:release` | Expected NO-GO: 30 blockers, one human approval and one recorded-audio requirement per lesson |

Coverage: statements **81.86%** (659/805), branches **75.97%** (332/437), functions **74.34%** (171/230), lines **85.99%** (608/707). These figures cover configured domain/repository files and do not claim all UI branches are tested.

Accessibility smoke reported zero axe violations for the tested primary screens and Exam using WCAG 2 A/AA, 2.1 AA and 2.2 AA tags. Mobile Exam checked 360/390/430 widths without horizontal page overflow and answer buttons at least 44px high. Keyboard skip navigation passed. This is not a full accessibility audit.

Local artifacts (ignored by Git): `coverage/index.html`, `coverage/coverage-summary.json`, `node_modules/.cache/playwright-report/index.html`, `node_modules/.cache/playwright-test-results/.last-run.json`, Exam mobile screenshots. CI is configured to upload coverage/build/browser artifacts after remote execution; no new remote run URL exists yet.

## Earlier failures and resolution

- High browser concurrency caused Firefox load/timeouts; the supported test profile uses two workers.
- One intermediate run was interrupted by an abnormal multi-hour environment gap and recorded timeouts/worker failures; it is not counted as passing evidence.
- A later run timed out the single test performing five complete axe scans at the default 30-second deadline. Its own timeout is now 60 seconds; individual interaction expectations remain unchanged. The final clean full run passed with the Firefox scan test taking about 10.2 seconds.
- Type/format issues discovered during implementation were corrected before final checks. The final source checks above supersede intermediate failed runs.

## Acceptance limits

Human Korean answer/distractor/source review, 30 recorded audio with rights/pronunciation review, manual UAT/device/screen-reader checks, remote CI/branch protection and production hosting/deep-link/Web Vitals acceptance remain pending. TTS test stubs prove playback error handling and persistence, not pronunciation quality. No production deployment, v1.0 tag, or signed UAT is reported.
