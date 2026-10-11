# Vocabulary Lab — bàn giao triển khai 2026-10-11

Nhánh bàn giao: **`feature/vocabulary-lab`**. Base `feature/completion-integration` tại `b79fed3`; mã kỹ thuật được kiểm thử tại **`5ea957f`**, sau đó bổ sung tài liệu. Kế hoạch và HTML mockup người dùng cung cấp được commit nguyên bản. Không push, mở PR hay merge vào nhánh base trong phiên này.

## Đã triển khai

- Route `/vocabulary`, navigation và deep link theo bài/mode/ID từ; mặc định bài đang học gần nhất. Lesson giữ bốn thẻ Recall, khối 70–75 từ được thay bằng tóm tắt, preview năm mục và CTA tới Lab.
- Bốn mode: Flashcard, Danh sách, Nhớ nghĩa và Trong ngữ cảnh. Batch mặc định 10, chọn 5/10/15; ưu tiên từ yếu/chưa học, filter nguồn/từ cần ôn, tìm Hangul/Vietnamese/cụm liên quan; catalog tối đa 20 mục/trang.
- Session nằm ở `vocabulary-session:<lessonId>` trong settings của IndexedDB **v3**, không đổi schema/version. Grade, review receipt, SRS và lesson event cùng một transaction. First grade/từ/phiên thắng; Previous/Next chỉ xem. Replay/two-tab không nhân lượt ôn. Reload giữ cursor/grades, không hiện lại nghĩa tự động. Kết phiên có xem lại/ôn từ khó/tiếp tục batch.
- Giữ 1.085 ID bất biến. Adapter dùng note làm “Cụm liên quan”, không biến note thành câu dịch. Có bốn enrichment draft ở Bài 1–3 và pipeline validation/coverage; **0/1.085 câu ví dụ được duyệt**, **0/1.085 audio từ ghi âm**. Alias/câu draft không dùng như dữ liệu đã duyệt.
- TTS và recorded Listening dùng chung playback owner, tránh phát chồng và cleanup của thẻ cũ hủy giọng của thẻ mới. Chỉ voice Korean, không autoplay, giới hạn text, timeout/error/retry, speed 0.75/1/1.25. Chất lượng phát âm và khả năng offline vẫn phụ thuộc thiết bị.
- Reading và Listening transcript đã hiện có toggle tra từ, matcher exact boundary/longest phrase, nhiều nghĩa, panel native dialog và bottom sheet mobile. Unknown/inflected có tìm thủ công trong học liệu; không API, không key frontend, không suy diễn morphology. Bookmark không tạo tiến độ/điểm giả. Exam không mount dictionary UI.
- Backup/restore/reset-one chứa/xác thực phiên typed, reset-one bỏ session của đúng bài. CI thêm `validate:vocab`; tài liệu hướng dẫn và changelog cập nhật.

Giao diện theo cấu trúc mockup (chế độ bên trái, thẻ giữa, thống kê bên phải; mobile xếp dọc), dùng màu/token của ứng dụng hiện tại. [Ảnh mobile kiểm thử](../qa/VOCABULARY_LAB_MOBILE.png).

## Nhánh phụ thuộc

| Thứ tự | Nhánh | Commit |
| --- | --- | --- |
| 1 | `feature/vocab-00-contract-ux` | `d4169d5` |
| 2 | `feature/vocab-01-domain-session` | `4dadc95` |
| 3 | `feature/vocab-02-lab-ui` | `d8d201a` |
| 4 | `feature/vocab-03-audio-content` | `a38d77a` |
| 5 | `feature/vocab-04-lookup-domain` | `59eac09` |
| 6 | `feature/vocab-05-context-ui` | `2d20551` |
| 7 | `feature/vocab-06-integration-qa` | `5ea957f` |
| 8 | `feature/vocabulary-lab` | Documentation commit tại branch tip |

Review từng diff với nhánh liền trước, hoặc aggregate `git diff feature/completion-integration...feature/vocabulary-lab`. Branch tip giai đoạn trước chưa chứa hardening của nhánh sau.

## QA cuối

Windows, Node 24.12.0, Playwright 1.63.0, production build/Vite preview, hai worker.

| Kiểm tra | Kết quả |
| --- | --- |
| Typecheck / lint / format / whitespace | PASS |
| Unit/integration toàn dự án | **159/159**, 33 file PASS |
| E2E toàn dự án | **58/58** PASS, 29 ca/trình duyệt Chromium và Firefox, khoảng 1,3 phút |
| E2E Vocabulary mới | 6 ca × 2 trình duyệt = **12/12** trong full run |
| Coverage domain/repository | Statements 84,30%; branches 78,34%; lines 88,03%; không phải coverage toàn UI/audio |
| `validate:vocab`, manifest, structural content | PASS |
| npm audit | **0 vulnerabilities** |
| Production build và bundle budget | PASS; 23 JS chunks, khoảng **328 KiB gzip** tổng, giới hạn 400 KiB |
| Axe + bàn phím + mobile | PASS màn hình Lab và panel; widths 360/390/430/768, Escape trả focus |

Kiểm thử mới chứng minh: quota retry không đánh dấu Done giả; lỗi late write rollback cả session/lesson/SRS/receipt; hai tab cùng batch và double-click ghi một grade; reload/Previous không grade lại; batch/Recall/summary/catalog; lookup/save đúng ID với mạng bị ngắt sau khi app đã load; unknown form không gán nghĩa; Listening chưa reveal/Exam không mount lookup.

Một lượt E2E mới ban đầu kỳ vọng tìm `등록금` có hai kết quả; dữ liệu thực có ba vì search gồm collocation. Assertion được sửa theo phạm vi search rồi full regression đạt 58/58. Bộ kiểm thử cũ được giữ, chỉ cập nhật kỳ vọng navigation từ năm lên sáu link.

Evidence cục bộ không commit: `coverage/`, `node_modules/.cache/playwright-report/`, `.last-run.json`, traces/screenshots. CI đã cấu hình nhưng chưa có remote run cho SHA mới. S0 UX sign-off và review chuyên môn chưa được ký thay bằng automation.

## Gate còn lại

Phần kỹ thuật Vocabulary Lab đã hoàn tất ở mức beta. Cần người chuyên môn duyệt enrichment/định nghĩa/source, kiểm tra giọng thật và UAT/screen reader/thiết bị thực trước release. Coverage: [enrichment](../content/VOCAB_ENRICHMENT_COVERAGE.md), [contract](../architecture/VOCABULARY_LAB_CONTRACT.md). Các gate v1.0 về 30 recorded Listening audio, source approval và production của master plan vẫn còn.

Optional S5 (proxy dictionary, morphological analyzer tùy ý, microphone, ảnh/nhớ từ AI) chưa triển khai theo phạm vi không block MVP trong kế hoạch. Không hứa dịch toàn câu hoặc chạy offline hoàn toàn.

Tham chiếu kỹ thuật: [MDN getVoices](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis/getVoices) hỗ trợ kiểm tra voice trên thiết bị; [MDN Intl.Segmenter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter) mô tả segmentation, không phải lemmatization.
