# Changelog

## Vocabulary Lab — 2026-10-11 (beta development)

- Dedicated `/vocabulary` route and compact Lesson entry; four modes, searchable/paginated catalog, 5/10/15-word batches, keyboard and mobile layouts.
- Atomic session/SRS/lesson grading in existing IndexedDB v3 settings; resume, same-session replay protection, two-tab grading, quota rollback and backup/reset support.
- Shared owner-based Korean speech and recorded-playback coordination; no English fallback or autoplay.
- Exact-boundary longest-phrase contextual lookup in Reading and revealed Listening, ambiguous senses, local manual search, bookmarks and focus-restoring modal/bottom sheet. Exam does not mount lookup UI.
- Vocabulary validator/CI gate, coverage audit and four editorial draft enrichments. No example/alias is marked approved; no recorded word audio added.
- Final local regression: 159 unit/integration tests and 58 Chromium/Firefox E2E executions PASS.

## 0.3.0-beta.1 — 2026-10-11

- IndexedDB v2/v3, session receipts, original result on replay, atomic review/lesson mutations and concurrency/rollback tests.
- Immutable vocabulary/grammar identities with a frozen v1 migration map and collision archives.
- Persisted lesson checklist, honest completion rule, live review clock/focus refresh and async submit guards.
- Writing drafts/submitted answers, historical question snapshots, practice history, validated backup/restore/reset and stale-replacement detection.
- 180 quiz questions, structural content gate, approval/source registries and generated identity manifest.
- 30 provisional Listening scripts and device Korean speech playback, supported recorded-player metadata/recovery.
- Seeded 30-question Exam with immutable deadline, answer/flag persistence, exactly-once submission and result review.
- Production-build E2E in Chromium/Firefox, axe/keyboard/mobile smoke, coverage reports, bundle budgets and dependency audit.
- Removed unused Tailwind build dependency and stylesheet; application uses its established CSS token system. Updated compatible vulnerable transitive dependency.

Preview only: human Korean/source approval, 30 approved recorded audio assets, production acceptance and UAT remain required before v1.0.0. No production deploy/tag or remote branch-protection change is implied.
