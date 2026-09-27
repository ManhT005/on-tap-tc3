import { LegacyQuizItemSchema } from './schemas';

const raw = [
  // BÀI 01
  {
    id: 101,
    lessonId: 1,
    type: 'understanding',
    question: 'Chọn câu ĐÚNG ngữ pháp theo quy tắc sử dụng của cấu trúc "밖에":',
    options: [
      '교실에 학생이 세 명밖에 있어요.',
      '시험 시간이 5분밖에 안 남았어요.',
      '시간이 없으니까 조금밖에 먹으세요.',
      '우리 같이 한 과목밖에 공부하자.',
    ],
    correctIndex: 1,
    explanation:
      '"밖에" biểu thị sự lựa chọn duy nhất và BẮT BUỘC phải đi với vị từ phủ định (안 남았다, 없다, 못 하다...).',
    whyWrong:
      'Câu A dùng vị từ khẳng định (있어요). Câu C và D dùng mệnh lệnh (먹으세요) và rủ rê (공부하자) - "밖에" tuyệt đối không kết hợp với các đuôi câu này.',
    concept: 'Ngữ pháp Danh từ + 밖에',
    keyword: '안 남았어요 (Vị từ phủ định)',
    source: 'Giáo trình Tiếng Hàn Tổng Hợp 3 - Bài 01: Trang 19',
  },
  {
    id: 102,
    lessonId: 1,
    type: 'recognition',
    question:
      'Theo phần Từ vựng sự kiện trường học: Hoạt động "신입생에게 학교 수업과 대학 생활을 안내하는 것" là gì?',
    options: ['신입생 환영회', '오리엔테이션', '졸업생 환송회', '사은회'],
    correctIndex: 1,
    explanation:
      '오리엔테이션 (OT/Buổi định hướng) là hoạt động hướng dẫn cho sinh viên mới về lớp học và đời sống đại học.',
    whyWrong: '신입생 환영회 là tiệc chào đón tân sinh viên; 사은회 là lễ tri ân thầy cô.',
    concept: 'Từ vựng sự kiện trường học (학교 행사)',
    keyword: '안내하는 것 (Hoạt động hướng dẫn)',
    source: 'Giáo trình Tiếng Hàn Tổng Hợp 3 - Bài 01: Trang 24',
  },
  {
    id: 103,
    lessonId: 1,
    type: 'understanding',
    question:
      'Theo nội dung phần Văn hóa Bài 1, sinh viên đại học 4 năm ở Hàn Quốc để nhận bằng cử nhân cần tích lũy tối thiểu bao nhiêu tín chỉ chuyên ngành?',
    options: [
      'Tối thiểu 30 tín chỉ trong tổng số 120 tín chỉ',
      'Tối thiểu 45 tín chỉ trong tổng số 140 tín chỉ',
      'Tối thiểu 50 tín chỉ trong tổng số 150 tín chỉ',
      'Tối thiểu 60 tín chỉ trong tổng số 130 tín chỉ',
    ],
    correctIndex: 1,
    explanation:
      'Giáo trình nêu rõ: Sinh viên đại học 4 năm cần tối thiểu 45 tín chỉ chuyên ngành trong tổng số khoảng 140 tín chỉ để nhận bằng cử nhân (학사 학위).',
    whyWrong: 'Các đáp án còn lại sai lệch so với dữ liệu sách giáo khoa.',
    concept: 'Văn hóa: Chế độ đại học Hàn Quốc (한국의 대학 제도)',
    keyword: '최소 45학점 내외, 총 140학점',
    source: 'Giáo trình Tiếng Hàn Tổng Hợp 3 - Bài 01: 문화 (Trang 33)',
  },

  // BÀI 02
  {
    id: 201,
    lessonId: 2,
    type: 'understanding',
    question: 'Chọn câu sử dụng SAI theo quy tắc phân biệt "덕분에" và "때문에" trong hộp TIPS:',
    options: [
      '선생님이 잘 가르쳐 주신 덕분에 한국 회사에 취직할 수 있었어요.',
      '친구 덕분에 숙제를 못 했어요.',
      '비 때문에 약속 시간에 늦었어요.',
      '부모님 염려 덕분에 건강하게 잘 지냅니다.',
    ],
    correctIndex: 1,
    explanation:
      'Hộp TIPS giáo trình ghi rõ: "덕분에" chỉ dùng cho kết quả TỐT. "숙제를 못 했다" là kết quả tiêu cực nên bắt buộc phải dùng "친구 때문에".',
    whyWrong: 'Câu B vi phạm nguyên tắc sử dụng 덕분에.',
    concept: 'Phân biệt 덕분에 và 때문에',
    keyword: '숙제를 못 했어요 (Kết quả tiêu cực)',
    source: 'Giáo trình Bài 02: TIPS 덕분에와 때문에 (Trang 37)',
  },
  {
    id: 202,
    lessonId: 2,
    type: 'application',
    question:
      'Biến đổi động từ "개강하다" ở câu "한국의 대학교는 몇 월에 개강을 합니까?" sang đuôi câu hỏi lịch sự "-나요/-(으)ㄴ가요?":',
    options: ['개강을 한가요?', '개강을 하나요?', '개강을 할까요?', '개강을 한 건가요?'],
    correctIndex: 1,
    explanation:
      'Với động từ ở thì hiện tại (개강하다), ta kết hợp với "-나요?" → "개강을 하나요?". Đuôi -(으)ㄴ가요 chỉ dùng cho tính từ ở hiện tại.',
    whyWrong: '한가요 là sai quy tắc chia động từ.',
    concept: 'Ngữ pháp -나요 / -(으)ㄴ가요?',
    keyword: '개강하다 (Động từ)',
    source: 'Sách bài tập Bài 02: 문법 -나요 (Trang 22)',
  },

  // BÀI 03
  {
    id: 301,
    lessonId: 3,
    type: 'recognition',
    question:
      'Chiến dịch khuyến khích sức khỏe "Sports 7330" của Hàn Quốc có ý nghĩa chính xác là gì?',
    options: [
      'Một tuần tập thể dục 7 lần, mỗi lần 30 phút, duy trì trong 30 ngày',
      'Một tuần tập thể dục 3 lần trở lên, mỗi ngày 30 phút',
      'Mỗi ngày đi bộ 7.000 bước và uống 3 lít nước trong 30 ngày',
      'Một tháng tập 7 ngày, mỗi ngày 3 tiếng và nghỉ ngơi 30 phút',
    ],
    correctIndex: 1,
    explanation:
      'Poster giáo trình ghi rõ: "Sports 7330" nghĩa là: 일주일에 세 번 이상, 하루 30분 운동 (Mỗi tuần từ 3 lần trở lên, mỗi ngày 30 phút).',
    whyWrong: 'Các phương án khác tự suy diễn sai lệch con số 7330.',
    concept: 'Văn hóa sức khỏe Hàn Quốc',
    keyword: '일주일에 세 번 이상, 하루 30분',
    source: 'Giáo trình Bài 03: Đọc hiểu & Poster (Trang 54)',
  },
  {
    id: 302,
    lessonId: 3,
    type: 'application',
    question:
      'Hoàn thành câu khuyên bảo trong sách bài tập: "감기 때문에 머리가 아프고 열도 나요. → 얼른 병원에 __________."',
    options: ['가는 게 좋겠어요', '가는 길이에요', '가게 됐어요', '가기로 했어요'],
    correctIndex: 0,
    explanation: '-는 게 좋다 dùng để đưa ra lời khuyên hoặc gợi ý hữu ích cho người bệnh.',
    whyWrong: '가는 길이에요 là đang trên đường đi; 가게 됐어요 là tình thế bị/được đưa đến.',
    concept: 'Ngữ pháp -는 게 좋다',
    keyword: '얼른 병원에 (Lời khuyên mau chóng đi khám)',
    source: 'Sách bài tập Bài 03: 문법 (Trang 31)',
  },

  // BÀI 04
  {
    id: 401,
    lessonId: 4,
    type: 'understanding',
    question:
      'Theo bài tập đọc hiểu về thủ tục mua sắm hàng hóa, khi muốn đổi hàng (교환) hoặc hoàn tiền (환불), điều kiện bắt buộc là gì?',
    options: [
      'Chỉ cần mang theo chứng minh thư nhân dân',
      'Phải có hóa đơn (영수증) và hàng hóa còn nguyên vẹn nhãn mác',
      'Bắt buộc phải trả bằng tiền mặt',
      'Chỉ được đổi trả tại trung tâm thương mại lớn',
    ],
    correctIndex: 1,
    explanation:
      'Tài liệu nhấn mạnh: 영수증이나 상표가 없으면 교환이나 환불을 할 수 없습니다 (Nếu không có hóa đơn hoặc nhãn mác thì không thể đổi trả).',
    whyWrong: 'Không có hóa đơn thì không thể thực hiện đổi trả theo quy định.',
    concept: 'Từ vựng & Quy tắc đổi trả hàng hóa',
    keyword: '영수증, 상표 (Hóa đơn, nhãn mác)',
    source: 'Giáo trình Bài 04: 듣기 & 읽기 (Trang 78)',
  },

  // BÀI 05
  {
    id: 501,
    lessonId: 5,
    type: 'application',
    question: 'Hoàn thành câu nói về quy trình làm món ăn: "쇠고기를 (     ) 채소를 넣으세요."',
    options: ['볶고 나서', '볶는 동안', '볶으려면', '볶다가'],
    correctIndex: 0,
    explanation:
      '-고 나서 nhấn mạnh hành động xào thịt bò phải hoàn tất trọn vẹn rồi mới cho rau củ vào.',
    whyWrong:
      '-다가 chỉ hành động đang dở dang đã bỏ giữa chừng; -는 동안 chỉ 2 hành động song song.',
    concept: 'Ngữ pháp -고 나서',
    keyword: '볶고 나서 (Xong xuôi rồi mới làm tiếp)',
    source: 'Giáo trình Bài 05: 기본 문법 (Trang 93)',
  },

  // BÀI 06
  {
    id: 601,
    lessonId: 6,
    type: 'application',
    question:
      'Điền cấu trúc phù hợp vào lời khuyên: "요금 내는 날짜를 잊어버리기 (     ) 자동이체를 신청하세요."',
    options: ['쉬우니까', '어려우니까', '쉬는 동안', '쉽게 되니까'],
    correctIndex: 0,
    explanation: '-기 쉽다 có nghĩa là "dễ bị...", ở đây là "rất dễ quên ngày thanh toán".',
    whyWrong: 'Cấu trúc chuẩn trong bài học là 잊어버리기 쉽다.',
    concept: 'Ngữ pháp -기 쉽다',
    keyword: '잊어버리기 쉽다 (Rất dễ quên)',
    source: 'Giáo trình & Sách bài tập Bài 06: Phụ lục đáp án (Trang 307)',
  },

  // BÀI 07
  {
    id: 701,
    lessonId: 7,
    type: 'recognition',
    question: 'Thành ngữ quán dụng biểu hiện người "giữ bí mật tốt, kín miệng" trong tiếng Hàn là:',
    options: ['발이 넓다', '입이 무겁다', '콧대가 높다', '눈이 높다'],
    correctIndex: 1,
    explanation:
      '입이 무겁다 (miệng nặng) = kín miệng, biết giữ bí mật. Ngược lại 입이 가볍다 là người ba hoa, hay lộ bí mật.',
    whyWrong: '발이 넓다 là quen biết rộng; 콧대가 높다 là kiêu ngạo; 눈이 높다 là kén chọn.',
    concept: 'Thành ngữ miêu tả tính cách (성격 관용구)',
    keyword: '비밀을 잘 지키다 = 입이 무겁다',
    source: 'Giáo trình Bài 07: 기본 어휘 (Trang 126)',
  },

  // BÀI 08
  {
    id: 801,
    lessonId: 8,
    type: 'application',
    question:
      'Điền ngữ pháp chuẩn cho câu trần thuật sự cố tiêu cực ngoài ý muốn: "알람 시계가 고장 (     ) 늦잠을 잤어요."',
    options: ['나는 바람에', '나도록', '나는 길에', '나기 때문에'],
    correctIndex: 0,
    explanation:
      '-는 바람에 diễn tả nguyên nhân đột ngột ngoài dự kiến dẫn đến hậu quả xấu ngoài ý muốn (ngủ quên).',
    whyWrong: '-도록 thể hiện mục đích/sai khiến; -는 길에 chỉ hành động khi đang trên đường.',
    concept: 'Ngữ pháp -는 바람에',
    keyword: '늦잠을 잤어요 (Hậu quả tiêu cực ngoài ý muốn)',
    source: 'Giáo trình Bài 08: 말하기 & 문법 (Trang 145)',
  },

  // BÀI 09
  {
    id: 901,
    lessonId: 9,
    type: 'recognition',
    question:
      'Theo phong tục tiệc tân gia (집들이) của người Hàn Quốc, việc tặng "세제" (bột giặt/chất tẩy rửa) mang ngụ ý gì?',
    options: [
      'Nhắc nhở gia chủ phải dọn dẹp nhà cửa thường xuyên',
      'Chúc cho gia đình phát tài phát lộc, tiền tài sinh sôi nảy nở như bọt xà phòng',
      'Chúc cho mọi việc trôi chảy như cuộn giấy',
      'Biểu thị việc xua đuổi tà khí trong nhà mới',
    ],
    correctIndex: 1,
    explanation:
      'Giáo trình giải thích: 거품이 생기는 것처럼 큰 부자가 되라는 뜻 (Chúc gia chủ phát tài như bọt xà phòng).',
    whyWrong: 'Ý nghĩa chúc trôi chảy là của giấy vệ sinh (휴지).',
    concept: 'Văn hóa quà tặng tiệc tân gia (집들이 선물)',
    keyword: '거품, 큰 부자가 되다 (Bọt xà phòng, phát tài)',
    source: 'Giáo trình Bài 09: CD Track 39 (Trang 170)',
  },

  // BÀI 10
  {
    id: 1001,
    lessonId: 10,
    type: 'application',
    question:
      'Chuyển câu hỏi "비행기 표를 예약했어요?" sang lối nói gián tiếp: "서영 씨가 저한테 비행기 표를 __________."',
    options: ['예약했냐고 해요', '예약하자고 해요', '예약하라고 해요', '예약한다고 해요'],
    correctIndex: 0,
    explanation:
      '-(으)냐고 하다 dùng để tường thuật lại câu hỏi gián tiếp của ai đó. Quá khứ dùng -았/었냐고 하다.',
    whyWrong:
      '예약하자고 하다 là rủ rê; 예약하라고 하다 là sai khiến; 예약한다고 하다 là trần thuật.',
    concept: 'Ngữ pháp tường thuật câu hỏi: -(으)냐고 하다',
    keyword: '예약했냐고 해요 (Hỏi xem đã đặt vé chưa)',
    source: 'Giáo trình Bài 10: 기본 문법 (Trang 182)',
  },

  // BÀI 11
  {
    id: 1101,
    lessonId: 11,
    type: 'understanding',
    question:
      'Khi chuyển câu trần thuật động từ sang lối nói thân mật không kính ngữ (반말) dạng chuẩn, hình thái chia đúng là gì?',
    options: [
      'Chỉ cần giữ nguyên động từ nguyên thể gắn với -다',
      'Gắn -ㄴ다 sau thân động từ tận cùng bằng nguyên âm, gắn -는다 sau phụ âm',
      'Luôn luôn thêm đuôi -자',
      'Bắt buộc phải kết thúc bằng -니',
    ],
    correctIndex: 1,
    explanation:
      'Trong lối nói 반말: Động từ chia hiện tại dạng -ㄴ/는다 (ví dụ: 간다, 먹는다). Đuôi -자 là rủ rê, đuôi -니/냐 là nghi vấn.',
    whyWrong: 'Tính từ mới giữ nguyên -다 (ví dụ: 예쁘다), còn động từ phải chia -ㄴ/는다.',
    concept: 'Quy tắc lối nói thân mật (반말 격식체)',
    keyword: '동사 + -ㄴ/는다',
    source: 'Giáo trình Bài 11: 문법 반말 (Trang 199)',
  },

  // BÀI 12
  {
    id: 1201,
    lessonId: 12,
    type: 'understanding',
    question:
      'Khi chuyển câu cầu khiến "giúp đỡ người nói" (도와주세요) sang câu tường thuật gián tiếp, quy tắc dùng đuôi đúng là:',
    options: ['도와주라고 하다', '도와 달라고 하다', '도와자고 하다', '도와준다고 하다'],
    correctIndex: 1,
    explanation:
      'Nếu hành động giúp đỡ hướng về chính người nói thì chuyển thành "-달라고 하다" (도와 달라고 했어요). Chỉ khi giúp người thứ ba mới dùng "-주라고 하다".',
    whyWrong: 'Dùng 도와주라고 하다 là sai người thụ hưởng hành động.',
    concept: 'Phân biệt -달라고 하다 và -주라고 하다',
    keyword: '나를 도와 달라 (Giúp đỡ chính bản thân người nói)',
    source: 'Giáo trình Bài 12: 기본 문법 -(으)라고 하다 (Trang 217)',
  },

  // BÀI 15
  {
    id: 1501,
    lessonId: 15,
    type: 'understanding',
    question:
      'Chọn câu sử dụng chuẩn xác cấu trúc phủ định kép mang tính nghĩa vụ bắt buộc "-지 않으면 안 되다":',
    options: [
      '사무실에 오실 때는 직원의 안내를 받지 않으면 안 됩니다.',
      '피곤하니까 잠을 자지 않으면 안 돼요.',
      '시간이 남으니까 서두르지 않으면 안 됩니다.',
      '재미없는 영화는 보지 않으면 안 됩니다.',
    ],
    correctIndex: 0,
    explanation:
      '-지 않으면 안 되다 diễn đạt ý nghĩa bắt buộc phải tuân thủ nghiêm ngặt (ở đây là phải theo hướng dẫn của nhân viên).',
    whyWrong: 'Các câu khác mâu thuẫn về mặt ngữ nghĩa và logic đời sống.',
    concept: 'Ngữ pháp -지 않으면 안 되다',
    keyword: '직원의 안내를 받지 않으면 안 됩니다 (Bắt buộc phải nhận hướng dẫn)',
    source: 'Giáo trình Bài 15: 쓰기 & Phụ lục đáp án (Trang 282, 314)',
  },
];

export const QUIZ_BANK = raw.map((item) => LegacyQuizItemSchema.parse(item));
