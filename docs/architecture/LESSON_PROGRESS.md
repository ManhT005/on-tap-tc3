# Lesson progress

Progress records contain persisted sets of immutable IDs. Opening a lesson contributes 0%. Recall contributes 20% across the four introductory recall items; vocabulary contributes 40% across all vocabulary items; grammar contributes 20% across explicitly checked structures; submitting quick practice contributes 20%. A confidence action on a recall item also records its vocabulary step. Merely answering questions without submission contributes no quiz progress.

Completion requires every mandatory item and a submitted quiz. Partial totals round down and remain below 100%. Event application is idempotent for checklist sets and happens against current state inside the same transaction as review or quiz mutations. Opening, reloading, or submitting a quiz cannot fabricate earlier study steps.

Historical completion is preserved in `legacyCompletedAt` when a lesson previously completed under the percentage-based rules is reopened. Its new checklist starts with only verified step events; the UI explains the historical completion separately. Existing practice results and migration records remain available.

Evidence: pure progress tests, cross-instance checklist test, learning-flow component test, and practice/repository regression tests. No human UAT sign-off is implied.
