# on-tap-tc3

Ứng dụng ôn tiếng Hàn Trung cấp 3, local-first. Bản hiện tại: **0.3.0-beta.1** — có learning loop, SRS, Quiz/Reading/Writing, Listening bằng giọng thiết bị, Exam và backup. Chưa công bố v1.0: còn duyệt học liệu, audio ghi âm và nghiệm thu production/UAT.

## Chạy ứng dụng

Môi trường đã kiểm thử: Node.js 24, npm, Chromium và Firefox.

```bash
npm ci
npm run dev
```

Production preview:

```bash
npm run build
npm run preview -- --host 127.0.0.1
```

## Chức năng

- 15 bài, 1.085 mục từ, 42 cấu trúc ngữ pháp, 180 quiz, 39 bài đọc, 30 đề viết.
- Vocabulary Lab tại `/vocabulary`: batch 5/10/15 từ, Flashcard, danh sách tìm kiếm/phân trang, Nhớ nghĩa và ngữ cảnh; reload giữ phiên, đánh giá một lần/từ/phiên vào SRS.
- Tra từ nội bộ trong Reading và Listening sau khi hiện lời thoại; nhiều nghĩa được giữ, dạng chưa khớp có tìm thủ công. Bộ phát tiếng Hàn dùng chung tránh phát chồng.
- Checklist thực theo từng bước; reload giữ tiến độ. Nộp quiz riêng chưa hoàn thành toàn bộ bài.
- IndexedDB v3, receipt theo session, atomic review read-modify-write, xử lý hai tab và retry.
- Review tự cập nhật lịch đến hạn; các ID học liệu cố định và có migration từ ID cũ.
- Writing lưu bản nháp/nội dung đã nộp; tự đánh giá được tách khỏi độ chính xác khách quan.
- 30 lời thoại/câu hỏi Listening với giọng Hàn của thiết bị. Không có giọng Hàn thì báo chưa phát được; đây chưa phải bộ 30 file audio đã kiểm định.
- Exam 30 câu: không giới hạn hoặc 30 phút, seed/snapshot, lưu đáp án, reload, tự nộp khi hết giờ, xem kết quả theo kỹ năng/bài.
- Lịch sử, JSON backup/restore có validation và kiểm tra dữ liệu vừa đổi ở tab khác; reset từng bài/toàn bộ có xác nhận.
- Lỗi lưu được báo và có retry. Không tự thay dữ liệu cũ bằng bộ nhớ Memory rỗng.

Dữ liệu nằm trên trình duyệt hiện tại, không tự đồng bộ. Writing không dùng AI grading. Ứng dụng chưa có service worker hay bảo đảm tải lại hoàn toàn offline.

## Kiểm tra

```bash
npm run typecheck
npm run lint
npm run format:check
npm run test:coverage
npm run check:manifest
npm run validate:content
npm run validate:vocab
npm run audit:data -- --write-docs
npm audit --audit-level=high
npm run build
npm run check:bundle
npx playwright install chromium firefox
npm run test:e2e
```

`npm run validate:release` là gate v1.0 bổ sung; hiện chủ động thất bại khi thiếu approval ngôn ngữ/nguồn và audio ghi âm. Không đánh dấu người kiểm duyệt chỉ từ kết quả validator.

Sau khi sửa nội dung, chạy `npm run generate:manifest` và cập nhật coverage. Không đổi ID đã cấp hoặc tái sinh mapping ID v1.

## Tài liệu bàn giao

- [Báo cáo triển khai và các gate còn lại](docs/IMPLEMENTATION_REPORT_2026-10-11.md)
- [Vocabulary Lab: triển khai, nhánh và QA](docs/release/VOCABULARY_LAB_IMPLEMENTATION_REPORT_2026-10-11.md), [enrichment coverage](docs/content/VOCAB_ENRICHMENT_COVERAGE.md)
- [Regression](docs/qa/REGRESSION_REPORT.md), [test matrix](docs/qa/TEST_MATRIX.md), [P2 closure](docs/phase_2/PHASE_2_CLOSURE_REPORT.md)
- [Hướng dẫn người học](docs/USER_GUIDE.md)
- [Kế hoạch nhánh](docs/IMPLEMENTATION_BRANCHES_2026-10-11.md)
- [Master plan](docs/ON_TAP_TC3_COMPLETION_MASTER_PLAN_2026-10-11.md)
- [Kiến trúc](docs/architecture.md), [migration ID](docs/architecture/CONTENT_IDENTITY_MIGRATION.md), [lesson progress](docs/architecture/LESSON_PROGRESS.md), [storage recovery](docs/architecture/STORAGE_RECOVERY.md), [Exam](docs/architecture/EXAM_PERSISTENCE.md)
- [Coverage nội dung](docs/content/CONTENT_COVERAGE.md), [approval tracker](docs/content/CONTENT_APPROVAL_TRACKER.md), [nguồn](docs/content/CONTENT_SOURCE_REGISTRY.md), [audio](docs/content/LISTENING_AUDIO_REGISTRY.md)
- [Backup/migration](docs/release/DATA_MIGRATION_AND_BACKUP.md), [deployment runbook](docs/release/DEPLOYMENT_RUNBOOK.md), [UAT chưa sign-off](docs/qa/UAT_SIGNOFF.md)

CI chạy `validate` và `e2e` trên các nhánh implementation. Báo cáo coverage/browser và artifact build được giữ để review. Cấu hình bảo vệ nhánh và production hosting vẫn cần thiết lập trong môi trường thực tế.
