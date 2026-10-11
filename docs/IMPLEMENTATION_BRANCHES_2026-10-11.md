# Completion implementation branches — 2026-10-11

Baseline: `feature/phase-2-learning-core`, local HEAD `50a4fa7`.
Master plan: [ON_TAP_TC3_COMPLETION_MASTER_PLAN_2026-10-11.md](ON_TAP_TC3_COMPLETION_MASTER_PLAN_2026-10-11.md).

Ten local branches were created. Each starts at the previous branch's tested tip; review its diff against that predecessor. The integration branch includes every technical commit. No remote push/PR, `main`/`develop` merge or release tag was performed.

| Order | Branch | Commit | Scope / evidence |
| --- | --- | --- | --- |
| 1 | `fix/p2-storage-session-identity` | `0d001ee` | P2-01: session receipts/unique identity; 104 tests + typecheck PASS at this stage |
| 2 | `fix/p2-review-transaction-race` | `c97414e` | P2-02: transactional SRS commands/rollback; 39 focused tests PASS |
| 3 | `fix/p2-stable-review-ids` | `6c22568` | P2-03: immutable IDs/frozen aliases/DB v3; 43 focused tests PASS |
| 4 | `feat/p2-lesson-progress-state` | `7e9f30b` | P2-04: persistent actual checklist; 117 tests PASS |
| 5 | `fix/p2-storage-recovery` | `3b41466` | P2-05: fail closed/retry/versionchange; recovery tests PASS |
| 6 | `fix/p2-review-live-ux-e2e` | `7bc0b0f` | P2-06/07: timer/focus refresh, save guards; focused and browser regression PASS |
| 7 | `feature/phase-3-content-experience` | `1075726` | P3: 180 quiz, drafts/history/backup; 17 Chromium E2E PASS at this stage |
| 8 | `feature/phase-4-listening-exam` | `e85a525` | P4: provisional TTS and durable Exam; 138 tests + 20 Chromium E2E PASS |
| 9 | `chore/p5-release-hardening` | `039de18` | P5 beta: CI, coverage, axe/mobile, bundles/dependencies; final 144 unit/integration + 46 Chromium/Firefox PASS |
| 10 | `feature/completion-integration` | Documentation commit at branch tip | All technical commits plus master plan, closure/test reports and handoff |

These are dependent branches. Opening all PRs directly against `develop` would duplicate earlier changes. Review in order with the predecessor as comparison base, or review the aggregate integration diff against `feature/phase-2-learning-core`.

```bash
git diff fix/p2-storage-session-identity...fix/p2-review-transaction-race
git diff feature/phase-2-learning-core...feature/completion-integration
```

The original planned `release/v1.0.0` branch was deferred because its release gates are not met. `chore/p5-release-hardening` contains the completed technical work and beta setup. Create a release branch/tag only after real content/audio/UAT/production evidence exists.

Final evidence and remaining gates: [implementation report](IMPLEMENTATION_REPORT_2026-10-11.md), [regression](qa/REGRESSION_REPORT.md), [P2 closure](phase_2/PHASE_2_CLOSURE_REPORT.md).

Do not merge Phase 2 into `develop` or tag a release until G2 evidence and UAT sign-off exist. Automated checks cannot sign off Korean language accuracy, audio rights, or human UAT. Those require explicit evidence in the approval trackers.

The master plan supplied by the user remains unchanged.
