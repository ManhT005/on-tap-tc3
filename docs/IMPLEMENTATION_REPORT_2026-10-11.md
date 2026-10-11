# Bàn giao triển khai — 2026-10-11

Bản triển khai hiện tại là **0.3.0-beta.1**, trên nhánh `feature/completion-integration`. Các hạng mục kỹ thuật đã được triển khai và kiểm thử cục bộ; chưa đạt toàn bộ gate phát hành v1.0 của master plan.

## Kết quả

- P2: IndexedDB v3; receipt chống nộp trùng theo session; review đọc/ghi trong cùng transaction; migration ID bất biến và bảo toàn dữ liệu cũ; checklist tiến độ thực; lỗi storage có thông báo/retry; không tự thay bằng Memory rỗng. Hai tab và double-click có kiểm thử.
- P3: 180 quiz (12/bài), schema bốn lựa chọn phân biệt, evidence Reading; Writing draft và nội dung đã nộp; lịch sử snapshot; backup/restore có validation, giới hạn 10 MiB và kiểm tra thay đổi từ tab khác; reset từng bài/toàn bộ có xác nhận. Tự đánh giá Writing tách khỏi độ chính xác khách quan.
- P4: 30 lời thoại Listening, phát bằng giọng Hàn của trình duyệt; báo rõ khi thiếu giọng/phát lỗi. Exam 30 câu, seed/snapshot, lưu đáp án/cờ/deadline, reload, hết giờ nộp một lần và xem kết quả theo kỹ năng/bài.
- P5: CI Node 24, coverage và Chromium/Firefox, axe/keyboard/mobile, ngân sách bundle, dependency audit, hướng dẫn sử dụng/deploy/rollback và registry duyệt nội dung/nguồn/audio. Bỏ dependency Tailwind không dùng và tách bundle theo route/vendor.

Học liệu gồm 15 bài, 1.085 mục từ, 42 điểm ngữ pháp, 180 quiz, 39 bài đọc, 30 đề viết và 30 lời thoại Listening. Cấu trúc hợp lệ không chứng minh độ chính xác tiếng Hàn hay quyền sử dụng nguồn.

## Kiểm chứng

Chạy trên Windows, Node 24.12.0, Playwright 1.63.0, production build qua Vite preview, hai worker:

| Kiểm tra | Kết quả |
| --- | --- |
| TypeScript / ESLint / Prettier / git diff whitespace | PASS |
| Unit và integration | 144/144; 28 file PASS |
| Coverage domain/repository | Statements 81,86%; branches 75,97%; lines 85,99% |
| E2E Chromium + Firefox | 46/46 PASS; 23 ca mỗi trình duyệt |
| Schema nội dung / manifest | PASS |
| Dependency audit | 0 vulnerabilities |
| Production build / bundle budget | PASS; 19 JS chunks, khoảng 315 KiB gzip tổng |
| Gate `validate:release` | NO-GO: thiếu 15 approval và audio ghi âm cho 15 bài |

Chi tiết và giới hạn: [regression](qa/REGRESSION_REPORT.md), [test matrix](qa/TEST_MATRIX.md), [P2 closure](phase_2/PHASE_2_CLOSURE_REPORT.md).

## Nhánh và review

Đã tạo 10 nhánh cục bộ theo thứ tự phụ thuộc trong [branch tracker](IMPLEMENTATION_BRANCHES_2026-10-11.md). Nhánh tích hợp chứa toàn bộ lịch sử triển khai. Review diff của từng nhánh so với nhánh ngay trước đó. `main`/`develop` chưa được merge; chưa push, mở PR hoặc tạo tag release. Master plan người dùng cung cấp được giữ nguyên.

## Điều kiện còn lại của master plan

1. Người có chuyên môn duyệt 15 bài, toàn bộ đáp án/distractor và xác minh nguồn/quyền sử dụng. Cập nhật [approval tracker](content/CONTENT_APPROVAL_TRACKER.md) và [source registry](content/CONTENT_SOURCE_REGISTRY.md) bằng bằng chứng thực tế.
2. Cung cấp/thu âm 30 audio tiếng Hàn có quyền sử dụng. Hiện **0/30 file ghi âm**; TTS là phương án beta theo phản hồi người dùng chưa có nguồn audio. Kiểm tra phát âm, transcript, đáp án và cập nhật [audio registry](content/LISTENING_AUDIO_REGISTRY.md).
3. Nghiệm thu thủ công, thiết bị thực và screen reader theo [UAT](qa/UAT_SIGNOFF.md). Kiểm thử tự động không ký thay người nghiệm thu.
4. Push/PR để có CI trên remote và cấu hình bảo vệ nhánh. Chọn môi trường hosting, triển khai artifact theo [runbook](release/DEPLOYMENT_RUNBOOK.md), kiểm tra deep link, CSP/cache, Web Vitals và rollback trên production. Chưa có bằng chứng production/remote CI cho HEAD mới.
5. Chỉ sau các bước trên mới merge/tag v1.0.0. Hiện G2 còn review/UAT/remote CI; G3 còn preview được nghiệm thu; G4 còn recorded audio; G5 còn approval/UAT/production.

## Chạy và dùng

Chạy `npm run dev` trong thư mục dự án. Dữ liệu học nằm trên trình duyệt hiện tại; đọc [hướng dẫn người học](USER_GUIDE.md) và xuất backup trước khi xóa dữ liệu hoặc chuyển thiết bị. Bản này chưa có đồng bộ tài khoản hoặc bảo đảm navigation offline hoàn toàn.
