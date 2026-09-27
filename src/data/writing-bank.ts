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
];

export const WRITING_BANK = raw.map((item) => LegacyWritingPromptSchema.parse(item));
