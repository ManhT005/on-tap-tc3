# Data migration and backup

Database upgrades are additive: v1 keeps historical practice records; v2 adds a unique session index and completion receipts; v3 migrates frozen legacy vocabulary/grammar IDs. No upgrade deletes the database. Failed upgrades roll back. Unknown legacy identities remain recoverable; identity collisions retain archived originals in settings.

Progress → Export JSON downloads a versioned envelope with lesson steps, review status, practice results, question snapshots, writing responses/drafts, receipts and settings. Backup envelopes v1/v2/v3 using this structure are validated; historical records may omit session identity. This does not imply compatibility with arbitrary unrelated JSON exports.

Import is a preview followed by explicit replacement. Files larger than 10 MiB, duplicate IDs, invalid counters and dangling receipts are rejected before writing. The current database is exported before confirmation. All stores replace in one transaction. The transaction compares current records with the exported snapshot and aborts if another tab changed data while the confirmation was open.

Reset all or one lesson requires two confirmations and exports current data first. Lesson reset preserves other lessons and shared history; close other learning tabs before replacing/resetting. Existing files can restore data after reset. Writes after a successful reset are new learning data, not an automatic merge.

Writing autosaves after a 400 ms pause and flushes before switching prompts. Failed writes preserve text in the current app session and show retry. Wait for confirmed saved status or press Save draft before reloading. Unconfirmed writes trigger a browser unload prompt. No writing text is sent to a grading service; self-assessment is separate from objective accuracy.

Rollback to older app code does not downgrade IndexedDB schema. Back up and verify a tested restore path before a production update. Never clear user storage to repair an upgrade.
