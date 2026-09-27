import { LessonContentSchema } from '../schemas';
import { pack } from './pack';

const raw = {
  title: 'Bài 13: 희망 (Ước mơ & Tương lai)',
  koreanTitle: '희망',
  objectives:
    'Nói về ước mơ tương lai, tấm gương vượt khó, thể hiện hành động tiếp diễn theo thời gian.',
  vocabulary: [
    pack('기본', '기본 어휘 (Ước mơ, Định hướng tương lai & Thành công)', [
      ['장래 희망', 'Ước mơ nghề nghiệp tương lai mai sau', '어린 시절 나의 장래 희망'],
      ['미래의 꿈', 'Khát vọng ước nguyện mai này', '미래의 꿈을 향해 힘차게 나아가다'],
      ['진로', 'Định hướng bước tiến tương lai nghề', '적성을 고려하여 진로를 결정하다'],
      ['진로를 정하다', 'Quyết định chọn đường đi tương lai', '대학 4학년 때 진로를 명확히 정하다'],
      ['취업하다', 'Xin được việc làm bước vào đời', '원하던 무역회사에 드디어 취업하다'],
      [
        '취업 준비 (취준)',
        'Quá trình ôn luyện xin việc miệt mài',
        '취업 준비로 바쁜 하루를 보내다',
      ],
      ['진학하다', 'Học tiếp lên bậc học cao hơn nữa', '더 깊은 학문을 위해 대학원에 진학하다'],
      ['대학원 진학', 'Học lên cao học lấy bằng thạc sĩ', '석사 학위 취득을 위한 대학원 진학'],
      ['유학을 가다', 'Xuất ngoại ra nước ngoài du học', '한국으로 한국어 연수 및 유학을 가다'],
      ['유학 생활', 'Cuộc sống tự lập của du học sinh', '낯선 타국에서의 보람찬 유학 생활'],
      ['적성에 맞다', 'Hợp với sở trường thiên bẩm năng khiếu', '적성에 맞는 일을 찾아야 행복하다'],
      ['흥미를 느끼다', 'Cảm thấy đam mê thích thú say mê', '새로운 외국어 학습에 흥미를 느끼다'],
      [
        '경험을 쌓다',
        'Tích lũy cọ xát kinh nghiệm thực tế',
        '다양한 아르바이트로 사회 경험을 쌓다',
      ],
      ['스펙을 쌓다', 'Rèn luyện tích lũy kỹ năng chứng chỉ', '자격증 취득과 인턴십으로 스펙 쌓기'],
      ['꿈을 키우다', 'Nuôi dưỡng ấp ủ ước mơ hoài bão', '어려운 환경에서도 꿈을 키워 가다'],
      ['꿈을 이루다', 'Biến ước mơ ấp ủ thành hiện thực', '피나는 노력 끝에 마침내 꿈을 이루다'],
      ['성공하다', 'Thành công hiển vinh vang dội', '자신이 선택한 분야에서 크게 성공하다'],
      ['성공을 거두다', 'Gặt hái thắng lợi rực rỡ vẻ vang', '창업 3년 만에 놀라운 성공을 거두다'],
      ['성공 비결', 'Bí quyết then chốt tạo nên thành công', '포기하지 않는 끈기가 바로 성공 비결'],
      ['성공 요인', 'Yếu tố quyết định đưa tới thành công', '철저한 준비와 열정이 핵심 성공 요인'],
      ['도전하다', 'Thử thách dấn thân không lùi bước', '새로운 분야에 끊임없이 도전하다'],
      ['실패하다', 'Thất bại vấp ngã trên đường đời', '실패를 두려워하지 않는 자만이 성공한다'],
      ['좌절하다', 'Ngã lòng gục ngã nản chí buông xuôi', '어떤 시련 앞에서도 결코 좌절하지 않다'],
      [
        '낙담하다',
        'Dao động chán chường nản lòng thoái chí',
        '불합격 통보에도 낙담하지 않고 재도전',
      ],
    ]),
    pack('새단어', '새 단어 & 읽기 본문 (Bảng từ mới tr. 333 & Hoạt động thiện nguyện)', [
      [
        '최선을 다하다',
        'Cố gắng hết sức bình sinh hết mình',
        '목표를 이루기 위해 매 순간 최선을 다하다',
      ],
      ['용기를 가지다', 'Có dũng khí can đảm tự tin bước tới', '역경에 맞서 싸울 용기를 가지다'],
      [
        '용기를 북돋우다',
        'Truyền dũng khí khích lệ tinh thần',
        '낙담한 친구에게 따뜻한 용기를 북돋우다',
      ],
      [
        '어려움을 극복하다',
        'Vượt qua chông gai khó khăn trở ngại',
        '불굴의 의지로 가난과 어려움을 극복하다',
      ],
      [
        '신체적 장애',
        'Tật nguyền khuyết tật cơ thể thể chất',
        '시각장애를 극복한 위대한 인간 승리',
      ],
      ['인내하다', 'Nhẫn nại kiên trì chịu đựng gian khó', '고통을 인내하며 묵묵히 훈련하다'],
      [
        '끈기 있게 버티다',
        'Kiên trì bền bỉ bám trụ tới cùng',
        '포기하지 않고 끈기 있게 끝까지 버티다',
      ],
      [
        '봉사 활동을 하다',
        'Tham gia hoạt động tình nguyện xã hội',
        '주말마다 복지관에서 봉사 활동을 하다',
      ],
      [
        '자원봉사자',
        'Người làm thiện nguyện tự giác tự tâm',
        '재난 현장에서 구호 활동을 펴는 자원봉사자',
      ],
      ['기부하다', 'Quyên góp tiền của ủng hộ đồng bào', '수재민을 돕기 위해 성금을 기부하다'],
      ['기부를 받다', 'Được tiếp nhận tiền của từ thiện', '기업으로부터 장학 기부를 받다'],
      ['모금하다', 'Gây quỹ quyên góp tiền ủng hộ', '난치병 어린이를 돕기 위한 거리 모금'],
      ['후원금', 'Khoản tiền tài trợ bảo trợ định kỳ', '보육원에 매달 후원금을 보내다'],
      ['양로원', 'Viện dưỡng lão chăm sóc các cụ già', '양로원을 찾아 어르신들의 말벗 해 드리기'],
      [
        '고아원 (보육원)',
        'Trại trẻ mồ côi viện bảo trợ trẻ em',
        '아이들에게 꿈을 심어주는 보육원 봉사',
      ],
      ['시각장애인', 'Người khiếm thị không nhìn thấy được', '시각장애인을 위한 점자 도서 제작'],
      ['점자', 'Chữ nổi xúc giác Braille cho người mù', '손가락 감각으로 읽는 한글 점자'],
      ['청각장애인', 'Người khiếm thính không nghe nói được', '청각장애인을 위한 수화 통역 방송'],
      ['수화', 'Ngôn ngữ ký hiệu cử chỉ bằng tay', '손짓으로 마음을 전하는 수화 배우기'],
      ['신체장애인', 'Người khuyết tật vận động thể chất', '장애인의 휠체어 이동권 보장 운동'],
      [
        '장애인 복지시설',
        'Cơ sở phúc lợi phục hồi người tàn tật',
        '편의 시설을 완비한 장애인 복지시설',
      ],
      ['보람이 있다', 'Có ý nghĩa sâu sắc lớn lao cho đời', '남을 돕는 일은 참으로 보람이 있다'],
      [
        '보람을 느끼다',
        'Cảm thấy tự hào ý nghĩa ngập tràn',
        '봉사를 마치고 가슴 벅찬 보람을 느끼다',
      ],
      [
        '키즈시티 (KidZania)',
        'Công viên trải nghiệm nghề nghiệp trẻ em',
        '어린이들이 직업을 직접 체험하는 테마파크',
      ],
    ]),
    pack('듣기', '듣기 스크립트 & 워크북 (Audio CD & Sách bài tập)', [
      ['백만장자', 'Đại tỷ phú triệu phú giàu có tự thân', '자수성가하여 큰 부를 이룬 백만장자'],
      ['복권', 'Vé số may rủi cầu vận đỏ đen', '인생 역전을 꿈꾸며 복권을 사다'],
      ['복권에 당첨되다', 'Trúng độc đắc vé số tiền tỷ', '1등 복권에 당첨되는 꿈을 꾸다'],
      [
        '금메달을 따다',
        'Giành đoạt huy chương vàng thế vận hội',
        '올림픽 무대에서 값진 금메달을 따다',
      ],
      ['시상대', 'Bục vinh quang nhận giải thưởng cao quý', '시상대 맨 위에 올라 애국가를 부르다'],
      ['동시통역사', 'Chuyên viên thông dịch cabin song song', '국제 정상회담의 동시통역사 활약'],
      ['특별보좌관', 'Cố vấn đặc vụ đặc biệt cho chính phủ', '백악관 특별보좌관으로 임명되다'],
      ['백악관', 'Nhà Trắng cơ quan đầu não Hoa Kỳ', '강영우 박사가 근무했던 미국 백악관'],
      ['사업가', 'Nhà làm kinh doanh, doanh nhân thành đạt', '혁신적인 벤처 기업을 이끄는 사업가'],
      ['교육자', 'Nhà giáo dục tâm huyết trồng người', '평생을 후학 양성에 바친 훌륭한 교육자'],
      [
        '피아니스트',
        'Nghệ sĩ đàn dương cầm piano điêu luyện',
        '세계적인 쇼팽 콩쿠르 우승 피아니스트',
      ],
      ['연예인', 'Nghệ sĩ biểu diễn văn nghệ giải trí', '청소년 장래 희망 1순위 인기 연예인'],
      [
        '역할 놀이 (Role play)',
        'Trò chơi đóng vai mô phỏng nghề nghiệp',
        '직업 역할 놀이를 통한 사회성 함양',
      ],
      ['실제 크기', 'Kích thước chuẩn thực tế ngoài đời', '실제 크기의 3분의 2로 축소된 모형'],
      ['구체적으로', 'Một cách cụ thể rành mạch rõ ràng', '실현 가능한 구체적인 계획을 세우다'],
      ['협동성', 'Tinh thần hợp tác làm việc cộng đồng', '팀원들과 협동성을 발휘하여 임무 완수'],
      [
        '입사 원서',
        'Đơn xin việc sơ yếu lý lịch nộp công ty',
        '하반기 공채에 입사 원서를 접수하다',
      ],
      [
        '이력서',
        'Bản lý lịch quá trình học tập làm việc',
        '자신의 경력을 일목요연하게 적은 이력서',
      ],
      ['인턴사원', 'Nhân viên thực tập sinh cọ xát nghề', '3개월간 인턴사원으로 실무 경험 쌓기'],
      [
        '비만 클리닉',
        'Phòng khám chuyên khoa trị béo phì',
        '체계적인 체중 감량을 돕는 비만 클리닉',
      ],
      ['평생', 'Suốt cả cuộc đời, cả một kiếp người', '평생 동안 이웃을 위해 헌신하다'],
      [
        '희망을 잃지 않다',
        'Không bao giờ để mất niềm hy vọng sống',
        '절망의 끝에서도 희망을 잃지 않는 용기',
      ],
      ['장애인위원회', 'Ủy ban quốc gia vì người khuyết tật', '장애인 복지 증진을 위한 정책 수립'],
      ['치료하다', 'Điều trị chữa lành bệnh tật hoàn toàn', '불치병을 이겨내고 건강을 회복하다'],
      ['완치되다', 'Bình phục hoàn toàn khỏi hẳn căn bệnh', '수술 후 암이 깨끗하게 완치되다'],
      ['기도', 'Sự cầu nguyện ước mong điều tốt đẹp', '간절한 기도로 마음의 평화를 찾다'],
    ]),
  ],
  grammar: [
    {
      structure: 'Động từ/Tính từ + -아/어 가다 vs -아/어 오다',
      meaning:
        '-아/어 가다 (tiếp diễn hướng về tương lai), -아/어 오다 (liên tục từ quá khứ đến hiện tại)',
      rule: 'Chỉ sự phát triển của hành vi hay trạng thái theo trục thời gian.',
      examples: [
        {
          kr: '30년 동안 쉬지 않고 매일 일만 해 왔어요.',
          vn: 'Bác ấy đã miệt mài làm việc suốt 30 năm không ngừng nghỉ.',
        },
      ],
    },
    {
      structure: 'Động từ/Tính từ + -아/어야겠다',
      meaning: 'Chắc chắn sẽ phải... (ý chí quyết tâm)',
      rule: 'Biểu hiện ý chí kiên định phải thực hiện hành động.',
      examples: [
        {
          kr: '다음 학기에는 장학금을 꼭 타야겠어요.',
          vn: 'Kỳ học tới nhất định tôi sẽ phải giành được học bổng.',
        },
      ],
    },
    {
      structure: 'Động từ/Tính từ + -았/었으면 좋겠다',
      meaning: 'Ước gì... / Giá mà được như vậy thì tốt biết mấy',
      rule: 'Biểu thị niềm mong mỏi, hy vọng cho một hiện thực tốt đẹp hơn.',
      examples: [
        {
          kr: '흐엉이 꼭 꿈을 이루었으면 좋겠습니다.',
          vn: 'Ước gì bạn Hương có thể thực hiện được ước mơ của mình.',
        },
      ],
    },
  ],
  culture: {
    title: 'Sự thay đổi về ước mơ của trẻ em Hàn Quốc',
    content:
      'Trước đây trẻ em Hàn Quốc mơ làm tổng thống, bác sĩ. Ngày nay, các ngành nghề như nghệ sĩ giải trí (연예인), vận động viên thể thao và nhà sáng tạo nội dung được yêu thích vượt trội.',
  },
};

export const lesson13 = LessonContentSchema.parse(raw);
