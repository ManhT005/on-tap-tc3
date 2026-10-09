# Hướng dẫn biên soạn học liệu (Content Authoring Guide)

Tài liệu này quy định quy chuẩn, cấu trúc dữ liệu, và quy trình biên soạn học liệu cho dự án **Ôn tập Tiếng Hàn TC3** (`on-tap-tc3`).

---

## 1. Cấu trúc học liệu cho mỗi bài (Lesson Pack)

Mỗi bài học (từ Bài 01 đến Bài 15) bao gồm các thành phần chuẩn sau:

1. **Metadata:** `id`, `title`, `koreanTitle`, `objectives`
2. **Từ vựng (Vocabulary):**
   - Tối thiểu 2 pack (thường là `기본 어휘` và `새 단어 & 읽기 본문`).
   - Mỗi từ gồm tuple: `[kr: string, vn: string, note?: string]`.
   - Trung bình 60–75 từ/bài.
3. **Ngữ pháp (Grammar):**
   - 2–4 cấu trúc ngữ pháp trọng tâm theo giáo trình TC3.
   - Trường: `structure`, `meaning`, `rule`, `examples` (tối thiểu 2 ví dụ có `kr`, `vn`), `commonMistakes`.
4. **Văn hóa (Culture):**
   - Trường: `title`, `content` (thông tin văn hóa Hàn Quốc tương ứng với chủ đề bài học).
5. **Trắc nghiệm (Quiz Bank):**
   - Tối thiểu 8 câu/bài (mục tiêu hoàn thiện 12 câu/bài).
   - Trường: `id` (số nguyên duy nhất), `lessonId`, `type` (`vocabulary` | `grammar`), `question`, `options` (đúng 4 lựa chọn), `correctIndex` (0–3), `explanation` (giải thích chi tiết vì sao đúng và vì sao các đáp án còn lại sai).
6. **Đọc hiểu (Reading Bank):**
   - Tối thiểu 2 bài đọc/bài (`READING_BANK[lessonId]`).
   - Trường: `id`, `title`, `passage`, `vietnameseTranslation`, `questions` (tối thiểu 2 câu hỏi trắc nghiệm/bài đọc kèm `evidence` dẫn chứng).
7. **Tự luận viết (Writing Bank):**
   - Tối thiểu 2 đề viết/bài (`WRITING_BANK`).
   - Trường: `id`, `lessonId`, `title`, `prompt` (tình huống cụ thể), `requiredKeywords` (từ khóa cốt lõi cần có), `modelAnswer` (câu văn mẫu chuẩn ngữ pháp), `explanation` (hướng dẫn vận dụng cấu trúc).

---

## 2. Quy chuẩn đặt ID (Stable Content IDs)

Để đảm bảo hệ thống Spaced Repetition (SRS) và lưu vết tiến độ không bị lệch khi sắp xếp lại bài học:

- **Quiz Questions:** ID số nguyên duy nhất tăng dần (ví dụ `101`, `102`, ... hoặc `401`, `1508`).
- **Reading Passages:** `rp_<lessonId>_<passageIndex>` (ví dụ `rp_1_1`, `rp_14_2`).
- **Reading Questions:** `rq_<lessonId>_<passageIndex>_<questionIndex>` (ví dụ `rq_1_1_1`, `rq_14_2_2`).
- **Writing Prompts:** `w<lessonId>` hoặc `w<lessonId>_<index>` (ví dụ `w1`, `w1_2`, `w15_1`, `w15_2`).
- **Vocabulary Review ID:**
  - Định dạng chuẩn mới: `lesson-<lessonId>-vocab-<encodedKrWord>`
  - Định dạng kế thừa tương thích: `lesson-<lessonId>-vocabulary-<packIndex>-<itemIndex>`
- **Grammar Review ID:**
  - Định dạng chuẩn mới: `lesson-<lessonId>-grammar-<structureOrIndex>`

---

## 3. Tiêu chuẩn chất lượng nội dung

- **Tính chính xác:** Chính tả tiếng Hàn chuẩn (Hangul 맞춤법), ngữ pháp đúng ngữ cảnh giáo trình trung cấp.
- **Tính sư phạm:**
  - Phương án nhiễu (distractor options) trong Quiz phải hợp lý, nhắm vào các lỗi sai phổ biến của người học Việt Nam.
  - Mỗi câu trắc nghiệm bắt buộc phải có `explanation` giải thích rõ lý do.
  - Đề viết (writing) phải có từ khóa gợi ý và câu mẫu tự nhiên.
- **Bản quyền & nguồn gốc:**
  - Không sao chép nguyên văn tài liệu có bản quyền thương mại chưa được cấp phép.
  - Các đoạn văn đọc hiểu và câu hỏi luyện tập do đội ngũ biên soạn tự phát triển theo chủ đề hoặc dựa trên khung năng lực TOPIK II.

---

## 4. Kiểm tra tự động (CI & Content Tooling)

Trước khi commit bất kỳ thay đổi nào về học liệu, tác giả bắt buộc chạy 2 công cụ kiểm tra:

```bash
# 1. Kiểm tra tính toàn vẹn của schema, duplicate IDs, correctIndex, options length
npm run validate:content

# 2. Kiểm tra độ phủ bài học và sinh báo cáo tổng hợp
npm run audit:data
```

Tất cả các kiểm tra phải trả về mã `0` (không có lỗi duplicate, lỗi cú pháp hoặc thiếu bài học).
