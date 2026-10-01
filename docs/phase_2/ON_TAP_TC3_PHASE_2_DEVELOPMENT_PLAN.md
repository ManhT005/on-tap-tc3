# ON-TAP-TC3 — PHASE 2 DEVELOPMENT PLAN

**Repository:** `ManhT005/on-tap-tc3`  
**Phase:** Phase 2 — Learning Core, Local Progress & Review Loop  
**Điều kiện bắt đầu:** Phase 1 đã merge sạch vào `main`

---

# 1. MỤC TIÊU PHASE 2

Biến project từ:

> app có shell + data

thành:

> app học tiếng Hàn có learning loop thật, lưu được tiến độ và ôn lại được.

Flow mục tiêu:

```text
Home
↓
Learn
↓
Lesson
↓
Practice
↓
Save Result
↓
Review
↓
Progress
```

---

# 2. DEFINITION OF DONE

Phase 2 chỉ hoàn thành khi:

- user học được ít nhất một lesson end-to-end;
- progress persist sau reload;
- practice có scoring;
- sai câu tạo review item;
- review item có `nextReviewAt`;
- Home dùng data thật;
- Review dùng queue thật;
- Progress dùng data thật;
- Lesson 1–3 đủ để chạy E2E;
- unit/integration tests pass;
- IndexedDB tests pass;
- Playwright E2E pass;
- CI green.

---

# 3. KIẾN TRÚC MỤC TIÊU

```text
src/
├── app/
│   ├── App.tsx
│   ├── AppShell.tsx
│   ├── router.tsx
│   └── providers/
│
├── pages/
│
├── features/
│   ├── learning/
│   ├── practice/
│   ├── review/
│   └── progress/
│
├── components/
│   ├── ui/
│   ├── learning/
│   └── feedback/
│
├── domain/
│   ├── learning/
│   ├── practice/
│   ├── progress/
│   └── review/
│
├── repositories/
│   ├── progress.repository.ts
│   └── indexeddb-progress.repository.ts
│
├── data/
└── utils/
```

Nguyên tắc:

```text
UI
↓
Feature
↓
Domain
↓
Repository
↓
IndexedDB
```

---

# 4. EPIC A — LEARNING ACCESS LAYER

**Priority:** P0

## Tạo

```text
src/domain/learning/course.service.ts
src/domain/learning/lesson.service.ts
src/domain/learning/learning.types.ts
```

## API

```ts
getLessons()
getLessonById(id)
getLessonVocabulary(id)
getLessonGrammar(id)
getLessonQuiz(id)
getLessonReading(id)
```

## Acceptance Criteria

- page không tự query data bank rải rác;
- invalid lesson trả explicit error/result;
- unit tests cho lesson 1, 15, invalid ID.

---

# 5. EPIC B — LEARN PAGE THẬT

## LessonCard cần hiển thị

- số bài;
- Korean title;
- Vietnamese title;
- topic;
- importance;
- trạng thái;
- progress;
- CTA.

## Status

```text
NOT_STARTED
IN_PROGRESS
COMPLETED
NEEDS_REVIEW
```

## Filter MVP

```text
All
Not started
In progress
Completed
```

---

# 6. EPIC C — LESSON LEARNING FLOW

## Flow

```text
LessonHeader
↓
Objectives
↓
Recall
↓
Vocabulary
↓
Grammar
↓
Quick Practice
↓
Completion
```

---

## C1 — Recall

- 3–5 item;
- nhớ trước khi reveal;
- confidence 1–4;
- không tính điểm nặng.

---

## C2 — Vocabulary

### Components

```text
VocabularyList
VocabularyCard
Flashcard
```

### Hiển thị

- Korean;
- Vietnamese;
- category;
- note;
- example;
- reveal;
- mark “Cần ôn”.

---

## C3 — Grammar

### Components

```text
GrammarCard
GrammarExample
GrammarDrill
```

### Hiển thị

- structure;
- meaning;
- rule;
- examples;
- common mistakes;
- quick drill.

---

## C4 — Quick Practice

Mỗi lesson:

```text
5–10 questions/session
```

Ưu tiên:

```text
MCQ
True/False
Fill
```

Chưa cần:

```text
Listening
Advanced ordering
Advanced matching
AI grading
```

---

# 7. EPIC D — PRACTICE ENGINE

## Files

```text
src/domain/practice/
├── practice-session.ts
├── score-practice.ts
├── practice.types.ts
└── *.test.ts
```

## Session

```ts
type PracticeSession = {
  id: string;
  lessonId?: number;
  mode: 'lesson' | 'quiz' | 'reading';
  questionIds: string[];
  answers: Record<string, unknown>;
  startedAt: string;
  completedAt?: string;
};
```

## Result

```ts
type PracticeResult = {
  score: number;
  correct: number;
  wrong: number;
  total: number;
  wrongQuestionIds: string[];
};
```

## Rules

- scoring phải là pure function;
- UI không tự tính score;
- wrong IDs được giữ lại.

---

# 8. EPIC E — LOCAL PROGRESS PERSISTENCE

Repo đã có `idb`, Phase 2 dùng thật.

## Interface

```ts
interface ProgressRepository {
  getCourseProgress(): Promise<CourseProgress>;
  getLessonProgress(lessonId: number): Promise<LessonProgress | null>;
  saveLessonProgress(progress: LessonProgress): Promise<void>;

  getReviewItems(): Promise<ReviewStatus[]>;
  saveReviewItem(item: ReviewStatus): Promise<void>;

  savePracticeResult(result: PracticeResult): Promise<void>;
}
```

## IndexedDB

```text
DB: on-tap-tc3
Version: 1
```

Stores:

```text
lesson_progress
review_status
practice_results
settings
```

## Migration

Ngay từ đầu phải có:

```ts
upgrade(db, oldVersion, newVersion)
```

## Error handling

Nếu IndexedDB lỗi:

- app không trắng trang;
- toast báo;
- memory fallback cho session hiện tại;
- dev log rõ ràng.

---

# 9. EPIC F — REVIEW ENGINE

## Files

```text
src/domain/review/review-engine.ts
src/domain/review/review-queue.ts
src/domain/review/review-engine.test.ts
```

## Review status hiện có

```text
itemId
itemType
repetitions
correctCount
wrongCount
lastReviewedAt
nextReviewAt
intervalDays
confidence
box
```

## MVP schedule

| Box | Interval |
|---:|---|
| 0 | same day |
| 1 | 1 day |
| 2 | 3 days |
| 3 | 7 days |
| 4 | 14 days |
| 5 | 30 days |

## Sai

```text
box = max(0, box - 1)
wrongCount += 1
nextReviewAt = near-term
```

## Đúng

```text
box = min(5, box + 1)
correctCount += 1
```

## Functions

```ts
gradeReview()
calculateNextReview()
getDueReviewItems()
sortReviewQueue()
```

Inject `now` để test deterministic.

---

# 10. EPIC G — REVIEW PAGE

## Sections

MVP:

```text
Due today
Recent mistakes
```

Sau này:

```text
Weak items
Completed
```

## Review flow

```text
Prompt
↓
Reveal
↓
Confidence 1–4
↓
Update ReviewStatus
↓
Next item
```

## Acceptance Criteria

- reload không mất queue;
- completed item biến mất khỏi due-now;
- nextReviewAt update đúng.

---

# 11. EPIC H — HOME DASHBOARD

Home shell hiện dùng static values.

Phase 2 thay bằng data thật.

## Cards

```text
Continue Learning
Due Reviews
Lessons Completed
Practice Accuracy
```

## CTA

```text
Nếu có lesson in-progress:
    Continue lesson
else:
    Start lesson kế tiếp
```

---

# 12. EPIC I — PROGRESS PAGE

## MVP metrics

```text
Lessons completed
Lessons in progress
Practice sessions
Accuracy
Reviews due
Vocabulary reviewed
Grammar reviewed
```

Không cần:

```text
heavy chart library
heatmap
cloud sync
social stats
```

---

# 13. EPIC J — PRACTICE PAGE

## Quiz

Implement thật.

Filter:

```text
All lessons
By lesson
Mistakes only
```

## Reading

Render data hiện có.

## Writing

Basic:

- prompt;
- required keywords;
- model answer reveal;
- self-check.

## Exam

Giữ disabled/coming soon nếu content chưa đủ.

## Listening

Không nằm trong critical path Phase 2.

---

# 14. CONTENT STRATEGY

Không cố hoàn thiện toàn bộ 15 bài cùng lúc.

## Tier 1 — Lesson 1–3

Mục tiêu:

```text
Vocabulary usable
Grammar usable
Quiz >= 8 câu/bài
Reading usable nếu có
Writing >= 1 prompt/bài
```

## Tier 2 — Lesson 4–15

Mục tiêu:

```text
lesson loads
vocabulary loads
grammar loads
graceful empty state
không crash
```

---

# 15. CONTENT VALIDATION

Bổ sung rule:

```text
Duplicate question ID
Invalid lesson reference
Empty explanation
MCQ answer out of range
Unknown targetId
Missing lesson metadata
Review item references missing content
```

Structural error:

```text
FAIL CI
```

Coverage thấp:

```text
WARNING
```

---

# 16. UNIT TEST STRATEGY

## Domain

```text
lesson.service.test.ts
score-practice.test.ts
review-engine.test.ts
review-queue.test.ts
```

## Review cases

```text
wrong answer lowers box
confidence 4 promotes
box never < 0
box never > 5
due filter correct
future item not due
```

## Practice cases

```text
0 questions
all correct
all wrong
mixed result
invalid answer
```

---

# 17. REPOSITORY TEST

Test IndexedDB:

```text
save lesson progress
reload repository
progress remains
save review item
update review item
query due items
save practice result
```

---

# 18. COMPONENT TEST

Bắt buộc:

```text
Flashcard
QuizCard
ReviewQueueItem
LessonCard
```

Kiểm tra:

- keyboard;
- reveal;
- submit;
- disabled state;
- feedback;
- aria.

---

# 19. PLAYWRIGHT E2E

## E2E-LEARN-01

```text
Home
→ Learn
→ Lesson 1
→ Vocabulary
→ Practice
→ Complete
→ Progress updated
```

## E2E-PERSIST-01

```text
Complete activity
→ Reload
→ Progress remains
```

## E2E-REVIEW-01

```text
Answer wrong
→ Complete practice
→ Open Review
→ Item exists
```

## E2E-REVIEW-02

```text
Open due item
→ Reveal
→ Confidence 3
→ Submit
→ Item removed from current queue
```

## E2E-MOBILE-01

Viewport:

```text
390 x 844
```

Flow:

```text
Home
→ Learn
→ Lesson
→ Practice
```

---

# 20. CI GATE

Không merge nếu fail:

```text
typecheck
lint
format check
unit test
content validation
data audit
build
Playwright
```

---

# 21. ERROR HANDLING

Mọi feature chính phải có:

```text
loading
empty
error
success
```

Ví dụ invalid lesson:

```text
Không fallback về Lesson 1.
```

Phải hiển thị:

```text
Lesson Not Found
```

---

# 22. PERFORMANCE

Mục tiêu:

- không render loop;
- IndexedDB không block UI;
- interaction phản hồi nhanh;
- bundle hợp lý.

Có thể lazy-load:

```text
Practice
Review
Progress
```

sau khi core flow ổn định.

---

# 23. SECURITY / PRIVACY

Phase 2 local-only.

Không lưu:

```text
password
API key
sensitive personal data
```

Chỉ lưu:

```text
learning progress
review status
practice result
settings
```

---

# 24. BRANCH STRATEGY

## Branch chính

```text
feature/phase-2-learning-core
```

Nếu chia việc:

```text
feature/phase-2-progress-repository
feature/phase-2-review-engine
feature/phase-2-learning-ui
feature/phase-2-e2e
```

---

# 25. PHÂN CÔNG TEAM 2 DEV

## Dev A

```text
course service
practice engine
progress repository
IndexedDB
review engine
unit tests
```

## Dev B

```text
pages
learning components
practice UI
review UI
progress UI
responsive
Playwright
```

---

# 26. TASK BREAKDOWN

| ID | Task | Priority | Estimate |
|---|---|---:|---:|
| P2-A | Learning access layer | P0 | 0.5–1d |
| P2-B | Learn page thật | P0 | 1d |
| P2-C | Lesson flow | P0 | 2–3d |
| P2-D | Practice engine | P0 | 1–1.5d |
| P2-E | IndexedDB repository | P0 | 1.5–2d |
| P2-F | Review engine | P0 | 1–1.5d |
| P2-G | Review UI | P0 | 1d |
| P2-H | Home real data | P1 | 0.5–1d |
| P2-I | Progress dashboard | P1 | 1d |
| P2-J | Practice modes | P1 | 1d |
| P2-T1 | Unit/integration tests | P0 | 1–2d |
| P2-T2 | Playwright E2E | P0 | 1d |
| P2-CONTENT | Lesson 1–3 hardening | P1 | 1–2d |

---

# 27. KẾ HOẠCH 2 TUẦN

## Day 1

- course service;
- progress types;
- repository interface.

## Day 2

- IndexedDB schema;
- repository tests.

## Day 3

- Learn page thật;
- lesson state.

## Day 4

- Lesson vocabulary;
- grammar UI.

## Day 5

- quick practice;
- practice session.

## Day 6

- scoring;
- wrong question tracking.

## Day 7

- review engine;
- scheduling tests.

## Day 8

- review page;
- review persistence.

## Day 9

- Home real data;
- Progress page.

## Day 10

- content Lesson 1–3;
- Playwright;
- mobile regression;
- bugfix;
- release candidate.

---

# 28. PULL REQUEST PLAN

## PR 1

```text
Phase 2 — Progress Repository
```

## PR 2

```text
Phase 2 — Learning Flow
```

## PR 3

```text
Phase 2 — Practice & Review Engine
```

## PR 4

```text
Phase 2 — Review, Progress & Home Integration
```

## PR 5

```text
Phase 2 — E2E & Release Hardening
```

---

# 29. RELEASE CHECKLIST

## Architecture

- [ ] UI không truy cập storage trực tiếp
- [ ] Domain logic không nằm trong component
- [ ] Repository abstraction hoạt động

## Learning

- [ ] 15 lessons mở được
- [ ] Lesson 1–3 đầy đủ hơn
- [ ] Vocabulary hoạt động
- [ ] Grammar hoạt động
- [ ] Quick Practice hoạt động

## Persistence

- [ ] reload không mất progress
- [ ] result lưu được
- [ ] review status lưu được

## Review

- [ ] wrong answer tạo review
- [ ] due query đúng
- [ ] schedule update đúng

## Dashboard

- [ ] Home dùng data thật
- [ ] Progress dùng data thật

## Quality

- [ ] Typecheck PASS
- [ ] Lint PASS
- [ ] Unit PASS
- [ ] Content validation PASS
- [ ] Build PASS
- [ ] Playwright PASS

---

# 30. KHÔNG LÀM TRONG PHASE 2

```text
Backend account
Cloud sync
Google login
AI tutor
AI grading
Full listening
Full mock exam
180 quiz hoàn chỉnh
Gamification phức tạp
Leaderboard
Admin CMS
```

---

# 31. OUTPUT CUỐI PHASE 2

Sau Phase 2:

```text
Học
↓
Làm bài
↓
Sai
↓
Tạo lịch ôn
↓
Ôn lại
↓
Cập nhật tiến độ
```

Đây là milestone biến `on-tap-tc3` từ frontend prototype thành **MVP học tiếng Hàn dùng được thực tế**.
