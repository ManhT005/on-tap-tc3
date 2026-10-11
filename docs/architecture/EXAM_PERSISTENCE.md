# Exam attempt persistence

Versioned blueprints create 30-question TC3 practice sets. Core: 20 quiz + 10 reading; optional mixed: 20 quiz + 5 reading + 5 listening. Practice mode has no deadline; timed mode lasts 30 minutes. These are authored course practice blueprints, not certified TOPIK simulations.

Seeded sampling is independent of input order, excludes duplicate IDs and rejects insufficient banks. Each attempt stores a snapshot of questions, options, answers, explanations, passage context and listening metadata. Later bank changes do not change a stored attempt.

State: CREATED → IN_PROGRESS → SUBMITTED / EXPIRED / ABANDONED. Starting computes the deadline once. Reload reuses it. Repository time decides expiry and blocks further answers at the boundary. Abandoned attempts retain metadata and do not count as objectively graded sessions.

Answers and flags read/modify/write current attempt state in one transaction. At most one active attempt is created across tabs. Submission atomically writes result, completion receipt, review mutations and the terminal attempt. Repeated/concurrent submissions return the original result. On storage failure the active attempt remains available for retry; expiry scoring uses saved answers.

Exam records live in typed settings and are included in JSON backup. Import validates the attempt blueprint, question identities, immutable deadline and result references. Shared exam history is retained by individual-lesson reset.

Evidence: deterministic blueprint tests, deadline boundary tests, two-instance answer/submit tests, injected receipt-write failure with rollback, and browser reload/expiry/result persistence. Listening test voices are synthetic fixtures; they do not certify pronunciation.
