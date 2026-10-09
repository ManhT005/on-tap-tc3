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
  {
    id: 'w11',
    lessonId: 7,
    title: 'Bài 07: Tự giới thiệu tính cách của bản thân',
    prompt:
      '다음 상황에 맞게 자신의 성격을 소개하는 문장을 완성하시오.\n[상황]: Tự giới thiệu bản thân thuộc tuýp người trầm tính (조용한 편이다) nhưng làm việc rất tỉ mỉ (꼼꼼하다), và đối với nhiệm vụ được giao thì làm hết mình như một chuyên gia (전문가처럼).',
    requiredKeywords: ['조용한 편', '꼼꼼한', '전문가처럼'],
    modelAnswer:
      '저는 평소에 말수가 적고 조용한 편이지만 일을 할 때는 꼼꼼한 성격입니다. 맡은 일은 전문가처럼 최선을 다해 처리합니다.',
    explanation:
      'Sử dụng -(으)ㄴ/는 편이다 để nhận định tính cách, tính từ 꼼꼼하다 để miêu tả phong cách làm việc, và 처럼 để so sánh thái độ chuyên nghiệp.',
  },
  {
    id: 'w12',
    lessonId: 7,
    title: 'Bài 07: Khen ngợi một người bạn tốt',
    prompt:
      '다음 상황에 맞게 친구를 칭찬하는 글을 완성하시오.\n[상황]: Khen ngợi bạn mình là người quen biết rộng rãi (발이 넓다), kín miệng giữ bí mật (입이 무겁다) và cảm thán về tấm lòng tốt bụng của bạn ấy bằng đuôi cảm thán -군요.',
    requiredKeywords: ['발이 넓고', '입이 무겁', '착하군요'],
    modelAnswer:
      '제 친구 민호는 발이 넓고 사람들과 잘 어울리는데도 입이 무거워서 믿을 수 있어요. 항상 남을 배려하는 마음씨가 정말 착하군요!',
    explanation:
      'Sử dụng các quán ngữ cơ thể về tính cách (발이 넓다, 입이 무겁다) kết hợp đuôi cảm thán -군요 để khen ngợi bạn bè.',
  },
  {
    id: 'w13',
    lessonId: 8,
    title: 'Bài 08: Xin lỗi vì làm vỡ đồ và cam kết đền bù',
    prompt:
      '다음 상황에 맞게 정중하게 사과하고 보상하겠다는 메시지를 완성하시오.\n[상황]: Bạn lỡ tay làm trượt rơi vỡ chiếc cốc của bạn mình. Hãy giải thích do trượt tay và hứa sẽ mua chiếc cốc mới giống hệt để đền, sử dụng cấu trúc -는 바람에 và -도록 하다.',
    requiredKeywords: ['미끄러지는 바람에', '깨뜨려서', '사 드리도록'],
    modelAnswer:
      '손이 미끄러지는 바람에 소중한 컵을 바닥에 떨어뜨려 깨뜨려서 정말 미안해. 내일 똑같은 컵으로 새로 사 드리도록 할게.',
    explanation:
      '-는 바람에 chỉ nguyên nhân bất ngờ ngoài ý muốn dẫn đến kết quả xấu (làm vỡ cốc); -도록 하다 chỉ quyết tâm chuộc lỗi.',
  },
  {
    id: 'w14',
    lessonId: 9,
    title: 'Bài 09: So sánh hai hình thức thuê nhà Jeonse và Wolse',
    prompt:
      '다음 주제에 대해 한국어로 의견을 작성하시오.\n[주제]: So sánh hai hình thức thuê nhà Jeonse (전세) và thuê theo tháng (월세), sử dụng cấu trúc "에 비해서" và từ vựng về chi phí (보증금, 부담을 줄이다).',
    requiredKeywords: ['월세에 비해서', '보증금이 큰', '부담을 줄일'],
    modelAnswer:
      '전세는 월세에 비해서 매달 나가는 방세가 없어서 생활비 부담을 줄일 수 있어요. 하지만 계약할 때 처음에 내야 하는 보증금이 아주 큰 편이에요.',
    explanation:
      'Dùng danh từ + 에 비해서 để so sánh tiêu chuẩn chi phí giữa hai hình thức thuê nhà đặc trưng tại Hàn Quốc.',
  },
  {
    id: 'w15',
    lessonId: 9,
    title: 'Bài 09: Nhờ bạn hướng dẫn cách làm hợp đồng thuê nhà',
    prompt:
      '다음 상황에 맞게 친구에게 도움을 요청하는 메시지를 작성하시오.\n[상황]: Bạn tìm được căn phòng ưng ý nhưng chưa biết cách làm hợp đồng thuê nhà bằng tiếng Hàn. Hãy nhờ bạn đi cùng đến văn phòng bất động sản, sử dụng cấu trúc -(으)ㄹ 줄 모르다.',
    requiredKeywords: ['계약서를 쓸 줄 몰라', '부동산', '도와줄 수 있어'],
    modelAnswer:
      '마음에 드는 원룸을 찾았는데 저는 아직 한국어로 계약서를 쓸 줄 몰라요. 내일 부동산 중개소에 같이 가서 도와줄 수 있어요?',
    explanation:
      'Dùng -(으)ㄹ 줄 모르다 để diễn đạt không biết cách thực hiện thủ tục hợp đồng nhà và đưa ra lời nhờ vả lịch sự.',
  },
  {
    id: 'w16',
    lessonId: 10,
    title: 'Bài 10: Chia sẻ dự định cho kỳ nghỉ tới',
    prompt:
      '다음 상황에 맞게 여행 계획을 이야기하는 글을 작성하시오.\n[상황]: Bạn đang cân nhắc kỳ nghỉ này sẽ đi du lịch đảo Jeju cùng gia đình, sử dụng cấu trúc -(으)ㄹ까 하다 và từ vựng về đặt vé (비행기 표를 예매하다, 숙소).',
    requiredKeywords: ['갈까 해요', '비행기 표를 예매', '숙소'],
    modelAnswer:
      '이번 여름휴가에는 가족과 함께 제주도로 여행을 갈까 해요. 성수기가 되기 전에 미리 비행기 표를 예매하고 깨끗한 숙소를 예약해 두었어요.',
    explanation: '-(으)ㄹ까 하다 diễn đạt ý định đang tính toán, dự trù cho chuyến du lịch.',
  },
  {
    id: 'w17',
    lessonId: 10,
    title: 'Bài 10: Tường thuật lại câu hỏi của bạn bè về chuyến đi',
    prompt:
      '다음 상황에 맞게 친구의 질문을 다른 사람에게 전달하시오.\n[상황]: Bạn bè hỏi bạn rằng chuyến du lịch vừa rồi có vui không và đồ ăn có ngon không, sử dụng cấu trúc tường thuật câu hỏi gián tiếp -(으)냐고 묻다/하다.',
    requiredKeywords: ['재미있었냐고', '음식이 맛있냐고', '물어봤어요'],
    modelAnswer:
      '친구가 저에게 지난번 경주 여행이 재미있었냐고 물어봤어요. 그리고 현지 음식이 맛있냐고도 물어봤어요.',
    explanation:
      'Sử dụng -(으)냐고 묻다 để tường thuật lại câu hỏi về trải nghiệm quá khứ (-았/었냐고) và tính từ trạng thái (맛있냐고).',
  },
];

export const WRITING_BANK = raw.map((item) => LegacyWritingPromptSchema.parse(item));
