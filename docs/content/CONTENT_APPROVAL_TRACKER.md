# Content approval tracker

180 quiz questions, 39 reading passages, 30 writing prompts, 1,085 vocabulary items and 42 grammar structures have structural validation. No Korean reviewer sign-off has been supplied. All 15 lessons remain **PENDING** language, answer, explanation and source review in `CONTENT_APPROVALS.json`.

The 60 additional quiz questions are authored recognition exercises based on immutable vocabulary/grammar IDs. Each lesson adds two vocabulary and two grammar questions. They are not independently verified language assessments. Review correct answers and all distractors before approving.

For each lesson, record the reviewer's name, date, approved scopes, corrected question/item IDs and source/license evidence. Never change status to approved based only on the validator passing. Listening audio availability and rights approval are separate release gates.

Use `npm run validate:content` for structural coverage. Release validation must additionally check the approval registry and recorded audio assets.
