# ON-TAP-TC3 — PHASE 2 BUG AUDIT & FIX IMPLEMENTATION PLAN

> **Loại tài liệu:** Bug backlog / Technical remediation plan / QA acceptance gate  
> **Ngày rà soát:** 2026-10-09  
> **Repository:** https://github.com/ManhT005/on-tap-tc3  
> **Nhánh được kiểm tra:** `feature/phase-2-learning-core`  
> **HEAD được kiểm tra:** [`6b86a8e`](https://github.com/ManhT005/on-tap-tc3/commit/6b86a8e3240df4e6e1870cb22385653e0082df46)  
> **Nhánh đích:** `develop`  
> **Phạm vi:** Learning flow, Quiz, Reading, Writing, Review/SRS, IndexedDB, dashboard, UI, tests và content quality.

## 0. Kết luận điều hành

**Đánh giá:** Phase 2 đã triển khai learning loop thực và bổ sung học liệu cho 15 bài. Các thay đổi tích cực gồm giao dịch IndexedDB nhiều store, degraded-storage warning, empty-state Reading/Writing, kiểm tra cấu trúc nội dung và bộ test React/Repository. Tuy nhiên, **chưa nên đánh dấu ready-to-merge** trước khi khép kín các mục P0 và xác nhận CI/E2E thực sự xanh.

**Lưu ý bằng chứng:** Các nhận định dưới đây là **static review** trên mã đã push, không phải kết quả chạy toàn bộ app hoặc xác nhận các lỗi đều đã xảy ra trong production. Nhãn:

- **CONFIRMED-CODE:** Có thể chỉ ra trực tiếp nhánh logic gây lỗi hoặc làm thiếu chức năng trong source.
- **RISK-REPRO:** Rủi ro hợp lý suy ra từ luồng xử lý; cần test tái hiện để xác nhận mức độ ảnh hưởng.
- **QUALITY/GATE:** Thiếu tiêu chí, kiểm thử hoặc tính chính xác của thống kê; không đồng nghĩa một test hiện tại đang fail.

### Trạng thái đối chiếu lần review trước

| Hạng mục | Trạng thái ở HEAD | Ghi chú |
|---|---|---|
| Giao dịch lưu Result + Review + Lesson Progress | Đã triển khai | Một IndexedDB transaction, nhưng khóa chống lưu trùng chưa đồng nhất |
| Reading/Writing khi chọn bài chưa có data | Đã sửa | Bộ chọn bài vẫn ở ngoài EmptyState |
| Writing yêu cầu nhập nội dung | Đã sửa một phần | `response` là controlled state, chưa ghi nội dung bài viết vào kết quả |

## 1. Bảng tổng hợp lỗi và thứ tự ưu tiên

| ID | Priority | Phân loại | Mô tả | Chủ sở hữu gợi ý | Chặn merge? | **Trạng thái** |
|---|---|---|---|---|---|---|
| BUG-P2-001 | **P0** | CONFIRMED-CODE | Chống submit trùng kiểm tra `result.id`, bỏ qua `sessionId`; riêng Lesson tạo result ID mới trên retry | Dev A | **Có** | ✅ FIXED |
| BUG-P2-002 | **P0/P1** | RISK-REPRO | Snapshot Review được đọc bên ngoài transaction; có thể ghi đè cập nhật từ tab/session khác | Dev A | Có nếu tái hiện | OPEN |
| BUG-P2-003 | **P1** | CONFIRMED-CODE | Mỗi lesson có 2 Writing prompts nhưng UI luôn hiển thị `data[0]` | Dev B | Nên sửa trước merge | ✅ FIXED |
| BUG-P2-004 | **P1** | CONFIRMED-CODE | Review ID từ vựng còn phụ thuộc `packIndex/itemIndex`; hàm stable ID chưa sử dụng | Dev A + B | Nên sửa trước mở rộng data | OPEN |
| BUG-P2-005 | **P1** | CONFIRMED-CODE | Quiz All lấy `.slice(0,10)`, lặp bộ câu hỏi đầu | Dev B | Không nếu scope MVP cố định | ✅ FIXED |
| BUG-P2-006 | **P1** | CONFIRMED-CODE | Bộ lọc `mistakes` chỉ nạp ReviewItems khi mount; sau làm sai chưa cập nhật trong cùng màn | Dev B | Nên sửa | ✅ FIXED |
| BUG-P2-007 | **P1** | CONFIRMED-CODE | Accuracy tổng gộp kết quả tự đánh giá Writing với bài được chấm khách quan | Dev A | Nên sửa | ✅ FIXED |
| BUG-P2-008 | **P1** | CONFIRMED-CODE | Text Writing không được lưu; chỉ lưu câu trả lời giả lập 0/1 | Dev A + B | Nên sửa hoặc ghi rõ out-of-scope | ✅ FIXED (UI notice) |
| BUG-P2-009 | **P1/P2** | CONFIRMED-CODE | Phần trăm lesson là số mốc cứng 25/50, checklist Grammar luôn ✅ | Dev B | Không nếu điều chỉnh UX | OPEN |
| BUG-P2-010 | **P1/P2** | RISK-REPRO | Memory fallback không hydrate dữ liệu cũ của IndexedDB khi đổi backend | Dev A | Theo yêu cầu durability | OPEN |
| BUG-P2-011 | **P2** | CONFIRMED-CODE | "Lỗi gần đây" sort theo `nextReviewAt`, không phải lần sai gần nhất | Dev A + B | Không | ✅ FIXED |
| BUG-P2-012 | **P2** | CONFIRMED-CODE | Nút lưu Review chưa khóa trong async request | Dev B | Không, nhưng cần chống thao tác lặp | ✅ FIXED |
| BUG-P2-013 | **P2** | RISK-REPRO | Queue due chỉ tính `new Date()` khi render; tab mở lâu có thể không tự hiện item đến hạn | Dev B | Không | OPEN |
| BUG-P2-014 | **P2** | QUALITY/GATE | Content validator chưa đồng nhất một số rule với authoring guide; chưa có kiểm duyệt ngôn ngữ | Content QA | Không với MVP Phase 2 | OPEN |
| GATE-P2-015 | **P0** | QUALITY/GATE | Chưa có kết quả xác thực CI / Playwright cho HEAD tại thời điểm review | QA / Tech Lead | **Có** | OPEN |

**Định nghĩa ưu tiên:** P0 = integrity/release blocker; P1 = lỗi chức năng hoặc sai số liệu có ảnh hưởng người học; P2 = UX/hardening, có thể lên backlog tiếp nếu không ảnh hưởng release.

---

## 2. Chi tiết từng bug và hướng khắc phục

### BUG-P2-001 — Idempotency dùng sai khóa, nguy cơ nhân đôi Practice Result

**Priority:** P0 — **Evidence:** CONFIRMED-CODE.  
**Tệp liên quan:**

- [`src/repositories/progress.repository.ts`](https://github.com/ManhT005/on-tap-tc3/blob/feature/phase-2-learning-core/src/repositories/progress.repository.ts)
- [`src/repositories/indexeddb/indexeddb-progress.repository.ts`](https://github.com/ManhT005/on-tap-tc3/blob/feature/phase-2-learning-core/src/repositories/indexeddb/indexeddb-progress.repository.ts)
- [`src/repositories/memory-progress.repository.ts`](https://github.com/ManhT005/on-tap-tc3/blob/feature/phase-2-learning-core/src/repositories/memory-progress.repository.ts)
- [`src/features/learning/state/use-lesson-flow.ts`](https://github.com/ManhT005/on-tap-tc3/blob/feature/phase-2-learning-core/src/features/learning/state/use-lesson-flow.ts)
- `src/features/practice/components/{QuizPractice,ReadingPractice}.tsx`

**Quan sát trong code:** `PracticeCompletionCommand` có `sessionId`, nhưng hai repository chỉ dùng `command.result.id` để kiểm tra bản ghi có tồn tại. Hook Lesson gọi `createId('practice-result')` **mỗi lần** `submitPractice()`, trong khi session ID đã được tạo ổn định khi mount; không có `submitting` guard tại Lesson. Quiz/Reading đã dùng `...-${session.id}` cho `resultId`, nhưng đây chưa phải ràng buộc tại tầng persistence.

**Kịch bản kiểm thử tái hiện:**

1. Mở Lesson 1, trả lời đầy đủ và bấm Hoàn thành liên tiếp nhanh hai lần, hoặc giả lập response commit thành công rồi client nhận lỗi và retry.
2. Quan sát `practice_results` và `review_status` trong IndexedDB.
3. Kỳ vọng: **một session chỉ tạo một result, review counters chỉ tăng một lần**; hiện tại mã không bảo đảm điều đó khi result ID thay đổi.

**Root cause:** Invariant ở interface nói “idempotent theo sessionId” nhưng implementation thực thi theo khóa `result.id` và không enforce `sessionId` độc nhất.

**Fix bắt buộc — chia 2 lớp:**

A. **Hotfix UI + Domain:**

```ts
// use-lesson-flow.ts
const resultId = `lesson-result-${session.id}`; // giữ cố định qua retry
const [submitting, setSubmitting] = useState(false);

async function submitPractice() {
  if (!quizResult.ok || result || submitting) return;
  setSubmitting(true);
  try {
    const completed = await completePracticeSession(
      { ...session, answers },
      quizResult.data.map(({ id, correctIndex }) => ({ id, correctIndex })),
      repository,
      { resultId, completedAt: new Date().toISOString() },
    );
    setResult(completed);
  } catch {
    setError('Không thể lưu kết quả. Vui lòng thử lại.');
  } finally {
    setSubmitting(false);
  }
}
```

B. **Khóa thực sự ở Repository (giải pháp bền vững):**

- Bổ sung `sessionId` cho `PracticeResult` và lưu trong mỗi result; giữ tương thích dữ liệu cũ (optional trong migration/reader, required cho dữ liệu mới).
- Nâng `PROGRESS_DATABASE_VERSION` từ `1` lên `2` **nếu thêm index**, thêm `by-session-id` cho store `practice_results` trong nhánh `upgrade(oldVersion < 2)`; kiểm thử nâng DB thật từ v1.
- Tạo **unique index** `by-session-id` cho result mới; kiểm tra session trong cùng readwrite transaction; tránh để check ở client thay thế ràng buộc lưu trữ.
- Cùng lúc cập nhật MemoryRepository idempotency theo session ID (không chỉ Map theo result ID).
- Giữ các result v1 không có `sessionId`, không phá record cũ hoặc giả gán session từ result ID nếu không có bằng chứng.
- Thực hiện một transaction duy nhất cho result + review + lesson; rollback đầy đủ khi có lỗi; các lời gọi trùng phải không thay đổi counter.

**Tests cần thêm:** `TC-IDEMP-01` cùng sessionId/different resultId, `TC-IDEMP-02` retry sau commit thành công nhưng response lỗi, `TC-IDEMP-03` hai commit song song, `TC-IDEMP-04` IndexedDB v1 -> v2 giữ kết quả cũ. **AC:** mỗi `sessionId` chỉ có tối đa 1 PracticeResult, mọi side effect chỉ xảy ra đúng một lần.

### BUG-P2-002 — Race condition cập nhật ReviewStatus giữa nhiều session/tab

**Priority:** P0 nếu tái hiện mất dữ liệu, còn lại P1 — **Evidence:** RISK-REPRO.  
**Tệp:** `src/domain/practice/complete-practice.ts`, `src/repositories/indexeddb/indexeddb-progress.repository.ts`, `src/domain/review/review-engine.ts`.

**Quan sát:** `completePracticeSession()` đọc toàn bộ `getReviewItems()` trước; sau đó tính `gradeReview()` trên snapshot, cuối cùng `commitPracticeCompletion()` ghi Review trong transaction. Nếu hai tab cùng giải một question, cả hai có thể cùng đọc `wrongCount=2`, mỗi bên tính `3`, rồi lần ghi cuối ghi đè tiến độ của lần còn lại.

**Cách tái hiện:** Khởi tạo review item (`wrongCount=2`), dùng hai repository trên cùng một DB, tạm dừng trước commit của cả hai, cho hai session cùng complete và giải phóng đồng thời; kiểm tra counter. Không kết luận đã mất dữ liệu thực tế trước khi chạy concurrency test.

**Fix:** Chuyển **read current ReviewStatus → calculate updates → write** vào **cùng một transaction**. Đề xuất đổi từ `PracticeCompletionCommand.reviewUpdates` (snapshot đã tính) sang payload chứa các đáp án/attempt events (`questionId`, `correct`, `confidence`, `completedAt`) để repository/domain service thực hiện update dựa trên state mới nhất trong một `readwrite` transaction, hoặc dùng optimistic revision/version với retry khi conflict. Không đẩy rule `gradeReview` vào React component.

**Tests:** `TC-CONC-01` hai commit đồng thời không mất counter; `TC-CONC-02` cùng session không nhân đôi; `TC-CONC-03` transaction rollback khi lưu Review thất bại. **AC:** không có lost update khi nhiều tab tác động một review item.

### BUG-P2-003 — 15 đề Writing không thể chọn trong UI (chỉ hiển thị đề đầu mỗi bài)

**Priority:** P1 — **Evidence:** CONFIRMED-CODE.  
**Tệp:** `src/features/practice/components/WritingPractice.tsx`, `src/domain/learning/lesson.service.ts`.

**Quan sát:** `getLessonWriting(lessonId)` trả mảng nhưng `prompt` luôn là `writingResult.data[0]`. Dù ngân hàng có 30 đề (2/bài), người học chỉ tiếp cận đề đầu, tức **15/30 đề không được chọn thông qua UI hiện tại**.

**Bước tái hiện:** Practice → Writing → chọn Bài 1 → không có selector để đổi `w1` sang `w1_2`.

**Fix:**

1. Thêm state `selectedPromptId` hoặc `promptIndex`; khi đổi lesson, gán prompt đầu tiên có tồn tại.
2. Hiển thị `<select aria-label="Đề viết">` nếu có nhiều đề, label hiển thị `title`.
3. Khi đổi prompt: reset `response`, `showModelAnswer`, `saved`, `selfAssessment`, `error` theo quyết định UX rõ ràng; nếu có draft thì giữ theo `promptId`.
4. Ghi `promptId` cùng với PracticeResult để có thể kiểm tra lịch sử của từng đề; tránh lẫn `w1` và `w1_2`.
5. Empty-state vẫn giữ lesson selector, không gây trang trắng.

**Tests:** chọn Bài 1 → có 2 đề → chọn đề 2 → hiển thị đúng prompt/model answer → lưu result gắn đúng `w1_2`. **AC:** mọi item trong `WRITING_BANK` đều được truy cập qua UI.

### BUG-P2-004 — Vocabulary Review ID chưa ổn định khi thay đổi vị trí từ

**Priority:** P1 — **Evidence:** CONFIRMED-CODE.  
**Tệp:** `src/features/learning/state/use-lesson-flow.ts`, `src/features/learning/components/LessonLearningFlow.tsx`, `src/domain/review/review-content.ts`, `src/data/lessons/*`.

**Quan sát:** Có `getStableVocabularyReviewId(lessonId, krWord)` nhưng `LessonLearningFlow` vẫn gọi `getVocabularyReviewId(lessonId, packIndex, itemIndex)` trong cả Recall và Vocabulary. Thêm/bớt/sắp xếp lại từ có thể làm một ID cũ trỏ sang từ khác.

**Fix:**

- Ưu tiên nội dung có `vocabId` bất biến do tác giả gán. Nếu chưa thêm schema, tạm dùng `lessonId + normalizedKorean + disambiguator` để tránh trùng từ khác nghĩa/ngữ cảnh; **không dùng Korean text làm ID duy nhất khi có duplicate homographs**.
- Áp dụng ID mới đồng bộ cả Recall và Vocabulary.
- Bổ sung migration/remapping cho legacy positional IDs, chỉ chuyển khi đối chiếu chắc chắn từ cũ; orphan không đoán bừa.
- `getReviewPrompt()` phải resolve cả ID cũ và mới trong giai đoạn tương thích; chống duplicate review queue sau migration.

**Tests:** reorder vocab pack không làm mất liên kết; từ giống nhau ở hai ngữ cảnh có ID khác khi cần; legacy data không chuyển sai nghĩa. **AC:** review item luôn truy ra cùng một từ qua các lần cập nhật nội dung.

### BUG-P2-005 — Quiz “Tất cả bài” chọn mãi 10 câu đầu

**Priority:** P1 — **Evidence:** CONFIRMED-CODE.  
**Tệp:** `src/features/practice/components/QuizPractice.tsx`, `src/domain/practice/practice-session.ts`.

**Quan sát:** `startSession()` dùng `availableQuestions.slice(0, 10)`. Sau khi ngân hàng tăng lên 120 câu, người học chọn “Tất cả bài” nhưng nhiều lượt vẫn gặp y hệt 10 câu đầu.

**Fix:** Tạo `selectPracticeQuestions(bank, {mode, lessonId, count, seed, recentQuestionIds})` là pure function; dùng Fisher–Yates với seeded RNG/injected RNG để test, không random trực tiếp trong render. Có thể cân bằng theo lesson và độ khó, hạn chế câu vừa làm nhưng không gây vòng lặp vô hạn khi ngân hàng ít. Giữ option `mistakes` ưu tiên mục sai.

**Tests:** cùng seed -> cùng order; seed khác -> bộ câu khác; không duplicate trong session; bank nhỏ hơn 10 vẫn xử lý; lesson filter tôn trọng `lessonId`. **AC:** nhiều lượt all-lesson không bị đóng cứng ở 10 câu đầu.

### BUG-P2-006 — Bộ lọc “Câu sai” không cập nhật ngay sau khi giải Quiz

**Priority:** P1 — **Evidence:** CONFIRMED-CODE.  
**Tệp:** `src/features/practice/components/QuizPractice.tsx`.

**Quan sát:** `useEffect([repository])` tải `getReviewItems()` một lần. Sau `completePracticeSession()` và `setResult`, `mistakeIds` không được làm mới; ngay trong cùng tab, chọn bộ lọc `Câu sai` có thể thấy dữ liệu cũ cho tới khi component remount.

**Fix:** Đặt `refreshMistakes()` gọi sau mỗi submit thành công và khi chọn filter `mistakes`; hoặc dùng shared review query/store với revision counter. Gắn trạng thái loading khi refresh. Tránh đưa tập review sai vào state không thể đồng bộ giữa các trang.

**Tests:** chọn Quiz All → trả lời sai câu `x` → submit → chuyển filter Mistakes không reload → câu `x` xuất hiện. **AC:** màn luyện câu sai phản ánh kết quả gần nhất của session hiện tại.

### BUG-P2-007 — Accuracy bị trộn với self-assessment Writing

**Priority:** P1 — **Evidence:** CONFIRMED-CODE.  
**Tệp:** `src/features/practice/components/WritingPractice.tsx`, `src/domain/practice/score-practice.ts`, `src/repositories/{indexeddb/indexeddb-progress,memory-progress}.repository.ts`, `src/pages/{HomePage,ProgressPage}.tsx`.

**Quan sát:** Writing tự đánh giá bằng Boolean nhưng `scorePractice()` biến nó thành đúng 1/1 hoặc 0/1, ghi vào `practice_results`. `getCourseProgress()` cộng `correct`/`total` **mọi mode**, nên “Độ chính xác luyện tập” lẫn giữa câu trắc nghiệm chấm tự động và tự đánh giá chủ quan.

**Ví dụ:** 10 câu Quiz đúng 8, người học tự chọn “Đạt” Writing → dashboard hiện `9/11 ≈ 82%` thay vì accuracy objective `8/10 = 80%`.

**Fix:** Dữ liệu phân biệt `assessmentType: 'AUTO_GRADED' | 'SELF_ASSESSED'`; UI Writing lưu `metRequirements` và metadata riêng, không mô phỏng đúng/sai bằng MCQ; `accuracy` chỉ tính lesson/quiz/reading được chấm khách quan. Thêm chỉ số riêng `writingAttempts`/`writingSelfChecks` nếu cần.

**Tests:** 8/10 Quiz + Writing pass -> objective accuracy vẫn 80%; 0 objective + Writing only -> accuracy hiển thị N/A hoặc trạng thái chưa đủ dữ liệu, không khẳng định 100%.

### BUG-P2-008 — Nội dung người học viết không được lưu

**Priority:** P1 — **Evidence:** CONFIRMED-CODE.  
**Tệp:** `src/features/practice/components/WritingPractice.tsx`, `src/domain/practice/practice.types.ts`, `src/repositories/*`, `src/domain/progress/*`.

**Quan sát:** `response` là state của `<textarea>`, nhưng `saveAssessment()` chỉ ghi `answers: { [prompt.id]: metRequirements ? 1 : 0 }`. Khi đổi prompt, đổi tab hoặc reload, bài viết gốc biến mất; không thể xem lịch sử bản viết để tự ôn.

**Fix:** Thêm `WritingAttempt` (`id`, `sessionId`, `promptId`, `lessonId`, `responseText`, `selfAssessment`, `createdAt`, `updatedAt`), lưu bằng IndexedDB hoặc thêm schema result mở rộng được kiểm tra type; tuyệt đối không làm Writing giả MCQ. Thiết kế autosave draft nếu nằm trong scope. Đặt giới hạn chiều dài và cho phép xóa dữ liệu người học. Nếu sản phẩm quyết định **không lưu nội dung**, cần thông báo rõ UI “Bài viết không được lưu” và hạ mục này thành limitation được duyệt, không mô tả là lưu bản viết.

**Tests:** nhập text → save → reload → vẫn đọc đúng text và `promptId`; chuyển qua đề khác không ghi đè; không tiết lộ dữ liệu giữa các browser profile. **AC:** UX ghi chính xác việc lưu dữ liệu thực tế.

### BUG-P2-009 — Tiến độ Lesson không phản ánh bước học thực tế

**Priority:** P1/P2 — **Evidence:** CONFIRMED-CODE.  
**Tệp:** `src/features/learning/state/use-lesson-flow.ts`, `src/features/learning/components/LessonLearningFlow.tsx`, `src/pages/LearnPage.tsx`.

**Quan sát:** Mở Lesson đã set 25%; đánh dấu hoặc đánh giá **một** từ đẩy lên 50%; checklist ngữ pháp hiển thị `✅` không cần thao tác. Người học có thể thấy tiến độ cao hơn phần thực sự đã hoàn thành.

**Fix:** Định nghĩa progress từ các bước có state thực: `opened`, `recallCompleted`, `vocabReviewedCount/total`, `grammarMarkedCount/total`, `quizCompleted`. Tính `completionPercent` từ quy tắc thống nhất (pure function), tránh hardcode ở event handler. Nếu chỉ cần MVP, thay phần trăm bằng nhãn các giai đoạn (`Chưa học / Đang học / Đã luyện xong`) để không đánh lừa.

**Tests:** mở bài không auto đánh dấu Grammar hoàn tất; 1/50 từ không thành 50%; reload giữ bước hoàn thành; quiz completed -> 100% theo định nghĩa được phê duyệt.

### BUG-P2-010 — Degraded storage không phục hồi dữ liệu đã có ở IndexedDB

**Priority:** P1/P2 — **Evidence:** RISK-REPRO / hành vi fallback đã hiện hữu.  
**Tệp:** `src/repositories/resilient-progress.repository.ts`, `src/app/providers/ProgressRepositoryProvider.tsx`, `src/pages/ProgressPage.tsx`.

**Quan sát:** Khi bất kỳ thao tác primary thất bại, wrapper chuyển vĩnh viễn trong phiên sang MemoryRepository mới khởi tạo, không đồng bộ các dữ liệu IndexedDB đã đọc trước đó. UI hiện đã cảnh báo dữ liệu chỉ có trong phiên, nhưng dashboard sau lỗi có thể chỉ phản ánh bộ nhớ rỗng, gây khó hiểu.

**Fix:** Không âm thầm thể hiện “đã lưu lâu dài”. Dùng `StorageStatus` rõ ràng, cảnh báo khi non-durable; tùy scope chọn (A) read-only khi primary lỗi hoặc (B) hydrate snapshot đã tải vào fallback, ghi dirty queue, retry recovery với conflict resolution. **Không tự merge dữ liệu bừa bãi sau recovery**. Thêm trạng thái `recovery pending` và chức năng export nếu user cần bảo toàn học tập.

**Tests:** lưu IndexedDB, giả lập quota failure, cảnh báo vẫn hiển thị; restart browser không tuyên bố dữ liệu memory còn; nếu hydrate, số liệu trước lỗi không bị về 0. **AC:** độ bền dữ liệu được biểu thị đúng và không ghi sai dữ liệu cũ.

### BUG-P2-011 — “Lỗi gần đây” thực tế không sort theo lần sai gần nhất

**Priority:** P2 — **Evidence:** CONFIRMED-CODE.  
**Tệp:** `src/features/review/state/use-review-queue.ts`, `src/domain/review/review-queue.ts`.

**Quan sát:** `items` đã được sort theo `nextReviewAt`; sau đó `items.filter(item => item.wrongCount > 0).slice(0,5)`. Do đó không có bằng chứng các mục hiển thị là 5 lỗi mới nhất. `lastReviewedAt` cũng có thể là lần trả lời đúng, không chắc là lần sai.

**Fix:** Bổ sung `lastWrongAt` trong ReviewStatus, cập nhật khi `correct=false`; migration tương thích các item cũ. `Recent mistakes` sort `lastWrongAt DESC` rồi mới `slice(0,5)`; nếu data cũ không có trường này, hiển thị “Mục từng sai” thay vì khẳng định gần đây.

**Tests:** 5 lỗi có lịch khác nhau nhưng `nextReviewAt` đảo thứ tự → UI vẫn hiển thị theo `lastWrongAt`.

### BUG-P2-012 — Có thể gửi lặp thao tác grade Review

**Priority:** P2 — **Evidence:** CONFIRMED-CODE.  
**Tệp:** `src/components/learning/ReviewQueueItem.tsx`, `src/features/review/state/use-review-queue.ts`.

**Quan sát:** `onGrade()` được gọi không `await`; nút “Lưu kết quả ôn” chỉ disable khi chưa reveal/chưa chọn confidence, không disable khi đang save. Người học có thể click nhiều lần trước khi mục biến mất.

**Fix:** Cho `onGrade` trả `Promise<void>`; quản lý `submitting` trong item/hook, disable toàn bộ controls trong quá trình commit, hiển thị spinner/text; chỉ đóng/hide item khi lưu thành công, báo lỗi và cho retry nếu fail. Repository vẫn cần bảo vệ concurrency ở BUG-P2-002; disable nút không thay thế idempotency.

**Tests:** fake delayed promise + double click → `onGrade` chỉ gọi một lần; lỗi save → nút mở lại, dữ liệu không giả thành công.

### BUG-P2-013 — Mục ôn đến hạn có thể không xuất hiện khi giữ trang mở lâu

**Priority:** P2 — **Evidence:** RISK-REPRO.  
**Tệp:** `src/features/review/state/use-review-queue.ts`.

**Quan sát:** `dueItems` được tính với `new Date()` ở lúc render, không có tick/focus/visibility refresh được khai báo. Nếu mục đến hạn sau 10 phút trong lúc tab Review mở và không có state update khác, queue có thể không tự đổi theo thời gian.

**Fix:** Refresh due queue khi tab/window focus, khi trang quay lại foreground, và/hoặc lên lịch 1 tick đúng mốc sớm nhất (đảm bảo cleanup). Dùng injected `now` cho test deterministic; tránh polling dày. Sync với changes repository nếu grade ở tab khác.

**Tests:** fake timer đi qua `nextReviewAt` trong một tab đang mở → due item xuất hiện mà không cần reload; khi unmount không còn listener/timer.

### BUG-P2-014 — Content validation chưa đồng nhất hoàn toàn với tiêu chuẩn biên soạn

**Priority:** P2 — **Evidence:** QUALITY/GATE.  
**Tệp:** `scripts/validate-content.ts`, `src/data/schemas/legacy.schema.ts`, `docs/content/CONTENT_AUTHORING_GUIDE.md`, `scripts/data-audit.ts`.

**Quan sát:** Guide quy định MCQ “đúng 4 options” nhưng schema và validator cho phép từ 2 options; guide nhắc 2 Reading/lesson, nội dung hiện đã đạt tối thiểu, validator coverage chỉ cảnh báo khi = 0; tính chính xác Hangul/ngữ pháp không thể chứng minh chỉ với Zod.

**Fix:** Tách `structural validation` (CI fail: duplicate, bad index, empty explanation, bad foreign key) khỏi `coverage policy` (CI fail/warn theo phase) và `editorial audit` (review thủ công bởi người biết tiếng Hàn). Chốt chính sách 4 lựa chọn nếu là yêu cầu thật của UI; sửa schema/guide/test nhất quán. Nếu muốn 2 lựa chọn cho True/False thì guide cần mô tả ngoại lệ theo `type`. Dùng `--write-docs` cập nhật coverage trong PR nội dung và kiểm tra diff.

**Tests:** fixture có 3 options, broken references, wrong correctIndex, blank explanation; policy tương ứng fail/warn chính xác. **AC:** script phản ánh đúng quy tắc sản phẩm, nhưng không tuyên bố đã thẩm định chất lượng ngôn ngữ chỉ từ schema.

### GATE-P2-015 — Chưa xác minh chất lượng build, CI và E2E trên HEAD

**Priority:** P0 gate — **Evidence:** QUALITY/GATE.  
**Tệp:** `.github/workflows/ci.yml`, `e2e/app-shell.spec.ts`, `package.json`, test files.

**Quan sát:** Có các job validate và E2E trong workflow nhưng tại thời điểm review không thu được check/run của HEAD qua nguồn đã kiểm tra. Đây **không phải khẳng định CI fail**; thiếu bằng chứng PASS để chấp thuận merge.

**Hành động:** Check Actions trên commit `6b86a8e`; nếu chưa có PR, tạo PR vào `develop` để chạy workflow `pull_request` và lấy log. Trên máy local chạy:

```bash
npm ci
npm run typecheck
npm run lint
npm run format:check
npm test
npm run validate:content
npm run audit:data
npm run build
npx playwright install chromium
npm run test:e2e
```

**AC:** mọi command exit 0, GitHub checks xanh, E2E chạy trên branch/commit cuối cùng sau fix, không phải SHA cũ. Evidence lưu trong PR description (SHA, workflow URL, logs). Chạy mobile viewport 360 / 390 / 430 và thử thao tác bàn phím.

---

## 3. Test Matrix cần bổ sung (tối thiểu)

| Test ID | Cấp | Kịch bản | Expected |
|---|---|---|---|
| TC-IDEMP-01 | Repo unit | Cùng sessionId, result ID khác | 1 result, Review count không tăng lần 2 |
| TC-IDEMP-02 | Integration | Commit đã thành công nhưng UI retry | Không duplicate |
| TC-IDEMP-03 | Integration | Hai commit cùng session song song | 1 commit, không side effect thừa |
| TC-IDEMP-04 | IndexedDB migration | Upgrade v1 → v2, dữ liệu cũ | Không mất practice/review/progress |
| TC-CONC-01 | IndexedDB integration | Hai tab cùng cập nhật 1 review item | Không lost update |
| TC-ATOMIC-01 | IndexedDB integration | Một write bị reject trong transaction | Cả result/review/lesson rollback |
| TC-WRITING-01 | Component | Bài 1 có `w1`, `w1_2` | Chọn và lưu đề 2 được |
| TC-WRITING-02 | Integration | Lưu bài viết và reload | Text + promptId được giữ (nếu đã chọn lưu text) |
| TC-WRITING-03 | Unit | Writing self-assessed | Không cộng vào objective accuracy |
| TC-VOCAB-01 | Unit + migration | Reorder vocabulary | ID vẫn resolve đúng từ |
| TC-VOCAB-02 | Integration | Legacy positional ID | Không trỏ sai từ hoặc nhân đôi |
| TC-QUIZ-01 | Unit | Nhiều seed từ 120 câu | Session đa dạng, không câu trùng |
| TC-QUIZ-02 | Component | Submit sai → filter Mistakes | Sai vừa tạo hiển thị tức thời |
| TC-PROGRESS-01 | Component | Chỉ mở lesson | Không giả đánh dấu Grammar completed |
| TC-REVIEW-01 | Component | Double click Save nhanh | Chỉ một callback ghi dữ liệu |
| TC-REVIEW-02 | Hook fake timer | `nextReviewAt` đi qua hiện tại | Tự nhận diện due item |
| TC-REVIEW-03 | Unit | Recent mistakes khác thứ tự due | Sort theo lastWrongAt |
| TC-STORAGE-01 | Integration | IndexedDB fail lúc đang dùng | Hiện degraded warning, không nhận là persisted |
| TC-CONTENT-01 | Script | Dữ liệu MCQ và reference hỏng | Fail rõ cấu trúc và file vi phạm |
| TC-E2E-01 | Playwright | Lesson → Quiz wrong → Review → Progress → reload | Nhất quán số liệu và storage |

**Chú ý:** `fake-indexeddb` kiểm tra được logic store/transaction ở Node nhưng không thay thế browser E2E. Khi thay DB version phải test migration thực theo đường nâng cấp của browser.

---

## 4. Phân công và thứ tự triển khai cho team 2 người

### Sprint Fix 0 — Integrity gate (P0, bắt buộc trước merge)

**Dev A — Core/Storage:**

1. `BUG-P2-001` hotfix stable result ID + chọn giải pháp session idempotency + IndexedDB migration (nếu áp dụng unique index).
2. Test transactional rollback và retry.
3. Reproduce `BUG-P2-002` multi-tab; nếu fail thì fix transaction/state update.

**Dev B — UI/Learning:**

1. Disable submit khi request Lesson đang chạy; trạng thái lỗi/retry rõ ràng.
2. `BUG-P2-003` bộ chọn Writing.
3. Test DOM/UX và browser smoke.

**QA/Lead:** đánh giá migrations, test dữ liệu cũ, xác nhận P0 + CI xanh.

### Sprint Fix 1 — Correctness & content accessibility (P1)

**Dev A:** `BUG-P2-004`, `BUG-P2-007`, `BUG-P2-008`, tests migration và dashboard accuracy.  
**Dev B:** `BUG-P2-005`, `BUG-P2-006`, `BUG-P2-009`, component/E2E.  
**QA:** kiểm tra toàn bộ 15 lessons, tối thiểu 2 đề Writing/lesson, data consistency qua reload.

### Sprint Fix 2 — Release hardening (P2)

**Dev A:** `BUG-P2-010`, `BUG-P2-011` và rule content.  
**Dev B:** `BUG-P2-012`, `BUG-P2-013` + keyboard/mobile/a11y.  
**QA:** regression + content editorial sampling + release notes.

**Thứ tự PR gợi ý** (tất cả từ HEAD Phase 2, không viết lại Foundation):

```text
fix/phase-2-idempotency-atomicity       -> feature/phase-2-learning-core
fix/phase-2-writing-prompt-navigation  -> feature/phase-2-learning-core
fix/phase-2-review-stable-ids          -> feature/phase-2-learning-core
fix/phase-2-quiz-progress-metrics      -> feature/phase-2-learning-core
fix/phase-2-release-hardening          -> feature/phase-2-learning-core
feature/phase-2-learning-core          -> develop (sau approval)
```

Không mở nhiều PR sửa cùng file `ProgressRepository`/`practice.types` song song khi chưa quyết định contract ID/version; Dev A chốt contract trước, Dev B tích hợp theo contract.

---

## 5. Definition of Done — merge gate

### P0 (bắt buộc)

- [ ] Một `sessionId` không thể tạo nhiều `practice_results`, kể cả retry với `resultId` mới.
- [ ] Việc lưu Result + Review + Lesson là atomic; thất bại một bước không sinh dữ liệu dở dang.
- [ ] Đã kiểm thử concurrency nếu môi trường có multi-tab.
- [ ] Có migration test cho IndexedDB v1 → v2 nếu thay schema.
- [ ] `npm ci`, typecheck, lint, format, unit, validate:content, audit:data, build, Playwright đều PASS.
- [ ] GitHub Actions của **SHA cuối sau fix** xanh; PR review/approval có evidence.

### P1 (khuyến nghị hoàn thành trước v1.0 MVP)

- [ ] Có thể chọn được cả hai đề Writing mỗi bài; dùng đúng `promptId`.
- [ ] Stable review ID không sai khi reorder data, có phương án legacy migration.
- [ ] Bộ lọc Mistakes cập nhật ngay; Quiz không lặp mãi 10 câu đầu.
- [ ] Objective accuracy tách khỏi Writing self-assessment.
- [ ] Thông báo đúng bài Writing có/không được lưu text.
- [ ] Progress/checklist phản ánh trạng thái học thực.

### P2 / Chất lượng

- [ ] Không double-submit Review; queue đến hạn hoạt động khi tab mở lâu.
- [ ] Trạng thái degraded không mập mờ về dữ liệu đã lưu.
- [ ] Recent mistakes đúng ngữ nghĩa; content/schema/guide thống nhất.
- [ ] 15/15 lessons mở được, Quiz/Reading/Writing có empty/error/loading hợp lý.
- [ ] QA duyệt mẫu nội dung tiếng Hàn, cách diễn giải và nguồn học liệu.

### Lệnh kiểm thử cuối

```bash
npm ci && npm run typecheck && npm run lint && npm run format:check
npm test
npm run validate:content
npm run audit:data
npm run build
npm run test:e2e
```

> Không merge chỉ dựa vào “có file test” hoặc README tự ghi “Release Candidate”. Merge khi có dữ liệu kiểm thử tương ứng commit cuối.

---

## 6. Hạn chế ngoài Phase 2 — không ghi thành bug bắt buộc

- **Listening 0/30:** feature chưa triển khai, là backlog sản phẩm sau MVP; không coi là regression Phase 2.
- **Exam:** đang hiển thị “Sắp ra mắt”, đây là chủ ý hiện tại, không mặc định là bug.
- **Quiz 120/180:** đã đạt 8 câu/bài, chưa đạt mục tiêu nội dung dài hạn 12 câu/bài; lên Phase 3/4 tùy roadmap.
- **Writing self-check:** không phải AI grading; không gắn nhãn “chấm bài viết tự động” khi chỉ check keyword/self-assessment.
- **Chưa test tính chính xác ngữ pháp:** content audit chủ yếu xác nhận schema/coverage; cần rà soát chuyên môn tiếng Hàn trước công bố học liệu.

## 7. Evidence tham chiếu

- Commit rà soát: https://github.com/ManhT005/on-tap-tc3/commit/6b86a8e3240df4e6e1870cb22385653e0082df46
- Phase 2 code: https://github.com/ManhT005/on-tap-tc3/tree/feature/phase-2-learning-core
- Kế hoạch trước: `docs/phase_2/ON_TAP_TC3_PROGRESS_AUDIT_AND_COMPLETION_PLAN_2026-10-09.md`
- Content coverage: `docs/content/CONTENT_COVERAGE.md`
- Source entry points: `src/domain/practice/complete-practice.ts`, `src/repositories/indexeddb/indexeddb-progress.repository.ts`, `src/features/practice/components/`, `src/features/learning/`, `src/features/review/`

**Owner cuối:** Tech Lead đánh dấu status từng bug: `OPEN → IN_PROGRESS → FIXED → VERIFIED → CLOSED`; QA chỉ đóng sau khi có failing test trước fix (nếu tái hiện được), passing test sau fix và số commit/PR tương ứng.
