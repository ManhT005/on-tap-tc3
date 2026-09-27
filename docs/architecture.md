# Architecture Review — Phase 0

## 1. Mục tiêu Phase 0

Phase 0 tập trung vào việc ổn định nền móng và giảm rủi ro refactor trước khi bắt đầu xây giao diện mới. Bối cảnh hiện tại là một ứng dụng monolithic trong file gốc `ti_ng_h_n_t_ng_h_p_3_game_n_thi_t_ng_t_c.tsx` với dữ liệu, state, logic và UI bị dính chặt trong cùng một component lớn.

Mục tiêu của Phase 0 là:

- tách dữ liệu khỏi UI;
- giữ nguyên nguyên tắc `strangler fig` để app cũ vẫn chạy trong lúc chuyển đổi;
- chuẩn hóa contract dữ liệu bằng Zod;
- có router và shell mới để phục vụ Phase 1;
- có audit thực tế về độ phủ dữ liệu để xác định phần nào còn thiếu;
- đặt ra checklist triển khai rõ ràng cho team.

## 2. Vấn đề hiện trạng

### 2.1. Kiến trúc monolith

File gốc có hơn 4.000 dòng và gom chung:

- dữ liệu bài học;
- bài quiz và reading;
- state của toàn bộ app;
- UI của 9 tab;
- logic chấm và tính điểm;
- mock exam và wrong notebook.

Điều này làm cho PR khó review, khó test, khó bảo trì và khó mở rộng.

### 2.2. Navigation trạng thái ngang hàng

App hiện tại điều hướng bằng `currentTab` thay vì router. Kết quả là nhiều entry xuất hiện cùng cấp và không tạo thành một trải nghiệm học có thứ tự.

### 2.3. Dữ liệu chưa ổn định

Data hiện tại có nhiều nội dung nhưng không có schema runtime thống nhất, nên không thể validate chắc chắn. Phase 0 giải quyết bằng cách:

- giữ dữ liệu cũ trong `legacy/`;
- tạo schema quá độ cho dữ liệu legacy;
- tách data ra `src/data/`;
- kiểm tra duplicate ID, missing lesson coverage và các lỗi cấu trúc cơ bản.

## 3. Kiến trúc mục tiêu

Kiến trúc mới áp dụng mô hình layered architecture như sau:

```text
UI Layer
  -> AppShell + feature screens
  -> Shared UI components

State Layer
  -> route state / feature local state
  -> app progress context

Domain Layer
  -> review engine
  -> mastery logic
  -> exam blueprint
  -> validators

Repository Layer
  -> progress repository interface
  -> localStorage adapter
  -> IndexedDB adapter (future)

Data Layer
  -> lessons/
  -> quiz-bank.ts
  -> reading-bank.ts
  -> writing-bank.ts
  -> schemas/
```

Mục tiêu của mô hình này là giữ UI của màn hình không import trực tiếp dữ liệu thô. Tất cả logic có tính toán đi qua domain/service layer, trong khi UI chỉ dùng data đã được validate.

## 4. Chuyển đổi IA cũ -> IA mới

| Tab cũ         | Khu vực mới     | Ghi chú                                |
| -------------- | --------------- | -------------------------------------- |
| Roadmap        | Home / Overview | Hiển thị tổng quan và tiếp cận học     |
| Learn          | Learn           | Nội dung học bài và kiến thức          |
| Vocab Lab      | Learn + Review  | Từ vựng là nền tảng hỗ trợ Recall      |
| Reading        | Practice        | Đọc hiểu nằm trong hoạt động luyện tập |
| Quiz           | Practice        | Câu hỏi ngắn, luyện tập nhanh          |
| Wrong Notebook | Review          | Ôn lại câu sai theo lịch               |
| Writing        | Practice        | Viết có checklist và mẫu tham khảo     |
| Exam           | Practice        | Thi ngắn / mock, không phải tab riêng  |
| Plan           | Progress        | Kế hoạch học và tiến độ                |

## 5. Kiến trúc router mới

Router hiện tại đã được đổi sang mô hình route phân tầng:

- `/`
- `/learn`
- `/learn/:lessonId`
- `/review`
- `/practice`
- `/progress`

Đây là biến chuyển cần thiết để bỏ hoàn toàn `currentTab` state từ monolith và chuyển sang route-driven navigation.

## 6. Quyết định kỹ thuật chính

### 6.1. Strangler fig

App cũ vẫn được giữ nguyên trong `legacy/` và tiếp tục chạy trong lúc quá trình chuyển đổi. Không có big-bang rewrite.

### 6.2. Local-first persistence

Progress của người học phải đi qua interface repository, không liên trực với UI. Đã chuẩn bị `idb` để có thể triển khai local-first storage sớm.

### 6.3. Data schema runtime

Zod được dùng để validate cấu trúc content và legacy data. Việc này giúp giảm rủi ro khi data bị thiếu hoặc sai shape.

### 6.4. Legacy compatibility layer

Vì dữ liệu cũ không khớp hoàn toàn với schema mới, Phase 0 dùng schema quá độ và giữ lại các field không dùng ngay nhưng có ích cho giải thích / review / content QA. Điều này tránh mất dữ liệu khi đang chuyển đổi.

## 7. Phase 0 kết luận

Phase 0 đã tạo ra nền móng cần thiết để Phase 1 bắt đầu:

- cấu trúc project rõ ràng;
- app shell và router cơ bản đã sẵn sàng;
- dữ liệu đã được tách khỏi component lớn;
- validation statics và audit thực tế đã chạy thành công;
- định hướng design và IA đã được thống nhất.

Những việc còn lại trong Phase 1 là xây UI thật, design system, persistence và review engine, chứ không phải làm lại toàn bộ architecture.
