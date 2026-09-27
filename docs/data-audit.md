# Data Audit — Phase 0

## 1. Mục tiêu

Bảng dưới đây là audit thực tế từ dữ liệu hiện có trong repo sau khi tách dữ liệu khỏi monolith cũ. Mục tiêu không phải là chốt số liệu hoàn hảo, mà là cung cấp baseline rõ ràng để team xác định phần nào cần bổ sung trong các phase tiếp theo.

## 2. Số liệu thực tế

| Bài | Từ vựng | Ngữ pháp | Quiz (mục tiêu 12) | Reading (mục tiêu 2) | Listening (mục tiêu 2) | Writing (mục tiêu 2) | Culture | Khoảng trống chính                |
| --: | ------: | -------: | -----------------: | -------------------: | ---------------------: | -------------------: | :-----: | --------------------------------- |
|  01 |      72 |        4 |               3/12 |                  5/2 |                    0/2 |                  1/2 |   Có    | Quiz, Listening, Writing          |
|  02 |      70 |        3 |               2/12 |                  5/2 |                    0/2 |                  1/2 |   Có    | Quiz, Listening, Writing          |
|  03 |      70 |        3 |               2/12 |                  5/2 |                    0/2 |                  1/2 |   Có    | Quiz, Listening, Writing          |
|  04 |      73 |        3 |               1/12 |                  0/2 |                    0/2 |                  0/2 |   Có    | Quiz, Reading, Listening, Writing |
|  05 |      75 |        3 |               1/12 |                  0/2 |                    0/2 |                  0/2 |   Có    | Quiz, Reading, Listening, Writing |
|  06 |      74 |        3 |               1/12 |                  0/2 |                    0/2 |                  0/2 |   Có    | Quiz, Reading, Listening, Writing |
|  07 |      72 |        3 |               1/12 |                  0/2 |                    0/2 |                  0/2 |   Có    | Quiz, Reading, Listening, Writing |
|  08 |      72 |        3 |               1/12 |                  0/2 |                    0/2 |                  1/2 |   Có    | Quiz, Reading, Listening, Writing |
|  09 |      72 |        2 |               1/12 |                  0/2 |                    0/2 |                  0/2 |   Có    | Quiz, Reading, Listening, Writing |
|  10 |      72 |        2 |               1/12 |                  0/2 |                    0/2 |                  0/2 |   Có    | Quiz, Reading, Listening, Writing |
|  11 |      72 |        2 |               1/12 |                  0/2 |                    0/2 |                  0/2 |   Có    | Quiz, Reading, Listening, Writing |
|  12 |      72 |        3 |               1/12 |                  0/2 |                    0/2 |                  0/2 |   Có    | Quiz, Reading, Listening, Writing |
|  13 |      74 |        3 |               0/12 |                  0/2 |                    0/2 |                  0/2 |   Có    | Quiz, Reading, Listening, Writing |
|  14 |      73 |        2 |               0/12 |                  0/2 |                    0/2 |                  0/2 |   Có    | Quiz, Reading, Listening, Writing |
|  15 |      72 |        3 |               1/12 |                  0/2 |                    0/2 |                  0/2 |   Có    | Quiz, Reading, Listening, Writing |

## 3. Đánh giá nhanh

- Từ vựng: khá đầy đủ, không phải là điểm cần ưu tiên lớn nhất ở giai đoạn này.
- Ngữ pháp: đã có, nhưng cần chuẩn hóa format và bổ sung drill / mini quiz ở các phase sau.
- Quiz: là khoảng trống lớn nhất. Chỉ 17 câu trên 180 mục tiêu, đạt khoảng 9% so với baseline.
- Reading: nhiều bài thiếu hoàn toàn, mặc dù file gốc có một số passage nhưng chưa đều đặn theo từng bài.
- Listening: chưa có tính năng/nguồn dữ liệu nào tương ứng.
- Writing: rất thiếu; chỉ 4 prompt trên 30 mục tiêu.

## 4. Kết luận cho chiến lược tiếp theo

Phase 1 nên tập trung vào:

1. thiết lập app shell và flow học thực tế;
2. thêm cơ chế giữ progress người dùng;
3. chuẩn hóa quiz / reading / writing bank theo chuẩn mới;
4. xây listening practice sau khi foundation ổn định.

## 5. User story mẫu cho Epic 1

> Là Tech Lead, tôi muốn dữ liệu 15 bài được tách khỏi `App.tsx` và validate được, để Dev có thể bắt đầu build UI mới ở Phase 1 mà không sợ vỡ dữ liệu.

Acceptance Criteria:

- Given dữ liệu đã tách vào `src/data/`,
- When chạy `npm run validate:content`,
- Then không có lỗi cấu trúc cơ bản nào được báo.

- Given có dữ liệu audit theo bài,
- When team review bảng trên,
- Then có thể xác định rõ bài nào cần bổ sung quiz / reading / writing / listening.
