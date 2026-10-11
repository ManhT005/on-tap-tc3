# ON-TAP-TC3 — VOCABULARY LAB & CONTEXTUAL DICTIONARY IMPLEMENTATION PLAN

**Ngày audit:** 2026-10-11 (Asia/Bangkok)  
**Repo:** https://github.com/ManhT005/on-tap-tc3  
**Nhánh đánh giá:** `feature/completion-integration` @ `b79fed32b066c59ac472c92f7bdfeb4dce33fa22`  
**Base:** `feature/phase-2-learning-core` @ `50a4fa788f18e8df1a2593fab49fba68855e0b1f`  
**Loại thay đổi:** Product UX redesign + Vocabulary domain feature + Contextual dictionary, không refactor đại trà Learning Core  
**Ưu tiên:** cao trước khi chốt UX v1; **không đánh đồng** việc CI xanh với việc đã hoàn thành trải nghiệm học từ.

## 0. Kết luận Tech Lead / Product Design

Vấn đề không phải thiếu Flashcard component mà là **tổ chức phiên học** và **chất lượng context**. `LessonLearningFlow.tsx` vẫn render hàng chục `VocabularyCard` thành trang dài. `Flashcard.tsx` chỉ reveal/back/confidence, không có phiên 10–15 từ, điều hướng/âm thanh/câu ví dụ dịch nghĩa. `VocabularyCard.tsx` hiện lấy `item.note`, thường là một **cụm từ gợi ý** chứ không phải câu ví dụ hoàn chỉnh kèm bản dịch. `ListeningPlayer.tsx` đã có speechSynthesis cho `ko-KR`; hãy trích một controller/service dùng chung, không copy logic vào Flashcard. `ReadingPractice.tsx` và `ListeningPractice.tsx` hiển thị đoạn văn plain text nên không có tra từ inline.

**Quyết định:** thêm Vocabulary Lab route riêng, biến Lesson thành entrypoint ngắn gọn; thêm contextual dictionary ở Reading, Listening transcript, thẻ ngữ pháp (sau này). Giữ stable content IDs, IndexedDB v3/session receipts, SRS và transaction hiện tại. Không build backend chỉ để đọc từ / tra từ có sẵn. Không đẩy user vào API bắt buộc hoặc hứa offline khi chưa có đủ assets.

## 1. Evidence thực tế của branch

| Source | Phát hiện | Tác động |
|---|---|---|
| `src/features/learning/components/LessonLearningFlow.tsx` | Sau mục Recall vẫn map tất cả vocabulary packs → `VocabularyCard` | 70–75 thẻ/bài, trang dài và nặng về việc cuộn |
| `src/components/learning/Flashcard.tsx` | Reveal nghĩa + confidence 1–4, không có `audio`, phiên, next, ví dụ tiếng Việt | Có thành phần cơ bản, **chưa là trải nghiệm Flashcard hoàn chỉnh** |
| `src/components/learning/VocabularyCard.tsx` | `front=item.kr`, `back=item.vn`, `example=item.note` | Note thường chỉ là collocation, không có nghĩa của câu mẫu |
| `src/data/schemas/vocabulary.schema.ts` | Schema mở rộng đã khai báo `examples`, `collocations`, `memoryHint`, `difficulty`, `partOfSpeech` | Schema giàu nhưng học liệu đang dùng LegacyVocabularyItemSchema |
| `src/data/lessons/pack.ts` | Tuple `[kr,vn,note,id]` chuyển thành `{id,kr,vn,note}` | Cần adapter/enrichment, tránh rewrite 1.085 mục từ |
| `src/components/learning/ListeningPlayer.tsx` | TTS phụ thuộc danh sách voice Korean của thiết bị; chọn speed, error | Có thể trích speech controller chung; không đảm bảo offline/có ko-KR voice |
| `src/features/practice/components/ReadingPractice.tsx` | Văn bản `<p lang="ko">` và nút dịch toàn đoạn | Chưa có click-to-lookup |
| `src/features/practice/components/ListeningPractice.tsx` | Transcript chỉ hiện sau click `Hiện lời thoại & bản dịch`; `ListeningPlayer` riêng | Tra từ chỉ nên kích hoạt khi transcript **được phép hiện** |
| `src/domain/review/content-identity.ts` | IDs bất biến và mapping ID lịch sử đã có | Bắt buộc giữ nguyên |
| `src/domain/progress/lesson-progress.ts` | Vocabulary đóng góp 40% Lesson, tính bằng stable ID | Phải ghi event theo **từ người dùng thực sự thao tác**, không auto-complete toàn bộ |
| GitHub Actions | Run `38138102529` thành công trên HEAD `b79fed3` | CI hiện xanh, không bao hàm acceptance Vocabulary Lab |

## 2. Product IA / Routes

- Nav chính đề xuất: `Home | Learn | Vocabulary | Review | Practice | Progress` (mobile ưu tiên menu/overflow để không chật). Nếu muốn nav gọn, Vocabulary có thể nằm nhóm `Learn` nhưng **phải là route riêng**, bookmark được.
- `/vocabulary` — trang Vocabulary Lab, mặc định bộ đang học gần nhất.
- `/vocabulary?lesson=1&mode=flashcard` — học một bài; `mode=list|flashcard|recall|context`.
- `/vocabulary?lesson=1&mode=list` — từ điển học liệu dạng bảng/grid gọn, tìm kiếm/filter.
- `/learn/:lessonId` — đổi khối “70 từ” thành `VocabularyStudySummary` (số từ, đã xem/đã nhớ, mục chưa học, nút `Học từ vựng bài này`, xem trước 3–5 từ, có thể xem toàn bộ trong drawer/tab phụ).
- `/review` — dùng lại SRS hiện có; từ khó được thêm vào queue, Review có thể mở card chi tiết qua wordId.
- Reading/Listening có `ContextualVocabulary` hiển thị panel/popover tra từ, không điều hướng khỏi bài trừ khi user chọn.

### Vocabulary Lab — màn hình chính

1. Header: Bài học, mục tiêu, tổng số từ, progress **theo trạng thái thực**, số từ cần ôn.
2. Chọn bộ: `Tất cả | Cơ bản | Từ mới | Từ bài nghe | Từ cần ôn`; trường tìm kiếm Hangul/Vietnamese.
3. Chế độ: `Flashcard` (default) | `Danh sách` | `Nhớ nghĩa (Recall)` | `Học theo ngữ cảnh`.
4. Batch **10 từ mặc định**, cho chọn 5/10/15; ưu tiên chưa học + từ yếu. Không bắt học 72 từ liên tiếp. Lưu phiên sau mỗi hành động.
5. Card front: chữ Hàn **lớn**, nút phát âm (0.75/1/1.25x), category/part-of-speech nếu có; không hiện nghĩa trước khi lật.
6. Card back: nghĩa tiếng Việt, câu Hàn hoàn chỉnh, bản dịch tiếng Việt, highlight từ đích, nút phát câu ví dụ, các collocation đã có, hint nếu được kiểm duyệt.
7. Tự đánh giá 1–4: Không nhớ / Khó nhớ / Nhớ được / Rất chắc; lưu bằng existing `applyReview` có `eventId` ổn định, rồi Next. Cho `Previous` chỉ để xem, tránh ghi chồng event trong cùng attempt.
8. Kết phiên: số từ đã thao tác, quên/khó/nhớ/rất chắc, CTA `Ôn lại từ khó` + `Tiếp tục batch`.
9. Keyboard: Space=flip (khi focus thích hợp); Left/Right điều hướng; 1–4 chỉ grade **sau reveal**, tránh xung đột form/input và screen reader.
10. Mobile: 1 card một lần, nút min 44px, hỗ trợ reduced motion, không ép animation lật 3D.

## 3. Data design — quan trọng nhất

### Không thay thế 1.085 stable IDs / không dùng word text làm PK

Giữ ID `vocab-01-0001`. Xây read-model `VocabularyEntry` kết hợp legacy + enrichment:

```ts
type VocabularyEntry = {
  id: string; lessonId: number;
  korean: string; vietnamese: string;
  source: 'basic' | 'new-word' | 'listening' | 'supplemental';
  category: string;
  partOfSpeech?: string;
  examples: { kr: string; vn: string; targetRange?: [number, number]; reviewStatus: 'pending'|'approved' }[];
  collocations: string[];
  lookupAliases?: string[]; // surface forms hoặc phrase variants được biên tập kiểm tra
  memoryHint?: string;
  sourceRef?: string;
  reviewStatus?: 'pending'|'approved';
};
```

- `src/domain/vocabulary/vocabulary.adapter.ts`: chuyển `{ id,kr,vn,note }` sang canonical entry, giữ `note` trong `collocations` **KHÔNG** coi tự động là một câu đã dịch.
- `src/data/vocabulary-enrichment/lesson-01.ts`...: enrichment theo ID, 1 câu+dịch chuẩn cho các từ batch pilot; mở rộng 15 bài. Cho phép câu ví dụ chia sẻ nội dung được duyệt nhưng vẫn tham chiếu ID từng mục.
- `src/domain/vocabulary/vocabulary-index.ts`: index stable `id`, surface, `lookupAliases`, bài học và cụm nhiều từ. Một từ có nhiều nghĩa cần candidate senses và ngữ cảnh, không lấy nghĩa đầu tiên như chân lý.
- `scripts/validate-vocabulary.ts`: unique IDs, orphan enrichment, duplicate aliases xung đột, example text/translation empty, target range hợp lệ, Hangul/whitespace sanity, sentence QA/rights approval status.
- `docs/content/VOCAB_ENRICHMENT_COVERAGE.md`: report `enriched/1085`, `approved/1085`, `audio asset coverage`, `unresolved contextual tokens`.

**Content QA:** Không tự sinh giả nghĩa/câu mẫu mà coi đã phê duyệt. Ở mức beta, card vẫn hiện nghĩa + `note` với nhãn “Cụm liên quan”; nếu chưa có câu chuẩn, hiển thị “Chưa có câu ví dụ được kiểm duyệt” thay vì tự tạo câu bừa.

## 4. Audio shared service — offline-first có điều kiện

- Trích TTS thành `src/services/audio/korean-speech.service.ts` + `useKoreanSpeech()`; dùng cho Flashcard, ContextPopover, Reading selected phrase, ListeningPlayer, **cùng một playback controller** để không phát chồng hai utterances.
- Adapter preference: `recorded audio asset (nếu có bản quyền và đúng từ)` → `speechSynthesis ko-KR available` → `trạng thái không có giọng + hướng dẫn cài voice`.
- `voiceschanged` / `getVoices()` để cập nhật voices; `utterance.lang='ko-KR'`, `voice.lang` khớp ko, tốc độ 0.75/1/1.25; stop/cancel trên đổi card/unmount. Không giả vờ đọc tiếng Hàn bằng voice Việt/Anh.
- Không autoplay. Có thể TTS 1 từ hoặc 1 câu, khác với nghe bài dài. Giới hạn text length, sanitize plain-text, không inject markup.
- **Không hứa offline hoàn toàn:** browser TTS availability/voice installation khác nhau theo OS; asset audio ghi âm gắn app mới đảm bảo kiểm soát phát âm, nhưng vẫn cần app được cache/offline build. Reuse recorded passages only khi quyền sử dụng rõ.

## 5. Click/tap-to-translate ở Reading & Listening

### UX

- Trong đoạn đọc/transcript đã reveal, từ vựng học liệu được highlight tinh tế (underline nét đứt, không tô cả bài). Desktop hover có hint; click/tap, keyboard Enter/Space mở Popover/side panel.
- Panel hiển thị: surface form đang chọn, lemma/cụm gốc **nếu mapping tin cậy**, nghĩa tiếng Việt, loại từ, câu chứa từ, audio từ/câu, `Lưu để ôn` hoặc `Mở flashcard`.
- Với từ chưa có trong 1.085 mục: cho phép select text hoặc bấm `Tra từ` → search thủ công/từ điển, thông báo “Chưa khớp từ trong học liệu” trước khi tra bên ngoài; không dịch âm thầm câu dài.
- Có toggle `Bật tra từ` để đọc không bị quá nhiều highlight. Trên mobile popover thành bottom sheet.
- Listening ở **practice/exam** phải giữ nguyên quy tắc không hiện transcript/nghĩa trước khi nộp trừ chế độ học/đã reveal; không leak đáp án qua tooltip.

### Matching algorithm (theo lớp, không hứa morphological parser)

1. Match longest known multiword expressions trên text gốc, dùng immutable `vocabId` và offset; không match substrings bừa.
2. Lookup known aliases/surface forms (ví dụ biến thể đã map thủ công với lemma) có kiểm duyệt.
3. `Intl.Segmenter('ko', { granularity: 'word' })` cho word-like spans & highlight fallback — **đây là segmentation, KHÔNG PHẢI lemmatizer**; gặp tiểu từ/đuôi từ/biến âm phải dùng rule/alias verified hoặc dictionary search.
4. Exact/homograph ambiguous → hiển thị nhiều nghĩa hoặc “cần chọn nghĩa”, ưu tiên match theo context bài học nhưng có nhãn.
5. Unknown → manual lookup; optional online dictionary provider, có trạng thái no-network/timeout/quota.
6. Preserve sentence punctuation, whitespace, selection range, keyboard accessibility, React DOM text safety; không chạy regex replace để nhúng raw HTML.

### Nguồn dictionary khả thi

- **Mặc định offline**: index của 1.085 từ nội bộ, không cần API. Cần cẩn thận về chất lượng dữ liệu và từ chưa có.
- **Online tùy chọn**: 한국어기초사전 (Korean Basic Dictionary) Open API cho bản dịch tiếng Việt (`translated=y`, `trans_lang=7`). Có đăng ký API key và điều kiện sử dụng. Không nhúng API key frontend Vite vào bundle; muốn dùng production qua minimal serverless proxy (giới hạn rate, cache, key giữ server) sau khi kiểm tra CORS/licensing. Nguồn chính thức: https://krdict.korean.go.kr/vie/openApi/openApiInfo.
- API từ điển cho **nghĩa từ**, không mặc định là dịch ngữ cảnh toàn câu hoặc phân tích hình thái; muốn dịch whole sentence cần provider riêng, quy định quyền riêng tư, phí và confidence label. Không bắt buộc cho MVP.

## 6. Kiến trúc module đề xuất

```text
src/
  pages/VocabularyPage.tsx
  features/vocabulary/
    components/VocabularyLab.tsx
    components/VocabularyFilters.tsx
    components/StudySession.tsx
    components/VocabularyFlashcard.tsx
    components/VocabularyCatalog.tsx
    components/ContextualVocabulary.tsx
    components/VocabularyDefinitionPopover.tsx
    components/SessionSummary.tsx
    state/use-vocabulary-session.ts
    state/use-vocabulary-lookup.ts
  domain/vocabulary/
    vocabulary.adapter.ts
    vocabulary-index.ts
    session-planner.ts
    contextual-matcher.ts
    vocabulary.types.ts
  services/audio/korean-speech.service.ts
  services/dictionary/dictionary-provider.ts
  services/dictionary/local-vocabulary-provider.ts
  data/vocabulary-enrichment/*.ts
  scripts/validate-vocabulary.ts
```

**Flow:** `page/component → feature state → vocabulary domain → existing ProgressRepository/ReviewEngine`; audio/dictionary là capabilities cắm thêm. Không cho domain import React, browser `window`, hoặc phụ thuộc endpoint online.

## 7. Workstreams/PR cho 2 Dev — có thể chia nhánh rõ

### S0 — Contract Freeze / UX sign-off (P0, 0.5–1 ngày)
**Owner:** Tech Lead + Dev A/B.  
**Branch:** `feature/vocab-00-contract-ux` từ `feature/completion-integration`.
- Chốt navigation, routes, states, content shapes, event semantics, what is vs not a fully-reviewed example.
- Freeze existing stable IDs and repo contracts; không đổi IndexedDB schema trừ khi cần bằng chứng rõ. Draft wireframe được nghiệm thu.
- DoD: UI states và data contract rõ ràng, no duplicate source of truth, test fixtures approved.

### S1 — Vocabulary Lab playable (P0, 2–3 ngày)
**Dev A:** `feature/vocab-01-domain-session` xây adapter/index, pick batch, progress-backed resume, quiz session id stable, domain tests.
**Dev B:** `feature/vocab-02-lab-ui` xây `/vocabulary`, modes Flashcard/Catalog, filter, 10-at-a-time, responsive, keyboard, results.
- Có thể làm song song **sau khi S0 freeze**; Dev B dùng interface mock trước, wiring sau.
- DoD: học 10 từ, reveal/grade/next, reload không mất review đã ghi; catalog không 70 thẻ cùng lúc; query lesson deep link.

### S2 — Korean audio + sentence enrichment pilot (P0/P1, 1–2 ngày)
**Dev A:** `feature/vocab-03-audio-content` shared TTS service, voice detection, fallback, starter enrichment 1–3; content validator.
**Dev B:** kết nối audio controls trên word và example, hiển thị câu+dịch/placeholder.
- DoD: trình duyệt có voice ko-KR phát được từ/câu đúng; không có voice báo rõ; không ảnh hưởng ListeningPlayer; validate missing examples.

### S3 — Context dictionary (P1, 2–3 ngày)
**Dev A:** `feature/vocab-04-lookup-domain`: matcher longest phrase, offsets, aliases, unknown/fallback, ambiguity; unit tests với particle/conjugated forms.
**Dev B:** `feature/vocab-05-context-ui`: hook/use lookup + popover/bottom sheet trong Reading và Listening reveal, save-to-review, keyboard/a11y, no answer reveal during Exam.
- DoD: click đúng từ trong bài đọc/listening, hiểu nghĩa phù hợp hoặc hiển thị unknown trung thực, click lưu tạo ReviewStatus stable đúng ID.

### S4 — Hardening, QA, rollout (P1, 1–2 ngày)
**Branch:** `feature/vocab-06-integration-qa` integrate theo chuỗi S1→S2→S3, PR `feature/vocabulary-lab` → `feature/completion-integration` (hoặc PR theo policy team).  
- Tests: adapter, session, lookup, audio mocks, rejected storage, multi-tab, content QA, E2E Chrome/Firefox/mobile. Bộ demo không tạo dữ liệu tiến độ giả trong app thật.
- Giữ CI hiện tại và bổ sung `validate:vocab` vào pipeline; không xóa test trước đó. Tổng estimate 7–11 **ngày làm việc theo workstream**, có chồng song song 2 dev; thêm thời gian QA học liệu 1.085 từ riêng.

### S5 — Optional nice-to-have (không block v1)
- Memory mnemonics (approved), ảnh minh họa được cấp phép cho từ cụ thể, minimal pairs, shadowing recording với sự đồng ý mic.
- Trình luyện ghép từ ↔ nghĩa, nghe-đoán-từ, fill-in-the-blank theo câu ví dụ verified.
- Dictionary proxy API ko→vi + caching, monitoring, quotas, privacy notice.
- Morphological analyzer nâng cao nếu người dùng thực sự cần tra biến thể bất kỳ.

## 8. QA Matrix phải chứng minh trước merge

| ID | Tình huống | Kết quả mong đợi |
|---|---|---|
| VOC-001 | Vào `/learn/1` | Không render liên tiếp 72 Flashcard; có CTA mở Vocabulary Lab |
| VOC-002 | `/vocabulary?lesson=1` | Lọc đúng bài, batch 10, refresh/deep-link hợp lệ |
| VOC-003 | Flip card | Nghĩa ẩn trước reveal; sau reveal hiển thị meaning + example/verified placeholder |
| VOC-004 | Grade 1,2,3,4 | Một event logical được persist theo immutable ID, không double-grade |
| VOC-005 | Reload giữa batch | Không ghi tiến độ giả; khôi phục session theo contract hoặc resume hợp lý |
| VOC-006 | Voice ko available/absent | Play ko-KR hoạt động hoặc báo rõ; stop khi đổi thẻ |
| VOC-007 | Chuyển Listening TTS → Flashcard TTS | Không phát chồng 2 giọng |
| VOC-008 | Select từ known trong Reading | Đúng lemma/ID, nghĩa ngữ cảnh, có nút lưu |
| VOC-009 | Select unknown/inflected từ | Không gán nghĩa sai; thấy no-match, manual input hoặc proxy optional |
| VOC-010 | Listening chưa reveal | Không có transcript, tooltip, hidden Vietnamese hints làm lộ đáp án |
| VOC-011 | Save word từ context | Sinh đúng Review item; no duplicate persistent items khi thao tác lặp |
| VOC-012 | Offline/no network | Known words/card hoạt động sau khi app đã load; online lookup báo no-network |
| VOC-013 | Storage quota/blocked IDB | Save rõ lỗi, không đánh dấu Done giả, không xóa dữ liệu |
| VOC-014 | 360px/mobile/keyboard | 44px targets, không overflow, focus/aria/popover dismiss đúng |
| VOC-015 | Content enrichment | Unique IDs, nonempty kr+vn, missing/review status report; không nâng coverage bằng content chưa duyệt |
| VOC-016 | Legacy SRS + backup/restore | Không mất review cũ; backup vẫn đọc được, schema change nếu có phải migration + rollback |

## 9. Acceptance release

- [ ] Vocabulary Lab là một khu học tập riêng, đi được từ nav và từ Lesson.
- [ ] Không còn trang lesson với hàng chục từ chạy dài không phân trang/thu gọn.
- [ ] Flashcard 10 từ/phiên, lật nghĩa, pronunciation, câu mẫu + dịch nếu approved, tự đánh giá, next và review.
- [ ] Từ học liệu cũ được dùng theo stable ID; không reset tiến độ người dùng.
- [ ] Reading và Listening transcript sau reveal tra từ inline; chưa tìm được thì báo rõ, không đoán bừa.
- [ ] Audio accessibility/error/fallback được xử lý trung thực, không hứa offline khi không có native Korean voice.
- [ ] No hidden answer leaks, không submit trùng; CI/Playwright green tại SHA cuối.
- [ ] Người kiểm duyệt chuyên môn xác nhận những ví dụ/định nghĩa được đưa vào bản phát hành chính thức.

## 10. References verified 2026-10-11

- Current branch: https://github.com/ManhT005/on-tap-tc3/tree/feature/completion-integration
- CI HEAD: https://github.com/ManhT005/on-tap-tc3/actions/runs/38138102529
- MDN getVoices: https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis/getVoices
- MDN voiceschanged: https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis/voiceschanged_event
- MDN Intl.Segmenter: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter
- Korean Basic Dictionary Vietnamese Open API: https://krdict.korean.go.kr/vie/openApi/openApiInfo
- Korean Basic Dictionary API key and use policy: https://krdict.korean.go.kr/eng/openApi/openApiRegister
