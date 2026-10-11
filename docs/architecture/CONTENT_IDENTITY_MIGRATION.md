# Content identity migration

Vocabulary tuple field 4 and grammar `id` are immutable identifiers assigned once. Do not regenerate or renumber them after moving content, fixing text, or adding new items. New items need unused IDs. Duplicate words with different meanings remain separate items.

`src/data/legacy-review-ids.v1.json` freezes the original mapping from positional and word-encoded references. Never regenerate this file from a later content order. `scripts/assign-content-identities.ts` refuses to run after the snapshot exists.

Database v3 migrates vocabulary and grammar review keys inside the version upgrade transaction. Practice results, receipts, and lesson progress remain intact. Unknown IDs stay available for recovery. If two legacy/canonical IDs collide, retain the status with more repetitions (latest timestamp breaks ties) and archive both originals in settings under `migration:v3:*`. Do not add counters when distinct events cannot be established.

Acceptance evidence: `content-identity-migration.test.ts` checks every explicit ID, reorders content, upgrades v1, preserves collision archives/orphans, and reopens the database. `session-identity.test.ts` continues to check v1 practice result preservation and uniqueness.
