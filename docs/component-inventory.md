# Component Inventory — Phase 0

## Mục tiêu

Danh sách dưới đây mô tả các component cần có trong design system và app shell khi bắt đầu Phase 1. Mỗi item được gắn nhãn ưu tiên để team biết component nào bắt buộc phải có trước.

|   # | Component         | Mục đích                                             | Ưu tiên |
| --: | ----------------- | ---------------------------------------------------- | ------- |
|   1 | AppShell          | Layout tổng của app, header + navigation + main area | P0      |
|   2 | Navigation        | Điều hướng chính theo route                          | P0      |
|   3 | BrandHeader       | Logo / tên app / icon                                | P1      |
|   4 | PageHeader        | Tiêu đề trang, mô tả, action                         | P1      |
|   5 | Card              | Khung nội dung chuẩn                                 | P0      |
|   6 | Button            | Nút hành động chính/phụ                              | P0      |
|   7 | IconButton        | Nút chỉ có icon, dùng trong toolbar                  | P1      |
|   8 | Toast             | Thông báo ngắn / success / error                     | P0      |
|   9 | EmptyState        | Trạng thái rỗng hoặc chưa có dữ liệu                 | P1      |
|  10 | Skeleton          | Loading placeholder                                  | P0      |
|  11 | SectionHeader     | Tiêu đề nhóm nội dung                                | P1      |
|  12 | Tabs              | Chuyển đổi nhóm nội dung trong một màn hình          | P1      |
|  13 | LessonCard        | Card hiển thị bài học                                | P1      |
|  14 | ProgressRing      | Hiển thị tiến độ học / mastery                       | P1      |
|  15 | Flashcard         | Hiển thị từ vựng / recall / reveal                   | P1      |
|  16 | QuizCard          | Một câu hỏi quiz và lựa chọn trả lời                 | P1      |
|  17 | ReadingPassage    | Bài đọc và câu hỏi đi kèm                            | P2      |
|  18 | WritingPromptCard | Prompt và checklist tự chấm                          | P2      |
|  19 | ReviewQueueItem   | Mục trong hàng đợi ôn lại                            | P1      |
|  20 | StatTile          | Thẻ thống kê nhanh                                   | P1      |
|  21 | Modal             | Cửa sổ trọng tâm cho xác nhận / thành công           | P2      |
|  22 | TextField / Input | Ô nhập / form cho viết / tìm kiếm                    | P1      |

## Ưu tiên triển khai Phase 1

Các component bắt buộc phải có trước khi hoạt động học chính thức bắt đầu:

- AppShell
- Navigation
- Card
- Button
- Toast
- Skeleton
- LessonCard
- Flashcard
- QuizCard
- ReviewQueueItem
- StatTile

Đây là nhóm nền tảng để tạo một màn hình học và ôn tập hoàn chỉnh mà không phải đụng lại cấu trúc layout quá nhiều.
