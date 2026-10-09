import { LegacyWritingPromptSchema } from './schemas';

const raw = [
  {
    id: 'w1',
    lessonId: 1,
    title: 'Bài 01: Giới thiệu bản thân và kế hoạch học tập',
    prompt:
      '다음 상황에 맞게 한국어로 문장을 완성하시오.\n[상황]: Bạn là Hương, sinh viên năm 2 khoa Hàn Quốc học nhưng chỉ biết một ít tiếng Hàn. Sau khi tốt nghiệp bạn dự định sang Hàn Quốc du học.',
    requiredKeywords: ['흐엉이라고 합니다', '2학년', '조금밖에', '유학을 갈 생각'],
    modelAnswer:
      '저는 한국학과 2학년 흐엉이라고 합니다. 한국어를 조금밖에 못하지만 졸업 후에 한국으로 유학을 갈 생각입니다.',
    explanation:
      'Sử dụng cấu trúc (이)라고 하다 (giới thiệu tên), 밖에 đi với vị từ phủ định 못하다 (chỉ biết một ít), và -(으)ㄹ 생각이다 (kế hoạch du học).',
  },
  {
    id: 'w2',
    lessonId: 2,
    title: 'Bài 02: Viết email cảm ơn giáo viên',
    prompt:
      '다음 상황에 맞게 감사 메일의 한 문장을 작성하시오.\n[상황]: Nhờ có thầy/cô giảng dạy tận tình mà em đã được nhận vào làm việc tại công ty thương mại Hàn Quốc.',
    requiredKeywords: ['선생님', '덕분에', '취직하게'],
    modelAnswer: '선생님이 잘 가르쳐 주신 덕분에 한국 무역회사에 취직하게 되었습니다.',
    explanation:
      'Sử dụng cấu trúc -(으)ㄴ 덕분에 để nêu nguyên nhân mang lại kết quả tốt đẹp và kết hợp với -게 되었습니다.',
  },
  {
    id: 'w3',
    lessonId: 3,
    title: 'Bài 03: Lời khuyên duy trì sức khỏe',
    prompt:
      '다음 질문에 대해 올바른 건강 조언을 작성하시오.\n[상황]: Khuyên người bệnh dạo này cảm cúm rất độc nên hãy mau chóng đi bệnh viện bằng cấu trúc "-는 게 좋다".',
    requiredKeywords: ['감기', '얼른', '병원에 가는 게'],
    modelAnswer: '요즘 감기는 독하니까 얼른 병원에 가는 게 좋겠어요.',
    explanation: 'Áp dụng -는 게 좋다 để đưa ra lời khuyên thiết thực.',
  },
  {
    id: 'w4',
    lessonId: 8,
    title: 'Bài 08: Giải thích lý do đi muộn và cam kết',
    prompt:
      '다음 상황에 맞게 정중하게 사과하는 답변을 완성하시오.\n[상황]: Giải thích lý do đi muộn do xe buýt bị hỏng và hứa từ mai sẽ cố gắng không đi muộn nữa.',
    requiredKeywords: ['바람에', '늦지 않도록'],
    modelAnswer:
      '버스가 고장 나는 바람에 늦었습니다. 죄송합니다. 내일부터는 늦지 않도록 하겠습니다.',
    explanation:
      'Sử dụng -는 바람에 để nêu nguyên nhân tiêu cực ngoài ý muốn và -도록 하겠습니다 để biểu thị ý chí quyết tâm sửa sai.',
  },
  {
    id: 'w5',
    lessonId: 4,
    title: 'Bài 04: Phàn nàn và yêu cầu đổi hàng',
    prompt:
      '다음 상황에 맞게 한국어로 문장을 완성하시오.\n[상황]: Bạn mua áo khoác ở trung tâm thương mại. Về nhà phát hiện khóa kéo bị hỏng. Hãy phàn nàn và đề nghị đổi sang áo khoác không bị lỗi, size nhỏ hơn.',
    requiredKeywords: ['지퍼가 고장', '대신에', '교환'],
    modelAnswer:
      '지난주에 여기서 산 점퍼인데 집에 와 보니 지퍼가 고장 났어요. 이 점퍼 대신에 이상이 없는 걸로, 치수도 한 사이즈 작은 걸로 교환해 주세요.',
    explanation:
      '지퍼가 고장 나다 = khóa kéo bị hỏng; 대신에 = thay cho (đổi sản phẩm); 교환하다 = đổi hàng. Cấu trúc câu phàn nàn lịch sự.',
  },
  {
    id: 'w6',
    lessonId: 4,
    title: 'Bài 04: So sánh ưu nhược điểm khi mua sắm online',
    prompt:
      '다음 주제에 대해 자신의 의견을 완성하시오.\n[주제]: So sánh ưu và nhược điểm của việc mua sắm trực tuyến (인터넷 쇼핑) so với mua sắm trực tiếp tại cửa hàng, sử dụng cấu trúc "편리한/싼 대신에".',
    requiredKeywords: ['편리한 대신에', '직접 확인'],
    modelAnswer:
      '인터넷 쇼핑은 편리한 대신에 물건을 직접 확인하기 어렵고 반품이 번거로울 수 있어요. 반면에 가격이 싼 대신에 배송 시간이 걸린다는 단점도 있어요.',
    explanation:
      '-(으)ㄴ 대신에 sau tính từ = bù lại cho ưu điểm này thì có nhược điểm kia. Đây là cấu trúc quan trọng để so sánh.',
  },
  {
    id: 'w7',
    lessonId: 5,
    title: 'Bài 05: Mô tả quy trình nấu một món ăn yêu thích',
    prompt:
      '다음 상황에 맞게 요리 과정을 설명하시오.\n[상황]: Mô tả cách nấu món canh kim chi đơn giản (김치찌개), sử dụng các cấu trúc -고 나서, -다가, 으로.',
    requiredKeywords: ['볶다가', '넣고 나서', '으로 간을'],
    modelAnswer:
      '먼저 돼지고기와 김치를 볶다가 물을 붓고 끓입니다. 두부를 넣고 나서 5분 정도 더 끓입니다. 마지막으로 국간장으로 간을 맞추면 완성됩니다.',
    explanation:
      '-다가 = đang xào thì đổ nước; -고 나서 = sau khi cho đậu phụ vào rồi; 으로 = bằng nước tương canh nêm.',
  },
  {
    id: 'w8',
    lessonId: 5,
    title: 'Bài 05: Chia sẻ ký ức về một món ăn đặc biệt',
    prompt:
      '다음 상황에 맞게 회상하는 글을 완성하시오.\n[상황]: Kể về ký ức ăn món 삼계탕 lần đầu tiên. Mô tả nguyên liệu, cách ăn và cảm nhận hương vị bằng từ vựng bài 5.',
    requiredKeywords: ['닭과 인삼으로', '든든하다', '고소하다'],
    modelAnswer:
      '처음 삼계탕을 먹었을 때 닭과 인삼으로 끓인 국물이 정말 구수하고 고소했습니다. 먹고 나서 배가 든든하고 기운이 나는 것 같았습니다.',
    explanation:
      '으로 chỉ nguyên liệu (nấu bằng gà và nhân sâm); 고소하다 = bùi béo thơm; 든든하다 = chắc dạ no lâu.',
  },
  {
    id: 'w9',
    lessonId: 6,
    title: 'Bài 06: Hướng dẫn mở tài khoản ngân hàng',
    prompt:
      '다음 상황에 맞게 안내문을 완성하시오.\n[상황]: Bạn là nhân viên ngân hàng. Hãy hướng dẫn khách hàng cần chuẩn bị gì để mở tài khoản và nên đăng ký thêm dịch vụ nào để tiện lợi, sử dụng cấu trúc -(으)려면 và -기 쉽다.',
    requiredKeywords: ['통장을 만들려면', '신분증', '잊어버리기 쉬우니까'],
    modelAnswer:
      '통장을 만들려면 신분증이 필요합니다. 자동이체도 신청하시면 요금 납부 날짜를 잊어버리기 쉬우니까 걱정이 없습니다.',
    explanation:
      '-(으)려면 = nếu muốn (mở tài khoản thì cần CMND); -기 쉽다 = dễ bị (quên ngày thanh toán).',
  },
  {
    id: 'w10',
    lessonId: 6,
    title: 'Bài 06: Chia sẻ thói quen tiết kiệm tài chính',
    prompt:
      '다음 주제에 대해 자신의 경험을 작성하시오.\n[주제]: Mô tả thói quen quản lý tiền của bạn: dùng phương pháp gì để tiết kiệm và tránh chi tiêu lãng phí? Sử dụng từ vựng bài 6.',
    requiredKeywords: ['가계부', '적금', '절약하다'],
    modelAnswer:
      '저는 매달 가계부를 써서 지출을 관리합니다. 월급이 들어오면 바로 적금 통장에 일부를 이체합니다. 이렇게 꾸준히 절약하면 1년 후에 목돈을 모을 수 있어요.',
    explanation:
      '가계부를 쓰다 = ghi sổ chi tiêu; 적금 = tiết kiệm tích lũy; 절약하다 = tiết kiệm căn cơ.',
  },
];

export const WRITING_BANK = raw.map((item) => LegacyWritingPromptSchema.parse(item));
