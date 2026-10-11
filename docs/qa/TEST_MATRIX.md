# Test matrix — integrated beta 0.3.0-beta.1

Paths below are relative to `src/` unless prefixed `e2e/`. Final local aggregate: 144 unit/integration tests and 46 browser executions PASS. A row can map to several assertions; counts are not added per row.

| Master-plan coverage | Source of evidence | Result / limitation |
| --- | --- | --- |
| Session identity and duplicate submission | `repositories/session-identity.test.ts`, `domain/practice/complete-practice.test.ts` | PASS: replay, concurrent completion, known session collision |
| Atomic review and rollback | `repositories/review-concurrency.test.ts`, `e2e/cross-tab.spec.ts` | PASS: two database adapters/tabs, double-click, rollback |
| Legacy identity migration | `repositories/content-identity-migration.test.ts`, `domain/review/review-content.test.ts` | PASS: frozen aliases, reordering, collision archive, unknown data |
| Storage blocked/quota/retry/upgrade failure | `repositories/storage-recovery.test.ts`, `e2e/learning-hardening.spec.ts` | PASS automated; manual device quota behavior pending |
| Honest lesson progress/reload | `domain/progress/lesson-progress.test.ts`, `features/learning/components/LessonLearningFlow.test.tsx`, `e2e/learning-hardening.spec.ts` | PASS: actual checklist; lessons 01/08/15 |
| Clock/focus due refresh and grade locking | `features/review/state/use-review-queue.test.tsx`, `components/learning/ReviewQueueItem.test.tsx`, `e2e/app-shell.spec.ts` | PASS |
| SRS grading and objective scoring | `domain/review/review-engine.test.ts`, `domain/practice/score-practice.test.ts` | PASS; self-assessment excluded from objective accuracy |
| Content cardinality/schema/evidence | `data/content-gates.test.ts`, `validate:content`, `check:manifest` | PASS structure; language/source approval pending |
| Writing draft/history/save failure | `features/practice/components/WritingPractice.persistence.test.tsx`, `repositories/backup-drafts.test.ts`, `e2e/writing-backup.spec.ts` | PASS: switch, reload, retry, assessment history |
| Backup restore/reset | `repositories/backup-drafts.test.ts`, `e2e/writing-backup.spec.ts` | PASS: validation, v1/v2/v3 envelope, stale snapshot, reference consistency, size cap, atomic replacement |
| Listening errors/recovery/scoring | `components/learning/ListeningPlayer.test.tsx`, `e2e/listening-exam.spec.ts` | PASS behavior with mocked speech; actual pronunciation not tested |
| Exam selection/state/persistence | `domain/exam/exam-engine.test.ts`, `repositories/exam-persistence.test.ts`, `e2e/listening-exam.spec.ts` | PASS: seed/order independence, deadline/reload, expiration, atomic replay |
| Navigation/deep routes/mobile | `e2e/app-shell.spec.ts`, `e2e/accessibility-responsive.spec.ts` | PASS local production preview, including 360/390/430 widths; real hosting pending |
| Accessibility | `e2e/accessibility-responsive.spec.ts` | PASS axe smoke on five primary screens and Exam; skip-link keyboard; manual screen-reader acceptance pending |
| Build/bundle/dependencies | `build`, `check:bundle`, `npm audit` | PASS local; bundle budget is not production Web Vitals |
| Production/UAT/remote CI | Deployment runbook and UAT tracker | PENDING; no deployment or human signature |

Coverage instrumentation selects `src/domain/**/*.ts` and `src/repositories/**/*.ts`, excludes test/type-only files. Unit tests use jsdom and fake-indexeddb where needed. E2E uses actual Chromium/Firefox, production Vite preview and two workers; speech voices/errors are stubbed in relevant tests.
