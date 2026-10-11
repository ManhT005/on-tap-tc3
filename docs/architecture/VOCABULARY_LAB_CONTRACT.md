# Vocabulary Lab contract

Base: `feature/completion-integration` at `b79fed3`. User-supplied plan and interactive mockup are preserved under `docs/release/`.

- `/vocabulary?lesson=1&mode=flashcard|list|recall|context`; optional `word=<stableId>` opens that word in a small batch. Absent lesson selects the latest in-progress lesson. Invalid lesson has a visible Bài 01 fallback; unsupported mode defaults to Flashcard and an unknown word ID uses the regular batch.
- Canonical entries adapt existing immutable vocabulary IDs. Legacy notes remain collocations, never approved translated examples. Pilot enrichment is editorial draft, not language/source sign-off. Approved examples/aliases require actual reviewer/source metadata.
- Batch defaults to 10, supports 5/10/15, prioritizes unstudied and weak items. One active session per lesson lives in existing v3 `settings` under `vocabulary-session:<lessonId>`; no IndexedDB version change.
- Grading commits session state, SRS event receipt and actual lesson item event in one transaction. First grade per word/session wins, including competing tabs. Previous/Next are viewing actions and never grade. Repeating a hard word requires a new session. Reveal state is transient and resets after reload.
- Lesson vocabulary credit follows actual grading; eligible recall IDs also receive recall credit. Context bookmark uses a mark event and does not fabricate lesson completion or grade repetitions.
- Backup validates session identity/lesson/IDs and restores session state; reset-one removes its session. No grading of vocabulary batches changes objective practice accuracy.
- Shared owner-based audio controller stops previous TTS or recorded playback before new playback; one component's cleanup must not cancel another owner's playback. Only Korean voices, no autoplay; explicit unavailable/error/retry.
- Context matcher uses exact boundaries and longest known phrase. Only approved aliases are used. Multiple senses stay visible, lesson preference is labeled, unknown/inflected forms are never guessed. Manual local search is available; no online API/key is added.
- Context lookup is mounted only on visible Reading text or revealed Listening transcript. Exam retains plain text and existing reveal rules.
- Mobile modes wrap, card actions are at least 44px, keyboard shortcuts ignore inputs/modifiers/control activation, dialog traps/restores focus and closes on Escape.

Technical acceptance is recorded in the final Vocabulary Lab report. Human enrichment/rights approval remains pending. Optional dictionary proxy, arbitrary morphology, AI images and microphone features are outside this implementation.
