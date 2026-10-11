# ON-TAP-TC3 — CURRENT STATE AUDIT & COMPLETION DELIVERY PLAN

> **Loại tài liệu:** Technical audit / Tech Lead execution plan / QA acceptance gate  
> **Ngày đánh giá:** 09/10/2026 (Asia/Bangkok)  
> **Repository:** https://github.com/ManhT005/on-tap-tc3  
> **Nguồn kiểm tra:** `main`, `develop`, `feature/phase-2-learning-core`; đối chiếu nội dung mã nguồn GitHub và tài liệu Phase 1–2.  
> **HEAD được kiểm tra của Phase 2:** `71d5e6da05144eb941621a2e37cf6fb4dd6531e1`  
> **Phạm vi:** Đánh giá hiện trạng → đóng Phase 2 → hoàn thiện TC3 15 bài → kiểm thử & phát hành.  
> **Mô hình nhóm đề xuất:** 2 developer; nội dung tiếng Hàn cần người review chuyên môn.  
> **Lưu ý xác minh:** Đây là code review từ repository qua GitHub connector; **chưa chạy trực tiếp `npm`/Playwright trên toàn bộ source**. Trạng thái PASS/FAIL của CI chưa được xác minh; GitHub combined statuses cho HEAD trên trả về danh sách rỗng, không đồng nghĩa với CI xanh.

---

## 0. Executive decision — nên làm gì tiếp?

**Quyết định:** Không viết lại ứng dụng. Tận dụng Learning Core đang có; ưu tiên một nhánh **Phase 2 hardening** để xử lý nhất quán dữ liệu, UX lỗi và test trước khi đưa vào `develop`. Sau đó phát triển **Phase 3 Content & Exam Readiness** và **Phase 4 Release Hardening**.

**Định nghĩa hai mốc hoàn thành, tránh đánh đồng:**

1. **MVP Phase 2:** Người học mở bài 1–3, học từ vựng/ngữ pháp, làm quiz, lưu kết quả, tạo hàng đợi ôn, ôn lại và xem tiến độ sau reload. Tất cả kiểm thử/gate chạy xanh.
2. **TC3 Complete v1:** Cả 15 bài có nội dung thực dụng và đồng đều; bộ luyện tập, theo dõi tiến độ, ôn tập, khả năng sử dụng trên mobile, hướng dẫn sử dụng và deployment ổn định. Listening/AI/cloud sync là **phạm vi mở rộng riêng**, không được ngầm coi là đã hoàn thành.

**Không merge / gắn tag ổn định** chỉ vì phần lớn component đã có hoặc `package.json` đang ghi `1.0.0`.

---

## 1. Repo snapshot — trạng thái có bằng chứng

### 1.1. Mốc các nhánh

| Nhánh | Tình trạng | Bằng chứng/nhận định |
|---|---|---|
| `main` | Nền tảng Phase 0 | HEAD baseline `26bbcbde...`; chưa có thay đổi Phase 1/2 so với nhánh mới. |
| `develop` | Phase 1 tích hợp | Đi trước `main` **19 commit**; có app shell, route/pages, CSS/tokens, test và CI. |
| `feature/phase-1-design-system-app-shell` | Phase 1 feature | `develop` hơn nhánh này 1 commit; file diff rỗng. |
| `feature/phase-2-learning-core` | Triển khai Phase 2, **chưa vào `develop`** | Đi trước `develop` **14 commit**; đã bổ sung domain, repository/IndexedDB, lesson/quiz/review/progress UI và tests. |

> **GitHub:** [main](https://github.com/ManhT005/on-tap-tc3/tree/main) · [develop](https://github.com/ManhT005/on-tap-tc3/tree/develop) · [Phase 2](https://github.com/ManhT005/on-tap-tc3/tree/feature/phase-2-learning-core) · [Phase 2 HEAD](https://github.com/ManhT005/on-tap-tc3/commit/71d5e6da05144eb941621a2e37cf6fb4dd6531e1)

**Nợ quy trình:** Tài liệu Phase 2 viết điều kiện “Phase 1 đã merge vào `main`”, nhưng trạng thái hiện tại là Phase 1 mới tích hợp ở `develop`. Phải thống nhất branch policy: `feature` → `develop` → `main` khi đã đủ gate; không tạo release từ feature.

### 1.2. Inventory chức năng

| Workstream | Code hiện có | Kết luận code review | Hướng xử lý |
|---|---|---|---|
| Phase 0 toolchain | React 19, TS, Vite, Zod, Vitest, Playwright, ESLint, Prettier | **Có** | Chạy xác minh và pin môi trường Node/npm. |
| Design System / App Shell | `src/app`, `src/components/ui`, `src/pages` | **Có** | Regression mobile/keyboard. |
| Routing | `router.tsx`, `LessonPage.tsx` | **Có** | Kiểm deep-link/static host fallback. |
| Learning data access | `domain/learning` | **Có** | Bổ sung tests dữ liệu lỗi và coverage. |
| Lesson flow | `LessonLearningFlow`, `use-lesson-flow` | **Có luồng chính** | Hoàn thành tiêu chí học, loading/error và lưu trạng thái. |
| Quiz/scoring | `domain/practice`, `QuizPractice` | **Có** | Idempotency, chống double submit và atomic save. |
| Reading | `ReadingPractice` | **Có với 3 bài** | Fix empty-state điều hướng, liên kết lessonId. |
| Writing | `WritingPractice` | **Có self-check** | Ràng buộc nội dung nhập, lưu câu trả lời, fix selector. |
| Review scheduling | `domain/review` | **Có** | Kiểm đúng lịch, trùng/thiếu item, orphan refs. |
| Persistence | `IndexedDbProgressRepository`, IndexedDB 4 stores | **Có happy path** | Atomic transition, khôi phục lỗi, migration tests. |
| Dashboard | `HomePage`, `ProgressPage` | **Có dữ liệu repo** | Sửa trạng thái lỗi và chuẩn hóa định nghĩa metric. |
| Automated tests | Unit, repository, component, Playwright scenarios | **Có test source** | Chưa xác nhận pass; tăng coverage failure paths. |
| Full TC3 content | 15 lesson metadata/content modules | **Có khung 15 bài** | Quiz/reading/writing còn mất cân đối. |
| Mock Exam | UI “coming soon” | **Chưa triển khai** | Chỉ mở khi bank đủ. |
| Listening/AI/backend | Không thuộc mục tiêu Phase 2 | **Chưa xác nhận** | Để backlog tùy nhu cầu sau v1. |

### 1.3. Content inventory định lượng (cập nhật sau batch C3 — commit `1d463c0`)

Đếm trực tiếp từ `validate:content` và `audit:data` scripts:

| Bài | Quiz | Reading passages | Writing prompts |
|---:|---:|---:|---:|
| 01 | 8 | 5 | 1 |
| 02 | 8 | 5 | 1 |
| 03 | 8 | 5 | 1 |
| 04 | 8 | 2 | 2 |
| 05 | 8 | 2 | 2 |
| 06 | 8 | 2 | 2 |
| 07 | 8 | 2 | 2 |
| 08 | 8 | 2 | 2 |
| 09 | 8 | 2 | 2 |
| 10 | 8 | 2 | 2 |
| 11 | 8 | 2 | 2 |
| 12 | 8 | 2 | 2 |
| 13 | 8 | 2 | 2 |
| 14 | 8 | 2 | 2 |
| 15 | 8 | 2 | 2 |
| **Tổng** | **120** | **39** | **27** |

> **✅ Trạng thái C3 delivered** (09/10/2026): Tất cả 15 bài đạt `>=8 quiz / >=2 reading / >=2 writing`. Validate: `Content schema valid: 15 lessons, 120 quiz questions, 39 reading passages, 27 writing prompts.`

**Full-content gate hiện trạng:** `>=12 quiz` chưa đạt (8/12 mỗi bài); `>=2 reading / >=2 writing` đã đạt 100%.

**Lưu ý:** `COURSE_STRUCTURE.totalQuestions` đang ghi 5–6 theo nhiều bài; số thực tế trong quiz bank không đồng nhất. Không dùng trường này làm thống kê thật; chuyển sang phép đếm từ content bank hoặc tự sinh trong build.

**Nguồn:** [quiz-bank](https://github.com/ManhT005/on-tap-tc3/blob/feature/phase-2-learning-core/src/data/quiz-bank.ts) · [reading-bank](https://github.com/ManhT005/on-tap-tc3/blob/feature/phase-2-learning-core/src/data/reading-bank.ts) · [writing-bank](https://github.com/ManhT005/on-tap-tc3/blob/feature/phase-2-learning-core/src/data/writing-bank.ts) · [course](https://github.com/ManhT005/on-tap-tc3/blob/feature/phase-2-learning-core/src/data/course.ts)

---

## 2. Findings — backlog sửa lỗi theo mức độ rủi ro

> Các mục dưới đây là **lỗi/rủi ro quan sát từ mã nguồn** chứ chưa phải lỗi đã tái hiện bằng chạy trình duyệt. Dev cần biến mỗi mục thành test tái hiện (repro test) trước khi fix.

| ID | Severity | Phát hiện cụ thể | Tác động | File ưu tiên |
|---|---|---|---|---|
| `P0-01` | **Blocker** | `completePracticeSession` lưu `practice_result`, từng `review_item` và `lesson_progress` bằng các lời gọi tách rời. | Nếu một thao tác sau thất bại, trạng thái có thể lưu nửa chừng; retry dễ ghi/đếm không nhất quán. | `src/domain/practice/complete-practice.ts`, `src/repositories/**` |
| `P0-02` | **High** | Writing/Reading trả nguyên `EmptyState` khi bài được chọn không có data, khiến selector biến mất. | Không đổi được bài trong cùng màn hình nếu chọn bài 4–15 thiếu data; UX bị kẹt. | `WritingPractice.tsx`, `ReadingPractice.tsx` |
| `P0-03` | **High** | `ProgressPage` vẽ skeleton khi `!progress` ngay cả khi có `error`. | Tải thất bại vẫn hiện loading, không có recovery rõ. | `src/pages/ProgressPage.tsx` |
| `P0-04` | **High** | `withMemoryFallback` chuyển sang memory rỗng sau lỗi primary, không mirror/snapshot dữ liệu đã lưu. | Có thể xuất hiện dashboard bằng 0 dù IndexedDB đã có dữ liệu; nguy cơ nhầm trạng thái được lưu lâu dài. | `src/repositories/resilient-progress.repository.ts`, `ProgressRepositoryProvider.tsx` |
| `P0-05` | **High** | Không có bằng chứng CI green cho HEAD; `get_commit_combined_status` trả về mảng rỗng. | Chưa đủ điều kiện merge/release. | `.github/workflows/ci.yml`, GitHub Actions |
| `P1-01` | Medium | Các lệnh submit chưa có khóa trạng thái `submitting` nhất quán; result ID tạo mới mỗi lần gọi. | Double click/promise cạnh tranh có thể ghi nhiều practice result cho 1 session. | `use-lesson-flow.ts`, `QuizPractice.tsx`, `ReadingPractice.tsx` |
| `P1-02` | Medium | Writing `textarea` không bind state, không kiểm rỗng và không lưu câu trả lời người học; có thể tự chấm đạt khi trống. | Dữ liệu kết quả viết không phản ánh bài đã làm. | `WritingPractice.tsx`, practice types/repository |
| `P1-03` | Medium | Reading practice tạo session `mode: reading` nhưng không truyền `lessonId` dù UI đã có bài được chọn. | Khó thống kê/tra cứu lịch sử theo bài. | `ReadingPractice.tsx` |
| `P1-04` | Medium | `vocabularyReviewed`/`grammarReviewed` đếm số review record, không phân biệt marked-vs-actually-reviewed. | Dashboard có thể ghi đã ôn dù chỉ mới đánh dấu cần ôn. | `indexeddb-progress.repository.ts`, `memory-progress.repository.ts` |
| `P1-05` | Medium | `validate-content.ts` mới kiểm duplicate/ref cơ bản; chưa validate MCQ correctIndex, explanation rỗng, reading question, orphan review references đầy đủ. | Dữ liệu hỏng lọt CI; lỗi runtime. | `scripts/validate-content.ts`, schemas |
| `P1-06` | Medium | Review content mapping dựa trên `packIndex/itemIndex` và regex ID. | Reorder vocabulary có thể khiến lịch ôn gắn nhầm từ khác. | `review-content.ts`, `use-lesson-flow.ts`, schema content |
| `P1-07` | Medium | Review UI bỏ qua item không tìm được prompt (`content === null`) nhưng thống kê reviewsDue vẫn có thể đếm. | Số mục đến hạn không khớp danh sách. | `ReviewPage.tsx`, `review-content.ts`, course progress |
| `P1-08` | Medium | Quy tắc hoàn thành lesson hiện phụ thuộc nộp quiz có câu hỏi (`total > 0`), chưa có chuẩn hoàn thành phần learning theo mục tiêu. | Người học có thể bỏ qua recall/vocabulary/grammar nhưng vẫn đạt 100%. | `complete-practice.ts`, `use-lesson-flow.ts` |
| `P2-01` | Low | README vẫn mô tả “hiện tập trung Phase 1”; `package.json` ghi version 1.0.0. | Thông tin trạng thái sản phẩm dễ gây hiểu nhầm. | `README.md`, `package.json` |
| `P2-02` | Low | `scripts/data-audit.ts` gán Listening `0/2` và Culture “Có” dạng hardcoded. | Audit chưa thực sự phản ánh toàn bộ dataset. | `scripts/data-audit.ts` |

### 2.1. Nguyên tắc fix quan trọng

- **Không chỉ catch lỗi rồi cho qua.** Khi lưu bài, kết quả luyện tập/review/lesson progress phải có chiến lược nhất quán dữ liệu.
- **Không làm rơi dữ liệu khi gặp lỗi storage.** Nếu fallback tạm thời, UI phải ghi rõ “dữ liệu phiên”, và không giả vờ đang hiển thị tiến độ đã lưu đầy đủ.
- **Không thêm backend** chỉ để sửa IndexedDB: ứng dụng v1 có thể hoạt động hoàn toàn local-first.
- **Không đổi review ID hàng loạt** nếu chưa có migration cho dữ liệu phiên bản cũ.

---

## 3. Kiến trúc đích cần giữ ổn định

```text
React Router / Pages
      |
      v
Features (learning, practice, review, progress)
      |
      v
Domain Services (pure scoring, review scheduling, lesson access)
      |
      v
Repository interface (ProgressRepository)
      |
      +----------------------------+
      |                            |
IndexedDB (durable)          Memory (degraded session mode)
```

**Architecture rules:**

1. Domain pure functions không import React, DOM hoặc IndexedDB.
2. Page/component không tự thao tác `indexedDB`, `localStorage` để cập nhật dữ liệu nghiệp vụ (ngoại lệ: test helper).
3. Một lệnh hoàn thành practice (`commitPracticeCompletion`) là **một đơn vị nghiệp vụ**; IndexedDB áp dụng transaction nhiều store khi cần.
4. State storage rõ `READY | DEGRADED | FAILED`, kèm khả năng thông báo/cứu hộ, không ẩn lỗi.
5. Content bank đọc tập trung qua lesson service; ID nội dung phải ổn định qua lần chỉnh sửa.
6. Bộ kiểm tra content là gate build độc lập, tách lỗi schema nghiêm trọng khỏi cảnh báo độ phủ.

### 3.1. Gợi ý contract mới (tham khảo, cần điều chỉnh sau test)

```ts
interface PracticeCompletionCommand {
  sessionId: string;                // Khóa idempotency
  result: PracticeResult;
  reviewUpdates: ReviewStatus[];
  lessonProgress?: LessonProgress;
}

interface ProgressRepository {
  // Các phương thức read / save hiện tại vẫn giữ để tránh refactor ồ ạt.
  commitPracticeCompletion(command: PracticeCompletionCommand): Promise<void>;
}
```

**IndexedDB implementation:** `db.transaction(['practice_results', 'review_status', 'lesson_progress'], 'readwrite')`; đặt record kết quả theo **sessionId ổn định** hoặc dùng unique index; kiểm trùng trước ghi và xử lý một cách idempotent. `await tx.done`; lỗi nào cũng rollback toàn transaction. Tính các `reviewUpdates` và lesson progress từ trạng thái phù hợp để không bị race/overwrite.

**Fallback:** memory repository cũng phải triển khai cùng contract; không thể bảo đảm “atomic data” giữa persistent và memory sau khi primary hỏng — nên xác định chế độ nhất quán từ đầu của một lệnh, không ghi nửa chừng trên primary rồi tiếp tục một nửa trên fallback.

---

## 4. Sprint A — Phase 2 Stabilization (P0, bắt buộc trước merge)

**Mục tiêu:** biến feature Phase 2 thành release candidate nội bộ, giữ scope đã có. **Ước tính 4–6 ngày làm việc / 2 dev**, phụ thuộc việc tái hiện lỗi và CI.

### A1. `P0-01` Atomic practice completion + idempotency

**Dev A — files:** `src/domain/practice/complete-practice.ts`, `src/repositories/progress.repository.ts`, `src/repositories/indexeddb/*`, `src/repositories/memory-progress.repository.ts`, các test liên quan.

- [ ] Tạo regression test: `saveReviewItem` fail sau khi result save → không được có trạng thái “result đã xong nhưng review thiếu”.
- [ ] Tạo regression test 2 lệnh nộp đồng thời cho một `session.id` → chỉ ghi một kết quả; review increment một lần.
- [ ] Chuyển domain sang command `commitPracticeCompletion` hoặc use-case orchestration tương đương.
- [ ] IndexedDB transaction xuyên 3 object stores; result key/idempotency ổn định; xử lý rollback.
- [ ] Với memory adapter, bảo đảm cùng semantics khi test.
- [ ] Không cho quiz/lesson/reading tự tính scoring; tiếp tục dùng `scorePractice` pure function.

**Acceptance:** Lỗi giả lập tại mọi điểm ghi không tạo dữ liệu dở dang; reload giữ kết quả chính xác, repeated submission không tăng practice session/review counters.

### A2. `P0-04` Storage health / fallback correctness

**Dev A — files:** `resilient-progress.repository.ts`, `ProgressRepositoryProvider.tsx`, test repository.

- [ ] Định nghĩa storage status `persistent/degraded/unavailable` và surface tới UI.
- [ ] Test primary fail trước lần read đầu và primary fail sau khi ghi thành công.
- [ ] Không hiển thị course progress 0 giả là dữ liệu vĩnh viễn; show warning và recovery CTA.
- [ ] Nếu chọn mirror trong memory, đồng bộ writes thành công vào mirror một cách có kiểm thử; nếu không thể hydrate dữ liệu đã có, ghi rõ dữ liệu không khả dụng.
- [ ] Không tự động đưa dữ liệu ephemeral về IndexedDB khi chưa có chiến lược reconcile.
- [ ] Test IndexedDB open/quota/transaction failure bằng adapter mock phù hợp.

**Acceptance:** Không trắng trang, không mất dữ liệu âm thầm; retry/reload/warning đúng chế độ; các test lỗi giả lập pass.

### A3. `P0-02`, `P0-03` UI reliability

**Dev B — files:** `ReadingPractice.tsx`, `WritingPractice.tsx`, `ProgressPage.tsx`.

- [ ] Luôn giữ bộ chọn Lesson phía trên vùng content/empty/error; chọn bài thiếu content vẫn đổi về bài khác được.
- [ ] ProgressPage ưu tiên `error` trước `loading`, không để skeleton vô hạn.
- [ ] Có button Retry/Reset hợp lý, không refresh toàn bộ app khi không cần.
- [ ] Kiểm responsive 360/390/430px; form và CTA có touch target >=44px.
- [ ] Test component cho “chọn lesson 4 trống → chọn lesson 1 → hoạt động bình thường”.

**Acceptance:** Không có trạng thái người dùng bị mắc kẹt vì thiếu data; lỗi load có thông báo và đường hồi phục.

### A4. `P0-05` CI reliability and merge gate

**2 dev + Reviewer — files:** `.github/workflows/ci.yml`, tests/config.

- [ ] Chạy toàn bộ command ở mục 8 theo thứ tự trên local sạch.
- [ ] Kiểm tra CI cho HEAD mới ở GitHub Actions, cả `validate` và `e2e` phải SUCCESS.
- [ ] Ghi evidence: commit SHA, workflow URL, số tests PASS, artifacts Playwright (nếu có).
- [ ] `npm ci` phải reproducible, không sửa lockfile tùy ý.
- [ ] Merge gate bắt buộc review + CI; không bypass bằng re-run chỉ để xanh nhất thời.

**Acceptance:** PR từ Phase 2 về `develop` chỉ được merge khi all required checks pass và có checklist QA được ký.

---

## 5. Sprint B — Phase 2 Completion & UX (P1)

**Ước tính:** 4–6 ngày làm việc / 2 dev sau Sprint A.

| Task | Owner | Thay đổi | Acceptance |
|---|---|---|---|
| `P1-01` Submit state | Dev B | Disable submit while pending; fixed sessionId; reset errors đúng lúc | Double click không ghi trùng; có loading/error/success rõ. |
| `P1-02` Writing | Dev B + Dev A | Controlled textarea; trim/required; tự kiểm đủ từ khóa với cảnh báo (không giả là AI scoring); lưu response hoặc minimal writing attempt | Không lưu “đạt” với câu trống; restore trạng thái theo quyết định scope. |
| `P1-03` Reading lineage | Dev A | Gắn `lessonId` vào reading session/result | Báo cáo theo bài tìm được lượt reading. |
| `P1-04` Progress metrics | Dev A | Metric `reviewed` chỉ đếm `repetitions > 0`; phân biệt marked/due | Unit tests for marked-only vs reviewed. |
| `P1-05` Content validation | Dev A | Validate `correctIndex`, `options`, explanation, ID/reference; báo lỗi vị trí | Dữ liệu hỏng làm CI fail, coverage thấp warning. |
| `P1-06` Stable content ID | Dev A | Thiết kế ID không theo vị trí mảng hoặc migration có kiểm soát | Reorder vocabulary không chuyển review sang từ khác. |
| `P1-07` Review orphan behavior | Dev A + B | Ẩn có cảnh báo và cleanup/migrate orphan, count thống nhất | Review page/count khớp trên dữ liệu hỏng. |
| `P1-08` Completion rules | Dev B + QA | Thống nhất “viewed/started/completed” và % có ý nghĩa; có thể đặt learning sections là checklist | Không 100% khi chưa thỏa điều kiện đã công bố. |
| `P1-09` A11y practice tabs | Dev B | Keyboard tabs, focus management, alert messages, labels | Keyboard-only complete core learning flow. |
| `P1-10` Docs housekeeping | Dev B | README phase/current setup, release status, content ownership/sources | README đúng với branch/version; không nói v1 stable khi chưa release. |

**Điều kiện close Phase 2:** 15 lesson routes load được không crash; Lessons 1–3 học trọn vòng; 3 chế độ Quiz/Reading/Writing không kẹt navigation; Review/persistence đúng; test gates PASS; issue P0 = 0.

---

## 6. Phase 3 — Hoàn thiện nội dung tiếng Hàn 15 bài

**Quan điểm triển khai:** Nội dung giáo dục là phần quyết định ứng dụng có thực sự hữu ích hay không. Không nên ưu tiên thêm nhiều framework/gameification khi 12 bài còn gần như trống quiz/reading/writing.

### 6.1. Content package cho từng bài

```
Lesson Content Pack
├── Metadata: lesson/topic/objectives
├── Vocabulary: korean/vietnamese/example/note/stableId
├── Grammar: structure/meaning/rule/examples/commonMistakes
├── Quiz: >=12 câu, giải thích đúng + vì sao sai
├── Reading: >=2 bài, có câu hỏi + bằng chứng
├── Writing: >=2 prompt, rubrics/keywords/model answer
└── Content manifest: source/author/review status
```

**Chất lượng cần kiểm:** ngữ pháp đúng, phương án nhiễu hợp lý, chỉ một đáp án đúng, không copy tài liệu có bản quyền không được phép, nguồn học liệu minh bạch, nhất quán thuật ngữ KR–VN. Nếu không có quyền sử dụng lại nguyên văn sách/bài đọc, thay bằng nội dung do nhóm tự biên soạn.

### 6.2. Bốn đợt nội dung

| Batch | Lessons | Deliverables | Trạng thái |
|---|---|---|---|
| `C0` | 1–3 | Kiểm duyệt chất lượng quiz/reading đang có; thêm writing lên 2/bài; validate schema | ✅ **DONE** — commit `22377e8` |
| `C1` | 4–6 | 8 quiz, 2 reading, 2 writing mỗi bài; validate PASS | ✅ **DONE** — commit `22377e8` |
| `C2` | 7–10 | 8 quiz, 2 reading, 2 writing mỗi bài; validate PASS | ✅ **DONE** — commit `cc974ee` |
| `C3` | 11–15 | 8 quiz, 2 reading, 2 writing mỗi bài; validate PASS | ✅ **DONE** — commit `1d463c0` |

**Acceptance batch:** 100% lesson trong batch có schema hợp lệ; quiz ≥8/bài (mục tiêu tối thiểu hiện tại); reading ≥2/bài; writing ≥2/bài; mỗi item có nguồn hoặc trạng thái `original-authored`; bài học không hiện empty state ở mode chính; code review + content review được ghi nhận.

> **Ghi chú:** gate đề xuất ban đầu là `>=12 quiz/bài`. Batch C0–C3 đã đạt `>=8 quiz/bài` và đủ reading/writing cho 100% bài học. Việc tăng lên 12 quiz/bài là mục tiêu nâng cao, thực hiện sau khi Exam blueprint xác định rõ phân phối câu hỏi.

### 6.3. Content tooling

- [ ] Sửa `scripts/data-audit.ts`: đọc count thực tế, xuất Markdown + JSON/CSV nếu tiện; không hardcode “Culture Có”.
- [ ] Thêm `scripts/validate-content.ts` kiểm cross references; explanation; question ID uniqueness; option length; answer index; reading data; writing schema.
- [ ] Tạo `docs/content/CONTENT_AUTHORING_GUIDE.md`: template item, convention stable IDs, guidelines nguồn.
- [ ] Tạo `docs/content/CONTENT_COVERAGE.md` sinh tự động hoặc cập nhật từ script, tránh thống kê thủ công lỗi thời.
- [ ] Test content audit khi thêm/xóa/reorder item.

**Ước lượng:** 2–4 tuần cho 2 dev đồng thời với review nội dung, hoặc lâu hơn nếu tự biên soạn/chỉnh học liệu nhiều. Không ép số câu chỉ để đạt chỉ tiêu; chất lượng là gate bắt buộc.

---

## 7. Phase 4 — Exam readiness, Release & Deploy

### 7.1. Exam MVP (chỉ mở sau Phase 3)

- [ ] Định nghĩa exam blueprint (phân phối bài/kỹ năng, thời lượng, số câu, độ khó).
- [ ] Random/seed deterministic cho test; tránh trùng câu/đáp án lặp không chủ ý.
- [ ] Hỗ trợ làm bài, còn thời gian, submit, tính điểm, review đáp án sau nộp.
- [ ] Không tự động chấm Writing bằng so khớp keywords rồi gọi là đánh giá ngôn ngữ chính xác; nếu chưa có rubric đủ tốt thì dùng self-evaluation.
- [ ] Local exam results nằm trong IndexedDB và hiện ở Progress.

### 7.2. Product polish

- [ ] Export/backup/import học tập (JSON có schema version), kèm test compatibility trước khi thêm migration phức tạp.
- [ ] Hiển thị tình trạng lưu offline/local; hướng dẫn xóa/reset dữ liệu; tránh rò rỉ thông tin không cần thiết.
- [ ] Accessibility: keyboard-only, screen reader labels, responsive 360/390/430/768/1280.
- [ ] Performance: lazy route đã có; đo trên thiết bị phổ thông; lazy-load content lớn nếu cần.
- [ ] Kiểm thử deep link `/learn/15` khi host trên GitHub Pages/Vercel/Netlify hoặc hosting tự quản: phải có SPA fallback.
- [ ] Kiểm thử reload, back/forward, lỗi network (static assets), storage denied, tab duplication.
- [ ] README hướng dẫn user + dev, screenshots và changelog.
- [ ] Gắn tag `v1.0.0` sau gate thật; xem lại `package.json` nếu version đang gây hiểu nhầm.

### 7.3. Những thứ KHÔNG nên tự động đưa vào v1

`backend auth`, đồng bộ đa thiết bị, AI tutor, AI chấm Writing, đăng nhập Google, leaderboard, CMS, TTS/Audio lớn, speech recognition, gamification phức tạp. Chỉ thêm khi có yêu cầu sản phẩm, nguồn lực và bộ test tương ứng.

---

## 8. Verification matrix — lệnh và test case bắt buộc

### 8.1. Local commands (PowerShell / Bash)

```bash
# Checkout chính xác nhánh cần review
git fetch origin
git switch feature/phase-2-learning-core
git pull --ff-only origin feature/phase-2-learning-core

# Dùng Node.js >=20 (theo README; ưu tiên một bản cụ thể có CI parity)
node --version
npm --version
npm ci

# Quality gates
npm run typecheck
npm run lint
npm run format:check
npm test
npm run validate:content
npm run audit:data
npm run build

# Browser tests
npx playwright install chromium
npm run test:e2e
```

**Evidence bắt buộc:** commit SHA, environment (`node --version`, `npm --version`), kết quả từng command, tên test fail, screenshot/trace nếu E2E fail, đường dẫn job CI.

### 8.2. Test matrix

| ID | Level | Scenario | Expected |
|---|---|---|---|
| `TC-01` | E2E | Home → Learn → bài 1 → trả lời quiz → Progress | Kết quả và trạng thái bài lưu đúng. |
| `TC-02` | E2E | Hoàn thành rồi reload tab | Progress/Review vẫn tồn tại. |
| `TC-03` | Integration | Review wrong answer tạo item | `nextReviewAt` và `wrongCount` chính xác. |
| `TC-04` | Unit | Review confidence 1/2/3/4; box 0/5 | Không tràn khoảng, schedule xác định. |
| `TC-05` | Repo | Fail write review sau result | Không partial commit. |
| `TC-06` | Repo | Nộp cùng `sessionId` 2 lần | Chỉ một result, không tăng reviews 2 lần. |
| `TC-07` | Repo | IndexedDB unavailable trước/sau khi ghi | UI degraded state rõ, không data-zero giả. |
| `TC-08` | UI | Writing lesson 4 không có prompt, đổi về 1 | Selector luôn tồn tại, không stuck. |
| `TC-09` | UI | Reading lesson 4 không có passage, đổi về 1 | Selector luôn tồn tại, không stuck. |
| `TC-10` | UI | Writing không nhập gì và đánh giá “Đạt” | Không được lưu “đạt”. |
| `TC-11` | UI | Progress repository reject | Hiển thị error/retry, không skeleton vô hạn. |
| `TC-12` | Unit | Vocabulary mới chỉ marked, chưa reviewed | `vocabularyReviewed` không tăng sai. |
| `TC-13` | Validation | Quiz correctIndex out of range, thiếu explanation | Validator lỗi và CI fail. |
| `TC-14` | Validation | Duplicate QID/reading ID, dangling reference | Validator báo cụ thể file/item. |
| `TC-15` | Regression | Reorder vocabulary của lesson 1 | Review map đúng stable ID / migration. |
| `TC-16` | UI | URL `/learn/999`, `/learn/abc` | Có NotFound, không fallback bài 1. |
| `TC-17` | E2E | Mobile 360/390/430 | Không overflow; CTA khả dụng. |
| `TC-18` | E2E | Chọn cùng question trong quiz, reload/đổi tab | Behavior đúng product spec, không duplicate save. |
| `TC-19` | E2E | Reading đúng/sai + lessonId | Reading result hiển thị đúng trong thống kê bài. |
| `TC-20` | CI/deploy | Deep-link `/learn/15` sau deploy tĩnh | Reload vẫn tải SPA bình thường. |

### 8.3. Definition of Done (strict)

- [ ] P0 issue = 0; P1 issue còn lại có risk acceptance cụ thể và không phá learning loop.
- [ ] Typecheck, lint, format, unit, content validation, data audit, build: **PASS**.
- [ ] Playwright E2E Chromium: **PASS**, không test flaky lặp đi lặp lại.
- [ ] IndexedDB tests thực sự test persistence sau reopen + rollback/failure injection.
- [ ] 15 lesson IDs render hoặc empty state chủ động, không crash.
- [ ] Bài 1–3 end-to-end có test tự động; 15/15 full-content gate trước v1 Complete.
- [ ] Manual QA trên mobile + desktop; accessibility tối thiểu.
- [ ] README/changelog/version/known limitations minh bạch.
- [ ] Review source/license nội dung và assets trước phát hành công khai.
- [ ] PR có reviewer, CI evidence, checklist, không merge trực tiếp feature vào `main`.

---

## 9. Kế hoạch PR và phân công hai dev

**Không chia PR theo từng UI nhỏ đang hoàn thiện; chia theo mốc có thể review độc lập.**

| PR | Branch đề xuất (tạo từ Phase 2 hoặc `develop` theo chiến lược hợp nhất) | Owner | Nội dung | Gate |
|---|---|---|---|---|
| `PR-A` | `fix/phase2-persistence-atomic` | Dev A | Transaction/idempotency/repository tests | Unit + repo failure tests. |
| `PR-B` | `fix/phase2-ui-error-states` | Dev B | Reading/Writing empty, Progress error, submit guard | Component + browser regression. |
| `PR-C` | `fix/phase2-content-metrics` | Dev A/B | Content validation, stable IDs, progress semantics | Content validation + unit. |
| `PR-D` | `test/phase2-final-gates` | QA + 2 dev | E2E, CI, docs, Playwright and mobile evidence | All green; merge Phase 2 → `develop`. |
| `PR-E` | `feature/phase3-content-lessons-04-06` | Dev B/content | Lesson 4–6 content packages | Language/content review. |
| `PR-F` | `feature/phase3-content-lessons-07-10` | Dev B/content | Lesson 7–10 content packages | Language/content review. |
| `PR-G` | `feature/phase3-content-lessons-11-15` | Dev B/content | Lesson 11–15 content packages | Language/content review. |
| `PR-H` | `feature/phase3-exam-mvp` | Dev A | Exam flow after bank coverage | Deterministic unit + E2E. |
| `PR-I` | `release/v1.0.0-rc1` | 2 dev + QA | Bugfix, deploy smoke, docs, license, release | Manual + automated release gates. |

**Git workflow an toàn:**

```bash
# B1: tạo nhánh hardening từ feature Phase 2 để bảo toàn lịch sử công việc
git fetch origin
git switch feature/phase-2-learning-core
git pull --ff-only

git switch -c fix/phase2-persistence-atomic
# ...fix / test / commit / push / PR vào Phase 2 (nếu dùng sub-PR)...

# B2: sau khi hoàn thành tất cả workstream, mở PR:
# feature/phase-2-learning-core  -> develop
# CI green + review + merge

# B3: đồng bộ stable release:
# develop -> main khi release candidate đã qua acceptance
```

Nếu team muốn bớt PR cho repo nhỏ: giữ A/B/C thành các commit reviewable trong `feature/phase-2-learning-core`, chỉ mở một PR Phase 2 → `develop`; **không chạy hai chiến lược merge đồng thời**.

---

## 10. Lịch triển khai đề xuất (tính theo ngày làm việc, không phải deadline cố định)

| Đợt | Ước lượng | Dev A | Dev B | Deliverable |
|---|---:|---|---|---|
| Ngày 1–2 | 2 ngày | Atomic submit design + tests | UX empty/error fixes + tests | PR-A/B draft. |
| Ngày 3–4 | 2 ngày | Storage fallback/metrics | Writing + submit guard | P0 resolved. |
| Ngày 5–6 | 2 ngày | Validation + stable IDs | Mobile + review UX + Playwright | Phase 2 candidate. |
| Ngày 7–8 | 2 ngày | CI, repo tests, bugfix | Full learning loop manual/E2E | Phase 2 → `develop`. |
| Tuần 3–4+ | 2+ tuần | Exam blueprint + tooling, QA | Content batches 1–2 | Content coverage tăng có kiểm soát. |
| Tuần 5–6+ | 2+ tuần | Exam MVP + release tests | Content batch cuối + language audit | v1 RC khi đủ gate. |

**Giới hạn ước lượng:** Tổng thời gian phụ thuộc số lượng câu hỏi phải tự biên soạn và người kiểm duyệt tiếng Hàn. Đây là **ước tính kế hoạch**, không phải cam kết tiến độ hoặc trạng thái đã hoàn thành.

---

## 11. Backlog có thể copy sang GitHub Issues / Project Board

### Ready now — làm theo thứ tự

1. `[P0][BE/Domain] Transactional + idempotent practice completion (TC-05/06)`
2. `[P0][Storage] Degraded mode & recovery semantics (TC-07)`
3. `[P0][UI] Reading/Writing lesson empty state selection (TC-08/09)`
4. `[P0][UI] Progress failure state (TC-11)`
5. `[P0][QA] Verify CI for Phase 2 HEAD and PR gates`
6. `[P1][UX] Writing answer binding, validation, persistence (TC-10)`
7. `[P1][Domain] Fix progress metric definitions (TC-12)`
8. `[P1][Data] Extend content validator and accuracy of data audit (TC-13/14)`
9. `[P1][Data] Stable review IDs / orphan handling (TC-15)`
10. `[P1][QA] Full E2E + accessibility regression`

### After Phase 2 merge

11. ~~`[P1][Content] Validate / improve Lessons 1–3; add to full-course target`~~ ✅ Done (C0)
12. ~~`[P1][Content] Build Lessons 4–6`~~ ✅ Done (C1)
13. ~~`[P1][Content] Build Lessons 7–10`~~ ✅ Done (C2)
14. ~~`[P1][Content] Build Lessons 11–15`~~ ✅ Done (C3)
15. `[P1][Exam] Blueprint, random session, timing, scoring, results`
16. `[P1][Release] Hosting smoke, backup/export, guide, licensing, v1.0.0 release`

---

## 12. Review / sign-off template

```markdown
### PR / Release Review
- Scope: 
- Base/head + commit SHA: 
- Linked issues/TCs: 
- Typecheck: PASS / FAIL / NOT RUN
- Lint/Format: PASS / FAIL / NOT RUN
- Unit/Repository: PASS / FAIL / NOT RUN
- Content validation/audit: PASS / FAIL / NOT RUN
- Build: PASS / FAIL / NOT RUN
- Playwright: PASS / FAIL / NOT RUN
- Manual desktop/mobile: PASS / FAIL / NOT RUN
- Failure injections / rollback tests: PASS / FAIL / NOT RUN
- Known issues / exceptions: 
- Reviewer decision: APPROVE / REQUEST CHANGES
```

---

## 13. Sources used for audit

1. [Phase 2 plan](https://github.com/ManhT005/on-tap-tc3/blob/feature/phase-2-learning-core/docs/phase_2/ON_TAP_TC3_PHASE_2_DEVELOPMENT_PLAN.md)
2. [Phase 1 closeout plan](https://github.com/ManhT005/on-tap-tc3/blob/develop/docs/phase_1/ON_TAP_TC3_PHASE_1_COMPLETION_PLAN.md)
3. [Practice completion](https://github.com/ManhT005/on-tap-tc3/blob/feature/phase-2-learning-core/src/domain/practice/complete-practice.ts)
4. [IndexedDB adapter](https://github.com/ManhT005/on-tap-tc3/blob/feature/phase-2-learning-core/src/repositories/indexeddb/indexeddb-progress.repository.ts)
5. [Memory fallback](https://github.com/ManhT005/on-tap-tc3/blob/feature/phase-2-learning-core/src/repositories/resilient-progress.repository.ts)
6. [Learning hook](https://github.com/ManhT005/on-tap-tc3/blob/feature/phase-2-learning-core/src/features/learning/state/use-lesson-flow.ts)
7. [Review hook](https://github.com/ManhT005/on-tap-tc3/blob/feature/phase-2-learning-core/src/features/review/state/use-review-queue.ts)
8. [Reading UI](https://github.com/ManhT005/on-tap-tc3/blob/feature/phase-2-learning-core/src/features/practice/components/ReadingPractice.tsx)
9. [Writing UI](https://github.com/ManhT005/on-tap-tc3/blob/feature/phase-2-learning-core/src/features/practice/components/WritingPractice.tsx)
10. [Progress UI](https://github.com/ManhT005/on-tap-tc3/blob/feature/phase-2-learning-core/src/pages/ProgressPage.tsx)
11. [CI workflow](https://github.com/ManhT005/on-tap-tc3/blob/feature/phase-2-learning-core/.github/workflows/ci.yml)
12. [Playwright E2E](https://github.com/ManhT005/on-tap-tc3/blob/feature/phase-2-learning-core/e2e/app-shell.spec.ts)
13. [Content validator](https://github.com/ManhT005/on-tap-tc3/blob/feature/phase-2-learning-core/scripts/validate-content.ts)
14. [Content data audit script](https://github.com/ManhT005/on-tap-tc3/blob/feature/phase-2-learning-core/scripts/data-audit.ts)

---

**Recommended next action (cập nhật 09/10/2026):**

- ✅ Sprint A (P0-01–P0-04): **DONE** — commits `a0c3a42`, `0d3ad8e`, `f9f1226`
- ✅ Sprint B P1-01–P1-05, P1-10, P2-01: **DONE** — commits `23c9fd9`, `ae516fb`, `c90a473`, `ad23287`
- ✅ Content Batches C0–C3 (15/15 bài): **DONE** — commits `22377e8`, `cc974ee`, `1d463c0`
- ⏳ **Tiếp theo:** Viết thêm quiz để đạt ≥12/bài; Exam MVP (Phase 4 — PR-H); Release v1.0.0-rc1 (PR-I).
