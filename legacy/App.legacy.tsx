import React, { useState, useMemo, useEffect } from 'react';

const COURSE_STRUCTURE = [
  {
    id: 1,
    title: 'Bài 01: 학교생활',
    koreanTitle: '학교생활',
    topic: 'Đời sống học đường & Học vụ',
    importance: 'Rất cao (Nền tảng)',
    totalQuestions: 6,
  },
  {
    id: 2,
    title: 'Bài 02: 대인 관계',
    koreanTitle: '대인 관계',
    topic: 'Quan hệ đối nhân xử thế & Thăm hỏi',
    importance: 'Cao',
    totalQuestions: 6,
  },
  {
    id: 3,
    title: 'Bài 03: 건강',
    koreanTitle: '건강',
    topic: 'Sức khỏe & Lối sống lành mạnh',
    importance: 'Trung bình',
    totalQuestions: 5,
  },
  {
    id: 4,
    title: 'Bài 04: 쇼핑',
    koreanTitle: '쇼핑',
    topic: 'Mua sắm & Đổi trả thanh toán',
    importance: 'Cao',
    totalQuestions: 5,
  },
  {
    id: 5,
    title: 'Bài 05: 요리',
    koreanTitle: '요리',
    topic: 'Ẩm thực, Nấu nướng & Gia vị',
    importance: 'Trung bình',
    totalQuestions: 5,
  },
  {
    id: 6,
    title: 'Bài 06: 은행',
    koreanTitle: '은행',
    topic: 'Giao dịch ngân hàng & Tài chính',
    importance: 'Cao',
    totalQuestions: 5,
  },
  {
    id: 7,
    title: 'Bài 07: 성격',
    koreanTitle: '성격',
    topic: 'Tính cách & Quán ngữ cơ thể',
    importance: 'Cao',
    totalQuestions: 5,
  },
  {
    id: 8,
    title: 'Bài 08: 실수',
    koreanTitle: '실수',
    topic: 'Sai sót, Xin lỗi & Khắc phục',
    importance: 'Rất cao',
    totalQuestions: 6,
  },
  {
    id: 9,
    title: 'Bài 09: 이사',
    koreanTitle: '이사',
    topic: 'Cư trú, Chuyển nhà & Tân gia',
    importance: 'Trung bình',
    totalQuestions: 5,
  },
  {
    id: 10,
    title: 'Bài 10: 여행',
    koreanTitle: '여행',
    topic: 'Du lịch, Địa danh & Lịch trình',
    importance: 'Cao',
    totalQuestions: 5,
  },
  {
    id: 11,
    title: 'Bài 11: 고민',
    koreanTitle: '고민',
    topic: 'Băn khoăn, Tư vấn & Lối nói 반말',
    importance: 'Rất cao',
    totalQuestions: 5,
  },
  {
    id: 12,
    title: 'Bài 12: 인터넷',
    koreanTitle: '인터넷',
    topic: 'Internet, Soạn thảo văn bản & Email',
    importance: 'Rất cao',
    totalQuestions: 5,
  },
  {
    id: 13,
    title: 'Bài 13: 희망',
    koreanTitle: '희망',
    topic: 'Ước mơ, Ý chí & Hoạt động thiện nguyện',
    importance: 'Cao',
    totalQuestions: 5,
  },
  {
    id: 14,
    title: 'Bài 14: 영화와 드라마',
    koreanTitle: '영화와 드라마',
    topic: 'Phim ảnh, Hallyu & Cảm nhận nghệ thuật',
    importance: 'Trung bình',
    totalQuestions: 5,
  },
  {
    id: 15,
    title: 'Bài 15: 예절과 규칙',
    koreanTitle: '예절과 규칙',
    topic: 'Quy tắc công cộng & Kính ngữ đời sống',
    importance: 'Rất cao',
    totalQuestions: 6,
  },
];

const pack = (sourceTag, category, tuples) => ({
  category,
  sourceTag,
  items: tuples.map(([kr, vn, note]) => ({ kr, vn, note: note || '' })),
});

const LESSONS_DATA = {
  1: {
    title: 'Bài 01: 학교생활 (Đời sống học đường)',
    koreanTitle: '학교생활',
    objectives:
      'Giới thiệu bản thân, trường lớp, giải thích ý nghĩa sự kiện và lên kế hoạch học tập.',
    vocabulary: [
      pack('기본', '기본 어휘 (Lớp học, Học vụ & Sự kiện trường)', [
        ['학기', 'Học kỳ', '이번 학기, 새 학기 시작'],
        ['신학기', 'Học kỳ mới', '신학기 맞이 준비'],
        ['과목', 'Môn học', '전공과목과 교양과목 이수'],
        ['교양과목', 'Môn văn hóa đại cương', '교양과목 학점 취득'],
        ['전공과목', 'Môn học chuyên ngành', '전공 45학점 이상 필수'],
        ['학점', 'Tín chỉ', '졸업에 필요한 140학점'],
        ['학점을 취득하다', 'Tích lũy tín chỉ', '한 학기 20학점 취득'],
        ['전공을 선택하다', 'Chọn chuyên ngành', '2학년 말 전공 선택'],
        ['부전공', 'Chuyên ngành phụ', '부전공 이수 신청'],
        ['복수 전공', 'Chuyên ngành kép (song bằng)', '복수 전공으로 두 학위 취득'],
        ['강의', 'Bài giảng', '강의를 듣다'],
        ['강의실', 'Giảng đường, phòng học', '강의실 배정 공지'],
        ['청강하다', 'Dự thính (nghe không lấy tín chỉ)', '교수님 강의 청강 신청'],
        ['수강 신청하다', 'Đăng ký môn học', '인터넷 수강 신청 시스템'],
        ['수강하다', 'Nghe giảng, học môn', '이번 학기에 4과목 수강'],
        ['등록금', 'Học phí đại học', '등록금 고지서 발송'],
        ['등록금을 납부하다', 'Nộp tiền học phí', '분할 납부 신청'],
        ['장학금을 받다', 'Nhận học bổng', '성적 우수 장학금 수혜'],
        ['장학생', 'Sinh viên nhận học bổng', '장학생 선발 명단'],
        ['새내기 = 신입생', 'Tân sinh viên (từ thuần Hàn)', '새내기를 맞이하다'],
        ['재학생', 'Sinh viên đang theo học', '재학생 대상 장학 공지'],
        ['졸업생', 'Cựu sinh viên tốt nghiệp', '졸업생 취업 현황'],
        ['입학식', 'Lễ khai giảng, nhập học', '신입생 입학식 행사'],
        ['졸업식', 'Lễ tốt nghiệp', '학사 학위 수여 졸업식'],
        ['체육대회', 'Đại hội thể thao', '단과대학 대항 축구 경기'],
      ]),
      pack('새단어', '새 단어 & 읽기 본문 (Bảng từ mới tr. 324 & Bài đọc)', [
        ['대운동장', 'Sân vận động lớn của trường', '대운동장에서 체육대회 개최'],
        ['축제', 'Lễ hội trường đại học', '대학교 80주년 기념 축제'],
        ['주점을 열다', 'Mở quán ăn đêm lễ hội', '동아리에서 주점 운영'],
        ['MT (Membership Training)', 'Dã ngoại tập thể gắn kết', '선후배 간의 화합 모임'],
        ['학술 발표회', 'Buổi thuyết trình học thuật', '연구 논문 발표회'],
        ['신입생 환영회', 'Tiệc chào đón tân sinh viên', '새내기를 환영하는 모임'],
        ['졸업생 환송회', 'Tiệc tiễn sinh viên tốt nghiệp', '졸업생을 환송하기 위한 자리'],
        ['사은회', 'Lễ tri ân thầy cô giáo', '스승의 은혜에 감사하는 자리'],
        ['개교기념일', 'Ngày kỷ niệm thành lập trường', '개교기념일 휴교 안내'],
        ['동아리', 'Câu lạc bộ sinh viên', '연극, 댄스, 학술 동아리'],
        ['동아리에 가입하다', 'Gia nhập câu lạc bộ', '신입 회원으로 가입'],
        ['학과 대표 (과대)', 'Lớp trưởng, đại diện khoa', '학생들의 의견을 수렴하는 과대표'],
        ['학생회', 'Hội sinh viên khoa', '학생 복지 사업 추진'],
        ['총학생회', 'Hội sinh viên toàn trường', '총학생회장 선거'],
        ['정기 모임', 'Họp mặt định kỳ', '매주 목요일 정기 모임'],
        ['화합을 다지다', 'Gắn kết tình đoàn kết', '선후배 간의 화합'],
        ['대기업', 'Doanh nghiệp tập đoàn lớn', '대기업 취직 준비'],
        ['중소기업', 'Doanh nghiệp vừa và nhỏ', '유망 중소기업 취업'],
        ['신청 마감', 'Hết hạn nộp đơn', '기한 엄수 신청 마감'],
        ['마감일', 'Ngày hết hạn nộp', '마감일 오후 5시까지'],
        ['모집하다', 'Chiêu mộ, tuyển sinh', '신입 회원 20명 모집'],
        ['자료실', 'Phòng tư liệu của khoa', '학과 자료실 이용 안내'],
        ['열람실', 'Phòng đọc thư viện', '열람실 24시간 개방'],
        ['휴관', 'Đóng cửa nghỉ thư viện', '공휴일 자료실 휴관'],
        ['제시하다', 'Xuất trình, đưa ra', '도서 대출 시 학생증 제시'],
      ]),
      pack('듣기', '듣기 스크립트 & 워크북 (Audio CD & Sách bài tập)', [
        ['학생증', 'Thẻ sinh viên', '학생증 발급 신청'],
        ['반입 금지', 'Cấm mang đồ vào trong', '자료실 내 음료 반입 금지'],
        ['지급하다', 'Chi trả, cấp phát', '등록금 전액을 지급하다'],
        ['전액 장학금', 'Học bổng toàn phần 100%', '성적 우수자 전액 장학금'],
        ['문학작품', 'Tác phẩm văn học', '현대 문학작품 강독'],
        ['단편소설', 'Truyện ngắn', '한국어 단편소설 번역'],
        ['시인', 'Nhà thơ sáng tác', '한국의 대표 현대 시인'],
        ['시를 쓰다', 'Sáng tác bài thơ', '한국어로 시 쓰기'],
        ['토론하다', 'Thảo luận, tranh biện', '주제 발표 후 자유 토론'],
        ['통역', 'Thông dịch, phiên dịch nói', '한국어-베트남어 통역'],
        ['동시통역', 'Thông dịch song song cabin', '국제회의 동시통역사'],
        ['자원봉사', 'Tình nguyện viên', '해외 자원봉사 파견'],
        ['봉사 활동', 'Hoạt động tình nguyện', '농촌 봉사 활동에 참여'],
        ['최선을 다하다', 'Cố gắng hết sức mình', '기말시험에 최선을 다하다'],
        ['국제 교류', 'Giao lưu quốc tế', '한-베 대학 간 학술 교류'],
        ['초대장', 'Giấy mời, thiệp mời', '사은회 초대장을 발송하다'],
        ['특히 / 특별히', 'Đặc biệt là', '문법, 특히 쓰기 영역'],
        ['소책자를 발간하다', 'Xuất bản tập san, sách mỏng', '동아리 문집 발간'],
        ['선발되다', 'Được tuyển chọn', '교환학생으로 선발되다'],
        ['외부 후원', 'Tài trợ từ bên ngoài', '기업의 장학 후원금'],
        ['조교', 'Trợ giảng khoa', '교수님 연구실 조교 근무'],
        ['학과 사무실 (과사)', 'Văn phòng khoa', '증명서 발급 및 학사 문의'],
      ]),
    ],
    grammar: [
      {
        structure: 'Danh từ + 밖에',
        meaning: 'Chỉ... / ngoài... ra không còn lựa chọn nào khác',
        rule: 'Đứng sau danh từ/phó từ biểu thị sự lựa chọn duy nhất. BẮT BUỘC ĐI VỚI VỊ TỪ PHỦ ĐỊNH (안, 못, 없다, 모르다...).',
        distinction:
          '⭐ TIPS: "밖에" tuyệt đối KHÔNG dùng trong câu khẳng định, mệnh lệnh (-으세요) hay rủ rê (-자).',
        examples: [
          { kr: '시험 시간이 5분밖에 안 남았어요.', vn: 'Thời gian thi chỉ còn lại đúng 5 phút.' },
          {
            kr: '보고서를 제출한 사람이 반밖에 안 돼요.',
            vn: 'Số người nộp báo cáo chỉ được có một nửa.',
          },
        ],
      },
      {
        structure: 'Danh từ + (이)라고 하다',
        meaning: 'Được gọi là... / Tên là...',
        rule: 'Sau nguyên âm dùng -라고 하다, sau phụ âm dùng -이라고 하다.',
        examples: [
          { kr: '저는 흐엉이라고 합니다.', vn: 'Tôi tên là Hương.' },
          {
            kr: '이 사람은 제 친구 조민재라고 해요.',
            vn: 'Người này là bạn tôi, tên là Cho Min-jae.',
          },
        ],
      },
      {
        structure: 'Động từ / Tính từ + -게 되다',
        meaning: 'Được, bị, trở nên, thành ra...',
        rule: 'Thể hiện sự biến đổi trạng thái do hoàn cảnh khách quan đưa lại, ngoài ý chí hay dự tính ban đầu.',
        examples: [
          {
            kr: '지난 학기 성적이 좋아서 장학금을 받게 됐어요.',
            vn: 'Do kỳ trước điểm tốt nên tôi đã được nhận học bổng.',
          },
        ],
      },
      {
        structure: 'Động từ + -(으)ㄹ 생각이다',
        meaning: 'Dự định làm gì...',
        rule: 'Thể hiện kế hoạch trong tương lai. Nguyên âm dùng -ㄹ 생각이다, phụ âm dùng -을 생각이다.',
        examples: [
          {
            kr: '졸업 후에 한국으로 유학을 갈 생각입니다.',
            vn: 'Sau khi tốt nghiệp tôi dự định sang Hàn Quốc du học.',
          },
        ],
      },
    ],
    culture: {
      title: 'Chế độ Đại học Việt Nam và Hàn Quốc (한국과 베트남의 대학 제도)',
      content:
        'Tại Hàn Quốc, hệ đại học 4 năm yêu cầu khoảng 140 tín chỉ để tốt nghiệp cử nhân (학사), trong đó môn chuyên ngành (전공) tối thiểu 45 tín chỉ. Sinh viên có thể học chuyên ngành kép (복수 전공) hoặc phụ (부전공).',
    },
  },

  2: {
    title: 'Bài 02: 대인 관계 (Quan hệ đối nhân xử thế)',
    koreanTitle: '대인 관계',
    objectives:
      'Thăm hỏi người quen lâu ngày gặp lại, nhờ cậy lịch sự, từ chối khéo léo trong giao tiếp xã hội.',
    vocabulary: [
      pack('기본', '기본 어휘 (Thăm hỏi, Nhờ cậy & Từ chối lịch sự)', [
        ['대인 관계', 'Quan hệ đối nhân xử thế', '사회생활의 기본인 대인 관계'],
        ['대인 관계가 좋다', 'Quan hệ xã hội hòa nhã tốt đẹp', '사람들과 잘 어울리는 성격'],
        ['대인 관계가 원만하다', 'Giao thiệp êm thắm suôn sẻ', '원만한 인간관계를 유지하다'],
        ['마음이 넓다', 'Tấm lòng rộng lượng bao dung', '어머니처럼 마음이 넓으시다'],
        ['친절하다', 'Thân thiện, tử tế', '처음 보는 사람에게도 친절하다'],
        ['인기가 있다', 'Được mọi người yêu mến, có tiếng', '친구들 사이에서 인기가 많다'],
        ['성격이 좋다', 'Tính tình tốt bụng', '원만하고 성격이 좋다'],
        ['사람을 사귀다', 'Kết bạn, giao du làm quen', '새로운 사람을 적극적으로 사귀다'],
        ['사람을 대하다', 'Đối đãi, đối xử với người khác', '상대방을 따뜻하게 대하다'],
        ['낯을 가리다', 'E thẹn, bẽn lẽn trước người lạ', '처음 만났을 때는 낯을 가리다'],
        ['사교성이 뛰어나다', 'Tài xã giao quan hệ xuất sắc', '사교적이고 발이 넓다'],
        ['부탁하다', 'Nhờ cậy, nhờ vả', '부탁이 있어서 찾아왔어요'],
        ['도움을 청하다', 'Ngỏ ý cần sự giúp đỡ', '선배에게 진로 도움을 청하다'],
        ['부탁을 받다', 'Được đề nghị nhờ vả', '친구에게 번역 부탁을 받다'],
        ['부탁을 들어주다', 'Chấp thuận giúp đỡ', '어려운 부탁을 흔쾌히 들어주다'],
        ['부탁을 거절하다', 'Từ chối lời nhờ vả', '정중하게 부탁을 거절하다'],
        ['거절을 당하다', 'Bị từ chối lời nhờ', '부탁했다가 거절을 당하다'],
        ['양해를 구하다', 'Xin sự thông cảm lượng thứ', '사정을 설명하고 양해를 구하다'],
        ['거절하기 곤란하다', 'Khó xử không nỡ từ chối', '은사님의 부탁이라 거절하기 곤란하다'],
        ['유감을 표하다', 'Bày tỏ sự tiếc nuối', '도와드리지 못해 유감입니다'],
        ['타당한 사정', 'Lý do chính đáng thỏa đáng', '타당한 사정을 설명하다'],
        ['감사의 표시', 'Biểu lộ lòng biết ơn', '작은 선물로 감사의 표시를 하다'],
        ['안부를 묻다', 'Hỏi thăm sức khỏe tình hình', '친구에게 안부를 묻다'],
        ['안부를 여쭙다', 'Kính hỏi thăm (dùng cho bề trên)', '교수님께 안부를 여쭙다'],
      ]),
      pack('새단어', '새 단어 & 읽기 본문 (Bảng từ mới tr. 325 & Bài đọc)', [
        ['안부를 전하다', 'Chuyển lời hỏi thăm', '부모님께 안부 좀 전해 주세요'],
        ['안부 전화를 하다', 'Gọi điện thoại hỏi thăm', '명절에 선생님께 안부 전화 드리기'],
        ['안부 편지를 보내다', 'Gửi thư thăm hỏi', '감사의 마음을 담아 편지 발송'],
        ['찾아뵙다', 'Đến tận nơi chào hỏi bề trên', '연구실로 직접 찾아뵙겠습니다'],
        ['인사를 드리다', 'Chào hỏi kính cẩn', '어르신께 큰절로 인사를 드리다'],
        ['송별회', 'Tiệc chia tay', '유학 떠나는 친구의 송별회'],
        ['동창회', 'Họp mặt bạn học cũ', '고등학교 동창회 참석'],
        ['송년회', 'Tiệc tất niên cuối năm', '한 해를 마무리하는 송년 모임'],
        ['동호회', 'CLB cùng sở thích đam mê', '사진 촬영 동호회 가입'],
        ['회식', 'Liên hoan công ty ăn uống', '오늘 저녁에 부서 회식이 있다'],
        ['야유회', 'Buổi picnic dã ngoại ngoài trời', '주말에 떠나는 야유회'],
        ['정기 모임', 'Họp mặt định kỳ hàng tháng', '매월 첫째 주 정기 모임'],
        ['뒤풀이', 'Liên hoan tăng 2 sau sự kiện', '행사 끝나고 식당에서 뒤풀이'],
        ['회비', 'Hội phí đóng góp', '회비는 1인당 1만 원입니다'],
        ['회비를 걷다 / 모으다', 'Thu gom tiền hội phí', '총무가 회비를 걷다'],
        ['참석하다', 'Tham dự, có mặt', '모임에 빠짐없이 참석하다'],
        ['불참하다', 'Vắng mặt không đến', '개인 사정으로 불참을 알리다'],
        ['연락하다', 'Liên lạc thông báo', '참석 여부를 미리 연락해 주세요'],
        ['취소되다', 'Bị hủy bỏ hoàn toàn', '폭우로 야유회가 취소되다'],
        ['변경되다', 'Bị thay đổi (giờ giấc, địa điểm)', '모임 장소가 서울식당으로 변경되다'],
        ['들르다', 'Ghé qua, tạt qua chốc lát', '퇴근하는 길에 연구실에 들르다'],
        ['무사히 도착하다', 'Về đến nơi an toàn bình an', '호치민에 무사히 도착했습니다'],
        ['실력', 'Thực lực, năng lực trình độ', '한국어 실력이 많이 늘었다'],
        ['취직하다', 'Xin được việc làm đi làm', '한국 무역회사에 취직하다'],
      ]),
      pack('듣기', '듣기 스크립트 & 워크북 (Audio CD & Sách bài tập)', [
        ['포기하다', 'Bỏ cuộc buông xuôi', '어려워도 포기하지 않고 해내다'],
        ['솔직하다', 'Thẳng thắn bộc trực', '솔직하게 속마음을 털어놓다'],
        ['어색하다', 'Ngượng ngùng không tự nhiên', '처음 만났을 때는 몹시 어색했다'],
        ['표정을 짓다', 'Biểu cảm nét mặt', '밝은 미소의 표정을 짓다'],
        ['현명하다', 'Khôn ngoan sáng suốt', '지혜롭고 현명하게 대처하다'],
        ['수첩', 'Sổ tay bỏ túi ghi chép', '약속 시간을 수첩에 메모하다'],
        ['스승의 날', 'Ngày Nhà giáo 15/5', '선생님 은혜에 감사하는 날'],
        ['카네이션', 'Hoa cẩm chướng cài ngực', '선생님 가슴에 카네이션을 달다'],
        ['면접시험', 'Kỳ thi phỏng vấn trực tiếp', '최종 면접시험에 합격하다'],
        ['신입 사원', 'Nhân viên mới tuyển dụng', '대기업 신입 사원 연수'],
        ['조직 문화', 'Văn hóa tổ chức công ty', '한국 기업의 조직 문화 적응'],
        ['고민거리', 'Nỗi lo lắng trăn trở', '선후배 관계에서 오는 고민거리'],
        ['심리적 부담', 'Gánh nặng tâm lý áp lực', '과도한 심리적 부담감'],
        ['업무량', 'Khối lượng công việc', '업무량이 많아서 야근하다'],
        ['월급 / 초봉', 'Tiền lương hàng tháng / Lương đầu', '첫 월급을 타서 부모님 선물'],
        ['배려하다', 'Quan tâm nghĩ cho người khác', '상대방의 입장을 깊이 배려하다'],
        ['신경 써 주시다', 'Quan tâm để ý chu đáo giùm', '신경 써 주신 덕분에 잘 끝났어요'],
        ['염려해 주시다', 'Lo lắng bận tâm giùm cho', '선생님이 염려해 주신 덕분입니다'],
        ['다 낫다', 'Khỏi hẳn ốm đau bệnh tật', '약 먹고 푹 잤더니 다 나았어요'],
        ['대접하다', 'Chiêu đãi nồng hậu mời cơm', '베트남 쌀국수를 대접할게요'],
        ['잊지 못할 추억', 'Kỷ niệm đẹp không thể quên', '한국에서 잊지 못할 소중한 추억'],
        ['시내에 나가다', 'Đi ra trung tâm phố xá', '친구를 만나러 시내에 가는 길'],
      ]),
    ],
    grammar: [
      {
        structure: 'Động từ + -는 길이다 (hoặc -는 길에)',
        meaning: 'Đang trên đường làm gì / Nhân tiện trên đường...',
        rule: 'Kết hợp chủ yếu với các động từ di chuyển: 가다, 오다, 퇴근하다, 출근하다...',
        examples: [
          {
            kr: '회식이 있어서 약속 장소로 가는 길이에요.',
            vn: 'Tôi đang trên đường đến địa điểm hẹn vì có liên hoan.',
          },
          {
            kr: '퇴근하는 길에 잠깐 들를게요.',
            vn: 'Tiện đường đi làm về tôi sẽ ghé qua một lát.',
          },
        ],
      },
      {
        structure: 'Danh từ + 덕분에 / Động từ + -(으)ㄴ 덕분에',
        meaning: 'Nhờ có... mà đạt được kết quả tốt',
        rule: 'Chỉ nguyên nhân dẫn tới kết quả tích cực, tốt đẹp.',
        distinction:
          '⭐ TIPS: "덕분에" CHỈ DÙNG CHO KẾT QUẢ TỐT. Với kết quả xấu, phải dùng "때문에". Ví dụ: "친구 때문에 숙제를 못 했어요" (Đúng), "친구 덕분에 숙제를 못 했어요" (Sai).',
        examples: [
          {
            kr: '선생님이 잘 가르쳐 주신 덕분에 한국 회사에 취직할 수 있었어요.',
            vn: 'Nhờ thầy cô dạy dỗ tận tình mà em đã xin được việc ở công ty Hàn.',
          },
        ],
      },
      {
        structure: '-나요 / -(으)ㄴ가요?',
        meaning: 'Đuôi câu hỏi lịch sự, tôn trọng người nghe',
        rule: 'Hiện tại: Động từ + -나요?, Tính từ + -(으)ㄴ가요?, Danh từ + 인가요?. Quá khứ: -았/었나요?.',
        examples: [
          {
            kr: '한국의 대학교는 몇 월에 개강을 하나요?',
            vn: 'Đại học ở Hàn Quốc khai giảng vào tháng mấy thế ạ?',
          },
          { kr: '회비가 얼마인가요?', vn: 'Hội phí tham gia là bao nhiêu vậy ạ?' },
        ],
      },
    ],
    culture: {
      title: 'Lễ phép khi nhờ vả và từ chối ở Hàn Quốc',
      content:
        'Khi nhờ cậy người khác cần dùng lời lẽ khiêm nhường, cân nhắc kỹ hoàn cảnh của đối phương. Khi từ chối, cần bày tỏ sự tiếc nuối và nêu lý do chính đáng một cách tế nhị.',
    },
  },

  3: {
    title: 'Bài 03: 건강 (Sức khỏe & Thể chất)',
    koreanTitle: '건강',
    objectives: 'Giải thích triệu chứng bệnh tật, tư vấn sức khỏe, khuyên bảo lối sống lành mạnh.',
    vocabulary: [
      pack('기본', '기본 어휘 (Sức khỏe, Căng thẳng & Nghỉ ngơi)', [
        ['건강하다', 'Khỏe mạnh kiện khang', '규칙적인 생활로 건강하다'],
        ['건강을 유지하다', 'Duy trì sức khỏe dẻo dai', '매일 유산소 운동으로 건강 유지'],
        ['몸이 약하다', 'Cơ thể yếu ớt', '어릴 때부터 몸이 약했다'],
        ['허약하다', 'Thể trạng suy nhược', '기력이 없고 허약한 체질'],
        ['안색이 좋다', 'Sắc mặt hồng hào tươi tắn', '운동 후 안색이 아주 좋아졌다'],
        ['안색이 나쁘다', 'Sắc mặt xanh xao nhợt nhạt', '오늘 안색이 안 좋아 보여요'],
        ['몸이 안 좋다', 'Người khó ở không khỏe', '감기 기운으로 몸이 안 좋다'],
        ['몸살이 나다', 'Bị cảm ốm đau nhức toàn thân', '몸살기로 온몸이 쑤시고 아프다'],
        ['건강을 지키다', 'Giữ gìn bảo vệ sức khỏe', '건강은 건강할 때 지켜야 한다'],
        ['건강을 돌보다', 'Chăm sóc bồi bổ sức khỏe', '부모님의 건강을 정성껏 돌보다'],
        ['건강을 잃다', 'Đánh mất sức khỏe lao lực', '과로로 인해 건강을 잃었다'],
        ['건강에 좋다', 'Có lợi cho sức khỏe', '채소와 과일은 건강에 좋다'],
        ['건강에 해롭다', 'Có hại độc hại cho cơ thể', '인스턴트 음식은 건강에 해롭다'],
        ['체력', 'Thể lực, sức bền thể chất', '기초 체력을 기르다'],
        ['면역력', 'Hệ miễn dịch sức đề kháng', '면역력을 높여 바이러스 예방'],
        ['비만', 'Chứng béo phì thừa cân', '비만 클리닉에서 상담 치료'],
        ['체중을 조절하다', 'Điều hòa kiểm soát cân nặng', '식단 조절로 체중 감량'],
        ['과로하다', 'Làm việc quá sức kiệt lực', '과로로 쓰러져 입원하다'],
        ['밤샘 작업을 하다', 'Làm việc thức trắng đêm', '야근과 밤샘 작업으로 피로 누적'],
        ['지치다', 'Kiệt sức rã rời mệt lử', '하루 종일 걷느라 지쳤다'],
        ['기진맥진하다', 'Mệt không còn chút sức lực', '등산 후 기진맥진해지다'],
        ['피로를 풀다', 'Xua tan mệt mỏi thể lực', '따뜻한 목욕으로 피로를 풀다'],
        ['피로 회복', 'Phục hồi sức lực mệt mỏi', '피로 회복에 좋은 비타민C'],
        ['휴식을 취하다', 'Nghỉ ngơi tĩnh dưỡng thư thái', '주말에는 온전히 휴식을 취하다'],
      ]),
      pack('새단어', '새 단어 & 읽기 본문 (Bảng từ mới tr. 326 & Bài đọc)', [
        ['스트레스를 받다', 'Bị căng thẳng áp lực stress', '학업 스트레스를 심하게 받다'],
        ['스트레스가 쌓이다', 'Stress tích tụ dồn nén', '스트레스가 쌓여 가슴이 답답하다'],
        ['스트레스를 풀다', 'Giải tỏa xả bớt stress', '취미 생활로 스트레스를 풀다'],
        ['스트레스 해소', 'Sự giải tỏa áp lực stress', '음악 감상을 통한 스트레스 해소'],
        ['불면증', 'Chứng mất ngủ kinh niên', '불면증으로 밤마다 잠을 설치다'],
        ['잠을 설치다', 'Ngủ trằn trọc chập chờn', '걱정 때문에 잠을 설쳤다'],
        ['숙면을 취하다', 'Ngủ một giấc sâu ngon lành', '숙면을 취해야 면역력 증진'],
        ['깊은 잠을 자다', 'Ngủ say giấc không mộng mị', '피로가 풀리도록 깊은 잠을 자다'],
        ['열이 나다', 'Bị phát sốt nhiệt độ tăng', '이마에서 고열이 나다'],
        ['두통약을 먹다', 'Uống thuốc đau nhức đầu', '머리가 지끈거려 두통약 복용'],
        ['진통제', 'Thuốc giảm đau', '통증 완화를 위한 진통제 처방'],
        ['기침을 하다', 'Bị ho sù sụ liên tục', '목이 간지러워 기침을 계속하다'],
        ['목이 붓다', 'Cổ họng sưng tấy rát buốt', '목이 심하게 부어서 침을 못 삼키다'],
        ['치과에 가다', 'Đi khám phòng nha khoa', '충치 치료를 위해 치과 방문'],
        ['변비가 생기다', 'Bị chứng táo bón ruột', '수분과 섬유질 부족으로 변비 발생'],
        ['소화 불량', 'Đầy hơi khó tiêu dạ dày', '급하게 먹어서 소화 불량에 걸리다'],
        ['가슴이 답답하다', 'Tức ngực nghẹn thở khó chịu', '답답한 마음에 창문을 열다'],
        ['가벼운 운동', 'Vận động thể dục nhẹ nhàng', '식후 30분 가볍게 걷기'],
        ['규칙적인 생활', 'Sinh hoạt có quy củ điều độ', '규칙적인 식습관과 수면 시간'],
        ['불규칙적', 'Thất thường không quy củ', '불규칙적인 생활로 건강 악화'],
        ['귤껍질차 (진피차)', 'Trà vỏ quýt khô bổ họng', '비타민C 풍부, 감기 예방에 탁월'],
        ['생강차', 'Trà gừng ấm bụng trị ho', '몸을 따뜻하게 해 주는 생강차'],
        ['유자차', 'Trà thanh yên mật ong thơm', '겨울철 목감기 완화 유자차'],
        ['인삼차', 'Trà nhân sâm bổ dưỡng khí', '원기 회복에 탁월한 전통 한방차'],
      ]),
      pack('듣기', '듣기 스크립트 & 워크북 (Audio CD & Sách bài tập)', [
        ['다이어트', 'Ăn kiêng giảm cân giữ dáng', '무리한 다이어트는 건강을 해친다'],
        ['실천하다', 'Thực hành đưa vào đời sống', '건강 10계명을 매일 실천하다'],
        ['만병의 근원', 'Căn nguyên nguồn gốc muôn bệnh', '스트레스는 만병의 근원'],
        ['친환경 식단', 'Thực đơn thân thiện môi trường', '유기농 채소로 차린 친환경 식단'],
        ['유기농 식품', 'Thực phẩm hữu cơ an toàn', '농약과 비료 없는 유기농 식품'],
        ['서구화되다', 'Bị Tây phương hóa du nhập', '식습관이 급격히 서구화되다'],
        ['패스트푸드', 'Thực phẩm ăn nhanh dầu mỡ', '햄버거 등 패스트푸드 섭취 줄이기'],
        ['통곡물', 'Ngũ cốc nguyên cám hạt', '도정하지 않은 건강 통곡물'],
        ['현미', 'Gạo lứt dinh dưỡng', '백미 대신 현미밥을 섭취하다'],
        ['웰빙 (Well-being)', 'Lối sống an lành khỏe mạnh', '웰빙 라이프스타일의 확산'],
        ['유산소 운동', 'Bài tập thể dục cardio hiếu khí', '걷기, 달리기, 수영 등 유산소 운동'],
        ['인라인스케이트', 'Trượt patin giày bánh lăn', '한강공원에서 인라인스케이트 타기'],
        ['볼링', 'Môn ném bóng gỗ bowling', '주말 볼링 동호회 활동'],
        ['스포츠 7330', 'Chiến dịch thể thao Hàn Quốc', '일주일에 세 번 이상 하루 30분'],
        ['정기 건강검진', 'Khám sức khỏe tổng quát định kỳ', '1년에 한 번 정기 검진 받기'],
        ['신체 나이', 'Tuổi sinh học của cơ thể', '실제 나이보다 젊은 신체 나이'],
        ['수영 강습', 'Lớp học bơi lội bài bản', '새벽 수영 강습 신청'],
        ['온몸이 쑤시다', 'Toàn thân ê ẩm nhức mỏi', '격렬한 운동 후 온몸이 쑤시다'],
        ['무를 꿀에 재우다', 'Ngâm củ cải vào mật ong', '기침 감기에 좋은 민간요법'],
        ['소화 효소', 'Men tiêu hóa đường ruột', '음식물 분해를 돕는 소화 효소'],
        ['만성 피로', 'Chứng mệt mỏi kinh niên mạn', '만성 피로 증후군 극복하기'],
        ['스트레칭 체조', 'Bài tập kéo giãn gân cơ', '사무실에서 틈틈이 하는 스트레칭'],
      ]),
    ],
    grammar: [
      {
        structure: 'Động từ + -는 게 좋다',
        meaning: 'Nên làm gì... / Làm việc gì thì tốt hơn',
        rule: 'Dùng để đưa ra lời khuyên hoặc gợi ý hành động có lợi.',
        examples: [
          {
            kr: '요즘 감기는 독하니까 얼른 병원에 가는 게 좋겠어요.',
            vn: 'Cảm cúm đợt này rất độc nên mau đến bệnh viện thì tốt hơn.',
          },
          {
            kr: '식사는 천천히 하는 게 건강에 좋아요.',
            vn: 'Ăn chậm nhai kỹ sẽ tốt cho sức khỏe.',
          },
        ],
      },
      {
        structure: 'Tính từ + -아/어 보이다',
        meaning: 'Trông có vẻ... / Nhìn có vẻ...',
        rule: 'Diễn tả cảm nhận, phán đoán dựa trên diện mạo bên ngoài.',
        examples: [
          {
            kr: '흐엉 씨, 오늘 안색이 안 좋아 보여요.',
            vn: 'Hương ơi, hôm nay trông sắc mặt bạn không được tốt.',
          },
        ],
      },
      {
        structure: 'Động từ/Tính từ + -(으)ㄴ/는 것 같다',
        meaning: 'Hình như... / Dường như... / Có vẻ như...',
        rule: 'Phán đoán dè dặt, khiêm tốn. Tính từ: -(으)ㄴ 것 같다, Động từ: -는 것 같다.',
        examples: [
          {
            kr: '요즘 과로하는 것 같아요. 좀 쉬세요.',
            vn: 'Dạo này hình như bạn làm việc quá sức rồi đấy.',
          },
        ],
      },
    ],
    culture: {
      title: 'Hoạt động giữ gìn sức khỏe của người Hàn Quốc & Chiến dịch Sports 7330',
      content:
        'Khẩu hiệu nổi tiếng "Sports 7330" khuyến khích: một tuần tập thể dục từ 3 lần trở lên, mỗi lần trên 30 phút. Người Hàn chuộng trà thảo mộc (생강차, 귤껍질차) và thực phẩm hữu cơ (유기농 식품).',
    },
  },

  4: {
    title: 'Bài 04: 쇼핑 (Mua sắm & Dịch vụ)',
    koreanTitle: '쇼핑',
    objectives: 'Bày tỏ sự bất mãn, yêu cầu đổi hàng/hoàn tiền, nắm bắt phương thức thanh toán.',
    vocabulary: [
      pack('기본', '기본 어휘 (Khu vực, Cửa hàng & Trang phục)', [
        ['쇼핑센터', 'Trung tâm mua sắm phức hợp', '원스톱 복합 쇼핑센터'],
        ['대형 마트', 'Đại siêu thị mua sắm lớn', '주말마다 대형 마트 장보기'],
        ['할인 매장', 'Cửa hàng bán đồ giảm giá', '이월 상품 할인 매장'],
        ['아울렛', 'Khu mua sắm hàng hiệu outlet', '교외 아울렛 쇼핑몰'],
        ['인터넷 쇼핑', 'Mua sắm qua mạng Internet', '스마트폰으로 인터넷 쇼핑 즐기기'],
        ['온라인 몰', 'Sàn thương mại điện tử trực tuyến', '공식 온라인 몰 주문'],
        ['홈쇼핑', 'Mua sắm truyền hình TV shopping', '생방송 홈쇼핑 채널 시청'],
        ['전통 시장 (재래시장)', 'Chợ truyền thống địa phương', '덤 문화가 있는 전통 시장'],
        ['매장', 'Gian hàng, nơi bán đồ', '1층 화장품 전용 매장'],
        ['코너', 'Quầy hàng chuyên mục sản phẩm', '신사복 전문 코너'],
        ['아동복', 'Quần áo trẻ em thiếu nhi', '친환경 원단 아동복 코너'],
        ['숙녀복', 'Thời trang trang phục nữ', '2층 여성 숙녀복 매장'],
        ['신사복', 'Âu phục thời trang nam giới', '남성 정장과 신사복 매장'],
        ['등산복', 'Đồ leo núi dã ngoại chức năng', '기능성 아웃도어 등산복'],
        ['겉옷', 'Áo khoác ngoài, đồ mặc ngoài', '따뜻한 겨울 겉옷 챙겨 입기'],
        ['속옷', 'Đồ lót trong mặc sát người', '순면 소재 속옷 세트'],
        ['상표 (태그)', 'Nhãn mác gắn trên sản phẩm', '상표를 떼지 않은 상태'],
        ['영수증', 'Hóa đơn mua hàng thanh toán', '영수증 지참 시 교환 가능'],
        ['교환하다', 'Đổi sang hàng hóa khác', '사이즈가 안 맞아 다른 옷으로 교환'],
        ['교환권', 'Phiếu chứng nhận đổi hàng', '상품 교환권을 지참하다'],
        ['환불하다', 'Hoàn lại tiền mặt đã mua', '구입 후 7일 이내 전액 환불'],
        ['반품하다', 'Trả lại kiện hàng đã nhận', '택배로 물품을 반품 접수하다'],
        ['배송료', 'Cước phí vận chuyển giao hàng', '도서 산간 지역 추가 배송료'],
        ['무료 배송', 'Miễn phí tiền giao hàng', '3만 원 이상 구매 시 무료 배송'],
        ['배송하다', 'Giao hàng, vận chuyển đồ', '주문 당일 신속하게 배송하다'],
      ]),
      pack('새단어', '새 단어 & 읽기 본문 (Bảng từ mới tr. 326 & Bài đọc)', [
        ['주문하다', 'Đặt hàng mua sắm', '인터넷으로 필요한 책을 주문하다'],
        ['일시불', 'Trả thẳng 1 lần duy nhất', '신용카드 일시불 결제 승인'],
        ['할부', 'Trả góp chia làm nhiều kỳ', '3개월 무이자 할부 혜택'],
        ['무이자 할부', 'Trả góp 0 đồng tiền lãi', '카드사 제휴 무이자 할부 행사'],
        ['포인트 적립', 'Tích lũy điểm thưởng thành viên', '결제 금액의 5% 포인트 적립'],
        ['적립하다', 'Tích lũy dồn điểm thưởng', '마일리지를 꾸준히 적립하다'],
        ['수선비', 'Tiền công sửa chữa đồ', '바지 기장 수선비 3천 원'],
        ['수선하다', 'Sửa chữa cắt may quần áo', '허리 치수를 몸에 맞게 수선하다'],
        ['줄이다', 'Cắt bớt, thu nhỏ lại kích thước', '바지 길이를 2센티 줄이다'],
        ['늘리다', 'Nới rộng, kéo dài ra thêm', '치마 폭을 편안하게 늘리다'],
        ['치수 (사이즈)가 작다', 'Kích cỡ bị chật, nhỏ so với người', '치수가 작아서 몸이 끼다'],
        ['치수가 크다', 'Kích cỡ bị rộng to so với dáng', '사이즈가 너무 커서 헐렁하다'],
        ['허리가 끼다', 'Vòng eo bị chật chội bó sát', '허리가 꽉 끼어서 숨쉬기 힘들다'],
        ['헐렁하다', 'Rộng thùng thình lùng bùng', '옷이 너무 헐렁해서 어색하다'],
        ['꼭 맞다', 'Vừa vặn khít như in trên người', '맞춤옷처럼 몸에 꼭 맞다'],
        ['소매가 길다', 'Ống tay áo quá dài trùm tay', '소매가 길어서 접어 입다'],
        ['소매가 짧다', 'Ống tay áo cộc ngắn cũn cỡn', '소매가 짧아서 팔이 드러나다'],
        ['색상이 연하다', 'Tông màu nhạt sáng thanh thoát', '화면보다 색상이 훨씬 연하다'],
        ['색상이 진하다', 'Tông màu đậm sẫm tối hơn', '어둡고 진한 네이비 색상'],
        ['얼룩이 묻다', 'Bị dính vết ố bẩn dơ lem', '새 옷에 커피 얼룩이 묻다'],
        ['얼룩이 생기다', 'Xuất hiện vết ố loang lổ', '세탁 후 얼룩이 생겨 속상하다'],
        ['지퍼가 고장 나다', 'Khóa kéo bị hỏng kẹt vỡ then', '여행 가방 지퍼가 고장 나다'],
        ['구멍이 나다', 'Bị thủng một lỗ rách toạc', '새 양말에 구멍이 뚫려 있다'],
        ['찢어지다', 'Bị rách vải rách toang mép', '종이가 날카로운 곳에 찢어지다'],
      ]),
      pack('듣기', '듣기 스크립트 & 워크북 (Audio CD & Sách bài tập)', [
        ['제품에 이상이 있다', 'Sản phẩm có lỗi bất thường', '제품에 이상이 있어서 교환 요청'],
        ['소비자', 'Người tiêu dùng hàng hóa', '소비자의 정당한 권익 보호'],
        ['소비자 보호원', 'Hội bảo vệ người tiêu dùng', '불량품 피해 소비자 보호원 고발'],
        ['품질 보장', 'Bảo đảm cam kết chất lượng', '1년간 무상 수리 품질 보장'],
        ['불만을 제기하다', 'Nêu khiếu nại, khiếu kiện', '배송 지연에 대해 불만을 제기하다'],
        ['구입하다', 'Mua sắm đồ (trang trọng)', '백화점 정품 매장에서 구입하다'],
        ['판매하다', 'Bán hàng ra thị trường', '온라인 최저가로 판매하다'],
        ['여가 시간', 'Thời gian rảnh rỗi nhàn hạ', '여가 시간에 인터넷 쇼핑 즐기기'],
        ['유행을 타다', 'Bắt kịp mốt trào lưu thời trang', '유행을 타지 않는 클래식 디자인'],
        ['최신 유행', 'Mốt mới nhất đang thịnh hành', '이번 시즌 최신 유행 스타일'],
        ['주방용품', 'Đồ dùng dụng cụ nhà bếp', '냄비와 프라이팬 등 주방용품'],
        ['생활용품', 'Đồ dùng sinh hoạt đời thường', '세제, 치약 등 필수 생활용품'],
        ['취급 주의', 'Cẩn trọng khi sử dụng cầm nắm', '유리 제품이므로 취급 주의 요망'],
        ['창립 기념 세일', 'Siêu giảm giá sinh nhật công ty', '창립 10주년 파격 할인 세일'],
        ['신용카드', 'Thẻ tín dụng mua trước trả sau', '신용카드 결제 승인 문자'],
        ['체크카드', 'Thẻ ghi nợ trừ tiền trực tiếp', '통장 잔액 한도 내 체크카드 결제'],
        ['과소비', 'Tiêu xài hoang phí quá mức', '신용카드 남용으로 인한 과소비'],
        ['충동구매', 'Mua sắm bốc đồng theo cảm xúc', '계획 없는 충동구매를 자제하다'],
        ['알뜰 쇼핑', 'Mua sắm tiết kiệm thông minh', '할인 쿠폰을 활용한 알뜰 쇼핑'],
        ['원피스', 'Váy liền thân phụ nữ một mảnh', '여름철 시원한 원피스 차림'],
        ['블라우스', 'Áo kiểu sơ mi nữ điệu đà', '실크 소재 고급 블라우스'],
        ['캐리어', 'Va li kéo hành lý du lịch', '바퀴가 달린 튼튼한 여행 캐리어'],
        ['택배 기사', 'Bưu tá nhân viên chuyển phát nhanh', '친절한 택배 기사님의 방문'],
        ['환불금', 'Khoản tiền hoàn lại vào tài khoản', '영업일 기준 3일 내 환불금 입금'],
      ]),
    ],
    grammar: [
      {
        structure: 'Danh từ + 대신(에)',
        meaning: 'Thay vì... / Thay cho...',
        rule: 'Diễn đạt sự thay thế đối tượng hoặc hành động.',
        examples: [
          { kr: '커피 대신(에) 우유로 주세요.', vn: 'Lấy cho tôi sữa thay vì cà phê nhé.' },
          {
            kr: '치마 대신(에) 바지로 교환해 주세요.',
            vn: 'Hãy đổi cho tôi sang quần thay vì váy.',
          },
        ],
      },
      {
        structure: 'Động từ/Tính từ + -(으)ㄴ/는 대신(에)',
        meaning: 'Thay vì làm gì... / Bù lại cho việc...',
        rule: 'Vế trước bị thay thế hoặc bù trừ khiếm khuyết cho nhau.',
        examples: [
          {
            kr: '가격이 싼 대신에 기능은 많지 않아요.',
            vn: 'Giá rẻ bù lại thì tính năng không có nhiều.',
          },
        ],
      },
      {
        structure: 'Động từ/Tính từ + -기는 하다',
        meaning: 'Thì có... thật đấy nhưng...',
        rule: 'Thừa nhận vế trước nhưng vế sau đưa ra ý kiến đối lập hoặc bổ sung hạn chế.',
        examples: [
          {
            kr: '싸기는 하지만 불편해서 안 입어요.',
            vn: 'Rẻ thì rẻ thật đấy nhưng bất tiện nên tôi không mặc.',
          },
        ],
      },
    ],
    culture: {
      title: 'Phương thức mua sắm hiện đại tại Hàn Quốc',
      content:
        'Chuyển biến mạnh mẽ sang siêu thị lớn (대형 마트), mua sắm trực tuyến và mua qua truyền hình Home Shopping với dịch vụ giao hàng tận nơi siêu tốc kèm thanh toán thẻ tiện lợi.',
    },
  },

  5: {
    title: 'Bài 05: 요리 (Ẩm thực & Nấu ăn)',
    koreanTitle: '요리',
    objectives: 'Nói về công thức nấu ăn, miêu tả hương vị món ăn, phân tích văn hóa ẩm thực.',
    vocabulary: [
      pack('기본', '기본 어휘 (Cách chế biến món ăn phong phú)', [
        ['썰다', 'Thái lát miếng mỏng vừa ăn', '고기와 채소를 먹기 좋게 썰다'],
        ['얇게 썰다', 'Thái lát thật mỏng dính', '오이를 얇게 썰어 준비하다'],
        ['채썰다', 'Thái sợi chỉ dài mỏng', '당근과 애호박을 곱게 채썰다'],
        ['다지다', 'Băm nhuyễn nhỏ li ti', '마늘과 파를 곱게 다지다'],
        ['빻다', 'Giã trong cối đập dập', '마른 고추를 절구에 빻다'],
        ['버무리다', 'Trộn đều tay với gia vị quyện', '양념에 배추를 손으로 버무리다'],
        ['무치다', 'Trộn gỏi nộm rau củ', '시금치를 고소하게 무치다'],
        ['담그다', 'Muối ủ kim chi, ngâm tương', '겨울철에 김장을 정성껏 담그다'],
        ['절이다', 'Ướp muối cho ngấm mềm xẹp', '배추를 소금물에 하룻밤 절이다'],
        ['볶다', 'Xào, rang lửa lớn ít dầu', '센 불에 야채와 고기를 볶다'],
        ['볶음밥', 'Cơm rang thập cẩm', '김치와 계란을 넣은 볶음밥'],
        ['굽다', 'Nướng vỉ than hoa, nướng lò', '석쇠에 삼겹살을 노릇노릇 굽다'],
        ['찌다', 'Hấp chín bằng hơi nước sôi', '만두를 찜통에 김 올려 찌다'],
        ['계란찜', 'Món trứng hấp cách thủy mềm xốp', '뚝배기에 부드럽게 찐 계란찜'],
        ['삶다', 'Luộc chín ngập nước sôi', '달걀과 수육을 푹 삶다'],
        ['푹 삶다', 'Hầm nhừ luộc thật kỹ lâu', '쇠고기 양지를 푹 삶아 육수 내기'],
        ['끓이다', 'Đun sôi sùng sục canh lẩu', '찌개를 바글바글 끓이다'],
        ['조리다', 'Kho rim cạn nước ngấm sốt', '갈치와 무를 양념에 짭짤하게 조리다'],
        ['부치다', 'Rán áp chảo tráng mỏng bánh', '프라이팬에 기름 두르고 전을 부치다'],
        ['전을 부치다', 'Rán bánh xèo, bánh bột chiên', '비 오는 날 호박전을 부치다'],
        ['튀기다', 'Chiên rán ngập dầu giòn rụm', '바삭바삭하게 감자를 튀기다'],
        ['튀김', 'Món chiên ngập dầu giòn', '바삭한 새우튀김과 야채튀김'],
        ['불리다', 'Ngâm nước cho nở phồng to', '찬물에 미역과 당면을 불리다'],
        ['비비다', 'Trộn đảo đều tay thức ăn', '고추장에 밥을 쓱쓱 비비다'],
        ['두르다', 'Láng vòng dầu đều mặt chảo', '달군 팬에 식용유를 두르다'],
      ]),
      pack('새단어', '새 단어 & 읽기 본문 (Bảng từ mới tr. 327 & Bài đọc)', [
        ['달구다', 'Làm nóng làm bỏng chảo rán', '프라이팬을 센 불에 달구다'],
        ['재다 / 재우다', 'Tẩm ướp thịt cho ngấm vị', '간장 양념에 불고기를 재워 두다'],
        ['간을 보다', 'Nếm thử độ mặn nhạt món ăn', '수저로 국물 간을 보다'],
        ['간을 맞추다', 'Nêm gia vị cho vừa vặn chuẩn', '소금과 간장으로 간을 맞추다'],
        ['간을 하다', 'Cho thêm muối nêm gia vị', '싱거우니까 소금으로 간을 하세요'],
        ['간이 맞다', 'Độ mặn ngọt vừa vặn miệng', '더 넣지 않아도 간이 딱 맞다'],
        ['입맛에 맞다', 'Hợp khẩu vị của người thưởng thức', '외국인 입맛에도 아주 잘 맞다'],
        ['맛이 나다', 'Dậy mùi thơm ngon đậm vị', '참기름을 넣으니 깊은 맛이 나다'],
        ['맛을 보다', 'Nếm thử mùi vị thức ăn', '완성된 요리의 맛을 보다'],
        ['간장', 'Nước tương xì dầu truyền thống', '진간장과 국간장의 차이'],
        ['진간장', 'Nước tương đậm đặc sẫm màu', '조림과 볶음에 쓰는 진간장'],
        ['국간장', 'Nước tương nhạt chuyên nấu canh', '국물 요리에 간 맞추는 간장'],
        ['고춧가루', 'Bột ớt đỏ xay khô Hàn Quốc', '칼칼한 맛을 내는 고춧가루'],
        ['고추장 양념', 'Sốt tương ớt đỏ cay nồng', '매콤달콤한 고추장 양념장'],
        ['된장', 'Tương hạt đậu nành lên men', '구수하고 깊은 된장찌개'],
        ['쌈장', 'Sốt tương chấm thịt nướng', '된장과 고추장을 섞은 쌈장'],
        ['참기름', 'Dầu mè hạt thơm nức mũi', '고소한 풍미의 필수 참기름'],
        ['깨소금', 'Muối vừng rang thơm giã nhỏ', '나물 무침 위에 깨소금 뿌리기'],
        ['다진 마늘', 'Tỏi củ băm nhuyễn mịn', '한국 음식의 필수 향신 양념'],
        ['대파', 'Hành boa-rô to dài xanh', '국물 맛을 시원하게 하는 대파'],
        ['양파', 'Hành tây củ tròn ngọt thơm', '단맛을 내는 볶음용 양파'],
        ['당근', 'Củ cà rốt màu cam tươi', '색감을 살려주는 당근 채썰기'],
        ['당면', 'Miến dong làm món miến xào', '잡채의 핵심 주재료인 당면'],
        ['어묵', 'Chả cá thanh miếng Hàn Quốc', '어묵탕과 떡볶이 필수 재료'],
        ['달콤하다', 'Ngọt ngào dễ chịu dịu dàng', '설탕 대신 과일로 낸 달콤한 맛'],
      ]),
      pack('듣기', '듣기 스크립트 & 워크북 (Audio CD & Sách bài tập)', [
        ['새콤달콤하다', 'Chua chua ngọt ngọt hài hòa', '새콤달콤한 비빔국수 양념'],
        ['매콤하다', 'Cay the the ngon miệng dịu nhẹ', '매콤하고 감칠맛 나는 떡볶이'],
        ['칼칼하다', 'Cay nồng rát họng tê lưỡi', '청양고추를 넣어 국물이 칼칼하다'],
        ['고소하다', 'Bùi béo ngậy thơm hạt mè', '들기름의 고소한 풍미'],
        ['담백하다', 'Thanh đạm không dầu mỡ ngấy', '두부와 생선의 담백한 맛'],
        ['싱겁다', 'Nhạt nhẽo thiếu muối thiếu gia vị', '소금이 덜 들어가서 싱겁다'],
        ['짜다', 'Mặn chát gắt do nhiều muối', '국물이 졸아서 너무 짜다'],
        ['삼계탕', 'Gà hầm sâm đại bổ ngày hè', '복날 원기 회복 삼계탕'],
        ['갈비탕', 'Canh sườn bò hầm ngọt nước', '맑은 국물의 영양 갈비탕'],
        ['설렁탕', 'Canh xương bò hầm trắng đục', '깍두기와 찰떡궁합인 설렁탕'],
        ['갈비찜', 'Sườn bò lợn om gia vị rim ngọt', '명절 손님 초대 요리 갈비찜'],
        ['제육볶음', 'Thịt lợn xào sốt cay nồng', '매콤한 양념의 제육볶음 백반'],
        ['호박전', 'Bánh bí ngòi lăn trứng rán', '노릇노릇 부쳐낸 호박전'],
        ['김치찌개', 'Canh kim chi hầm thịt heo', '한국인의 소울푸드 김치찌개'],
        ['찰떡궁합', 'Cặp đôi ăn ý hoàn hảo hòa quyện', '삼겹살과 쌈채소의 찰떡궁합'],
        ['영양이 풍부하다', 'Hàm lượng dinh dưỡng dồi dào', '단백질과 비타민이 풍부하다'],
        ['보양식', 'Món ăn đại bổ dưỡng dưỡng sinh', '여름철 기력을 돋우는 보양식'],
        ['섭취하다', 'Hấp thụ nạp dinh dưỡng vào', '하루 권장량의 수분을 섭취하다'],
        ['주재료', 'Nguyên liệu chính chủ đạo', '불고기의 주재료인 쇠고기'],
        ['부재료', 'Nguyên liệu phụ gia thêm', '버섯과 양파 등 풍성한 부재료'],
        ['멥쌀', 'Gạo tẻ nấu cơm hàng ngày', '한국인의 주식인 멥쌀밥'],
        ['찹쌀', 'Gạo nếp dẻo thơm nấu xôi', '삼계탕 속에 넣는 찰진 찹쌀'],
        ['잡곡', 'Ngũ cốc hỗn hợp các loại hạt', '건강을 위해 섞어 먹는 잡곡밥'],
        ['든든하다', 'Chắc dạ ấm lòng no lâu', '아침밥을 든든하게 챙겨 먹다'],
        ['순두부찌개', 'Canh đậu phụ non cay nóng hổi', '뚝배기에 끓여 내는 순두부찌개'],
      ]),
    ],
    grammar: [
      {
        structure: 'Động từ + -고 나서',
        meaning: 'Sau khi làm xong... thì...',
        rule: 'Nhấn mạnh hành động ở vế trước phải hoàn tất trọn vẹn rồi hành động sau mới diễn ra.',
        examples: [
          {
            kr: '쇠고기를 볶고 나서 채소를 넣으세요.',
            vn: 'Xào thịt bò xong xuôi rồi hãy cho rau củ vào.',
          },
        ],
      },
      {
        structure: 'Danh từ + (으)로',
        meaning: 'Bằng... (chỉ nguyên liệu, dụng cụ, phương tiện)',
        rule: 'Nguyên âm hoặc phụ âm ㄹ dùng 로, phụ âm khác dùng 으로.',
        examples: [
          {
            kr: '삼계탕은 닭과 인삼으로 만듭니다.',
            vn: 'Món Samgyetang được nấu bằng gà và nhân sâm.',
          },
        ],
      },
      {
        structure: 'Động từ + -다가',
        meaning: 'Đang làm... thì (bị gián đoạn chuyển sang hành động khác)',
        rule: 'Hành động vế 1 đang tiếp diễn thì có hành động 2 chen ngang làm ngắt quãng.',
        examples: [
          { kr: '양파를 썰다가 손가락을 다쳤어요.', vn: 'Đang thái hành tây thì bị đứt tay.' },
        ],
      },
    ],
    culture: {
      title: 'Tên gọi món ăn Hàn Quốc theo phương pháp chế biến',
      content:
        'Tên món ăn Hàn Quốc thường được cấu tạo bằng [Nguyên liệu chính] + [Cách nấu]. Ví dụ: 불고기 (thịt nướng), 오징어볶음 (mực xào), 생선조림 (cá kho rim), 갈비탕 (canh sườn bò), 김치찌개 (canh sốt kim chi).',
    },
  },

  6: {
    title: 'Bài 06: 은행 (Nghiệp vụ ngân hàng)',
    koreanTitle: '은행',
    objectives: 'Mở tài khoản, thực hiện giao dịch chuyển tiền, hỏi đáp các thủ tục tài chính.',
    vocabulary: [
      pack('기본', '기본 어휘 (Mở sổ, Gửi tiền, Rút tiền & Chuyển khoản)', [
        ['통장을 만들다', 'Mở sổ tài khoản ngân hàng', '은행 창구에서 첫 통장 개설'],
        ['통장을 개설하다', 'Mở tài khoản ngân hàng (trang trọng)', '새로운 계좌를 개설하다'],
        ['통장 정리', 'In cập nhật sổ tiết kiệm định kỳ', '통장정리기로 거래 내역 인쇄'],
        ['기장하다', 'In sổ, ghi nhận sổ sách', '거래 내역을 통장에 기장하다'],
        ['계좌 번호', 'Số tài khoản ngân hàng', '송금할 상대방의 계좌 번호'],
        ['계좌 이체', 'Chuyển tiền tài khoản sang tài khoản', '스마트폰으로 간편 계좌 이체'],
        ['예금하다', 'Gửi tiền vào tài khoản sinh lời', '여유 자금을 은행에 예금하다'],
        ['정기예금', 'Gửi tiết kiệm định kỳ lãnh lãi', '1년 만기 정기예금 가입'],
        ['적금을 들다', 'Gửi tiết kiệm tích lũy từng tháng', '매달 30만 원씩 적금을 붓다'],
        ['적금 만기', 'Đáo hạn sổ tiết kiệm tích lũy', '적금 만기가 되어 원금 수령'],
        ['출금하다', 'Rút tiền mặt ra khỏi tài khoản', 'ATM기에서 현금을 출금하다'],
        ['인출하다', 'Rút tiền ngân hàng (từ Hán)', '예금을 전액 인출하다'],
        ['입금하다', 'Nộp tiền mặt vào tài khoản', '통장으로 월급이 입금되다'],
        ['무통장 입금', 'Nộp tiền không cần sổ hay thẻ', '창구에서 무통장 입금 신청'],
        ['송금하다', 'Chuyển tiền gửi đi nơi khác', '고향 가족에게 생활비를 송금하다'],
        ['해외 송금', 'Chuyển tiền ra nước ngoài quốc tế', '외환 창구에서 해외 송금 처리'],
        ['대출하다', 'Vay tiền vốn tín dụng ngân hàng', '주택 구입 자금을 대출하다'],
        ['대출을 받다', 'Được duyệt nhận tiền vay vốn', '저금리로 은행 대출을 받다'],
        ['잔액 조회', 'Tra cứu kiểm tra số dư còn lại', '인터넷뱅킹으로 잔액 조회하기'],
        ['잔고 확인', 'Xem số tiền còn trong tài khoản', '지출 전 통장 잔고 확인'],
        ['수수료를 내다', 'Nộp trả phí dịch vụ giao dịch', '타행 이체 수수료를 부담하다'],
        ['수수료 면제', 'Miễn trừ tiền phí dịch vụ', '급여 통장 이체 수수료 면제 혜택'],
        ['환전하다', 'Đổi ngoại tệ lấy tiền bản địa', '해외여행 전 달러화로 환전하다'],
        ['환율 우대', 'Ưu đãi mức tỷ giá ngoại hối', '환율 우대 쿠폰을 적용받다'],
        ['동전을 교환하다', 'Đổi tiền xu kim loại thành tiền giấy', '동전교환기에서 지폐로 바꾸다'],
      ]),
      pack('새단어', '새 단어 & 읽기 본문 (Bảng từ mới tr. 328 & Bài đọc)', [
        ['비밀번호를 입력하다', 'Nhập mã số bí mật bảo mật 4 số', '비밀번호 3회 오류 시 잠금 처리'],
        ['신분증', 'Giấy tờ tùy thân căn cước', '본인 확인용 필수 신분증 지참'],
        ['주민등록증', 'Thẻ căn cước công dân quốc gia', '대한민국 주민등록증 제시'],
        ['여권', 'Hộ chiếu xuất nhập cảnh quốc tế', '외국인 거래 시 여권 필수 지참'],
        ['도장', 'Con dấu mộc khắc tên cá nhân', '서명 대신 도장으로 통장 개설'],
        ['서명 (사인)', 'Chữ ký viết tay của chính chủ', '신청서 하단에 정자 서명'],
        ['현금카드', 'Thẻ rút tiền mặt tại máy ATM', '현금카드로 간편 인출'],
        ['체크카드', 'Thẻ ghi nợ trực tiếp qua tài khoản', '연회비 없는 청년 체크카드'],
        ['신용카드', 'Thẻ tín dụng thanh toán sau', '신용카드 한도 금액 조회'],
        ['한도 금액', 'Hạn mức chi tiêu tối đa của thẻ', '월 사용 한도 금액 설정'],
        ['자동출금기 (ATM기)', 'Máy rút nộp tiền tự động 24h', '365일 24시간 무인 자동출금기 코너'],
        ['인터넷뱅킹', 'Dịch vụ ngân hàng qua mạng Internet', '공인인증서로 인터넷뱅킹 접속'],
        ['텔레뱅킹', 'Ngân hàng qua tổng đài điện thoại', 'ARS 전화 텔레뱅킹 송금'],
        ['스마트폰뱅킹', 'Ngân hàng trên app di động thông minh', '간편한 모바일 앱 뱅킹 이용'],
        ['창구', 'Quầy làm việc giao dịch trực tiếp', '1번 창구에서 대기하다'],
        ['번호표를 뽑다', 'Bấm lấy số thứ tự xếp hàng', '도착하자마자 순번 대기 번호표를 뽑다'],
        ['출금 신청서', 'Giấy đề nghị rút tiền mặt', '창구 직원의 안내로 신청서 작성'],
        ['지폐', 'Tiền giấy mệnh giá các loại', '한국은행 발행 정식 지폐'],
        ['만 원짜리', 'Tờ tiền mệnh giá 10.000 won', '세종대왕 그림의 만 원짜리 지폐'],
        ['오만 원짜리', 'Tờ tiền mệnh giá 50.000 won', '신사임당 그림의 오만 원짜리 지폐'],
        ['천 원짜리', 'Tờ tiền lẻ mệnh giá 1.000 won', '퇴계 이황 그림의 천 원짜리 지폐'],
        ['잔돈', 'Tiền thối lại, tiền lẻ rời rạc', '거스름돈으로 받은 동전 잔돈'],
        ['수표', 'Chi phiếu ngân phiếu thanh toán', '고액 결제용 자기앞수표'],
        ['자기앞수표', 'Séc bảo chứng ngân hàng phát hành', '10만 원권 자기앞수표 배서'],
      ]),
      pack('듣기', '듣기 스크립트 & 워크북 (Audio CD & Sách bài tập)', [
        ['공과금', 'Tiền dịch vụ công (điện, nước, ga)', '매달 납부하는 아파트 공과금'],
        ['공과금을 납부하다', 'Nộp thanh toán hóa đơn công ích', '은행에서 공과금을 수납 납부하다'],
        ['지로용지', 'Giấy báo thanh toán chuyển khoản', '지로용지의 전자 납부 번호 확인'],
        [
          '자동이체 (자동 납부)',
          'Chuyển tiền tự động trừ hàng tháng',
          '날짜 맞춰 공과금 자동이체 신청',
        ],
        ['가계부를 쓰다', 'Ghi chép sổ chi tiêu gia đình', '알뜰살뜰 꼼꼼히 가계부를 기록하다'],
        ['용돈기입장', 'Sổ ghi chi tiêu tiền tiêu vặt', '어린 시절 용돈기입장 쓰는 습관'],
        ['수입', 'Khoản thu nhập kiếm vào túi', '고정 수입과 부수입 정산'],
        ['지출', 'Khoản chi tiêu tiền xuất ra ngoài', '불필요한 과소비 지출 줄이기'],
        ['저금통', 'Heo đất đựng tiền xu tiết kiệm', '동전을 차곡차곡 모으는 저금통'],
        ['분실신고', 'Khai báo mất thẻ mất sổ ngân hàng', '카드 분실 즉시 고객센터 분실신고'],
        ['도둑맞다', 'Bị kẻ gian trộm cắp mất tài sản', '지갑을 도둑맞아 계좌 지급 정지'],
        ['함부로', 'Bừa bãi cẩu thả không suy nghĩ', '비밀번호를 남에게 함부로 알려주지 마라'],
        ['저축왕', 'Vua tiết kiệm được vinh danh', '수입의 80%를 저축하여 저축왕 선정'],
        ['상금', 'Tiền giải thưởng nhận được', '상금 전액을 불우이웃 돕기에 기부'],
        ['절반', 'Một nửa 50% số lượng tiền', '월급의 절반을 적금에 넣다'],
        ['절약하다', 'Căn cơ tằn tiện tiết kiệm tiền', '알뜰하게 아끼고 절약하는 생활 습관'],
        ['재테크', 'Nghệ thuật đầu tư quản lý tài chính', '부동산과 주식 금융 재테크 공부'],
        ['이자', 'Tiền lời tiền lãi sinh sôi ra', '정기예금 만기 후 이자 수령'],
        ['금리 (이율)', 'Mức lãi suất tỷ lệ phần trăm', '시중 은행의 예금 금리 비교'],
        ['만기일', 'Ngày hết hạn đáo hạn kỳ phiếu', '적금 만기일에 맞춰 은행 방문'],
        ['통장 사본', 'Bản photo sao chép mặt sổ ngân hàng', '장학금 지급 신청 시 통장 사본 제출'],
        ['본인 확인', 'Xác minh danh tính chính chủ', '신분증으로 본인 확인 절차 진행'],
        ['보이스피싱', 'Lừa đảo mạo danh ngân hàng qua đt', '금융 사기 보이스피싱 피해 예방'],
        ['사업자우대적금', 'Gói tiết kiệm ưu đãi hộ kinh doanh', 'KB국민은행 중소기업 지원 상품'],
        ['금융 사기', 'Tội phạm lừa đảo tài chính tinh vi', '개인정보 유출로 인한 금융 사기 주의'],
      ]),
    ],
    grammar: [
      {
        structure: 'Động từ + -기 쉽다',
        meaning: 'Dễ bị... / Rất dễ xảy ra...',
        rule: 'Chỉ khả năng xảy ra của một hiện tượng, thường là sơ suất bất lợi.',
        examples: [
          {
            kr: '날짜를 잊어버리기 쉬우니까 자동이체를 신청하세요.',
            vn: 'Rất dễ quên ngày nộp nên bạn hãy đăng ký chuyển khoản tự động.',
          },
        ],
      },
      {
        structure: 'Động từ + -는 동안 (Danh từ + 동안)',
        meaning: 'Trong suốt khoảng thời gian...',
        rule: 'Diễn tả hành động diễn ra trong lúc một khoảng thời gian đang duy trì.',
        examples: [
          {
            kr: '신분증을 복사하는 동안 신청서를 작성해 주세요.',
            vn: 'Trong lúc tôi photo thẻ căn cước, xin hãy điền đơn đăng ký.',
          },
        ],
      },
      {
        structure: 'Động từ + -(으)려면',
        meaning: 'Nếu muốn làm gì...',
        rule: 'Giả định mục đích để đưa ra điều kiện cần thiết.',
        examples: [
          {
            kr: '송금을 하려면 계좌 번호를 알아야 해요.',
            vn: 'Nếu muốn chuyển tiền thì phải biết số tài khoản.',
          },
        ],
      },
    ],
    culture: {
      title: 'Dịch vụ Ngân hàng tại Hàn Quốc',
      content:
        'Hệ thống ngân hàng Hàn Quốc phát triển với mạng lưới ATM hoạt động 24/7, Internet Banking, Smartphone Banking tiện lợi kết hợp ngân hàng thương mại tổng hợp (như KB Kookmin).',
    },
  },

  7: {
    title: 'Bài 07: 성격 (Tính cách & Phẩm chất)',
    koreanTitle: '성격',
    objectives: 'Miêu tả tính cách con người, khen ngợi, cảm thán, nhận xét mức độ tính cách.',
    vocabulary: [
      pack('기본', '기본 어휘 (Tính từ miêu tả tính cách con người)', [
        ['활발하다', 'Hoạt bát vui tươi năng động', '매사에 긍정적이고 활발하다'],
        ['명랑하다', 'Vui tươi sáng sủa rạng rỡ', '잘 웃고 명랑한 성격의 소유자'],
        ['밝다', 'Rạng rỡ tươi tắn hồn nhiên', '성격이 밝아서 주위를 환하게 하다'],
        ['착하다', 'Hiền lành tử tế lương thiện', '마음씨가 곱고 착한 친구'],
        ['조용하다', 'Trầm tính ít nói lặng lẽ', '말수가 적고 차분하며 조용하다'],
        ['얌전하다', 'Thanh lịch nết na thùy mị', '어른들 앞에서 얌전하고 예의 바르다'],
        ['솔직하다', 'Thẳng thắn bộc trực thật thà', '자신의 생각을 솔직하게 털어놓다'],
        ['털털하다', 'Bình dân xuề xòa không câu nệ', '성격이 털털해서 친구가 많다'],
        ['차분하다', 'Điềm tĩnh ung dung khoan thai', '위기 속에서도 차분하게 대처하다'],
        ['침착하다', 'Bình tĩnh không hề bấn loạn', '침착함을 잃지 않고 문제를 해결하다'],
        ['성격이 급하다', 'Tính tình nóng vội hấp tấp', '빨리빨리 서두르며 성격이 급하다'],
        ['덤벙대다', 'Hậu đậu hay quên lơ đễnh', '물건을 잘 잃어버리고 덤벙대다'],
        ['고집이 세다', 'Bướng bỉnh cứng đầu bảo thủ', '남의 충고를 듣지 않고 고집이 세다'],
        ['완고하다', 'Cố chấp khăng khăng ý mình', '옛 방식을 고집하는 완고한 태도'],
        ['느긋하다', 'Ung dung thong dong nhàn nhã', '마음이 느긋해서 서두르지 않다'],
        ['여유롭다', 'Thư thái thong thả bình tâm', '여유로운 미소를 짓다'],
        ['적극적이다', 'Tích cực chủ động hăng hái', '토론 수업에 적극적으로 참여하다'],
        ['소극적이다', 'Thụ động rụt rè ngại ngùng', '자신감이 없어 소극적인 태도'],
        ['사교적이다', 'Dễ gần có tài kết giao bạn bè', '사람들과 금방 친해지는 사교적인 성격'],
        ['낯을 안 가리다', 'Không e thẹn người lạ dạn dĩ', '처음 봐도 낯을 전혀 안 가리다'],
        ['내성적이다', 'Hướng nội kín đáo trầm lặng', '생각이 많고 조용한 내성적인 성격'],
        ['외향적이다', 'Hướng ngoại cởi mở hoạt náo', '야외 활동을 즐기는 외향적인 사람'],
        ['신중하다', 'Thận trọng cân nhắc chu đáo', '결정을 내릴 때 매사 신중하다'],
        ['꼼꼼하다', 'Tỉ mỉ chi tiết cẩn thận từng li', '서류를 꼼꼼하게 검토하다'],
      ]),
      pack('새단어', '새 단어 & 읽기 본문 (Quán ngữ cơ thể & Bài đọc tr. 329)', [
        ['부지런하다', 'Chăm chỉ cần cù siêng năng', '아침 일찍 일어나는 부지런한 학생'],
        ['성실하다', 'Cần mẫn thành thật đúng giờ', '지각 한 번 없는 성실한 생활 태도'],
        ['게으르다', 'Lười biếng trễ nải ườn ra', '청소를 미루고 침대에서 게으르다'],
        ['다정하다', 'Ấm áp giàu tình cảm trìu mến', '다정다감하게 말을 건네다'],
        ['배려심이 많다', 'Giàu lòng quan tâm chu đáo', '남의 아픔을 보듬는 배려심'],
        ['입이 무겁다', 'Kín miệng giữ bí mật cực tốt', '비밀을 지키려면 입이 무거워야 한다'],
        ['입이 가볍다', 'Ba hoa hay bép xép lộ chuyện', '입이 가벼워서 남의 말을 퍼뜨리다'],
        ['발이 넓다', 'Quen biết rộng rãi khắp nơi', '마당발이라 불릴 만큼 발이 넓다'],
        ['눈이 높다', 'Mắt nhìn cao kén chọn khó tính', '눈이 너무 높아서 이성을 못 사귀다'],
        ['콧대가 높다', 'Kiêu kỳ kiêu căng ngạo mạn', '자존심이 세고 콧대가 높다'],
        ['귀가 얇다', 'Nhẹ dạ cả tin dễ bị lung lay', '남의 말에 쉽게 흔들리는 귀가 얇은 사람'],
        ['손이 크다', 'Hào phóng chi tiêu lượng lớn', '손이 커서 음식을 잔뜩 차려내다'],
        [
          '발을 벗고 나서다',
          'Nhiệt tình lăn xả xắn tay áo giúp',
          '어려운 이웃 돕기에 발을 벗고 나서다',
        ],
        ['책임감이 강하다', 'Tinh thần trách nhiệm cao độ', '맡은 업무를 완수하는 책임감'],
        ['생각이 깊다', 'Suy nghĩ chín chắn sâu xa', '나이에 비해 속이 깊고 생각이 깊다'],
        ['재주가 많다', 'Có nhiều hoa tay tài lẻ tháo vát', '노래와 그림 등 다재다능한 재주'],
        ['이해심이 많다', 'Giàu lòng thấu hiểu cảm thông', '상대방의 입장을 감싸주는 이해심'],
        ['유머 감각', 'Khiếu hài hước dí dỏm duyên dáng', '유머 감각이 뛰어나 분위기 메이커'],
        ['시원시원하다', 'Hào sảng xởi lởi dứt khoát', '성격이 시원시원하여 뒤끝이 없다'],
        ['유능하다', 'Có năng lực tài ba tháo vát', '회사에서 인정받는 유능한 인재'],
        ['무능하다', 'Bất tài vô dụng không năng lực', '책임을 다하지 못하는 무능한 태도'],
        ['분석적이다', 'Có đầu óc phân tích dữ liệu', '문제를 분석적으로 파악하다'],
        ['논리적이다', 'Có tính logic chặt chẽ xác đáng', '조리 있고 논리적인 말솜씨'],
        ['계산적이다', 'Toan tính so đo thiệt hơn cá nhân', '인간관계에서 너무 계산적이다'],
      ]),
      pack('듣기', '듣기 스크립트 & 워크북 (Audio CD & Sách bài tập)', [
        ['자기중심적이다', 'Ích kỷ chỉ biết bản thân mình', '남을 배려하지 않는 자기중심적 성격'],
        ['호기심이 많다', 'Tò mò ham khám phá học hỏi', '새로운 지식에 호기심이 많다'],
        ['혈액형별 성격', 'Tính cách theo 4 nhóm máu ABO', '한국인들이 즐겨 묻는 혈액형'],
        ['격려하다', 'Cổ vũ động viên khích lệ tinh thần', '낙담한 친구를 따뜻하게 격려하다'],
        ['다투다', 'Tranh cãi cãi lộn xích mích', '사소한 일로 형제끼리 다투다'],
        ['말다툼하다', 'Khẩu chiến cãi vã bằng lời', '서로 의견이 달라 말다툼을 벌이다'],
        ['추진하다', 'Đẩy mạnh xúc tiến tiến hành', '강한 추진력으로 프로젝트 완수'],
        ['지도자', 'Người lãnh đạo dẫn dắt tập thể', '모범을 보이는 훌륭한 지도자'],
        ['리더십', 'Năng lực phong thái lãnh đạo', '팀을 하나로 모으는 리더십'],
        ['합리적이다', 'Hợp lý thấu tình đạt lý', '합리적인 의사결정과 지출'],
        ['주장이 강하다', 'Chính kiến mạnh mẽ kiên định', '자신의 주장이 너무 강하다'],
        ['긍정적이다', 'Lạc quan tích cực yêu đời', '어려운 상황에서도 긍정적인 생각'],
        ['소년소녀가장', 'Trẻ em trụ cột gia đình mất cha mẹ', '어려움 속에서도 꿋꿋한 소년가장'],
        ['감정이 풍부하다', 'Giàu cảm xúc rung động tinh tế', '예술가처럼 감정이 풍부하다'],
        ['뒤끝이 없다', 'Không để bụng không thù dai vặt', '싸우고 바로 화해하여 뒤끝이 없다'],
        [
          '팀워크 (Teamwork)',
          'Tinh thần đồng đội làm việc nhóm',
          '경기에서 이기려면 팀워크가 필수',
        ],
        ['빨리빨리 문화', 'Văn hóa khẩn trương của Hàn Quốc', '속도와 효율을 중시하는 배경'],
        ['정이 많다', 'Giàu tình cảm sâu nặng ấm áp', '한국인의 따뜻한 민족적 정서'],
        ['관상', 'Nhân tướng học nhìn mặt đoán người', '얼굴 생김새 관상으로 성격 파악'],
        ['손금', 'Chỉ tay trong lòng bàn tay bói toán', '손금을 보며 미래 운세 점치기'],
        ['별자리', 'Chòm sao cung hoàng đạo 12 sao', '생일 별자리로 보는 성격 특징'],
        ['띠별 성격', 'Tính cách theo 12 con giáp tuổi', '태어난 해 띠별 궁합과 성향'],
        ['글씨', 'Nét chữ viết tay trên giấy', '글씨체를 보면 성격을 알 수 있다'],
        ['바느질', 'Khâu vá thêu thùa tỉ mỉ', '차분하고 얌전하게 바느질하기'],
      ]),
    ],
    grammar: [
      {
        structure: 'Danh từ + 처럼',
        meaning: 'Như là... / Giống như...',
        rule: 'So sánh mức độ hoặc đặc tính tương đương giữa hai đối tượng.',
        examples: [
          {
            kr: '우리 교수님은 어머니처럼 마음이 넓으십니다.',
            vn: 'Giáo sư của chúng tôi có tấm lòng bao dung như người mẹ.',
          },
        ],
      },
      {
        structure: 'Tính từ + -군요, Động từ + -는군요',
        meaning: '...hóa ra là vậy! / ...thế cơ à!',
        rule: 'Đuôi cảm thán khi vừa nhận biết một sự thật mới. Quá khứ: -았/었군요.',
        examples: [
          {
            kr: '결석을 한 번도 안 했어요. 정말 성실하군요!',
            vn: 'Bạn không nghỉ buổi nào, thật là chăm chỉ quá!',
          },
        ],
      },
      {
        structure: 'Động từ/Tính từ + -(으)ㄴ/는 편이다',
        meaning: 'Thuộc diện... / Thuộc tuýp người...',
        rule: 'Đánh giá mức độ nghiêng về một chiều hướng nào đó.',
        examples: [
          {
            kr: '저는 성격이 급하고 고집이 센 편이에요.',
            vn: 'Tôi thuộc diện tính tình nóng vội và bướng bỉnh.',
          },
        ],
      },
    ],
    culture: {
      title: 'Đặc điểm tính cách của người Hàn Quốc & Văn hóa "빨리빨리"',
      content:
        'Người Hàn Quốc nổi tiếng với tác phong khẩn trương "빨리빨리" (nhanh lên nhanh lên), đồng thời rất giàu tình cảm sâu nặng (정), nhiệt tình và gắn kết tập thể.',
    },
  },

  8: {
    title: 'Bài 08: 실수 (Sai sót & Khắc phục)',
    koreanTitle: '실수',
    objectives: 'Nói lý do trễ hẹn, giải thích sơ suất, cam kết sửa sai và nhắc nhở người khác.',
    vocabulary: [
      pack('기본', '기본 어휘 (Sự cố ngoài ý muốn, Tai nạn & Hỏng hóc)', [
        ['실수하다', 'Mắc sai sót sơ suất lơ đễnh', '누구나 살면서 실수를 한다'],
        ['실수를 저지르다', 'Phạm phải lỗi lầm nghiêm trọng', '돌이킬 수 없는 실수를 저지르다'],
        ['잘못하다', 'Làm điều sai quấy sai trái', '제가 잘못했으니 용서해 주세요'],
        ['잘못을 인정하다', 'Thẳng thắn nhận lỗi về mình', '변명하지 않고 잘못을 시인하다'],
        ['잃어버리다', 'Làm mất đánh mất đồ vật', '지하철에 우산을 잃어버리다'],
        ['분실하다', 'Làm thất lạc đồ đạc tài sản', '지갑을 분실하여 분실물 센터 문의'],
        ['오해하다', 'Hiểu nhầm sai ý người khác', '말뜻을 오해하여 화를 내다'],
        ['오해를 풀다', 'Hóa giải sự hiểu lầm xích mích', '대화로 친구와의 오해를 풀다'],
        ['쏟다', 'Làm đổ tràn nước nước canh', '키보드 위에 커피를 쏟다'],
        ['물을 쏟다', 'Làm đổ nước lênh láng', '실수로 컵을 쳐서 물을 쏟았다'],
        ['찢다', 'Làm xé rách giấy vở quần áo', '중요한 서류를 실수로 찢다'],
        ['찢어지다', 'Bị rách toạc mép bung chỉ', '바지가 못에 걸려 찢어지다'],
        ['넘어지다', 'Vấp ngã bổ nhào xuống đất', '빙판길에 미끄러져 넘어지다'],
        ['계단에서 구르다', 'Ngã lăn lông lốc bậc thang', '발을 헛디뎌 계단에서 구르다'],
        ['미끄러지다', 'Trượt chân ngã trượt sàn ướt', '물기 있는 바닥에서 미끄러지다'],
        ['떨어뜨리다', 'Làm rơi tuột đồ vật xuống đất', '스마트폰을 바닥에 떨어뜨리다'],
        ['깨뜨리다', 'Làm vỡ tan cốc chén đồ thủy tinh', '설거지하다가 그릇을 깨뜨리다'],
        ['부서지다', 'Bị vỡ nát sứt mẻ tan tành', '안경테가 부서져 새로 맞추다'],
        ['망가지다', 'Bị hỏng bét trục trặc hư hại', '컴퓨터가 망가져 과제를 못 하다'],
        ['고장 나다', 'Bị hỏng hóc máy móc thiết bị', '알람 시계가 고장 나는 바람에 늦잠'],
        ['작동이 안 되다', 'Không hoạt động ngừng chạy', '전원을 켜도 기계가 작동이 안 되다'],
        ['문제가 생기다', 'Nảy sinh vấn đề rắc rối sự cố', '일정에 차질과 문제가 생기다'],
        ['발을 밟다', 'Dẫm vào chân người khác', '만원 지하철에서 남의 발을 밟다'],
        ['발이 밟히다', 'Bị người khác dẫm lên chân', '발이 밟혀서 몹시 아팠다'],
      ]),
      pack('새단어', '새 단어 & 읽기 본문 (Bảng từ mới tr. 330 & Bài đọc)', [
        ['사과하다', 'Xin lỗi nhận lỗi chân thành', '진심을 다해 고개 숙여 사과하다'],
        ['정중히 사과하다', 'Cúi đầu tạ lỗi cung kính', '고객에게 정중히 사과하다'],
        ['용서를 빌다', 'Cầu xin sự tha thứ lượng thứ', '무릎을 꿇고 용서를 빌다'],
        ['용서하다', 'Tha thứ bao dung độ lượng', '친구의 잘못을 너그럽게 용서하다'],
        ['양해를 구하다', 'Xin thông cảm cho sự bất tiện', '지각에 대해 미리 양해를 구하다'],
        ['변명하다', 'Biện bạch thanh minh quanh co', '핑계를 대며 변명하지 마라'],
        ['핑계를 대다', 'Viện cớ đùn đẩy trách nhiệm', '바쁘다는 핑계를 대고 빠지다'],
        ['잊어버리다', 'Quên bẵng lãng quên mất', '중요한 약속 날짜를 잊어버리다'],
        ['까먹다', 'Quên sạch bách không còn nhớ', '시험 범위를 깜빡 까먹었다'],
        ['깜빡하다', 'Quên khuấy đi trong chốc lát', '지갑 챙겨 나오는 걸 깜빡하다'],
        ['헷갈리다', 'Lẫn lộn mơ hồ không rõ ràng', '길이 헷갈려서 한참을 헤매다'],
        ['착각하다', 'Ngộ nhận lầm tưởng sai lệch', '약속 시간을 1시로 착각하다'],
        ['생각이 나다', 'Sực nhớ ra, bật lên trong đầu', '방금 전에 이름이 번뜩 생각났다'],
        ['기억하다', 'Ghi nhớ khắc sâu trong tâm trí', '선생님의 말씀을 똑똑히 기억하다'],
        ['건망증이 있다', 'Có tính đãng trí hay quên đồ', '메모하는 습관으로 건망증 극복'],
        ['조심하다', 'Cẩn trọng để ý giữ gìn', '다치지 않도록 각별히 조심하세요'],
        ['주의하다', 'Chú ý cảnh giác cẩn thận', '미끄러운 바닥에 넘어지지 않게 주의'],
        ['경로석 (노약자석)', 'Ghế ưu tiên người già khuyết tật', '노약자에게 자리를 양보하다'],
        ['말실수', 'Lỡ lời nói hớ vạ miệng hớ hênh', '말실수로 상대방을 당황하게 하다'],
        ['실언하다', 'Nói bậy buông lời không đúng', '술자리에서 실언하여 사과하다'],
        ['늦잠을 자다', 'Ngủ quên dậy muộn hơn giờ', '알람을 못 듣고 늦잠을 잤다'],
        ['명심하다', 'Khắc cốt ghi tâm lời răn dạy', '선생님의 소중한 충고를 명심하다'],
        ['가슴에 새기다', 'Khắc sâu vào tận đáy lòng', '부모님의 은혜를 가슴에 새기다'],
        ['곰곰이 생각하다', 'Suy nghĩ kỹ càng thấu đáo sâu', '앞으로의 진로를 곰곰이 생각하다'],
      ]),
      pack('듣기', '듣기 스크립트 & 워크북 (Audio CD & Sách bài tập)', [
        ['화가 풀리다', 'Nguôi giận, hết bực bội bực dọc', '사과 편지를 읽고 화가 풀렸다'],
        ['벌금을 내다', 'Nộp tiền phạt vi phạm hành chính', '쓰레기 무단 투기로 벌금을 내다'],
        ['과태료', 'Tiền phạt vi phạm luật lệ', '주차 위반 과태료 고지서'],
        ['강력 접착제', 'Keo dán siêu dính siêu bền', '실수로 탄생한 포스트잇 접착제'],
        ['포스트잇', 'Giấy ghi chú dán tạm dính', '붙였다 떼기 쉬운 메모지 발명품'],
        ['떼다', 'Bóc ra, gỡ rời ra khỏi chỗ dán', '벽에 붙은 스티커를 떼다'],
        ['붙이다', 'Dán dính vào bề mặt vật', '게시판에 안내문을 풀로 붙이다'],
        ['바르다', 'Đúng đắn chuẩn mực / Bôi trét', '바른 자세와 올바른 언어 습관'],
        ['젖다', 'Bị thấm ướt sũng nước mưa', '비에 젖어 옷이 흠뻑 젖었다'],
        ['어쩔 수 없다', 'Đành chịu không còn cách nào khác', '상황이 이러니 어쩔 수 없네요'],
        ['수고하세요', 'Chúc vất vả (tối kỵ với bề trên)', '윗사람에게 쓰면 결례인 표현'],
        ['안녕히 계세요', 'Chào ở lại (chuẩn khi chào bề trên)', '수고하세요 대신 올바른 인사말'],
        ['혼나다', 'Bị mắng bị quở trách nặng nề', '어르신께 지하철에서 크게 혼나다'],
        ['김 씨 (부적절 호칭)', 'Gọi họ + 씨 (khiếm nhã ở Hàn)', '성 뒤에 씨만 붙이면 기분 나빠함'],
        ['당황하다', 'Bối rối lúng túng hoang mang', '예상치 못한 질문에 당황하다'],
        ['창피하다', 'Xấu hổ ngượng ngùng đỏ mặt', '실수를 하고 나서 몹시 창피했다'],
        ['부끄럽다', 'Thẹn thùng ngượng nghịu tự xấu hổ', '얼굴이 붉어질 만큼 부끄럽다'],
        ['실례가 되다', 'Trở thành hành vi thất lễ vô phép', '남의 대화에 불쑥 끼어들면 실례'],
        ['쓰레기봉투', 'Túi đựng rác theo quy chuẩn', '종량제 규격 봉투에 담아 배출'],
        ['데이트 신청을 하다', 'Ngỏ lời mời hẹn hò yêu đương', '좋아하는 이성에게 데이트 신청'],
        ['확인하다', 'Kiểm tra xác nhận lại đồ đạc', '내리기 전에 두고 내리는 물건 확인'],
        ['지름길', 'Đường tắt ngắn nhất đi nhanh', '지름길로 가려다 길을 잃었다'],
        ['품질', 'Chất lượng hàng hóa máy móc', '가격에 비해 우수한 품질'],
        ['위대하다', 'Vĩ đại to lớn mang tầm vóc', '실패에서 시작된 위대한 발명품'],
      ]),
    ],
    grammar: [
      {
        structure: 'Động từ + -는 바람에',
        meaning: 'Do/vì... bất ngờ dẫn đến hậu quả tiêu cực ngoài ý muốn',
        rule: 'Chỉ đi với động từ. Vế sau LUÔN LÀ KẾT QUẢ XẤU hoặc sự cố ngoài dự liệu.',
        examples: [
          {
            kr: '알람 시계가 고장 나는 바람에 늦잠을 잤어요.',
            vn: 'Vì đồng hồ báo thức bị hỏng nên tôi đã ngủ quên.',
          },
        ],
      },
      {
        structure: 'Động từ + -는 중이다',
        meaning: 'Đang trong quá trình làm việc gì...',
        rule: 'Biểu hiện hành động đang diễn ra tại thời điểm nói.',
        examples: [
          { kr: '교수님께서는 지금 회의 중이십니다.', vn: 'Giáo sư hiện đang trong cuộc họp.' },
        ],
      },
      {
        structure: 'Động từ + -도록 하다',
        meaning: 'Hãy làm... (khuyên bảo) / Sẽ quyết tâm làm...',
        rule: 'Dùng để nhắc nhở người khác hoặc bộc lộ quyết tâm sửa sai.',
        examples: [
          {
            kr: '내일부터는 늦지 않도록 하겠습니다.',
            vn: 'Từ ngày mai em sẽ cố gắng hết sức để không bị muộn nữa ạ.',
          },
        ],
      },
    ],
    culture: {
      title: 'Cách ứng xử khi mắc lỗi và văn hóa xưng hô người Hàn',
      content:
        'Khi mắc lỗi, việc thừa nhận thẳng thắn được tôn trọng. Trong xưng hô, tuyệt đối không gọi người Hàn bằng họ + 씨 (ví dụ "김 씨" là khiếm nhã), mà phải gọi [Họ và tên + 씨] hoặc [Chức danh].',
    },
  },

  9: {
    title: 'Bài 09: 이사 (Chuyển nhà & Cư trú)',
    koreanTitle: '이사',
    objectives:
      'Tìm nhà qua văn phòng môi giới bất động sản, hiểu hợp đồng thuê nhà và phong tục tiệc tân gia.',
    vocabulary: [
      pack('기본', '기본 어휘 (Các loại hình nhà ở & Hình thức thuê)', [
        ['개인 주택 (단독주택)', 'Nhà riêng biệt lập có sân vườn', '마당과 옥상이 있는 단독주택'],
        ['연립주택', 'Nhà tập thể các phòng độc lập', '여러 가구가 사는 연립주택'],
        ['다세대주택', 'Nhà chia nhiều hộ chung sống', '빌라 형태의 다세대주택 거주'],
        ['아파트', 'Căn hộ chung cư hiện đại cao tầng', '한국인이 가장 선호하는 주거 형태'],
        ['대단지 아파트', 'Khu đô thị chung cư quy mô lớn', '편의 시설이 완비된 대단지 아파트'],
        ['원룸', 'Phòng đơn studio khép kín một phòng', '대학생과 직장인이 선호하는 원룸'],
        ['투룸', 'Căn hộ 2 phòng ngủ riêng biệt', '방 2개와 거실이 있는 투룸'],
        ['오피스텔', 'Căn hộ văn phòng tiện ích kết hợp', '역세권에 위치한 주거용 오피스텔'],
        ['빌라', 'Nhà biệt thự phố thấp tầng mini', '엘리베이터가 설치된 신축 빌라'],
        [
          '고시원 (고시텔)',
          'Phòng trọ hộp diêm cho sĩ tử luyện thi',
          '보증금 없이 월세만 내는 고시원',
        ],
        ['한옥', 'Nhà cổ truyền thống kiểu Hàn', '온돌과 마루가 조화로운 전통 한옥'],
        ['기숙사', 'Ký túc xá trường học tập thể', '대학 기숙사 입사 신청 기간'],
        [
          '전세 (Jeonse)',
          'Thuê nhà đặt cọc trọn gói không tiền tháng',
          '한국 특유의 주택 임대 제도',
        ],
        ['전세권', 'Quyền thuê nhà đặt cọc bảo đảm', '계약 만료 시 보증금 전액 반환'],
        ['월세', 'Thuê nhà trả tiền theo từng tháng', '보증금 500에 월세 40만 원'],
        ['보증부 월세', 'Thuê cọc nhỏ kèm tiền thuê hàng tháng', '반전세 형태의 보증부 월세'],
        ['하숙', 'Ở trọ chủ nhà nấu ăn sáng tối', '하숙집 주인아주머니의 따뜻한 밥상'],
        ['자취', 'Tự thuê phòng tự nấu ăn sinh hoạt', '친구와 함께 자취를 시작하다'],
        ['부동산 소개소', 'Văn phòng môi giới nhà đất', '부동산 중개소에서 방 알아보기'],
        ['공인중개사', 'Chuyên viên môi giới BĐS cấp phép', '공인중개사의 안내로 집 구경'],
        ['중개 수수료 (복비)', 'Tiền hoa hồng môi giới nhà đất', '법정 중개 수수료율 확인'],
        ['계약서', 'Bản hợp đồng thuê mua nhà đất', '부동산 임대차 계약서 작성'],
        ['계약하다', 'Ký kết hợp đồng giao dịch', '마음에 들어 정식으로 계약하다'],
        ['계약금', 'Tiền đặt cọc hợp đồng ban đầu 10%', '계약 당일 보증금의 10% 송금'],
      ]),
      pack('새단어', '새 단어 & 읽기 본문 (Bảng từ mới tr. 331 & Bài đọc)', [
        ['보증금', 'Khoản tiền đặt cọc bảo đảm hợp đồng', '보증금을 안전하게 돌려받다'],
        ['잔금을 치르다', 'Thanh toán nốt số tiền còn lại khi vào', '이사 당일 입주하며 잔금 완납'],
        ['관리비', 'Phí quản lý tòa nhà hàng tháng', '수도세, 인터넷 포함된 관리비'],
        ['청소비', 'Phí vệ sinh hành lang chung cư', '관리비 고지서에 포함된 청소비'],
        ['난방비', 'Tiền sưởi ấm mùa đông lạnh giá', '겨울철 도시가스 난방비 절약 요령'],
        ['개별난방', 'Hệ thống sưởi riêng từng phòng căn hộ', '온도 조절이 자유로운 개별난방'],
        ['중앙난방', 'Hệ thống sưởi ấm trung tâm cả tòa', '정해진 시간에만 켜지는 중앙난방'],
        ['보일러', 'Bình đun sưởi nước nóng sưởi sàn', '보일러가 고장 나서 방이 춥다'],
        ['온돌', 'Hệ thống sưởi ấm dưới sàn truyền thống', '방바닥을 따뜻하게 데우는 온돌'],
        ['남향집', 'Nhà quay hướng Nam đón ánh nắng', '햇볕이 잘 드는 남향집 선호'],
        ['북향집', 'Nhà quay hướng Bắc mùa đông lạnh', '남향집에 비해서 춥고 어두운 북향집'],
        [
          '포장 이사',
          'Dịch vụ chuyển nhà trọn gói từ A đến Z',
          '포장 이사업체에서 짐 정리까지 완벽',
        ],
        [
          '일반 이사',
          'Dịch vụ chuyển nhà tự đóng gói đồ đạc',
          '포장 이사에 비해서 저렴한 일반 이사',
        ],
        ['이삿짐센터', 'Công ty vận chuyển đồ đạc dọn nhà', '견적을 비교하고 이삿짐센터 선정'],
        ['이삿짐차', 'Xe tải chuyên dụng chở đồ dọn nhà', '사다리차가 달린 이삿짐 트럭'],
        ['짐을 싸다', 'Đóng gói xếp đồ đạc vào thùng hộp', '상자에 책과 옷가지를 정리해 싸다'],
        ['짐을 풀다', 'Mở tháo dỡ thùng đồ sắp đặt chỗ mới', '이사한 새집에서 짐을 풀다'],
        ['집들이', 'Tiệc tân gia mừng nhà mới với bạn bè', '이사 후 친구들을 집들이에 초대하다'],
        [
          '집 구경',
          'Tham quan ngắm nghía các phòng trong nhà',
          '손님들에게 집 안 구석구석을 구경시키다',
        ],
        [
          '가루비누 (세제)',
          'Xà phòng bột (quà tân gia phát tài)',
          '비누 거품처럼 큰 부자가 되라는 뜻',
        ],
        [
          '두루마리 휴지',
          'Giấy vệ sinh cuộn (quà chúc hanh thông)',
          '모든 일이 술술 잘 풀리라는 의미의 선물',
        ],
        [
          '떡을 돌리다',
          'Chia sẻ bánh gạo cho hàng xóm láng giềng',
          '이사 떡을 이웃집에 돌리며 인사',
        ],
        ['시루떡', 'Bánh gạo hấp đậu đỏ xua đuổi tà khí', '붉은 팥 시루떡으로 액운 쫓기'],
        ['액운을 없애다', 'Xua đuổi vận xui tà khí đen đủi', '새집의 액운을 없애고 복을 부르다'],
      ]),
      pack('듣기', '듣기 스크립트 & 워크북 (Audio CD & Sách bài tập)', [
        ['복을 부르다', 'Cầu rước may mắn tài lộc vào nhà', '길조를 모아 집안에 복을 부르다'],
        ['역세권', 'Khu vực gần sát ga tàu điện ngầm', '지하철역 도보 5분 거리의 역세권'],
        ['편의 시설', 'Cơ sở tiện ích đời sống dân sinh', '마트, 병원 등 편의 시설 완비'],
        ['신축', 'Tòa nhà mới xây dựng hoàn thiện', '깨끗하고 현대적인 신축 원룸'],
        ['리모델링', 'Nhà sửa chữa nâng cấp cải tạo mới', '내부를 깨끗하게 리모델링한 집'],
        ['전망이 좋다', 'Tầm nhìn cảnh quan thoáng đãng đẹp', '창밖으로 공원이 보이는 멋진 전망'],
        ['도보', 'Đi bộ bằng đôi chân', '학교까지 도보로 10분 통학'],
        [
          '물이 새다 (누수)',
          'Bị rò rỉ nước, thấm dột trần tường',
          '비가 오면 베란다 천장에서 물이 새다',
        ],
        ['점검하다', 'Kiểm tra rà soát nghiệm thu kỹ càng', '계약 전 수도와 보일러 작동 점검'],
        ['빈손으로 오다', 'Đi tay không đến không mang quà', '선물 사지 말고 그냥 빈손으로 오세요'],
        ['파손되다', 'Bị sứt mẻ gãy vỡ đồ đạc vận chuyển', '이사 도중 아끼던 가구가 파손되다'],
        ['흠집', 'Vết xước vết trầy trên bề mặt', '가구 모서리에 흠집이 생기다'],
        ['전액 배상', 'Bồi thường toàn bộ 100% thiệt hại', '파손된 물품에 대해 전액 배상받다'],
        ['마루', 'Sàn gỗ hiên nhà truyền thống thoáng', '여름에 바람이 잘 통하고 시원한 마루'],
        ['채광', 'Ánh sáng tự nhiên chiếu vào nhà', '창문이 커서 채광이 아주 좋은 방'],
        ['햇볕이 잘 들다', 'Đón ánh nắng chan hòa ấm áp', '빨래가 뽀송뽀송 잘 마르는 남향집'],
        [
          '부담을 줄이다',
          'Giảm bớt gánh nặng chi phí tiền bạc',
          '룸메이트와 월세 부담을 절반으로 줄이다',
        ],
        ['사라지다', 'Biến mất, tiêu tan đi đâu mất', '이사하던 날 지갑이 감쪽같이 사라지다'],
        ['보람부동산', 'Tên hiệu văn phòng BĐS trong bài', '교재 9과 사진 속 보람부동산'],
        ['해결되다', 'Được giải quyết ổn thỏa êm xuôi', '주인과 대화로 수리 문제가 해결되다'],
        ['안전하다', 'An toàn không có hiểm nguy', '치안이 좋고 밤길도 안전한 동네'],
        ['주거 형태', 'Hình thức cư trú sinh sống', '전세와 월세 등 다양한 주거 형태'],
        ['주거 종류', 'Chủng loại phân loại nhà ở', '아파트, 빌라, 단독주택 등 주거 종류'],
        ['이사하다', 'Dọn nhà chuyển nơi cư trú mới', '정든 집을 떠나 새 아파트로 이사하다'],
      ]),
    ],
    grammar: [
      {
        structure: 'Động từ + -(으)ㄹ 줄 알다/모르다',
        meaning: 'Biết / Không biết cách làm gì (kỹ năng, năng lực)',
        rule: 'Nguyên âm dùng -ㄹ 줄 알다/모르다, phụ âm dùng -을 줄 알다/모르다.',
        examples: [
          {
            kr: '저는 한국어로 계약서를 쓸 줄 몰라요.',
            vn: 'Tôi không biết cách viết bản hợp đồng bằng tiếng Hàn.',
          },
        ],
      },
      {
        structure: 'Danh từ + 에 비해서 (에 비해)',
        meaning: 'So với... thì...',
        rule: 'Dùng để so sánh một đối tượng với đối tượng làm tiêu chuẩn.',
        examples: [
          {
            kr: '포장 이사는 일반 이사에 비해서 비싼 편입니다.',
            vn: 'Chuyển nhà trọn gói so với chuyển nhà thường thì thuộc diện đắt hơn.',
          },
        ],
      },
    ],
    culture: {
      title: 'Văn hóa tiệc tân gia (집들이) và ý nghĩa của các món quà tặng',
      content:
        'Khi chuyển về nhà mới, người Hàn tặng bột giặt/nước giặt (세제) mong gia chủ sinh sôi tài lộc như bọt xà phòng, và tặng giấy vệ sinh (휴지) chúc mọi việc giải quyết trôi chảy hanh thông.',
    },
  },

  10: {
    title: 'Bài 10: 여행 (Du lịch & Trải nghiệm)',
    koreanTitle: '여행',
    objectives: 'Lên lịch trình tour, hỏi han địa điểm tham quan, truyền đạt câu hỏi gián tiếp.',
    vocabulary: [
      pack('기본', '기본 어휘 (Lịch trình, Thủ tục & Giấy tờ chuyến đi)', [
        ['계획을 세우다', 'Lên kế hoạch dự tính cho chuyến đi', '여름휴가 여행 계획을 세우다'],
        ['일정을 짜다', 'Lập lịch trình tour chi tiết từng ngày', '알찬 3박 4일 여행 일정을 짜다'],
        ['예약하다', 'Đặt trước phòng ở, bàn ăn, dịch vụ', '제주도 호텔 숙소를 미리 예약하다'],
        ['사전 예약', 'Đặt chỗ trước khi khởi hành', '성수기에는 사전 예약이 필수'],
        ['예매하다', 'Đặt mua trước vé tàu xe, máy bay', 'KTX 고속철도 기차표를 예매하다'],
        ['출발하다', 'Khởi hành xuất phát lên đường', '오전 8시에 인천공항에서 출발하다'],
        ['도착하다', 'Cập bến, đáp tới nơi an toàn', '비행기가 정시에 무사히 도착하다'],
        ['출국하다', 'Xuất cảnh ra nước ngoài', '공항 검색대를 통과하여 출국하다'],
        ['입국하다', 'Nhập cảnh vào một quốc gia', '베트남 하노이 공항에 입국하다'],
        ['귀국하다', 'Trở về lại quê hương tổ quốc', '1년간의 어학연수를 마치고 귀국하다'],
        [
          '일정을 변경하다',
          'Thay đổi giờ giấc ngày tháng tour',
          '개인 사정으로 여행 일정을 변경하다',
        ],
        ['취소하다', 'Hủy bỏ chuyến đi tour du lịch', '태풍 때문에 항공편 예약을 취소하다'],
        ['입국 심사를 받다', 'Làm thủ tục hải quan nhập cảnh', '입국 심사대에서 여권과 비자 제시'],
        ['세관 신고', 'Khai báo đồ chịu thuế hải quan', '면세 한도 초과 물품 세관 신고'],
        ['면세점', 'Cửa hàng bán đồ miễn thuế sân bay', '공항 면세점에서 화장품 쇼핑'],
        ['여권', 'Hộ chiếu xuất nhập cảnh cá nhân', '여권 유효기간이 6개월 이상 남다'],
        ['여권 만료일', 'Ngày hết hạn hiệu lực hộ chiếu', '여권 만료일 이전에 갱신 신청'],
        [
          '비자(사증)를 발급받다',
          'Được cấp thị thực visa nhập cảnh',
          '대사관에서 관광 비자를 발급받다',
        ],
        ['항공권 (비행기 표)', 'Vé máy bay đi lại đường không', '저비용 항공사 특가 항공권 예매'],
        ['왕복 항공권', 'Vé máy bay khứ hồi cả đi lẫn về', '왕복 항공권으로 저렴하게 구매'],
        ['편도 항공권', 'Vé máy bay một chiều đi hoặc về', '귀국일이 미정이라 편도 항공권 구매'],
        ['여행자수표', 'Séc du lịch bảo đảm an toàn', '현금 분실 위험을 줄이는 여행자수표'],
        ['환전하다', 'Đổi tiền mặt sang tiền ngoại tệ', '공항 환전소에서 현지 통화로 환전'],
        ['여행자 보험', 'Bảo hiểm du lịch quốc tế bảo vệ', '해외여행 전 여행자 보험 필수 가입'],
      ]),
      pack('새단어', '새 단어 & 읽기 본문 (Bảng từ mới tr. 331 & Bài đọc)', [
        ['숙박 시설', 'Cơ sở lưu trú trọ ngơi nghỉ', '호텔, 펜션 등 다양한 숙박 시설'],
        ['숙소', 'Chỗ ở nghỉ ngơi trong chuyến đi', '시내 중심가에 위치한 깔끔한 숙소'],
        ['펜션', 'Nhà nghỉ biệt thự homestay ngoại ô', '바비큐 파티가 가능한 펜션 예약'],
        ['리조트', 'Khu nghỉ dưỡng phức hợp cao cấp', '수영장과 골프장을 갖춘 리조트'],
        ['게스트하우스', 'Nhà nghỉ tập thể ba lô giá rẻ', '배낭여행객들이 모이는 게스트하우스'],
        ['성수기', 'Mùa cao điểm đông đúc giá đắt', '여름휴가 7~8월 성수기 요금'],
        ['비수기', 'Mùa vắng khách giá cả hạ rẻ', '조용하고 저렴한 비수기 여행'],
        ['세계 문화유산', 'Di sản văn hóa thế giới UNESCO', '유네스코 지정 세계 문화유산 등재'],
        ['유네스코', 'Tổ chức Giáo dục Khoa học UNESCO', '인류 문화유산을 보호하는 유네스코'],
        [
          '패키지여행',
          'Du lịch trọn gói theo đoàn dẫn tour',
          '가이드가 인솔하는 편리한 패키지여행',
        ],
        ['자유여행', 'Du lịch tự do khám phá tự túc', '내 마음대로 일정을 짜는 자유여행'],
        ['배낭여행', 'Du lịch ba lô bụi sinh viên', '젊은 시절 떠나는 배낭여행의 묘미'],
        ['수학여행', 'Du lịch ngoại khóa trường học tập thể', '고등학교 시절 경주로 떠난 수학여행'],
        [
          '신혼여행 (허니문)',
          'Tuần trăng mật của đôi uyên ương',
          '하와이로 낭만적인 신혼여행을 떠나다',
        ],
        ['크루즈 여행', 'Du lịch bằng du thuyền đại dương sang', '호화 크루즈선을 타고 바다 항해'],
        ['테마 여행', 'Du lịch theo chuyên đề khám phá', '미식 탐방을 주제로 한 테마 여행'],
        ['에어텔 상품', 'Combo vé máy bay kèm khách sạn', '항공권과 호텔만 묶은 에어텔 상품'],
        ['사찰', 'Chùa chiền Phật giáo cổ tự', '천년 고찰 불국사를 둘러보다'],
        ['고궁', 'Cung điện xưa thời vương triều', '서울 도심의 아름다운 경복궁 고궁'],
        ['유적지', 'Khu di tích lịch sử ngàn năm', '신라의 역사가 살아 숨 쉬는 유적지'],
        ['온천', 'Suối khoáng nóng thư giãn ngâm mình', '피로를 싹 풀어주는 따뜻한 온천욕'],
        ['계곡', 'Khe suối thung lũng nước trong vắt', '여름철 시원한 강원도 계곡 피서'],
        ['해수욕장', 'Bãi tắm biển mùa hè sôi động', '부산 해운대 해수욕장 피서객 인파'],
        ['모래사장', 'Bãi cát vàng mịn ven biển', '파도 소리를 들으며 모래사장을 걷다'],
      ]),
      pack('듣기', '듣기 스크립트 & 워크북 (Audio CD & Sách bài tập)', [
        ['놀이공원', 'Công viên giải trí trò chơi', '주말에 롤러코스터 타러 놀이공원 가기'],
        ['기암괴석', 'Núi đá tảng kỳ vĩ hiểm trở', '하롱베이의 수려한 기암괴석 풍경'],
        ['절경', 'Cảnh đẹp tuyệt trần say đắm lòng', '눈앞에 펼쳐진 자연의 빼어난 절경'],
        ['곡창지대', 'Kho thóc vựa lúa màu mỡ phì nhiêu', '메콩강 델타의 거대한 곡창지대'],
        ['삼각주', 'Vùng đồng bằng châu thổ sông bồi', '강 하류에 형성된 비옥한 삼각주'],
        ['과수원', 'Vườn cây ăn trái sum suê trĩu quả', '달콤한 사과 과수원 체험'],
        ['열대 과일', 'Trái cây miền nhiệt đới thơm ngọt', '망고, 두리안 등 싱싱한 열대 과일'],
        [
          '자외선 차단제 (선크림)',
          'Kem chống nắng bảo vệ làn da',
          '햇볕에 타지 않게 자외선 차단제 바르기',
        ],
        ['선글라스', 'Kính râm thời trang chống chói lóa', '강한 햇빛을 차단하는 선글라스'],
        ['여행 경비', 'Lộ phí chi phí chuyến đi du lịch', '예산에 맞춰 여행 경비를 알뜰하게 환전'],
        [
          '일교차',
          'Độ chênh lệch nhiệt độ ngày và đêm',
          '환절기 큰 일교차로 감기 조심 겉옷 챙기기',
        ],
        ['입술 보호제 (립밤)', 'Sáp dưỡng ẩm chống nứt nẻ môi', '건조한 기후 필수품 입술 보호제'],
        ['설악산', 'Dãy núi Seorak hùng vĩ Gangwon', '가을 단풍이 절경인 설악산 등반'],
        ['경주', 'Cố đô Gyeongju vương triều Shilla', '도시 전체가 지붕 없는 박물관인 경주'],
        ['해운대', 'Bãi biển Haeundae nổi tiếng Busan', '푸른 파도와 마천루가 어우러진 해운대'],
        ['제주도', 'Hòn đảo du lịch ngọc bích Jeju', '한라산과 에메랄드빛 바다의 제주도'],
        ['하롱베이', 'Vịnh Hạ Long kỳ quan thế giới', '베트남 북부 최고의 관광 명소 하롱베이'],
        ['후에 (Huế)', 'Cố đô Huế trầm mặc kinh thành', '응우옌 왕조의 유서 깊은 고도 후에'],
        [
          '관광 안내소',
          'Trung tâm thông tin hướng dẫn du khách',
          '역 앞 관광 안내소에서 지도 받기',
        ],
        ['팸플릿', 'Tờ gấp giới thiệu chỉ đường du lịch', '여행 정보가 상세히 담긴 안내 팸플릿'],
        [
          '여행 패턴',
          'Khuynh hướng thói quen đi du lịch',
          '체험 중심으로 변화한 한국인의 여행 패턴',
        ],
        ['나룻배', 'Thuyền đò nhỏ chèo tay trên sông', '나룻배를 타고 강을 건너다'],
        ['초원', 'Đồng cỏ xanh bao la bát ngát', '말들이 뛰노는 몽골의 대초원'],
        ['당일치기', 'Chuyến đi trong ngày đi về luôn', '주말에 가볍게 다녀오는 당일치기 여행'],
      ]),
    ],
    grammar: [
      {
        structure: '-(으)냐고 하다 (묻다)',
        meaning: 'Tường thuật lại câu hỏi gián tiếp: Ai đó hỏi rằng...?',
        rule: 'Động từ + -느냐고 하다 / -냐고 하다, Tính từ + -(으)냐고 하다, Danh từ + (이)냐고 하다.',
        examples: [
          {
            kr: '서영 씨가 비행기 표를 예약했냐고 물어봤어요.',
            vn: 'Seo-young đã hỏi tôi rằng đã đặt vé máy bay chưa.',
          },
        ],
      },
      {
        structure: 'Động từ + -(으)ㄹ까 하다',
        meaning: 'Đang tính / Dự định có nên làm gì hay không',
        rule: 'Diễn tả ý định còn đang cân nhắc trong suy nghĩ của chủ ngữ.',
        examples: [
          {
            kr: '이번 방학에는 한국 여행을 떠날까 해요.',
            vn: 'Kỳ nghỉ lần này tôi đang tính đi du lịch Hàn Quốc.',
          },
        ],
      },
    ],
    culture: {
      title: 'Các địa danh du lịch nổi tiếng của Hàn Quốc',
      content:
        'Gyeongju (경주) - cố đô vương triều Shilla; Seoraksan (설악산) với cảnh sắc 4 mùa; Haeundae (해운대) tại Busan; và đảo Jeju (제주도) nổi tiếng thế giới.',
    },
  },

  11: {
    title: 'Bài 11: 고민 (Nỗi lo & Tư vấn tâm lý)',
    koreanTitle: '고민',
    objectives:
      'Tâm sự nỗi niềm, chia sẻ băn khoăn, sử dụng lối nói thân mật không kính ngữ (반말).',
    vocabulary: [
      pack('기본', '기본 어휘 (Tâm lý, Cảm xúc & Nỗi băn khoăn)', [
        ['고민이 생기다', 'Nảy sinh nỗi lo âu trăn trở phiền muộn', '진로 문제로 큰 고민이 생기다'],
        ['고민거리', 'Vấn đề băn khoăn khó xử trong lòng', '취업 준비생의 가장 큰 고민거리'],
        [
          '고민을 털어놓다',
          'Trút bầu tâm sự giãi bày cởi mở',
          '친한 친구에게 속마음 고민을 털어놓다',
        ],
        ['고민을 고백하다', 'Bộc bạch thổ lộ nỗi lòng kín đáo', '부모님께 숨겨온 고민을 고백하다'],
        [
          '고민을 해결하다',
          'Tháo gỡ giải quyết triệt để nỗi lo',
          '선배의 조언으로 고민을 해결하다',
        ],
        ['실마리를 찾다', 'Tìm thấy manh mối gỡ rối vấn đề', '해결의 실마리를 찾기 위해 대화하다'],
        ['갈등을 겪다', 'Trải qua xung đột bất đồng quan điểm', '세대 차이로 부모님과 갈등을 겪다'],
        [
          '갈등이 생기다',
          'Nảy sinh xích mích mâu thuẫn nội bộ',
          '친구 사이에 사소한 오해로 갈등이 생기다',
        ],
        [
          '갈등을 해소하다',
          'Hóa giải dung hòa mâu thuẫn xích mích',
          '솔직한 대화로 오랜 갈등을 해소하다',
        ],
        ['갈등을 극복하다', 'Vượt qua bất đồng đoàn kết hơn', '조직 내의 갈등을 현명하게 극복하다'],
        ['자신감이 있다', 'Tràn đầy tự tin vào năng lực mình', '자신감이 있어서 면접을 잘 보다'],
        ['자신감이 넘치다', 'Tràn trề lòng tự tin phong độ cao', '자신감 넘치는 당당한 목소리'],
        [
          '자신감을 잃다',
          'Đánh mất sự tự tin suy sụp tinh thần',
          '거듭된 불합격으로 자신감을 잃다',
        ],
        [
          '자신감이 부족하다',
          'Thiếu tự tin rụt rè nhút nhát e dè',
          '자신감이 부족해서 발표를 망치다',
        ],
        [
          '초조하다',
          'Bồn chồn đứng ngồi không yên lo thắt ruột',
          '합격자 발표를 앞두고 몹시 초조하다',
        ],
        ['애가 타다', 'Ruột gan nóng như lửa cồn cào xót xa', '연락이 닿지 않아 애가 타다'],
        ['긴장되다', 'Căng thẳng hồi hộp tim đập chân run', '면접관 앞에 서니 몹시 긴장되다'],
        ['손에 땀을 쥐다', 'Căng thẳng toát mồ hôi tay gay cấn', '손에 땀을 쥐게 하는 긴장감'],
        ['두렵다', 'Lo sợ hoảng sợ trước tương lai', '새로운 도전에 대한 두려움을 떨치다'],
        ['불안하다', 'Bất an nơm nớp lo âu chông chênh', '불확실한 미래 때문에 마음이 불안하다'],
        ['우울증', 'Chứng bệnh trầm cảm u uất tâm lý', '우울증 극복을 위한 심리 상담 치료'],
        ['스트레스', 'Căng thẳng áp lực thần kinh', '만병의 근원인 과도한 스트레스'],
        [
          '외로움을 타다',
          'Cảm thấy cô đơn hiu quạnh trống vắng',
          '가족과 떨어져 타향살이에 외로움을 타다',
        ],
        ['고독하다', 'Cô độc một mình giữa cuộc đời', '고독한 밤을 홀로 지새우다'],
      ]),
      pack('새단어', '새 단어 & 읽기 본문 (Bảng từ mới tr. 332 & Bài đọc)', [
        ['상담 센터', 'Trung tâm tư vấn tâm lý hỗ trợ', '대학 내 학생 생활 상담 센터'],
        ['상담실', 'Phòng tư vấn riêng tư kín đáo', '전문 상담실을 방문하여 면담'],
        ['상담사', 'Chuyên viên tư vấn tâm lý giàu kinh nghiệm', '공감 능력이 뛰어난 전문 상담사'],
        ['전문가 상담', 'Tư vấn chuyên sâu từ chuyên gia', '진로 전문가와의 1:1 심층 상담'],
        ['상담을 받다', 'Được nhận tư vấn định hướng giúp đỡ', '학업 스트레스로 정기 상담을 받다'],
        [
          '조언을 구하다',
          'Tìm kiếm xin lời khuyên từ tiền bối',
          '인생 선배에게 진솔한 조언을 구하다',
        ],
        ['충고', 'Lời khuyên can chân thành đúng đắn', '친구의 따끔한 충고를 명심하다'],
        [
          '진로 문제',
          'Định hướng nghề nghiệp tương lai',
          '졸업반 학생들의 최대 관심사인 진로 문제',
        ],
        ['취업 문제', 'Vấn đề xin việc làm khó khăn thị trường', '청년 실업과 취업 문제 해결 방안'],
        ['이성 문제', 'Chuyện tình cảm nam nữ hẹn hò', '이성 친구와의 갈등으로 고민하다'],
        ['연애 상담', 'Tư vấn gỡ rối chuyện yêu đương đôi lứa', '친구들에게 털어놓는 연애 상담'],
        [
          '인간관계 문제',
          'Vấn đề quan hệ đối nhân xử thế xã hội',
          '사회생활에서 가장 힘든 인간관계 문제',
        ],
        ['친구 관계', 'Quan hệ bạn bè trường lớp bằng hữu', '새 학기 교우 관계 적응하기'],
        ['경제적 문제', 'Khó khăn tài chính tiền nong eo hẹp', '학비와 생활비 마련 등 경제적 문제'],
        ['학비 부담', 'Gánh nặng tiền học phí đại học', '장학금 신청으로 학비 부담 덜기'],
        ['가정 문제', 'Bất hòa mâu thuẫn trong gia đình', '가정불화로 인한 심리적 상처'],
        ['외모 문제', 'Mặc cảm tự ti băn khoăn về ngoại hình', '외모에 대한 지나친 집착과 고민'],
        ['외모 콤플렉스', 'Mặc cảm tự ti về nhan sắc vóc dáng', '외모 콤플렉스를 당당히 극복하다'],
        ['사소하다', 'Vụn vặt nhỏ nhặt không đáng bận tâm', '사소한 일에 너무 연연하지 마라'],
        ['마음의 짐', 'Gánh nặng đè nặng trong tâm khảm', '속마음을 털어놓고 마음의 짐을 덜다'],
        ['극복하다', 'Khắc phục vượt qua nghịch cảnh gian truân', '의지로 신체적 한계를 극복하다'],
        ['저절로', 'Tự nó một cách tự nhiên theo thời gian', '시간이 흐르면 저절로 해결되다'],
        ['부적응', 'Sự không thích nghi lạc lõng bỡ ngỡ', '새로운 학교생활 부적응 문제'],
        [
          '현실의 벽',
          'Bức tường thực tế khắc nghiệt nghiệt ngã',
          '사회에 나와 냉정한 현실의 벽에 부딪치다',
        ],
      ]),
      pack('듣기', '듣기 스크립트 & 워크북 (Audio CD & Sách bài tập)', [
        ['속마음', 'Tâm can sâu kín đáy lòng người', '가장 가까운 사람에게 속마음을 열다'],
        [
          '익숙해지다',
          'Trở nên thuần thục quen thuộc tay chân',
          '반복하여 연습하다 보면 금방 익숙해진다',
        ],
        ['치열하다', 'Khốc liệt gay gắt dữ dội nảy lửa', '취업 시장의 치열한 입사 경쟁'],
        ['경쟁이 치열하다', 'Mức độ cạnh tranh vô cùng khốc liệt', '대기업 공채의 치열한 경쟁률'],
        [
          '성장하다',
          'Trưởng thành lớn khôn vững vàng hơn',
          '아픔과 실패를 딛고 한 단계 더 성장하다',
        ],
        ['성숙해지다', 'Chín chắn già dặn từng trải hơn', '시련을 겪으며 내면이 한층 성숙해지다'],
        ['위로하다', 'An ủi chia sẻ vỗ về động viên', '슬픔에 빠진 친구를 따뜻하게 위로하다'],
        ['라디오 상담실', 'Chương trình tư vấn phát thanh radio', '금요 스페셜 라디오 상담실 코너'],
        ['사연', 'Câu chuyện hoàn cảnh gửi về chia sẻ', '청취자가 라디오에 보낸 감동 사연'],
        [
          '취업 준비생 (취준생)',
          'Sinh viên đang mài giũa chờ xin việc',
          '도서관에서 밤새는 취업 준비생',
        ],
        [
          '채용 공고',
          'Thông báo tuyển dụng chính thức công ty',
          '하반기 대기업 신입사원 채용 공고',
        ],
        ['자격 요건', 'Tiêu chuẩn tư cách điều kiện ứng tuyển', '토픽 5급 이상의 지원 자격 요건'],
        [
          '스펙 (Spec)',
          'Bộ hồ sơ năng lực thành tích cá nhân',
          '어학 성적과 인턴 경력 등 스펙 쌓기',
        ],
        [
          '어학연수',
          'Du học tiếng ngắn hạn trau dồi ngôn ngữ',
          '어학연수를 통해 실전 회화 실력 향상',
        ],
        [
          '교환학생',
          'Sinh viên trao đổi văn hóa giữa 2 trường',
          '자매결연 대학 교환학생 파견 선발',
        ],
        [
          '추천서를 써 주시다',
          'Viết thư giới thiệu tiến cử học trò',
          '지도교수님께서 흔쾌히 추천서를 써 주시다',
        ],
        ['반말', 'Lối nói thân mật không kính ngữ bạn bè', '동갑내기 친구끼리 편하게 쓰는 반말'],
        [
          '존댓말 (높임말)',
          'Kính ngữ trang trọng với người lớn',
          '어른 앞에서는 깍듯하게 존댓말 쓰기',
        ],
        [
          '개발하다',
          'Phát triển khai phá tiềm năng bản thân',
          '자신만의 잠재 능력을 적극 개발하다',
        ],
        [
          '반영하다',
          'Phản ánh đúng thực trạng nguyện vọng',
          '학생들의 요구를 학사 운영에 반영하다',
        ],
        ['반응', 'Phản ứng phản hồi từ mọi người', '새로운 제안에 대한 긍정적인 반응'],
        ['발달하다', 'Phát triển nở rộ tiến bộ vượt bậc', '신체와 지능이 균형 있게 발달하다'],
        ['구분되다', 'Được phân loại rạch ròi thành nhóm', '성격 유형에 따라 네 가지로 구분되다'],
        ['권하다', 'Khuyên nhủ khuyến khích ai làm gì', '선생님께서 교환학생 지원을 권하시다'],
      ]),
    ],
    grammar: [
      {
        structure: 'Lối nói thân mật không kính ngữ (반말)',
        meaning: 'Cách nói thân mật giữa bạn bè thân thiết, người ít tuổi hơn',
        rule: 'Trần thuật: Động từ + -ㄴ/는다, Tính từ + -다. Nghi vấn: -니/냐?. Rủ rê: -자. Mệnh lệnh: -아/어라.',
        examples: [
          {
            kr: '요즘 고민이 많아서 잠이 안 와.',
            vn: 'Dạo này nhiều nỗi lo quá nên tớ không ngủ được.',
          },
          { kr: '내일 우리 같이 영화 보러 가자!', vn: 'Mai bọn mình cùng đi xem phim đi!' },
        ],
      },
      {
        structure: 'Động từ + -다 보면',
        meaning: 'Nếu liên tục làm gì thì dần dần sẽ...',
        rule: 'Hành động vế trước lặp lại dẫn tới kết quả hoặc kinh nghiệm ở vế sau.',
        examples: [
          {
            kr: '계속 읽다 보면 내용을 이해하게 될 거예요.',
            vn: 'Cứ đọc liên tục nhiều lần thì bạn sẽ hiểu được nội dung thôi.',
          },
        ],
      },
    ],
    culture: {
      title: 'Nỗi trăn trở của sinh viên Hàn Quốc',
      content:
        'Thế hệ trẻ Hàn Quốc đối mặt với áp lực thi cử, xin việc (취업 준비). Nhiều trường đại học xây dựng trung tâm tư vấn tâm lý (상담 센터) để hỗ trợ sinh viên tháo gỡ áp lực.',
    },
  },

  12: {
    title: 'Bài 12: 인터넷 (Internet & Soạn thảo)',
    koreanTitle: '인터넷',
    objectives: 'Soạn thảo văn bản, gửi email công việc, truyền đạt mệnh lệnh và rủ rê gián tiếp.',
    vocabulary: [
      pack('기본', '기본 어휘 (Mạng Internet, Thư điện tử & Thao tác)', [
        [
          '포털 사이트',
          'Cổng thông tin trực tuyến lớn tổng hợp',
          '네이버, 다음 등 대형 포털 사이트',
        ],
        ['홈페이지', 'Trang chủ website chính thức tổ chức', '학교 대표 홈페이지 공지사항'],
        ['블로그', 'Trang nhật ký blog cá nhân trực tuyến', '맛집 탐방과 일상을 기록하는 블로그'],
        ['미니 홈페이지', 'Trang mạng cá nhân Cyworld thịnh hành', '싸이월드 미니홈피 꾸미기'],
        ['웹 문서', 'Văn bản trang web định dạng HTML', '유용한 정보를 담은 웹 문서 검색'],
        ['게시글', 'Bài viết đăng tải trên diễn đàn bảng tin', '자유게시판에 응원 게시글 올리기'],
        ['동영상', 'Video clip hình ảnh chuyển động', '온라인 동영상 강의 시청'],
        ['이미지', 'Hình ảnh tĩnh, đồ họa tranh ảnh', '고화질 이미지 파일 업로드'],
        ['검색', 'Tìm kiếm dữ liệu thông tin số', '포털 검색 엔진을 활용한 정보 검색'],
        ['검색창', 'Thanh ô gõ từ khóa tìm kiếm', '검색창에 단어를 입력하다'],
        ['검색어', 'Từ khóa dùng để tra cứu tìm kiếm', '실시간 급상승 검색어 순위'],
        ['댓글', 'Bình luận phản hồi dưới bài đăng', '게시글에 따뜻한 응원 댓글을 남기다'],
        ['보내기 (전송)', 'Gửi thư đi, truyền dữ liệu qua mạng', '작성한 보고서 이메일 보내기'],
        ['받기 (수신)', 'Nhận thư điện tử gửi về', '새로운 편지 받기 확인'],
        ['수신함', 'Hộp thư đến lưu trữ thư nhận', '수신함이 가득 차서 정리하다'],
        ['답 메일 (회신, RE:)', 'Thư điện tử trả lời hồi âm', '교수님의 문의에 답 메일 발송'],
        ['전체 메일', 'Gửi thư đến toàn thể danh sách nhóm', '동아리 회원 전체 메일 전송'],
        ['참조 (CC)', 'Đồng kính gửi tham chiếu người liên quan', '팀장님을 참조에 넣어 메일 발송'],
        [
          '전달하기 (FW:)',
          'Chuyển tiếp bức thư cho người khác xem',
          '받은 업무 공문을 동료에게 전달하기',
        ],
        ['이메일 주소', 'Địa chỉ hòm thư điện tử cá nhân', '명함에 적힌 이메일 주소'],
        ['첨부파일', 'Tệp tin văn bản tài liệu đính kèm', '이메일 하단에 첨부파일 등록'],
        ['대용량 첨부', 'Đính kèm tệp tin dung lượng lớn', '영상 파일을 대용량 첨부로 발송'],
        ['내려받기 (다운로드)', 'Tải tệp tin về máy tính cá nhân', '과제 양식 파일을 다운로드하다'],
        ['올리기 (업로드)', 'Tải tệp tin lên trang mạng máy chủ', '인터넷 카페에 사진 업로드하기'],
      ]),
      pack('새단어', '새 단어 & 읽기 본문 (Bảng từ mới tr. 332 & Thao tác phím)', [
        [
          '복사하기 (Ctrl+C)',
          'Sao chép đoạn văn bản hoặc tệp tin',
          '원하는 글을 복사해서 붙여넣다',
        ],
        ['잘라내기 (Ctrl+X)', 'Cắt đoạn văn bản tệp tin di dời', '불필요한 문장을 잘라내기 하다'],
        ['오려두기', 'Cắt đoạn lưu tạm vào khay nhớ bộ nhớ', '한글 워드 프로세서 오려두기 기능'],
        [
          '붙이기 (Ctrl+V)',
          'Dán đoạn văn bản vừa sao chép vào',
          '복사한 내용을 원하는 위치에 붙이기',
        ],
        ['삭제하기 (Delete)', 'Xóa bỏ ký tự tệp tin hoàn toàn', '오타를 백스페이스로 삭제하다'],
        [
          '저장하기 (Ctrl+S)',
          'Lưu lại tiến trình văn bản đang làm',
          '작업 중간에 수시로 문서 저장하기',
        ],
        [
          '다른 이름으로 저장',
          'Lưu thành bản tài liệu mới tên khác',
          '수정본을 다른 이름으로 저장하기',
        ],
        ['불러오기 (Ctrl+O)', 'Mở lại tài liệu văn bản cũ đã lưu', '저장된 과제 파일을 불러오다'],
        [
          '되돌리기 (Ctrl+Z)',
          'Hoàn tác thao tác lỗi vừa mới làm',
          '실수한 작업을 이전 상태로 되돌리기',
        ],
        ['인쇄하기 (Ctrl+P)', 'In văn bản ra máy in ấn bản giấy', '보고서 최종본 3부 인쇄하기'],
        [
          '글씨 크기 (폰트 크기)',
          'Cỡ chữ kích thước con chữ hiển thị',
          '제목 글씨 크기를 16포인트로 키우다',
        ],
        [
          '글씨 모양 (서체)',
          'Phông dáng kiểu chữ viết hiển thị',
          '가독성 높은 맑은 고딕 글씨 모양',
        ],
        ['문단 모양', 'Định dạng kiểu đoạn văn bản lề lối', '양쪽 맞춤으로 문단 모양 정리'],
        ['줄 간격 (행간)', 'Khoảng cách giãn giữa các dòng chữ', '줄 간격을 160%로 여유 있게 설정'],
        ['최근 작업 문서', 'Danh sách tài liệu vừa làm gần nhất', '목록에서 최근 작업 문서 열기'],
        ['벼룩시장', 'Chợ trời trao đổi đồ cũ sinh viên', '학교 홈페이지 벼룩시장 게시판'],
        ['중고 장터', 'Khu chợ mua bán đồ cũ tiết kiệm', '중고 전공 서적 알뜰 거래 장터'],
        ['중고 물건', 'Đồ vật đã qua sử dụng còn tốt', '반값에 구입한 깨끗한 중고 물건'],
        ['연기되다', 'Bị hoãn lại dời sang ngày khác', '폭우로 모임 일정이 다음 주로 연기되다'],
        ['취소되다', 'Bị hủy bỏ hoàn toàn không tổ chức', '비행기 결항으로 행사가 취소되다'],
        [
          '보고서 작성',
          'Soạn thảo viết bài báo cáo tiểu luận',
          '워드 프로그램을 이용한 보고서 작성',
        ],
        ['워드 작업', 'Thao tác soạn thảo trên phần mềm Word', '도서관 컴퓨터실에서 워드 작업하기'],
        [
          '바이러스 검사',
          'Quét rà soát diệt virus máy tính',
          '백신 프로그램으로 정기 바이러스 검사',
        ],
        ['백신 프로그램', 'Phần mềm bảo vệ diệt trừ virus mạng', '최신 백신 프로그램 실시간 감시'],
      ]),
      pack('듣기', '듣기 스크립트 & 워크북 (Audio CD & Sách bài tập)', [
        ['도서 대출', 'Mượn sách đọc từ thư viện trường', '학생증으로 도서 대출 기한 연장'],
        ['신청서', 'Đơn đăng ký nguyện vọng mẫu chuẩn', '온라인 신청서 양식 작성 제출'],
        ['참가비', 'Lệ phí tiền đóng tham gia chương trình', '행사 참가비 2만 원 계좌 입금'],
        ['야경', 'Cảnh sắc đêm lung linh ánh đèn phố', '남산 서울타워에서 바라본 서울 야경'],
        [
          '유인물 (핸드아웃)',
          'Ấn phẩm tài liệu phát tay trên lớp',
          '교수님이 나눠 주신 수업 유인물',
        ],
        ['요약하다', 'Tóm lược cô đọng những ý cốt lõi', '긴 논문 내용을 한 장으로 요약하다'],
        ['참고 자료', 'Tài liệu nguồn trích dẫn tham khảo', '보고서 말미에 참고 자료 목록 명시'],
        [
          '바로 가기 만들기',
          'Tạo biểu tượng lối tắt trên màn hình',
          '바탕화면에 자주 쓰는 폴더 바로 가기',
        ],
        ['노트북', 'Máy tính xách tay Laptop cá nhân', '강의실에 노트북을 챙겨 가다'],
        [
          '학교 이메일 계정',
          'Tài khoản hòm thư do trường cấp',
          '학생 복지 포털에서 학교 메일 발급',
        ],
        ['스팸 메일', 'Thư rác quảng cáo độc hại không rõ', '모르는 사람의 스팸 메일은 열지 마라'],
        ['기숙사 신청', 'Đăng ký phòng ở trong ký túc xá', '홈페이지에서 2학기 기숙사 신청하기'],
        [
          '파워포인트 (PPT)',
          'Phần mềm trình chiếu thuyết trình',
          '발표용 슬라이드를 PPT로 제작하다',
        ],
        ['출력하다', 'In ra giấy từ máy in vi tính', '과제물을 프린터로 깨끗하게 출력하다'],
        ['궁궐', 'Cung điện lăng tẩm hoàng cung xưa', '조선 왕조의 5대 궁궐 탐방'],
        ['민속박물관', 'Bảo tàng văn hóa dân gian dân tộc', '전통 민속 유물을 전시한 박물관'],
        [
          '마무리하다',
          'Hoàn tất kết thúc trọn vẹn công việc',
          '오늘 안에 밀린 과제를 모두 마무리하다',
        ],
        ['찻집', 'Quán trà thưởng thức trà truyền thống', '인사동 골목의 고즈넉한 전통 찻집'],
        ['한식당', 'Nhà hàng chuyên phục vụ món ăn Hàn', '불고기와 찌개를 파는 유명 한식당'],
        ['설문 조사', 'Phiếu khảo sát điều tra thăm dò ý kiến', '대학생 소비 실태 설문 조사 참여'],
        ['제출하다', 'Nộp bài báo cáo đơn từ đúng hạn', '마감 기한 내에 리포트를 제출하다'],
        ['빠뜨리다', 'Bỏ quên, đánh rơi mất thứ gì đó', '가방에 지갑을 빠뜨리고 외출하다'],
        ['돌리다', 'Quay lại, phát tán, luân chuyển', '친구들에게 여행 사진을 돌려보다'],
        ['사이버', 'Không gian mạng thế giới ảo Cyber', '사이버 대학교 온라인 학위 취득'],
      ]),
    ],
    grammar: [
      {
        structure: 'Động từ/Tính từ + -(으)ㅁ',
        meaning: 'Đuôi câu danh hóa dùng trong ghi chú, thông báo ngắn',
        rule: 'Nguyên âm hoặc phụ âm ㄹ dùng -ㅁ, phụ âm khác dùng -음.',
        examples: [
          { kr: '내일 모임이 연기되었음.', vn: 'Thông báo: Cuộc họp ngày mai đã bị hoãn lại.' },
        ],
      },
      {
        structure: 'Động từ + -(으)라고 하다',
        meaning: 'Tường thuật gián tiếp câu mệnh lệnh',
        rule: 'Nếu làm cho người nói thì dùng "-달라고 하다"; nếu làm cho người thứ ba thì dùng "-주라고 하다".',
        examples: [
          { kr: '선생님께서 숙제를 제출하라고 하셨어요.', vn: 'Thầy giáo bảo phải nộp bài tập.' },
        ],
      },
      {
        structure: 'Động từ + -자고 하다',
        meaning: 'Tường thuật gián tiếp câu rủ rê, đề nghị',
        rule: 'Truyền đạt lại lời rủ rê của ai đó cho đối phương.',
        examples: [
          {
            kr: '지원 씨가 카페에서 같이 공부하자고 했어요.',
            vn: 'Ji-won rủ cùng học ở quán cà phê.',
          },
        ],
      },
    ],
    culture: {
      title: 'Văn hóa Internet và Chợ đồ cũ sinh viên Hàn Quốc',
      content:
        'Hàn Quốc là cường quốc Internet. Sinh viên thường trao đổi sách vở qua chuyên mục "chợ trời" (벼룩시장) ngay trên diễn đàn trường học để tiết kiệm chi phí.',
    },
  },

  13: {
    title: 'Bài 13: 희망 (Ước mơ & Tương lai)',
    koreanTitle: '희망',
    objectives:
      'Nói về ước mơ tương lai, tấm gương vượt khó, thể hiện hành động tiếp diễn theo thời gian.',
    vocabulary: [
      pack('기본', '기본 어휘 (Ước mơ, Định hướng tương lai & Thành công)', [
        ['장래 희망', 'Ước mơ nghề nghiệp tương lai mai sau', '어린 시절 나의 장래 희망'],
        ['미래의 꿈', 'Khát vọng ước nguyện mai này', '미래의 꿈을 향해 힘차게 나아가다'],
        ['진로', 'Định hướng bước tiến tương lai nghề', '적성을 고려하여 진로를 결정하다'],
        [
          '진로를 정하다',
          'Quyết định chọn đường đi tương lai',
          '대학 4학년 때 진로를 명확히 정하다',
        ],
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
        [
          '적성에 맞다',
          'Hợp với sở trường thiên bẩm năng khiếu',
          '적성에 맞는 일을 찾아야 행복하다',
        ],
        ['흥미를 느끼다', 'Cảm thấy đam mê thích thú say mê', '새로운 외국어 학습에 흥미를 느끼다'],
        [
          '경험을 쌓다',
          'Tích lũy cọ xát kinh nghiệm thực tế',
          '다양한 아르바이트로 사회 경험을 쌓다',
        ],
        [
          '스펙을 쌓다',
          'Rèn luyện tích lũy kỹ năng chứng chỉ',
          '자격증 취득과 인턴십으로 스펙 쌓기',
        ],
        ['꿈을 키우다', 'Nuôi dưỡng ấp ủ ước mơ hoài bão', '어려운 환경에서도 꿈을 키워 가다'],
        ['꿈을 이루다', 'Biến ước mơ ấp ủ thành hiện thực', '피나는 노력 끝에 마침내 꿈을 이루다'],
        ['성공하다', 'Thành công hiển vinh vang dội', '자신이 선택한 분야에서 크게 성공하다'],
        ['성공을 거두다', 'Gặt hái thắng lợi rực rỡ vẻ vang', '창업 3년 만에 놀라운 성공을 거두다'],
        [
          '성공 비결',
          'Bí quyết then chốt tạo nên thành công',
          '포기하지 않는 끈기가 바로 성공 비결',
        ],
        [
          '성공 요인',
          'Yếu tố quyết định đưa tới thành công',
          '철저한 준비와 열정이 핵심 성공 요인',
        ],
        ['도전하다', 'Thử thách dấn thân không lùi bước', '새로운 분야에 끊임없이 도전하다'],
        ['실패하다', 'Thất bại vấp ngã trên đường đời', '실패를 두려워하지 않는 자만이 성공한다'],
        [
          '좌절하다',
          'Ngã lòng gục ngã nản chí buông xuôi',
          '어떤 시련 앞에서도 결코 좌절하지 않다',
        ],
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
        [
          '시상대',
          'Bục vinh quang nhận giải thưởng cao quý',
          '시상대 맨 위에 올라 애국가를 부르다',
        ],
        ['동시통역사', 'Chuyên viên thông dịch cabin song song', '국제 정상회담의 동시통역사 활약'],
        ['특별보좌관', 'Cố vấn đặc vụ đặc biệt cho chính phủ', '백악관 특별보좌관으로 임명되다'],
        ['백악관', 'Nhà Trắng cơ quan đầu não Hoa Kỳ', '강영우 박사가 근무했던 미국 백악관'],
        [
          '사업가',
          'Nhà làm kinh doanh, doanh nhân thành đạt',
          '혁신적인 벤처 기업을 이끄는 사업가',
        ],
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
        [
          '장애인위원회',
          'Ủy ban quốc gia vì người khuyết tật',
          '장애인 복지 증진을 위한 정책 수립',
        ],
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
  },

  14: {
    title: 'Bài 14: 영화와 드라마 (Điện ảnh & Truyền hình)',
    koreanTitle: '영화와 드라마',
    objectives: 'Đánh giá tác phẩm điện ảnh, chia sẻ cảm nhận cá nhân và tìm hiểu văn hóa Hallyu.',
    vocabulary: [
      pack('기본', '기본 어휘 (Sản xuất, Rạp chiếu & Đội ngũ diễn viên)', [
        ['주연', 'Vai nam nữ diễn viên chính trong phim', '영화의 흥행을 이끄는 주연'],
        ['주연 배우', 'Diễn viên đảm nhận vai nhân vật chính', '주연 배우의 뛰어난 내면 연기'],
        ['조연', 'Vai phụ làm nền đặc sắc cho phim', '주연 못지않게 빛나는 감초 조연'],
        ['조연 배우', 'Diễn viên đóng các vai phụ trong phim', '명품 조연 배우들의 열연'],
        [
          '감독 (영화감독)',
          'Đạo diễn điện ảnh người chỉ huy bấm máy',
          '칸 영화제 수상 봉준호 감독',
        ],
        ['관객', 'Khán giả vào rạp thưởng thức điện ảnh', '천만 관객을 돌파한 국민 영화'],
        ['관람객', 'Người xem tham quan thưởng thức nghệ thuật', '주말 극장을 가득 메운 관람객'],
        [
          '개봉하다',
          'Khởi chiếu ra rạp chính thức công chiếu',
          '다음 주 전국 극장에서 일제히 개봉하다',
        ],
        ['개봉일', 'Ngày đầu tiên bộ phim ra rạp phục vụ', '개봉일에 맞춰 조조 영화 예매'],
        ['상영관', 'Phòng chiếu rạp phim với màn ảnh lớn', '아이맥스 대형 상영관 관람'],
        [
          '상영 시간 (러닝타임)',
          'Thời lượng phát sóng chiếu của bộ phim',
          '상영 시간이 2시간 30분으로 길다',
        ],
        [
          '예고편',
          'Đoạn trailer video giới thiệu tóm lược phim',
          '공식 유튜브 예고편이 화제를 모으다',
        ],
        ['티저 영상', 'Clip teaser nhá hàng gây tò mò', '긴장감 넘치는 티저 영상 공개'],
        ['시사회', 'Buổi chiếu thử ra mắt trước công chúng', '개봉 전 언론 배급 시사회 참석'],
        [
          'VIP 시사회',
          'Buổi công chiếu dành cho khách quý sao',
          '동료 배우들이 대거 참석한 시사회',
        ],
        [
          '매진되다',
          'Bán hết sạch vé không còn chỗ trống',
          '주말 프라임 타임 좌석이 전석 매진되다',
        ],
        ['촬영하다', 'Quay phim ghi hình các phân cảnh', '아름다운 제주도 로케이션 촬영'],
        ['촬영지', 'Địa điểm trường quay đóng phim thực tế', '드라마 촬영지로 유명해진 관광지'],
        [
          '출연하다',
          'Xuất hiện diễn xuất trong tác phẩm',
          '인기 아이돌 가수가 영화에 특별 출연하다',
        ],
        ['카메오', 'Vai diễn khách mời bất ngờ thú vị', '깜짝 카메오로 등장한 유명 MC'],
        ['대사', 'Lời thoại ngôn từ của nhân vật nói', '귓가에 맴도는 감동적인 영화 대사'],
        ['명대사', 'Câu thoại kinh điển để đời ấn tượng', '관객들의 심금을 울린 명대사 열전'],
        ['장면', 'Phân cảnh khung hình trong bộ phim', '마지막 눈물의 이별 장면'],
        ['명장면', 'Phân cảnh đắt giá đỉnh cao nghệ thuật', '한국 영화사에 길이 남을 명장면'],
      ]),
      pack('새단어', '새 단어 & 읽기 본문 (Bảng từ mới tr. 333 & Thể loại phim)', [
        [
          '줄거리 (시놉시스)',
          'Cốt truyện tóm tắt sườn nội dung phim',
          '반전을 거듭하는 탄탄한 줄거리',
        ],
        ['결말', 'Hồi kết kết cục cuối cùng của câu chuyện', '가슴 뭉클한 해피엔딩 결말'],
        ['반전', 'Cú lật mặt plot twist bất ngờ phút chót', '소름 돋는 충격적인 반전 결말'],
        ['조조 영화', 'Suất chiếu sáng sớm tinh mơ giá rẻ', '주말 아침 조조할인으로 알뜰 관람'],
        [
          '심야 영화',
          'Suất chiếu muộn lúc nửa đêm thanh vắng',
          '금요일 밤 친구들과 심야 영화 보기',
        ],
        [
          '공포 영화 (호러물)',
          'Phim kinh dị ma quái rùng rợn sợ hãi',
          '등골이 오싹해지는 여름철 공포 영화',
        ],
        [
          '코미디 영화 (코믹물)',
          'Phim hài hước dí dỏm sảng khoái',
          '배꼽 잡고 웃게 만드는 유쾌한 코미디',
        ],
        [
          '전쟁 영화',
          'Phim chiến tranh khói lửa bom đạn lịch sử',
          '전쟁의 참상과 비극을 고발한 대작',
        ],
        ['역사물', 'Phim lịch sử tái hiện biến cố quá khứ', '철저한 고증을 거친 정통 역사물'],
        [
          '멜로 영화 (로맨스)',
          'Phim tâm lý tình cảm lãng mạn đẫm lệ',
          '애절하고 슬픈 첫사랑의 멜로 영화',
        ],
        [
          '액션 영화',
          'Phim hành động võ thuật rượt đuổi nghẹt thở',
          '화려한 무술과 폭파 액션 영화',
        ],
        [
          'SF 영화 (공상과학)',
          'Phim khoa học viễn tưởng vũ trụ không gian',
          '미래 세계를 경이롭게 그린 SF 대작',
        ],
        [
          '판타지 영화',
          'Phim huyền ảo kỳ bí phép thuật ma thuật',
          '마법 세계를 배경으로 한 판타지 영화',
        ],
        [
          '사극 (정통 사극)',
          'Phim cổ trang triều đình thời Chosun xưa',
          '아름다운 한복과 궁중 암투가 담긴 사극',
        ],
        [
          '애니메이션 (만화영화)',
          'Phim hoạt hình đồ họa anime vẽ tay',
          '남녀노소 온 가족이 즐기는 애니메이션',
        ],
        [
          '드라마 (연속극)',
          'Phim truyền hình nhiều tập theo tập',
          '본방 사수하며 매주 챙겨보는 드라마',
        ],
        [
          '감동적이다',
          'Cảm động lay động tâm can rơi nước mắt',
          '가족애를 다룬 눈물겨운 감동적인 이야기',
        ],
        [
          '인상적이다',
          'Ấn tượng sâu sắc khó phai mờ trong trí',
          '주연 배우의 강렬한 눈빛 연기가 인상적',
        ],
        ['실감나다', 'Chân thực sống động y như đời thực', '특수효과 컴퓨터 그래픽이 실감나다'],
        ['생생하다', 'Sống động như đang diễn ra trước mắt', '역사적 사건을 생생하게 재현하다'],
        [
          '흥미진진하다',
          'Hấp dẫn lôi cuốn gay cấn từng phút giây',
          '손에 땀을 쥐게 하는 흥미진진한 전개',
        ],
        [
          '오싹하다',
          'Rợn tóc gáy lạnh sống lưng rùng mình',
          '귀신이 나타나는 순간 소름 끼치고 오싹하다',
        ],
        ['유치하다', 'Trẻ con ấu trĩ nông cạn cũ rích', '스토리가 너무 뻔하고 유치해서 실망했다'],
        ['진부하다', 'Nhàm chán rập khuôn không sáng tạo', '진부한 신파극 설정을 벗어나지 못하다'],
      ]),
      pack('듣기', '듣기 스크립트 & 워크북 (Audio CD & Sách bài tập)', [
        ['지루하다', 'Buồn ngủ tẻ nhạt lê thê phát ngán', '상영 시간이 너무 길어서 지루했다'],
        ['폭력적이다', 'Mang tính bạo lực đâm chém máu me', '청소년이 보기에 지나치게 폭력적이다'],
        ['잔인하다', 'Tàn nhẫn độc ác dã man không ghê tay', '피가 튀는 잔인한 살인 장면'],
        [
          '관람 등급',
          'Phân loại độ tuổi giới hạn người xem',
          '전체 관람가, 12세, 15세, 청소년 관람 불가',
        ],
        ['감상문', 'Bài văn ghi lại cảm tưởng sau khi xem', '영화 감상문을 과제로 제출하다'],
        [
          '관람평 (리뷰)',
          'Lời review đánh giá bình luận của người xem',
          '포털 사이트 실관람객 평점과 관람평',
        ],
        [
          '한류 (Hallyu)',
          'Làn sóng văn hóa Hàn Quốc lan tỏa cầu',
          'K-드라마와 K-POP의 전 세계적 열풍',
        ],
        [
          '사투리 (방언)',
          'Tiếng địa phương, phương ngữ vùng miền',
          '구수한 부산 사투리를 구사하는 주인공',
        ],
        ['흥행', 'Doanh thu phòng vé bán vé ăn khách', '박스오피스 1위를 차지한 흥행 돌풍'],
        [
          '흥행작 (블록버스터)',
          'Tác phẩm bom tấn điện ảnh siêu ăn khách',
          '역대 한국 영화 최고 흥행작 기록 갱신',
        ],
        ['해운대', 'Phim thảm họa sóng thần Haeundae', '쓰나미 재난을 다룬 한국 최초 흥행 영화'],
        ['대장금', 'Phim truyền hình Nàng Dae Jang Geum', '한식 궁중 음식을 세계에 알린 명작 사극'],
        [
          '겨울연가',
          'Bản tình ca mùa đông gây sốt Nhật Bản',
          '남이섬을 한류 관광 명소로 만든 드라마',
        ],
        ['시청률', 'Tỷ lệ người theo dõi truyền hình rating', '시청률 40%를 돌파한 국민 드라마'],
        [
          '배경음악 (OST)',
          'Nhạc nền chủ đề trong phim truyền hình',
          '애절한 멜로디의 드라마 OST 테마곡',
        ],
        ['즐겨 보다', 'Thích thú say mê dõi theo từng tập', '한국 연속극을 안 빼놓고 즐겨 보다'],
        [
          '연기력이 뛰어나다',
          'Năng lực diễn xuất xuất thần đỉnh cao',
          '신들린 연기력이 뛰어난 명배우',
        ],
        [
          '해리포터',
          'Harry Potter thế giới phù thủy kỳ ảo',
          '세계적인 베스트셀러 원작 판타지 영화',
        ],
        ['등급', 'Đẳng cấp, cấp bậc phân hạng', '영상물 등급 위원회의 엄격한 심의'],
        ['작품', 'Tác phẩm nghệ thuật điện ảnh', '완성도가 매우 높은 훌륭한 예술 작품'],
        ['배경', 'Bối cảnh lịch sử thời đại xã hội', '1980년대를 시대적 배경으로 한 영화'],
        ['제한하다', 'Hạn chế giới hạn đối tượng xem', '미성년자 관람을 엄격히 제한하다'],
        ['탤런트', 'Diễn viên truyền hình kịch nghệ', '인기 탤런트들이 대거 출연하는 주말극'],
        ['괴물', 'Phim điện ảnh Quái vật sông Hàn', '봉준호 감독의 2006년 천만 관객 영화'],
        [
          '인기를 끌다',
          'Gặt hái danh tiếng vang dội rầm rộ',
          '방영 첫 회부터 폭발적인 인기를 끌다',
        ],
      ]),
    ],
    grammar: [
      {
        structure: 'Động từ/Tính từ + -던데요',
        meaning: 'Tôi thấy rằng... cơ mà! (Hồi tưởng trải nghiệm cá nhân)',
        rule: 'Người nói trực tiếp chứng kiến hoặc trải nghiệm sự việc trong quá khứ rồi hồi tưởng chia sẻ.',
        examples: [
          {
            kr: '이 영화를 봤는데 정말 감동적이던데요.',
            vn: 'Tôi đã xem bộ phim này rồi, cảm động thực sự luôn đấy.',
          },
        ],
      },
      {
        structure: 'Động từ/Tính từ + -거든요',
        meaning: 'Vì là... mà (đưa ra lý do người nghe chưa biết)',
        rule: 'Cung cấp nguyên nhân làm sáng tỏ tình huống trước đó.',
        examples: [
          {
            kr: '저는 공포 영화를 좋아해요. 제가 주인공이 된 것 같은 기분이 들거든요.',
            vn: 'Tôi thích phim kinh dị. Vì cảm giác như chính mình là nhân vật chính vậy.',
          },
        ],
      },
    ],
    culture: {
      title: 'Làn sóng văn hóa Hàn Quốc (Hallyu) qua màn ảnh',
      content:
        'Những bộ phim kinh điển như "Bản tình ca mùa đông" (겨울연가) thúc đẩy du lịch đảo Nami, "Nàng Dae Jang Geum" (대장금) quảng bá ẩm thực hoàng cung ra toàn thế giới.',
    },
  },

  15: {
    title: 'Bài 15: 예절과 규칙 (Quy tắc & Phép lịch sự)',
    koreanTitle: '예절과 규칙',
    objectives:
      'Thực hiện phép lịch sự trong sinh hoạt xã hội, ngôn ngữ kính ngữ và quy tắc công cộng.',
    vocabulary: [
      pack('기본', '기본 어휘 (Phép lịch thiệp & Quy tắc nơi công cộng)', [
        [
          '예의를 지키다',
          'Giữ đúng phép lịch sự khuôn phép phép tắc',
          '어른을 만나면 깍듯하게 예의를 지키다',
        ],
        [
          '예절 바르다',
          'Lễ phép ngoan ngoãn có giáo dục đàng hoàng',
          '인사를 잘하는 예절 바른 청년',
        ],
        [
          '예의에 어긋나다',
          'Trái với phép tắc khiếm nhã vô phép',
          '윗사람 앞에서 다리를 꼬는 건 예의에 어긋난다',
        ],
        [
          '실례가 되다',
          'Thất lễ gây phiền hà cho người khác',
          '식사 시간에 전화를 거는 것은 큰 실례가 된다',
        ],
        [
          '예의가 없다',
          'Vô phép xấc xược mất dạy thiếu giáo dục',
          '남을 무시하고 예의가 전혀 없다',
        ],
        ['버릇이 없다', 'Hư đốn càn quấy không biết lễ nghĩa', '어른에게 반말하는 버릇없는 행동'],
        [
          '질서를 지키다',
          'Giữ gìn trật tự ngăn nắp nơi công cộng',
          '승강장 앞에서 한 줄 서기로 질서를 지키다',
        ],
        [
          '새치기 금지',
          'Cấm chen ngang cấm xô đẩy chen hàng',
          '새치기하지 말고 차례대로 줄을 서세요',
        ],
        [
          '규칙을 준수하다',
          'Tuân thủ nghiêm ngặt quy định nội quy',
          '도서관 이용 규칙을 철저히 준수하다',
        ],
        ['양보하다', 'Nhường nhịn chia sẻ phần hơn cho người', '서로 한 걸음씩 양보하여 타협하다'],
        [
          '자리를 양보하다',
          'Nhường ghế ngồi trên xe buýt tàu điện',
          '임산부와 노약자에게 자리를 양보하다',
        ],
        ['배려하다', 'Quan tâm để tâm nghĩ cho tha nhân', '남에게 불쾌감을 주지 않도록 배려하다'],
        [
          '타인을 배려하다',
          'Nghĩ cho người khác biết đặt mình vào họ',
          '더불어 사는 사회에서 타인을 배려하는 마음',
        ],
        [
          '피해를 주다',
          'Gây thiệt hại phiền toái làm phiền người',
          '공공장소에서 소란을 피워 피해를 주다',
        ],
        [
          '방해하다',
          'Cản trở phá bĩnh quấy rầy làm phiền',
          '도서관에서 큰 소리로 떠들어 공부를 방해하다',
        ],
        [
          '불쾌감을 주다',
          'Gây cảm giác khó chịu ngứa mắt gai tai',
          '과도한 애정 행각으로 남에게 불쾌감을 주다',
        ],
        [
          '웃어른을 공경하다',
          'Kính trọng phụng dưỡng người già bề trên',
          '유교 전통 효 사상에 따라 어른을 공경하다',
        ],
        [
          '법과 도덕',
          'Pháp luật nghiêm minh và đạo đức làm người',
          '사회 질서를 유지하는 법과 도덕 준수',
        ],
        [
          '경로석 (노약자석)',
          'Ghế ưu tiên dành riêng người cao tuổi',
          '자리가 비어 있어도 경로석은 비워 두다',
        ],
        ['쾌적하다', 'Thông thoáng dễ chịu sạch sẽ tinh tươm', '쾌적한 지하철 환경 만들기 캠페인'],
        [
          '수저 (숟가락 젓가락)',
          'Bộ thìa và đũa trọn vẹn trên bàn ăn',
          '어른이 먼저 수저를 드신 후에 식사 시작',
        ],
        ['밥그릇', 'Bát đựng cơm ăn cơm hàng ngày', '밥그릇을 식탁 바닥에 내려놓고 먹다'],
        ['국그릇', 'Bát sâu lòng đựng nước canh lẩu', '국그릇을 들고 마시지 않는 한국 식사 예절'],
        [
          '소리를 내지 않다',
          'Ăn nhai không phát ra tiếng ồn nhồm nhoàm',
          '음식을 씹을 때 쩝쩝 소리를 내지 마라',
        ],
      ]),
      pack('새단어', '새 단어 & 읽기 본문 (Bảng từ mới tr. 334 & Ứng xử chuẩn mực)', [
        [
          '그릇을 들고 먹지 않다',
          'Không bưng bát lên ăn (tối kỵ ở Hàn)',
          '밥그릇을 손에 들고 먹으면 거지의 행동 여김',
        ],
        [
          '이어폰을 끼다',
          'Đeo tai nghe cắm vào tai thưởng thức',
          '대중교통 이용 시 반드시 이어폰을 끼다',
        ],
        [
          '볼륨을 조절하다',
          'Chỉnh nhỏ âm lượng không lọt tiếng ra ngoài',
          '이어폰 소리가 밖으로 새지 않게 볼륨 조절',
        ],
        [
          '통화를 작게 하다',
          'Nói chuyện điện thoại thì thào khẽ khàng',
          '지하철 안에서 통화는 작고 짧게 끝내기',
        ],
        [
          '진동 모드로 바꾸다',
          'Chuyển điện thoại sang chế độ rung êm',
          '공연장이나 강의실에서는 진동 모드로 전환',
        ],
        [
          '모자를 벗다 (실내 탈모)',
          'Cởi mũ nón khi vào trong tòa nhà phòng',
          '건물 안이나 어른 앞에서는 모자를 벗기',
        ],
        [
          '쓰레기봉투',
          'Túi gom đựng rác thải đúng quy định',
          '규격 쓰레기봉투에 담아 지정된 장소 배출',
        ],
        [
          '종량제 봉투',
          'Túi rác tiêu chuẩn đóng phí môi trường',
          '종량제 봉투 미사용 시 과태료 부과',
        ],
        [
          '분리수거',
          'Phân loại rác tái chế rác hữu cơ vô cơ',
          '캔, 플라스틱, 유리병 분리수거 철저',
        ],
        [
          '재활용',
          'Tái chế rác thải bảo vệ môi trường xanh',
          '다 쓴 종이와 신문지는 재활용 수거함에',
        ],
        [
          '신문지수거함',
          'Thùng thu gom giấy báo cũ ga tàu điện',
          '다 읽은 신문은 신문지수거함에 꽂아두기',
        ],
        [
          '낙서 금지',
          'Cấm vẽ bậy viết bậy bôi bẩn lên tường',
          '문화재와 공공시설 낙서 금지 표지판',
        ],
        ['훼손 금지', 'Cấm phá hoại làm hư hại tài sản công', '공공 기물 훼손 금지 경고문'],
        [
          '금연',
          'Cấm hút thuốc lá tuyệt đối ở nơi công cộng',
          '금연 구역에서 담배를 피우면 벌금형',
        ],
        ['흡연실', 'Buồng phòng riêng biệt dành hút thuốc lá', '지정된 흡연실을 찾아 담배 피우기'],
        [
          '대중교통',
          'Phương tiện giao thông công cộng tàu xe',
          '버스와 지하철 등 대중교통 이용 에티켓',
        ],
        [
          '승하차 에티켓',
          'Văn hóa lịch sự khi lên xuống tàu xe',
          '내리는 승객이 먼저, 타는 승객은 나중에',
        ],
        [
          '차례대로 줄서기',
          'Xếp hàng ngay ngắn lần lượt theo thứ tự',
          '새치기 없이 차례대로 승차하기',
        ],
        [
          '승낙을 받다',
          'Được sự ưng thuận bằng lòng đồng ý',
          '타인의 물건을 빌릴 때는 먼저 승낙을 받다',
        ],
        [
          '허락을 구하다',
          'Xin phép trước khi làm việc gì đó',
          '친구 집 방문 전 미리 허락을 구하다',
        ],
        [
          '악수를 청하다',
          'Chủ động đưa tay ra ngỏ ý bắt tay',
          '보통 윗사람이 아랫사람에게 먼저 악수를 청함',
        ],
        ['살며시 잡다', 'Nắm nhẹ nhàng ấm áp vừa vặn tay', '상대방의 손을 살며시 쥐고 인사하기'],
        [
          '힘껏 잡다 (결례)',
          'Bóp siết mạnh tay làm đau đối phương',
          '손이 아플 정도로 힘껏 쥐면 큰 실례',
        ],
        [
          '방문 예절',
          'Phép tắc lịch thiệp khi tới thăm nhà ai',
          '식사 시간이나 이른 아침 방문은 피하기',
        ],
      ]),
      pack('듣기', '듣기 스크립트 & 워크북 (Audio CD & Sách bài tập)', [
        [
          '식사 시간 피하기',
          'Tránh khung giờ bữa ăn khi đến chơi nhà',
          '식사 때를 피해 약속 시간 잡기',
        ],
        [
          '출발 전 전화하기',
          'Gọi điện báo trước khi xuất phát tới',
          '방문하기 전 미리 전화로 알리는 예절',
        ],
        [
          '소지품을 확인하다',
          'Kiểm tra kỹ hành lý tư trang trước khi rời',
          '내리기 전 선반 위의 소지품을 확인하다',
        ],
        ['결근', 'Nghỉ làm việc vắng mặt nơi công sở', '몸이 아파서 결근계를 제출하다'],
        ['무단결근', 'Tự ý nghỉ làm không xin phép báo trước', '연락 없이 무단결근하면 중징계'],
        ['상사', 'Cấp trên lãnh đạo quản lý trực tiếp', '직장 상사에게 공손하게 인사드리기'],
        ['부하 직원', 'Nhân viên cấp dưới trong phòng ban', '부하 직원의 의견을 경청하는 상사'],
        [
          '외박하다',
          'Ngủ qua đêm bên ngoài không về nhà',
          '기숙사 규칙상 외박은 사전에 허락받아야 함',
        ],
        ['외박 허락', 'Được duyệt đồng ý ngủ qua đêm bên ngoài', '사감 선생님께 외박 신청서 제출'],
        [
          '안내 데스크',
          'Bàn lễ tân chỉ dẫn hướng dẫn khách vào',
          '1층 안내 데스크에서 방문증 발급',
        ],
        [
          '진지 드셨어요?',
          'Kính ngữ tối cao: Mời dùng bữa cơm (cho cụ)',
          '연세 높으신 할아버지 할머니께 드리는 인사',
        ],
        [
          '식사하셨어요?',
          'Kính ngữ thông thường: Anh đã ăn cơm chưa',
          '형이나 직장 선배에게 쓰는 적절한 식사 안부',
        ],
        [
          '써 주세요',
          'Kính xin thầy viết hộ giùm em với ạ',
          '선생님께 추천서를 부탁할 때 쓰는 올바른 표현',
        ],
        [
          '쓰세요 (명령조 결례)',
          'Thầy hãy viết đi (mệnh lệnh xấc xược)',
          '선생님께 쓰세요라고 하면 큰 결례',
        ],
        [
          '도서관 열람실 에티켓',
          'Phép lịch sự trong phòng đọc thư viện',
          '발걸음 소리를 줄이고 휴대전화는 무음으로',
        ],
        [
          '공연장 입장 예절',
          'Phép tắc khi vào nhà hát xem kịch',
          '공연 시작 후에는 입장 제한 준수',
        ],
        [
          '음악 감상을 방해하다',
          'Gây ồn ào cản trở người khác nghe nhạc',
          '공연 도중 옆 사람과 잡담하지 말 것',
        ],
        [
          '차를 세우다 (주차)',
          'Đỗ xe dừng xe đúng nơi quy định',
          '길가가 아닌 전용 주차장에 차를 세우다',
        ],
        ['주차장 이용', 'Tuân thủ gửi xe trong bãi đỗ quy củ', '지하 2층 주차장을 이용해 주십시오'],
        [
          '공동생활',
          'Đời sống sinh hoạt tập thể chung đụng',
          '기숙사 공동생활에서는 서로 배려가 필수',
        ],
        ['술을 마시다', 'Uống bia rượu say xỉn trong phòng', '기숙사 내 음주 및 흡연 행위 엄금'],
        [
          '다른 방에서 자다',
          'Tự ý sang ngủ phòng người khác bừa bãi',
          '규칙상 허락 없이 타인의 방에서 자면 안 됨',
        ],
        [
          '물건을 훔치다',
          'Ăn trộm ăn cắp tài sản của người khác',
          '법과 도덕을 어기는 중대한 범죄 행위',
        ],
        [
          '소지품을 분실하다',
          'Làm thất lạc đồ đạc tư trang cá nhân',
          '귀중품은 항상 몸에 지니고 분실 주의',
        ],
      ]),
    ],
    grammar: [
      {
        structure: 'Động từ/Tính từ + -지 않으면 안 되다',
        meaning: 'Bắt buộc phải... (phủ định kép nhấn mạnh nghĩa vụ)',
        rule: 'Tương đương với -아야/어야 하다 nhưng mang sắc thái khẳng định nghĩa vụ bắt buộc mạnh mẽ.',
        examples: [
          {
            kr: '직원의 안내를 받지 않으면 안 됩니다.',
            vn: 'Bạn bắt buộc phải tuân theo hướng dẫn của nhân viên.',
          },
        ],
      },
      {
        structure: 'Động từ + -(으)려던 참이다',
        meaning: 'Vừa đúng lúc đang định làm gì...',
        rule: 'Diễn tả ý định chuẩn bị thực hiện thì trùng hợp với tình huống xảy ra.',
        examples: [
          {
            kr: '마침 저도 한국어 책을 사려던 참이었어요.',
            vn: 'Đúng lúc tôi cũng đang định đi mua cuốn sách tiếng Hàn này.',
          },
        ],
      },
      {
        structure: 'Danh từ + 대로',
        meaning: 'Theo như... / Đúng theo...',
        rule: 'Hành động tuân thủ theo nguyên tắc hoặc trật tự đã có.',
        examples: [
          { kr: '순서대로 줄을 서서 들어가세요.', vn: 'Hãy xếp hàng vào theo đúng thứ tự.' },
        ],
      },
    ],
    culture: {
      title: 'Phép tắc lịch sự trong đời sống sinh hoạt Hàn Quốc',
      content:
        'Khi bắt tay, người lớn tuổi/cấp trên sẽ chủ động đưa tay ra trước và nắm nhẹ nhàng. Trên tàu xe luôn nhường ghế ưu tiên (경로석) cho người cao tuổi.',
    },
  },
};

const QUIZ_DATABASE = [
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

const KOREAN_WRITING_PROMPTS = [
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

const READING_PASSAGES_DATABASE = {
  // BÀI 01: 학교생활 (Đời sống học đường)
  1: [
    {
      id: 'r1_1',
      passageNumber: 1,
      type: 'Thông báo học vụ',
      title: '기말시험 일정 및 시험 기간 안내 (Thông báo lịch thi cuối kỳ)',
      source: 'Giáo trình Tiếng Hàn Tổng Hợp 3 - Bài 01: Trang 29',
      koreanText: `2학년 학생 여러분, 이번 1학기 기말시험은 6월 12일(수)부터 6월 18일(화)까지 실시됩니다.\n이번 기말시험 기간은 일주일밖에 안 됩니다. 시험 시간표와 강의실 배정은 학과 게시판에 공지되어 있으니 반드시 확인하시기 바랍니다.\n이번 학기 성적 우수자에게는 다음 학기 등록금 전액 장학금이 지급될 예정입니다. 학생 여러분 모두 최선을 다해 좋은 성적을 거두시기 바랍니다.`,
      vietnameseTranslation: `Kính gửi các bạn sinh viên năm 2, kỳ thi cuối kỳ học kỳ 1 lần này sẽ diễn ra từ thứ Tư ngày 12/6 đến thứ Ba ngày 18/6. Thời gian thi lần này chỉ vỏn vẹn 1 tuần. Lịch thi và phân phòng thi đã được thông báo trên bảng tin của khoa, đề nghị các bạn kiểm tra kỹ. Những sinh viên có thành tích xuất sắc trong kỳ này sẽ được cấp học bổng toàn phần học phí cho kỳ học tới. Chúc toàn thể sinh viên cố gắng hết sức để đạt kết quả tốt nhất.`,
      keyVocabulary: [
        { kr: '기말시험', vn: 'Thi cuối kỳ' },
        { kr: '일주일밖에 안 되다', vn: 'Chỉ được đúng một tuần (không hơn)' },
        { kr: '성적 우수자', vn: 'Người có thành tích học tập xuất sắc' },
        { kr: '등록금', vn: 'Học phí đại học' },
        { kr: '최선을 다하다', vn: 'Cố gắng hết sức mình' },
      ],
      questions: [
        {
          id: 'rq_1_1_1',
          question: 'Thời gian diễn ra kỳ thi cuối kỳ của sinh viên năm thứ hai kéo dài bao lâu?',
          options: [
            'Kéo dài đúng 1 tuần lễ (7 ngày)',
            'Kéo dài trong vòng 2 tuần',
            'Kéo dài 10 ngày',
            'Kéo dài suốt cả tháng 6',
          ],
          correctIndex: 0,
          evidence:
            '이번 기말시험 기간은 일주일밖에 안 됩니다 (Thời gian thi chỉ có 1 tuần mà thôi).',
        },
        {
          id: 'rq_1_1_2',
          question: 'Sinh viên đạt thành tích xuất sắc trong kỳ thi này sẽ nhận được quyền lợi gì?',
          options: [
            'Được miễn tham gia buổi định hướng OT',
            'Được nhận học bổng toàn phần học phí cho kỳ học tiếp theo',
            'Được tốt nghiệp sớm trước thời hạn',
            'Được chọn đi thực tập ngay tại doanh nghiệp lớn',
          ],
          correctIndex: 1,
          evidence: '성적 우수자에게는 다음 학기 등록금 전액 장학금이 지급될 예정입니다.',
        },
      ],
    },
    {
      id: 'r1_2',
      passageNumber: 2,
      type: 'Thư mời & Sự kiện',
      title: '한국학과 졸업생 환송회 안내문 (Thư mời tiệc chia tay sinh viên tốt nghiệp)',
      source: 'Giáo trình Tiếng Hàn Tổng Hợp 3 - Bài 01: Trang 29',
      koreanText: `한국학과 학생 여러분 안녕하십니까?\n오는 6월 25일(월) 저녁 6시에 이번 학기 졸업생 환송회가 열립니다. 장소는 학교 앞 사거리 근처에 있는 '대학문화'라고 하는 한식당입니다.\n그동안 정들었던 4학년 선배들을 환송하고 새로운 출발을 축하해 주기 위한 뜻깊은 자리입니다. 한국학과 재학생들은 모두 빠짐없이 참석해 주시기 바랍니다.\n참석을 희망하는 학생은 6월 20일까지 학과 대표에게 연락해 주십시오. 맛있는 음식과 함께 재미있는 프로그램을 많이 준비할 생각입니다.`,
      vietnameseTranslation: `Xin chào các bạn sinh viên khoa Hàn Quốc học! Vào lúc 18h tối thứ Hai ngày 25/6 tới sẽ diễn ra tiệc tiễn sinh viên tốt nghiệp kỳ này. Địa điểm là nhà hàng món Hàn mang tên 'Văn hóa Đại học' nằm gần ngã tư trước cổng trường. Đây là dịp ý nghĩa để chia tay và chúc mừng khởi đầu mới của các tiền bối năm 4 thân thương. Toàn thể sinh viên đang theo học khoa Hàn Quốc học hãy tham gia đầy đủ nhé! Các bạn muốn tham gia xin hãy liên lạc với lớp trưởng khoa trước ngày 20/6.`,
      keyVocabulary: [
        { kr: '졸업생 환송회', vn: 'Tiệc tiễn sinh viên tốt nghiệp' },
        { kr: '재학생', vn: 'Sinh viên đang theo học' },
        { kr: '(이)라고 하다', vn: 'Tên là, được gọi là' },
        { kr: '학과 대표', vn: 'Đại diện khoa, lớp trưởng' },
        { kr: '준비할 생각이다', vn: 'Dự định sẽ chuẩn bị' },
      ],
      questions: [
        {
          id: 'rq_1_2_1',
          question: 'Địa điểm tổ chức buổi tiệc tiễn sinh viên tốt nghiệp là ở đâu?',
          options: [
            'Hội trường lớn của khoa Hàn Quốc học',
            'Một nhà hàng món Hàn tên là "대학문화" ở gần ngã tư trường',
            'Khu nhà ăn tập thể trong ký túc xá',
            'Một quán cà phê sinh viên ngoài phố',
          ],
          correctIndex: 1,
          evidence: "장소는 학교 앞 사거리 근처에 있는 '대학문화'라고 하는 한식당입니다.",
        },
      ],
    },
    {
      id: 'r1_3',
      passageNumber: 3,
      type: 'Thông báo học bổng',
      title: '학과 장학금 신청 및 선발 안내 (Thông báo nộp đơn và xét chọn học bổng)',
      source: 'Giáo trình Tiếng Hàn Tổng Hợp 3 - Bài 01: Trang 29',
      koreanText: `한국학과 재학생 여러분에게 장학금에 대해 공지합니다.\n이번 학기에는 외부 후원 덕분에 장학금을 5명이 받을 수 있게 되었습니다. 장학금 지급액은 이전과 동일하게 1인당 100만 원입니다.\n장학금을 신청하고자 하는 학생은 신청서와 성적증명서를 준비하여 6월 30일 오후 5시까지 학과 사무실에 제출해 주시기 바랍니다.\n그리고 다음 학기부터는 장학 수혜 인원을 확대하여 총 8명의 학생들에게 학과 장학금을 지급할 생각입니다. 성실하고 열정적인 학생들의 많은 지원 바랍니다.`,
      vietnameseTranslation: `Thông báo về học bổng gửi tới các bạn sinh viên khoa Hàn Quốc học. Học kỳ này, nhờ có tài trợ từ bên ngoài, đã có 5 sinh viên được nhận học bổng. Số tiền chi trả vẫn như trước là 1.000.000 won mỗi người. Sinh viên có nguyện vọng xin học bổng hãy chuẩn bị đơn và bảng điểm nộp về văn phòng khoa trước 17h ngày 30/6. Đặc biệt từ học kỳ sau, chúng tôi dự định nâng số lượng người nhận lên 8 sinh viên.`,
      keyVocabulary: [
        { kr: '후원', vn: 'Tài trợ, ủng hộ' },
        { kr: '받을 수 있게 되다', vn: 'Được nhận (do hoàn cảnh đưa lại)' },
        { kr: '성적증명서', vn: 'Bảng điểm kết quả học tập' },
        { kr: '지급할 생각이다', vn: 'Dự định cấp phát chi trả' },
      ],
      questions: [
        {
          id: 'rq_1_3_1',
          question: 'Từ học kỳ sau, chế độ học bổng của khoa sẽ có điểm gì thay đổi?',
          options: [
            'Tiền học bổng của mỗi người sẽ tăng gấp đôi',
            'Số lượng sinh viên được nhận học bổng sẽ tăng từ 5 người lên 8 người',
            'Sinh viên chỉ cần nộp đơn qua mạng mà không cần nộp bảng điểm',
            'Học bổng sẽ bị hủy bỏ do hết tài trợ',
          ],
          correctIndex: 1,
          evidence: '다음 학기부터는 총 8명의 학생들에게 학과 장학금을 지급할 생각입니다.',
        },
      ],
    },
    {
      id: 'r1_4',
      passageNumber: 4,
      type: 'Giới thiệu CLB',
      title: '한국문학 동아리 신입 회원 모집 (Tuyển thành viên CLB Văn học Hàn Quốc)',
      source: 'Giáo trình Tiếng Hàn Tổng Hợp 3 - Bài 01: Trang 29',
      koreanText: `한국문학 동아리 '글사랑'에서 2024년도 2학기 새내기 및 재학생 회원을 모집합니다.\n우리 동아리는 한국의 현대 문학작품을 함께 읽고, 한국어 시와 단편소설을 베트남어로 번역하며 토론하는 학술 동아리입니다.\n한국문학에 관심이 있는 학생이라면 한국어 실력에 상관없이 누구든지 환영합니다. 매주 목요일 방과 후에 모여 정기 모임을 가지며, 학기 말에는 회원들의 번역 작품을 모아 소책자를 발간할 생각입니다.\n가입을 원하시는 분은 학과 자료실 옆 동아리 방으로 찾아오십시오.`,
      vietnameseTranslation: `CLB Văn học Hàn Quốc mang tên 'Geulsarang' chiêu mộ tân sinh viên và thành viên đang theo học kỳ 2. CLB của chúng tôi là nơi cùng đọc các tác phẩm văn học hiện đại Hàn Quốc, dịch thơ và truyện ngắn sang tiếng Việt cũng như thảo luận học thuật. Bất cứ ai quan tâm đến văn học Hàn Quốc đều được chào đón bất kể trình độ. Chúng tôi sinh hoạt định kỳ vào chiều thứ Năm sau giờ học và dự định xuất bản tập san dịch thuật vào cuối kỳ.`,
      keyVocabulary: [
        { kr: '새내기', vn: 'Tân sinh viên (từ thuần Hàn)' },
        { kr: '문학작품', vn: 'Tác phẩm văn học' },
        { kr: '번역하다', vn: 'Dịch thuật, phiên dịch viết' },
        { kr: '토론하다', vn: 'Thảo luận, tranh luận' },
        { kr: '자료실', vn: 'Phòng tư liệu' },
      ],
      questions: [
        {
          id: 'rq_1_4_1',
          question: 'Hoạt động chính của câu lạc bộ "글사랑" là gì?',
          options: [
            'Luyện tập đại hội thể thao trường',
            'Đọc tác phẩm văn học Hàn Quốc, dịch thơ/truyện và thảo luận',
            'Học thêm các môn văn hóa đại cương',
            'Đi dã ngoại MT định kỳ hàng tuần',
          ],
          correctIndex: 1,
          evidence:
            '한국의 현대 문학작품을 함께 읽고, 시와 단편소설을 번역하며 토론하는 동아리입니다.',
        },
      ],
    },
    {
      id: 'r1_5',
      passageNumber: 5,
      type: 'Văn hóa đối chiếu',
      title: '한국과 베트남의 대학 제도 비교 (So sánh chế độ Đại học Việt Nam & Hàn Quốc)',
      source: 'Giáo trình Tiếng Hàn Tổng Hợp 3 - Bài 01: Văn hóa (Trang 33 & 316)',
      koreanText: `한국의 대학교는 4년제 대학교, 2년제 전문대학, 그리고 사이버대학 등으로 구분된다. 4년제 대학교에 입학한 학생이 하나의 전공을 선택하여 학사 학위를 받기 위해서는 전공과목 최소 45학점 내외를 포함하여 총 140학점 내외를 취득해야 한다.\n이때 전공과목 학점 이외에는 부전공이나 복수 전공, 그리고 다양한 교양과목으로 학점을 이수하게 된다. 한 학기당 일반적으로 18학점에서 20학점 정도를 수강 신청하며, 1과목은 보통 2~3학점에 해당한다.\n베트남의 대학 제도와 비교해 볼 때 한국 대학교는 학생 개개인이 자율적으로 수강 신청을 통해 시간표를 짜고 복수 전공을 이수할 수 있는 선택의 폭이 넓은 편이다.`,
      vietnameseTranslation: `Đại học ở Hàn Quốc chia thành hệ đại học 4 năm, đại học chuyên môn 2 năm và đại học qua mạng. Sinh viên đại học 4 năm để nhận bằng cử nhân phải tích lũy khoảng 140 tín chỉ, trong đó tối thiểu 45 tín chỉ chuyên ngành. Ngoài tín chỉ chuyên ngành, sinh viên học tích lũy các môn chuyên ngành phụ, chuyên ngành kép và văn hóa đại cương. Bình thường mỗi kỳ sinh viên đăng ký khoảng 18-20 tín chỉ (1 môn từ 2-3 tín chỉ). So với Việt Nam, sinh viên Hàn Quốc có quyền tự chủ cao trong việc tự xếp thời khóa biểu và chọn học song bằng.`,
      keyVocabulary: [
        { kr: '학사 학위', vn: 'Bằng cử nhân' },
        { kr: '전공과목', vn: 'Môn chuyên ngành' },
        { kr: '교양과목', vn: 'Môn văn hóa đại cương' },
        { kr: '복수 전공', vn: 'Chuyên ngành kép (song bằng)' },
        { kr: '취득하다 / 이수하다', vn: 'Đạt được / Hoàn thành tích lũy tín chỉ' },
      ],
      questions: [
        {
          id: 'rq_1_5_1',
          question:
            'Theo nội dung bài đọc, điều kiện số tín chỉ để nhận bằng cử nhân tại trường đại học 4 năm ở Hàn Quốc là gì?',
          options: [
            'Tổng 120 tín chỉ trong đó chuyên ngành tối thiểu 30 tín chỉ',
            'Tổng khoảng 140 tín chỉ bao gồm tối thiểu 45 tín chỉ chuyên ngành',
            'Tổng 150 tín chỉ không bắt buộc số tín chỉ chuyên ngành',
            'Chỉ cần tích lũy đủ các môn văn hóa đại cương',
          ],
          correctIndex: 1,
          evidence:
            '학사 학위를 받기 위해서는 전공과목 최소 45학점 내외를 포함하여 총 140학점 내외를 취득해야 한다.',
        },
      ],
    },
  ],

  // BÀI 02: 대인 관계 (Quan hệ đối nhân xử thế)
  2: [
    {
      id: 'r2_1',
      passageNumber: 1,
      type: 'Thông báo họp mặt',
      title: '한국학과 개강 모임 및 장소 변경 안내 (Thông báo họp mặt đầu khóa)',
      source: 'Giáo trình Tiếng Hàn Tổng Hợp 3 - Bài 02: Trang 41 & SBT Trang 17',
      koreanText: `한국학과 학생 여러분, 이번 주 금요일에 예정되었던 2학기 개강 모임 일정이 변경되어 안내드립니다.\n원래 모임 장소였던 서울식당의 사정으로 인해, 학교 앞 '만남의 집' 식당으로 장소가 변경되었습니다. 모임 시간은 변동 없이 금요일 오후 5시에 시작합니다.\n회비는 1인당 1만 원이며, 모임이 끝난 후에는 근처 카페에서 2차 뒤풀이가 있을 예정입니다. 선후배 간의 친목을 다지는 중요한 자리인 만큼 많은 참석 바랍니다. 혹시 늦게 오시는 분은 과 대표에게 미리 연락해 주세요.`,
      vietnameseTranslation: `Gửi các bạn sinh viên khoa Hàn Quốc học, buổi họp mặt đầu kỳ 2 dự kiến vào thứ Sáu tuần này có sự thay đổi. Do lý do phát sinh từ nhà hàng Seoul Sikdang vốn định trước, địa điểm họp mặt được đổi sang quán 'Mannam-ui Jip' trước cổng trường. Thời gian không đổi, bắt đầu lúc 17h chiều thứ Sáu. Hội phí là 10.000 won/người, sau khi kết thúc sẽ có liên hoan tăng hai tại quán cà phê gần đó. Mong các bạn tham gia đông đủ!`,
      keyVocabulary: [
        { kr: '개강 모임', vn: 'Họp mặt đầu học kỳ' },
        { kr: '변경되다', vn: 'Bị thay đổi' },
        { kr: '회비', vn: 'Hội phí tham gia' },
        { kr: '뒤풀이', vn: 'Liên hoan tăng 2, tăng 3 sau sự kiện' },
        { kr: '친목을 다지다', vn: 'Gắn kết tình hữu nghị, thân thiện' },
      ],
      questions: [
        {
          id: 'rq_2_1_1',
          question: 'Buổi họp mặt đầu kỳ đã thay đổi thông tin nào so với kế hoạch ban đầu?',
          options: [
            'Thời gian dời sang cuối tuần',
            'Địa điểm chuyển từ Seoul Sikdang sang quán Mannam-ui Jip',
            'Mức hội phí tăng lên gấp đôi',
            'Hủy bỏ hoàn toàn buổi họp mặt',
          ],
          correctIndex: 1,
          evidence:
            "원래 모임 장소였던 서울식당의 사정으로 인해, 학교 앞 '만남의 집' 식당으로 장소가 변경되었습니다.",
        },
      ],
    },
    {
      id: 'r2_2',
      passageNumber: 2,
      type: 'Thư tri ân',
      title: '스승의 날 감사 편지 (Thư tri ân gửi thầy nhân ngày Nhà giáo)',
      source: 'Giáo trình Tiếng Hàn Tổng Hợp 3 - Bài 02: Trang 49',
      koreanText: `김영준 선생님께.\n선생님, 그동안 안녕하셨습니까? 올해도 어느덧 스승의 날이 돌아왔습니다. 스승의 날이 될 때마다 저는 늘 선생님 생각이 납니다.\n한국어 공부를 처음 시작했을 때 문법과 발음이 너무 어려워서 포기하려고 했는데, 선생님께서 포기하지 않도록 따뜻하게 격려해 주셨지요. 선생님이 잘 가르쳐 주신 덕분에 저는 한국어를 포기하지 않고 끝까지 공부할 수 있었습니다.\n그 덕분에 지난주에는 한국 무역회사 면접시험에 무사히 합격하여 취직하게 되었습니다. 자주 찾아뵙고 인사를 드려야 하는데 그러지 못해 죄송합니다. 다음 주 퇴근하는 길에 연구실로 찾아뵙겠습니다. 늘 건강하십시오.`,
      vietnameseTranslation: `Kính gửi thầy Kim Young-jun. Thầy dạo này có mạnh khỏe không ạ? Năm nay ngày Nhà giáo lại về, mỗi lần đến dịp này em lại nhớ về thầy. Hồi mới bắt đầu học tiếng Hàn ngữ pháp và phát âm khó quá em đã toan bỏ cuộc, nhưng chính thầy đã động viên để em không từ bỏ. Nhờ có thầy tận tình chỉ dạy mà em đã kiên trì theo đuổi. Nhờ vậy tuần trước em đã đỗ phỏng vấn và xin được việc ở công ty thương mại Hàn Quốc. Em xin lỗi vì không thường xuyên tới thăm thầy được. Tiện đường tan sở tuần tới em sẽ ghé qua văn phòng thăm thầy ạ.`,
      keyVocabulary: [
        { kr: '스승의 날', vn: 'Ngày Nhà giáo' },
        { kr: '가르쳐 주신 덕분에', vn: 'Nhờ có thầy dạy dỗ (kết quả tốt)' },
        { kr: '취직하게 되다', vn: 'Đã xin được việc làm' },
        { kr: '찾아뵙다', vn: 'Đến tận nơi thăm hỏi bề trên' },
        { kr: '퇴근하는 길에', vn: 'Tiện đường đi làm về' },
      ],
      questions: [
        {
          id: 'rq_2_2_1',
          question:
            'Nhờ sự giúp đỡ và dạy dỗ của thầy giáo, người viết thư đã đạt được kết quả gì?',
          options: [
            'Được đi du học tự túc ở nước ngoài',
            'Vượt qua khó khăn và đỗ phỏng vấn xin việc tại công ty thương mại Hàn Quốc',
            'Trở thành giáo viên dạy tiếng Hàn',
            'Được miễn toàn bộ học phí đại học',
          ],
          correctIndex: 1,
          evidence:
            '선생님이 잘 가르쳐 주신 덕분에... 한국 무역회사 면접시험에 무사히 합격하여 취직하게 되었습니다.',
        },
      ],
    },
    {
      id: 'r2_3',
      passageNumber: 3,
      type: 'Thư điện tử',
      title: '베트남 귀국 후 감사 이메일 (Email cảm ơn sau khi về nước an toàn)',
      source: 'Giáo trình Tiếng Hàn Tổng Hợp 3 - Bài 02: Trang 48',
      koreanText: `지훈 씨에게.\n지훈 씨, 저 루이엔이에요. 저는 어제 비행기를 타고 호치민에 무사히 도착했습니다.\n제가 한국에 머무는 동안 서울의 경복궁과 청계천도 안내해 주고, 맛있는 불고기와 냉면도 사 주셔서 정말 감사했습니다. 지훈 씨 덕분에 낯선 한국 생활이 전혀 외롭지 않았고 잊지 못할 소중한 추억을 많이 만들 수 있었어요.\n다음에 지훈 씨가 베트남에 여행을 오시면 제가 하롱베이를 구경시켜 드리고 전통 쌀국수도 대접할게요. 꼭 놀러 오세요!`,
      vietnameseTranslation: `Gửi Ji-hoon. Mình là Luyến đây. Hôm qua mình đã đáp máy bay về tới TP.HCM an toàn rồi. Trong thời gian mình ở Hàn Quốc, thực sự cảm ơn cậu rất nhiều vì đã dẫn mình đi tham quan Cung điện Gyeongbokgung, suối Cheonggyecheon và mời mình ăn bulgogi với mì lạnh. Nhờ có cậu mà cuộc sống nơi xứ người không hề cô đơn và mình đã có biết bao kỷ niệm đẹp khó quên. Lần tới nếu cậu sang Việt Nam du lịch, mình nhất định sẽ dẫn cậu đi Vịnh Hạ Long và mời món phở truyền thống nhé!`,
      keyVocabulary: [
        { kr: '무사히 도착하다', vn: 'Đến nơi an toàn, bình an vô sự' },
        { kr: '머무는 동안', vn: 'Trong suốt khoảng thời gian lưu lại' },
        { kr: '잊지 못할 추억', vn: 'Kỷ niệm khó quên' },
        { kr: '대접하다', vn: 'Chiêu đãi, tiếp đãi nồng hậu' },
      ],
      questions: [
        {
          id: 'rq_2_3_1',
          question: 'Luyến dự định sẽ làm gì để đáp lễ khi Ji-hoon sang thăm Việt Nam?',
          options: [
            'Mua vé máy bay khứ hồi cho Ji-hoon',
            'Dẫn Ji-hoon đi tham quan Vịnh Hạ Long và chiêu đãi món phở truyền thống',
            'Gửi quà lưu niệm sang Hàn Quốc qua đường bưu điện',
            'Giúp Ji-hoon tìm việc làm thêm tại TP.HCM',
          ],
          correctIndex: 1,
          evidence:
            '지훈 씨가 베트남에 여행을 오시면 제가 하롱베이를 구경시켜 드리고 전통 쌀국수도 대접할게요.',
        },
      ],
    },
    {
      id: 'r2_4',
      passageNumber: 4,
      type: 'Khảo sát xã hội',
      title: '신입 사원의 고민거리 조사 보고서 (Khảo sát mối băn khoăn của nhân viên mới)',
      source: 'Giáo trình Tiếng Hàn Tổng Hợp 3 - Bài 02: Trang 42-43',
      koreanText: `취업 포털 사이트에서 한국 대기업과 중소기업의 신입 사원 500명을 대상으로 '가장 힘든 고민거리'를 조사하였다.\n조사 결과, 전체 응답자의 42%가 '선후배 및 직장 동료와의 대인 관계'를 1위로 꼽았다. 신입 사원들은 업무를 익히는 것보다 낯선 조직 문화에 적응하고 상사에게 예의 바르게 행동하는 것에 더 큰 심리적 부담을 느낀다고 답했다.\n그다음으로는 '과도한 업무량(28%)'과 '적은 월급(18%)'이 뒤를 이었다. 전문가들은 원만한 대인 관계를 유지하기 위해서는 먼저 밝은 표정으로 인사하고 상대방의 입장을 배려하는 태도가 무엇보다 중요하다고 조언한다.`,
      vietnameseTranslation: `Trang web tuyển dụng đã thực hiện khảo sát đối với 500 nhân viên mới tại các doanh nghiệp lớn và vừa ở Hàn Quốc về 'nỗi lo lắng trăn trở lớn nhất'. Kết quả cho thấy 42% số người chọn 'quan hệ đối nhân xử thế với tiền bối và đồng nghiệp' ở vị trí số 1. Các nhân viên mới chia sẻ rằng so với việc học nghiệp vụ thì họ cảm thấy áp lực tâm lý lớn hơn trong việc thích nghi với văn hóa công ty và cư xử lễ phép với cấp trên. Tiếp theo là khối lượng công việc quá tải (28%) và lương thấp (18%).`,
      keyVocabulary: [
        { kr: '신입 사원', vn: 'Nhân viên mới tuyển dụng' },
        { kr: '고민거리', vn: 'Nỗi lo lắng băn khoăn' },
        { kr: '선후배 관계', vn: 'Mối quan hệ tiền bối - hậu bối' },
        { kr: '심리적 부담', vn: 'Gánh nặng tâm lý' },
        { kr: '배려하다', vn: 'Quan tâm nghĩ cho người khác' },
      ],
      questions: [
        {
          id: 'rq_2_4_1',
          question:
            'Theo kết quả khảo sát, khó khăn lớn nhất mà nhân viên mới tại Hàn Quốc gặp phải là gì?',
          options: [
            'Mức lương khởi điểm quá thấp',
            'Khó khăn trong quan hệ đối nhân xử thế với tiền bối và đồng nghiệp nơi công sở',
            'Thời gian di chuyển đi làm quá xa',
            'Không sử dụng được máy tính văn phòng',
          ],
          correctIndex: 1,
          evidence: "전체 응답자의 42%가 '선후배 및 직장 동료와의 대인 관계'를 1위로 꼽았다.",
        },
      ],
    },
    {
      id: 'r2_5',
      passageNumber: 5,
      type: 'Văn hóa đối chiếu',
      title: '한국인의 부탁과 거절의 예절 (Phép lịch sự khi nhờ cậy và từ chối ở Hàn Quốc)',
      source: 'Giáo trình Tiếng Hàn Tổng Hợp 3 - Bài 02: Văn hóa (Trang 50 & 316)',
      koreanText: `사회생활을 하면서 다른 사람에게 부탁을 하거나 상대방의 부탁을 거절해야 할 때가 많다. 한국에서는 부탁을 할 때 상대방의 상황과 입장을 먼저 신중하게 고려해야 한다.\n상대방이 거절하기 어려운 곤란한 부탁을 하거나 조건을 앞세우는 것은 큰 실례가 된다. 또한 부탁을 들어준 사람에게는 작은 감사의 표시를 잊지 말아야 한다.\n반대로 부탁을 거절할 때는 단호하게 '안 된다'고 말하기보다는 먼저 "도와드리지 못해 죄송합니다"라며 유감을 표하고, 거절할 수밖에 없는 타당한 사정을 부드럽게 설명하여 상대방의 기분이 상하지 않도록 양해를 구하는 것이 현명한 예절이다.`,
      vietnameseTranslation: `Trong đời sống xã hội, chúng ta thường xuyên phải nhờ vả hoặc từ chối lời đề nghị của người khác. Tại Hàn Quốc, khi nhờ cậy ai điều gì, điều quan trọng nhất là phải cân nhắc kỹ hoàn cảnh và vị thế của đối phương. Việc nhờ vả điều khiến đối phương khó xử khó từ chối hoặc ra điều kiện là hành vi rất khiếm nhã. Ngược lại, khi từ chối, thay vì nói thẳng thừng 'không được', người lịch sự sẽ bày tỏ sự tiếc nuối trước ("Tôi xin lỗi vì không giúp được"), sau đó giải thích lý do chính đáng để xin sự thông cảm.`,
      keyVocabulary: [
        { kr: '양해를 구하다', vn: 'Xin sự thông cảm lượng thứ' },
        { kr: '타당한 사정', vn: 'Lý do chính đáng thỏa đáng' },
        { kr: '실례가 되다', vn: 'Trở thành hành vi thất lễ, khiếm nhã' },
        { kr: '현명하다', vn: 'Khôn ngoan, sáng suốt' },
      ],
      questions: [
        {
          id: 'rq_2_5_1',
          question:
            'Theo quy tắc lịch thiệp của người Hàn, khi từ chối lời nhờ vả ta nên làm như thế nào?',
          options: [
            'Lập tức im lặng không trả lời để đối phương tự hiểu',
            'Nói thẳng thừng "không được" một cách dứt khoát ngay từ đầu',
            'Bày tỏ tiếc nuối, nêu lý do chính đáng một cách khéo léo để xin sự thông cảm',
            'Yêu cầu đối phương phải trả một khoản phí thù lao lớn',
          ],
          correctIndex: 2,
          evidence:
            '먼저 유감을 표하고, 거절할 수밖에 없는 타당한 사정을 부드럽게 설명하여 양해를 구하는 것이 현명한 예절이다.',
        },
      ],
    },
  ],

  // BÀI 03: 건강 (Sức khỏe & Lối sống)
  3: [
    {
      id: 'r3_1',
      passageNumber: 1,
      type: 'Khẩu hiệu & Chiến dịch',
      title:
        '국민 건강 10원칙과 스포츠 7330 캠페인 (Chiến dịch Sports 7330 & 10 nguyên tắc sức khỏe)',
      source: 'Giáo trình Tiếng Hàn Tổng Hợp 3 - Bài 03: Trang 54',
      koreanText: `한국 국민건강보험공단과 대한체육회는 국민들의 건강 증진을 위해 '스포츠 7330' 캠페인을 적극적으로 전개하고 있다.\n'스포츠 7330'이란 "일주일에(7) 세 번(3) 이상, 하루 30분(30)씩 꾸준히 운동하자"는 의미를 담고 있다. 바쁜 현대인들이 과도한 스트레스와 불규칙한 생활 습관으로 인해 건강을 잃기 쉽기 때문이다.\n매일 무리하게 격렬한 운동을 하는 것보다, 가볍게 걷기나 계단 오르기 같은 유산소 운동을 주 3회 30분씩 실천하는 것이 심장 질환과 성인병 예방에 훨씬 효과적인 것으로 나타났다.`,
      vietnameseTranslation: `Hiệp hội Thể dục Thể thao và Cơ quan Bảo hiểm Sức khỏe Quốc gia Hàn Quốc đang tích cực triển khai chiến dịch 'Sports 7330' nhằm nâng cao thể chất cộng đồng. Khẩu hiệu 'Sports 7330' mang ý nghĩa: 'Một tuần (7) tập thể dục từ 3 lần (3) trở lên, mỗi ngày 30 phút (30) đều đặn'. Nguyên do vì người hiện đại bận rộn rất dễ tổn hại sức khỏe bởi stress và sinh hoạt thất thường. Thay vì tập quá sức, việc đi bộ nhẹ nhàng 30 phút x 3 lần/tuần mang lại hiệu quả vượt trội phòng bệnh tim mạch.`,
      keyVocabulary: [
        { kr: '스포츠 7330', vn: 'Chiến dịch thể thao: Tuần 3 lần, mỗi lần 30 phút' },
        { kr: '건강을 잃다', vn: 'Đánh mất sức khỏe' },
        { kr: '불규칙한 생활', vn: 'Sinh hoạt thất thường không quy củ' },
        { kr: '유산소 운동', vn: 'Bài tập thể dục hiếu khí (cardio)' },
      ],
      questions: [
        {
          id: 'rq_3_1_1',
          question:
            'Con số "7330" trong chiến dịch sức khỏe nổi tiếng của Hàn Quốc mang ý nghĩa chính xác là gì?',
          options: [
            'Mỗi ngày đi 7.000 bước, uống 3 lít nước và ngủ 30 phút',
            'Một tuần tập thể dục từ 3 lần trở lên, mỗi ngày tập ít nhất 30 phút',
            'Tập thể dục liên tục trong 7 tháng, mỗi tháng 30 ngày',
            'Một tuần nghỉ ngơi 3 ngày và giảm 30% lượng thức ăn',
          ],
          correctIndex: 1,
          evidence:
            '스포츠 7330이란 일주일에(7) 세 번(3) 이상, 하루 30분(30)씩 꾸준히 운동하자는 의미이다.',
        },
      ],
    },
    {
      id: 'r3_2',
      passageNumber: 2,
      type: 'Ẩm thực trị liệu',
      title: '감기에 탁월한 한국의 전통 식품과 한방차 (Món ăn & Trà trị cảm cúm dân gian Hàn Quốc)',
      source: 'Sách bài tập Tiếng Hàn Tổng Hợp 3 - Bài 03: Trang 37',
      koreanText: `환절기에 감기에 걸려 기침과 두통으로 고생할 때 한국인들이 즐겨 찾는 전통 식품이 있다. 옛날부터 한국 사람들은 감기에 걸리면 비타민C와 소화 효소가 풍부한 '무'를 꿀에 재워 먹었다.\n또한 몸을 따뜻하게 해 주는 '생강차'는 단백질과 비타민이 많아 목의 통증과 기침을 완화하는 데 큰 도움이 된다.\n겨울철 귤을 먹고 난 후 껍질을 깨끗이 씻어 말려서 끓여 마시는 '귤껍질차(진피차)'는 감기 예방은 물론 다이어트와 피부 미용에도 좋다. 돈이 많이 들지 않고 집에서 쉽게 만들 수 있는 이러한 전통 차를 마시는 것이 독한 감기약을 먹는 것보다 몸에 좋다.`,
      vietnameseTranslation: `Vào thời điểm giao mùa khi bị cảm cúm hành hạ bởi những cơn ho và đau đầu, người Hàn có những món truyền thống rất được chuộng. Từ xa xưa khi bị cảm, người Hàn thường ngâm củ cải giàu vitamin C vào mật ong để ăn. Ngoài ra, 'trà gừng' giúp làm ấm cơ thể, giàu dưỡng chất giúp xoa dịu đau rát họng và giảm ho. Mùa đông, trà vỏ quýt phơi khô (trần bì) vừa phòng cảm cúm vừa hỗ trợ giảm cân và làm đẹp da. Những loại trà này rẻ tiền, dễ làm tại nhà và lành tính hơn thuốc tây.`,
      keyVocabulary: [
        { kr: '생강차', vn: 'Trà gừng' },
        { kr: '귤껍질차', vn: 'Trà vỏ quýt' },
        { kr: '다이어트', vn: 'Giảm cân, giữ vóc dáng' },
        { kr: '마시는 게 좋다', vn: 'Uống thì tốt hơn (lời khuyên)' },
      ],
      questions: [
        {
          id: 'rq_3_2_1',
          question: 'Theo bài viết, ưu điểm lớn của trà vỏ quýt (귤껍질차) là gì?',
          options: [
            'Có giá thành rất đắt đỏ chỉ bán ở hiệu thuốc',
            'Vừa phòng ngừa cảm cúm, vừa hỗ trợ giảm cân, dễ làm và không tốn nhiều tiền',
            'Chỉ có thể uống vào mùa hè',
            'Có vị rất đắng khó uống',
          ],
          correctIndex: 1,
          evidence:
            '귤껍질차는 감기 예방은 물론 다이어트에도 좋고, 돈이 많이 들지 않고 집에서 쉽게 만들 수 있다.',
        },
      ],
    },
    {
      id: 'r3_3',
      passageNumber: 3,
      type: 'Giới thiệu sách',
      title: '건강 도서 추천: 잘 먹고 잘 살자 (Giới thiệu sách "Ăn ngon sống khỏe")',
      source: 'Sách bài tập Tiếng Hàn Tổng Hợp 3 - Bài 03: Trang 35',
      koreanText: `안색이 안 좋아 보이십니까? 업무와 학업 스트레스로 인해 만성 피로를 겪고 계신 분들을 위한 실용적인 건강 도서가 새로 출간되었습니다.\n한국출판사에서 펴낸 '잘 먹고 잘 살자'는 현대인들이 일상에서 손쉽게 실천할 수 있는 웰빙 건강법을 총망라하고 있습니다.\n무리한 단식 대신 영양이 균형 잡힌 친환경 식단 구성법부터, 집이나 사무실에서 틈틈이 할 수 있는 스트레칭 체조, 그리고 올바른 수면 습관까지 친절하게 안내합니다. 몸이 약해서 자주 아픈 분이라면 이 책을 꼭 읽어 보시는 게 좋겠습니다.`,
      vietnameseTranslation: `Trông sắc mặt bạn có vẻ không được khỏe? Một cuốn sách sức khỏe thực tế mới được xuất bản dành cho những người đang chịu đựng chứng mệt mỏi mãn tính do áp lực công việc và học tập. Cuốn sách 'Ăn ngon sống khỏe' của Nhà xuất bản Hàn Quốc tổng hợp những phương pháp dưỡng sinh lành mạnh mà ai cũng có thể làm theo trong đời thường. Từ thực đơn dinh dưỡng cân bằng thay vì nhịn ăn cực đoan, đến các bài tập giãn cơ tại chỗ và thói quen ngủ khoa học.`,
      keyVocabulary: [
        { kr: '안색이 안 좋아 보이다', vn: 'Sắc mặt trông có vẻ không tốt' },
        { kr: '만성 피로', vn: 'Chứng mệt mỏi mãn tính' },
        { kr: '웰빙 식단', vn: 'Thực đơn ăn uống lành mạnh vì sức khỏe' },
        { kr: '실천하다', vn: 'Thực hành, đưa vào thực tế' },
      ],
      questions: [
        {
          id: 'rq_3_3_1',
          question: 'Cuốn sách "잘 먹고 잘 살자" hướng dẫn nội dung gì cho độc giả?',
          options: [
            'Cách điều chế các loại thuốc kháng sinh cực mạnh',
            'Các phương pháp ăn uống lành mạnh, tập thể dục tại chỗ và thói quen sinh hoạt tốt',
            'Cách thức kiếm tiền nhanh trong kinh doanh',
            'Lịch sử y học cổ truyền thế giới',
          ],
          correctIndex: 1,
          evidence:
            '친환경 식단 구성법부터 틈틈이 할 수 있는 스트레칭 체조, 올바른 수면 습관까지 친절하게 안내합니다.',
        },
      ],
    },
    {
      id: 'r3_4',
      passageNumber: 4,
      type: 'Trải nghiệm cá nhân',
      title: '수영을 시작한 후 달라진 나의 건강 (Sức khỏe của tôi thay đổi từ khi học bơi)',
      source: 'Sách bài tập Tiếng Hàn Tổng Hợp 3 - Bài 03: Trang 36',
      koreanText: `저는 지난달까지만 해도 불면증 때문에 밤마다 잠을 설치고 늘 피곤해 보였습니다. 몸이 약해서 감기도 자주 걸렸습니다.\n그러던 중 친구의 권유로 학교 체육관에서 아침 수영 강습을 신청하여 매일 한 시간씩 수영을 배우게 되었습니다.\n처음 며칠 동안은 온몸이 쑤시고 과로하는 것처럼 힘들었지만, 3주가 지난 지금은 안색도 아주 좋아지고 밤에 깊은 잠을 잘 수 있게 되었습니다. 강습료도 동네 사설 스포츠센터에 비해서 저렴한 편입니다. 건강을 지키려면 자신에게 맞는 유산소 운동을 하나 정해서 꾸준히 하는 게 제일 좋습니다.`,
      vietnameseTranslation: `Cho tới tận tháng trước, vì chứng mất ngủ mà đêm nào tôi cũng trằn trọc và trông lúc nào cũng mệt mỏi rũ rượi. Cơ thể yếu ớt nên tôi cũng hay bị cảm. Được bạn bè khuyên nhủ, tôi đã đăng ký lớp học bơi buổi sáng tại nhà thi đấu của trường mỗi ngày 1 tiếng. Vài ngày đầu toàn thân ê ẩm mệt lử như kiệt sức, nhưng sau 3 tuần sắc mặt tôi đã hồng hào hẳn lên và có thể ngủ sâu giấc. Học phí ở trường cũng thuộc diện rẻ hơn so với các trung tâm tư nhân ngoài phố.`,
      keyVocabulary: [
        { kr: '잠을 설치다', vn: 'Ngủ trằn trọc không yên giấc' },
        { kr: '몸이 약하다', vn: 'Thể trạng yếu ớt, suy nhược' },
        { kr: '깊은 잠을 자다', vn: 'Ngủ một giấc thật sâu' },
        { kr: '저렴한 편이다', vn: 'Thuộc diện giá rẻ' },
      ],
      questions: [
        {
          id: 'rq_3_4_1',
          question: 'Sau 3 tuần kiên trì tập bơi, người viết đã đạt được thay đổi tích cực nào?',
          options: [
            'Được chọn vào đội tuyển bơi lội quốc gia',
            'Sắc mặt hồng hào hơn và đã chữa được chứng mất ngủ, ngủ sâu giấc',
            'Tiết kiệm được toàn bộ tiền ăn hàng tháng',
            'Không cần phải đi học trên giảng đường nữa',
          ],
          correctIndex: 1,
          evidence: '3주가 지난 지금은 안색도 아주 좋아지고 밤에 깊은 잠을 잘 수 있게 되었습니다.',
        },
      ],
    },
    {
      id: 'r3_5',
      passageNumber: 5,
      type: 'Văn hóa đối chiếu',
      title:
        '한국인의 식습관 변화와 유기농 웰빙 열풍 (Sự thay đổi thói quen ăn uống & trào lưu hữu cơ Hàn Quốc)',
      source: 'Giáo trình Tiếng Hàn Tổng Hợp 3 - Bài 03: Trang 69 & Văn hóa Trang 317',
      koreanText: `한국 사회가 급속하게 발전하면서 패스트푸드와 육류 위주의 서구화된 식습관이 널리 퍼졌으나, 최근에는 다시 건강을 위해 자연식을 찾는 사람들이 크게 늘고 있다.\n특히 농약과 화학 비료를 쓰지 않고 재배한 '유기농 식품(Organic Food)'이 큰 인기를 끌고 있으며, 대형 마트마다 유기농 채소와 통곡물 전용 매장이 마련되어 있다.\n또한 일상생활에서 탄산음료나 인스턴트 커피 대신 생강차, 유자차, 인삼차와 같은 전통 한방 음료를 즐겨 마시는 문화가 젊은 층 사이에서도 확산되고 있다. 이는 단순한 유행을 넘어 몸과 마음의 조화를 중시하는 한국인의 웰빙(Well-being) 철학을 보여준다.`,
      vietnameseTranslation: `Cùng với sự phát triển thần tốc của xã hội Hàn Quốc, thói quen ăn uống Tây phương hóa nhiều thịt và đồ ăn nhanh từng lan rộng, nhưng gần đây xu hướng tìm về các món ăn tự nhiên vì sức khỏe đang gia tăng mạnh mẽ. Đặc biệt, thực phẩm hữu cơ (유기농 식품) trồng không hóa chất đang rất được săn đón, các siêu thị đều có quầy nông sản hữu cơ riêng. Giới trẻ cũng ngày càng chuộng uống trà thảo mộc truyền thống (trà gừng, trà thanh yên, trà nhân sâm) thay cho nước có ga hay cà phê hòa tan.`,
      keyVocabulary: [
        { kr: '서구화되다', vn: 'Bị Tây phương hóa' },
        { kr: '유기농 식품', vn: 'Thực phẩm hữu cơ (không hóa chất)' },
        { kr: '통곡물', vn: 'Ngũ cốc nguyên hạt' },
        { kr: '웰빙', vn: 'Lối sống lành mạnh, an lành (Well-being)' },
      ],
      questions: [
        {
          id: 'rq_3_5_1',
          question:
            'Điểm nổi bật trong sự thay đổi thói quen ăn uống gần đây của người Hàn Quốc là gì?',
          options: [
            'Chỉ ăn thức ăn nhanh để tiết kiệm thời gian',
            'Chuyển sang chuộng thực phẩm hữu cơ tự nhiên và các loại trà truyền thống tốt cho sức khỏe',
            'Ngừng hoàn toàn việc ăn rau củ',
            'Chỉ uống nước ngọt có ga trong mọi bữa ăn',
          ],
          correctIndex: 1,
          evidence:
            "농약과 화학 비료를 쓰지 않은 '유기농 식품'이 인기를 끌고 전통 음료를 즐겨 마시는 문화가 확산되고 있다.",
        },
      ],
    },
  ],
};

export default function App() {
  const [currentTab, setCurrentTab] = useState('roadmap');
  const [activeLessonId, setActiveLessonId] = useState(1);

  // Reading Studio State
  const [readingSelectedLesson, setReadingSelectedLesson] = useState(1);
  const [readingPassageIndex, setReadingPassageIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [highlightVocab, setHighlightVocab] = useState(true);
  const [readingFontSize, setReadingFontSize] = useState('text-sm'); // text-xs | text-sm | text-base
  const [readingUserAnswers, setReadingUserAnswers] = useState({});

  // Gamification & Progress
  const [xp, setXp] = useState(250);
  const [streak, setStreak] = useState(4);
  const [studyPlanDays, setStudyPlanDays] = useState(14);
  const [targetGrade, setTargetGrade] = useState('A');
  const [completedLessons, setCompletedLessons] = useState([1]);
  const [wrongAnswers, setWrongAnswers] = useState([
    {
      ...QUIZ_DATABASE[0],
      userSelected: '교실에 학생이 세 명밖에 있어요.',
      failedAt: 'Luyện tập Bài 01',
    },
  ]);

  // Vocab Lab State & Deep Scanned Source Filters
  const [vocabSearchTerm, setVocabSearchTerm] = useState('');
  const [vocabSelectedLesson, setVocabSelectedLesson] = useState('all');
  const [vocabSourceFilter, setVocabSourceFilter] = useState('all'); // all | 기본 | 새단어 | 듣기
  const [flashcardFlipped, setFlashcardFlipped] = useState(false);
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (title, message, type = 'info') => {
    setToastMessage({ title, message, type });
  };

  const closeToast = () => {
    setToastMessage(null);
  };

  // Quiz Interaction State
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);

  // Korean Writing State
  const [currentWritingIndex, setCurrentWritingIndex] = useState(0);
  const [userWritingInput, setUserWritingInput] = useState('');
  const [writingFeedback, setWritingFeedback] = useState(null);

  // Exam Mode State
  const [examStarted, setExamStarted] = useState(false);
  const [examAnswers, setExamAnswers] = useState({});
  const [examResult, setExamResult] = useState(null);

  const allVocabularies = useMemo(() => {
    const list = [];
    Object.entries(LESSONS_DATA).forEach(([lessonId, lesson]) => {
      lesson.vocabulary.forEach((cat) => {
        cat.items.forEach((item) => {
          list.push({
            lessonId: Number(lessonId),
            lessonTitle: lesson.koreanTitle,
            category: cat.category,
            sourceTag: cat.sourceTag || '기본',
            kr: item.kr,
            vn: item.vn,
            note: item.note || '',
          });
        });
      });
    });
    return list;
  }, []);

  const filteredVocabularies = useMemo(() => {
    return allVocabularies.filter((v) => {
      const matchLesson =
        vocabSelectedLesson === 'all' || v.lessonId === Number(vocabSelectedLesson);
      const matchSource = vocabSourceFilter === 'all' || v.sourceTag === vocabSourceFilter;
      const matchSearch =
        v.kr.toLowerCase().includes(vocabSearchTerm.toLowerCase()) ||
        v.vn.toLowerCase().includes(vocabSearchTerm.toLowerCase()) ||
        v.category.toLowerCase().includes(vocabSearchTerm.toLowerCase()) ||
        v.note.toLowerCase().includes(vocabSearchTerm.toLowerCase());
      return matchLesson && matchSource && matchSearch;
    });
  }, [allVocabularies, vocabSelectedLesson, vocabSourceFilter, vocabSearchTerm]);

  const currentLessonQuizzes = useMemo(() => {
    const list = QUIZ_DATABASE.filter((q) => q.lessonId === activeLessonId);
    return list.length > 0 ? list : QUIZ_DATABASE.filter((q) => q.lessonId === 1);
  }, [activeLessonId]);

  const estimatedWorkloadMinutes = useMemo(() => {
    const baseMinutesPerTopic = targetGrade === 'A+' ? 45 : targetGrade === 'A' ? 35 : 25;
    const totalMinutes = COURSE_STRUCTURE.length * baseMinutesPerTopic;
    return Math.round(totalMinutes / studyPlanDays);
  }, [studyPlanDays, targetGrade]);

  const currentLesson = LESSONS_DATA[activeLessonId] || LESSONS_DATA[1];

  const handleAnswerSelect = (index) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(index);
    setIsAnswerSubmitted(true);

    const activeQ = currentLessonQuizzes[currentQuizIndex];
    const isCorrect = index === activeQ.correctIndex;

    if (isCorrect) {
      setXp((prev) => prev + 10);
    } else {
      setWrongAnswers((prev) => {
        const exists = prev.some((item) => item.id === activeQ.id);
        if (!exists) {
          return [...prev, { ...activeQ, userSelected: activeQ.options[index] }];
        }
        return prev;
      });
    }
  };

  const handleNextQuiz = () => {
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    if (currentQuizIndex < currentLessonQuizzes.length - 1) {
      setCurrentQuizIndex((prev) => prev + 1);
    } else {
      setXp((prev) => prev + 50);
      if (!completedLessons.includes(activeLessonId)) {
        setCompletedLessons((prev) => [...prev, activeLessonId]);
      }
      showToast(
        'Chúc mừng!',
        `Bạn đã hoàn thành bộ câu hỏi Bài ${activeLessonId} (${currentLesson.koreanTitle})! Bạn được thưởng +50 XP.`,
        'success',
      );
      setCurrentQuizIndex(0);
    }
  };

  const handleRetryWrongQuestion = (questionId, selectedIdx) => {
    const targetQ = wrongAnswers.find((q) => q.id === questionId);
    if (!targetQ) return;

    if (selectedIdx === targetQ.correctIndex) {
      setWrongAnswers((prev) => prev.filter((q) => q.id !== questionId));
      setXp((prev) => prev + 5);
      showToast(
        'Đã khắc phục thành công!',
        'Chính xác! Câu hỏi đã được gỡ khỏi Sổ Tay Câu Sai và bạn nhận được +5 XP.',
        'success',
      );
    } else {
      showToast(
        'Chưa chính xác!',
        'Phương án bạn vừa chọn vẫn chưa đúng. Hãy đọc kỹ phần giải thích nguyên nhân và thử lại nhé!',
        'warning',
      );
    }
  };

  const handleEvaluateKoreanWriting = () => {
    const currentPrompt = KOREAN_WRITING_PROMPTS[currentWritingIndex];
    const userText = userWritingInput.trim();

    if (!userText) {
      showToast(
        'Thông báo',
        'Vui lòng nhập câu trả lời tiếng Hàn của bạn trước khi chấm điểm!',
        'warning',
      );
      return;
    }

    const matchedKeywords = currentPrompt.requiredKeywords.filter((kw) => userText.includes(kw));
    const accuracyRatio = matchedKeywords.length / currentPrompt.requiredKeywords.length;

    let grade = 'Cần rèn luyện thêm';
    let comment = '';

    if (accuracyRatio === 1) {
      grade = 'Xuất sắc (A+)';
      comment =
        'Tuyệt hảo! Câu viết của bạn chuẩn xác 100% cả về từ vựng trọng tâm, ngữ pháp và văn phong học thuật tiếng Hàn.';
      setXp((prev) => prev + 25);
    } else if (accuracyRatio >= 0.5) {
      grade = 'Đạt yêu cầu (B+)';
      comment = `Bạn đã nắm được ý chính, nhưng cần bổ sung các từ khóa then chốt: ${currentPrompt.requiredKeywords.join(', ')}.`;
      setXp((prev) => prev + 10);
    } else {
      grade = 'Cần cải thiện (C)';
      comment =
        'Câu của bạn chưa đáp ứng đủ các ngữ pháp và từ khóa bắt buộc của đề bài. Hãy xem câu mẫu chuẩn bên dưới nhé.';
    }

    setWritingFeedback({
      grade,
      comment,
      matchedKeywords,
      modelAnswer: currentPrompt.modelAnswer,
      explanation: currentPrompt.explanation,
    });
  };

  const handleSubmitExam = () => {
    let score = 0;
    const missed = [];

    QUIZ_DATABASE.forEach((q) => {
      if (examAnswers[q.id] === q.correctIndex) {
        score += 1;
      } else {
        missed.push({
          ...q,
          selected: examAnswers[q.id] !== undefined ? q.options[examAnswers[q.id]] : 'Chưa chọn',
        });
      }
    });

    const accuracy = Math.round((score / QUIZ_DATABASE.length) * 100);
    setExamResult({
      score,
      total: QUIZ_DATABASE.length,
      accuracy,
      missed,
    });
    setExamStarted(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col antialiased">
      {/* TOAST MODAL */}
      {toastMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-200 shadow-2xl space-y-4 text-center">
            <div className="text-4xl">
              {toastMessage.type === 'success'
                ? '🎉'
                : toastMessage.type === 'warning'
                  ? '⚠️'
                  : '💡'}
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">{toastMessage.title}</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{toastMessage.message}</p>
            </div>
            <button
              onClick={closeToast}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-all shadow-sm cursor-pointer"
            >
              Đã hiểu
            </button>
          </div>
        </div>
      )}

      {}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 py-3 shadow-2xs">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center text-white text-xl shadow-xs">
              🇰🇷
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-black text-slate-900 text-sm sm:text-base tracking-tight">
                  Tiếng Hàn Tổng Hợp 3
                </h1>
                <span className="text-[10px] font-bold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full font-mono">
                  Trung Cấp 3
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                베트남인을 위한 종합 한국어 3 (KB국민은행 & KF 한국국제교류재단)
              </p>
            </div>
          </div>

          {}
          <div className="flex items-center space-x-3 text-xs font-bold">
            <div className="flex items-center space-x-1.5 bg-amber-50 text-amber-800 px-3 py-1.5 rounded-xl border border-amber-200">
              <span>⭐</span>
              <span>{xp} XP</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-rose-50 text-rose-800 px-3 py-1.5 rounded-xl border border-rose-200">
              <span>🔥</span>
              <span>{streak} Ngày</span>
            </div>
            <div
              onClick={() => setCurrentTab('wrong_notebook')}
              className="flex items-center space-x-1.5 bg-red-50 text-red-800 px-3 py-1.5 rounded-xl border border-red-200 cursor-pointer hover:bg-red-100 transition-all"
            >
              <span>📕</span>
              <span>{wrongAnswers.length} Câu sai</span>
            </div>
          </div>
        </div>

        {}
        <div className="max-w-6xl mx-auto mt-3 flex items-center space-x-1 overflow-x-auto pb-1 scrollbar-none text-xs font-bold">
          {[
            { id: 'roadmap', label: '🗺️ Bản Đồ' },
            { id: 'learn', label: '📚 Học Bài' },
            { id: 'vocab_lab', label: '🗂️ Vocab Lab' },
            { id: 'reading', label: '📖 Đọc Hiểu' },
            { id: 'quiz', label: '🎮 Luyện Quiz' },
            { id: 'wrong_notebook', label: `📕 Sổ Câu Sai (${wrongAnswers.length})` },
            { id: 'writing', label: '✍️ Tự Luận HQ' },
            { id: 'exam', label: '📝 Mock Exam' },
            { id: 'plan', label: '⏱️ Kế Hoạch' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                currentTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-6">
        {}
        {currentTab === 'roadmap' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl p-6 text-white shadow-md relative overflow-hidden">
              <div className="relative z-10">
                <span className="bg-white/20 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                  Lộ trình học tập toàn diện
                </span>
                <h2 className="text-2xl font-black mt-2 mb-1">
                  🗺️ BẢN ĐỒ CHINH PHỤC 15 BÀI TRUNG CẤP 3
                </h2>
                <p className="text-xs text-indigo-100 max-w-xl">
                  Bao quát toàn diện từ vựng 4 nguồn, ngữ pháp có điều kiện kết hợp, mẹo phân biệt
                  sắc thái và các bài đọc đối chiếu văn hóa Hàn - Việt.
                </p>
                <div className="mt-4 flex items-center space-x-4">
                  <div className="flex-1 max-w-xs bg-black/20 rounded-full h-3 overflow-hidden p-0.5">
                    <div
                      className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.round((completedLessons.length / COURSE_STRUCTURE.length) * 100)}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs font-bold text-emerald-200">
                    {completedLessons.length}/{COURSE_STRUCTURE.length} Bài Hoàn Thành (
                    {Math.round((completedLessons.length / COURSE_STRUCTURE.length) * 100)}%)
                  </span>
                </div>
              </div>
              <span className="absolute right-4 bottom-[-10px] text-8xl opacity-15 select-none">
                📚
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {COURSE_STRUCTURE.map((lesson) => {
                const isCompleted = completedLessons.includes(lesson.id);
                const isActive = activeLessonId === lesson.id;

                return (
                  <div
                    key={lesson.id}
                    onClick={() => {
                      setActiveLessonId(lesson.id);
                      setCurrentTab('learn');
                    }}
                    className={`cursor-pointer rounded-2xl p-4 border transition-all hover:shadow-md ${
                      isActive
                        ? 'border-indigo-500 bg-indigo-50/50 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-indigo-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        Unit {lesson.id < 10 ? `0${lesson.id}` : lesson.id}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                          isCompleted
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {isCompleted ? '✅ Đã hoàn thành' : '▶️ Đang học'}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-800 text-sm mb-1">{lesson.title}</h3>
                    <p className="text-xs text-slate-500 mb-3">{lesson.topic}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                      <span className="text-indigo-600 font-semibold">{lesson.importance}</span>
                      <span className="text-slate-400">{lesson.totalQuestions} câu hỏi</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {}
        {currentTab === 'learn' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                    Bài đang học
                  </span>
                  <span className="bg-indigo-100 text-indigo-800 text-[10px] font-black px-2 py-0.5 rounded-full font-mono">
                    {currentLesson.vocabulary.reduce((acc, cat) => acc + cat.items.length, 0)} Từ
                    vựng chuyên sâu
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mt-1">{currentLesson.title}</h2>
                <p className="text-xs text-slate-500 mt-1">{currentLesson.objectives}</p>
              </div>
              <div className="flex items-center space-x-2">
                <select
                  value={activeLessonId}
                  onChange={(e) => {
                    setActiveLessonId(Number(e.target.value));
                    setCurrentQuizIndex(0);
                  }}
                  className="px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-bold"
                >
                  {COURSE_STRUCTURE.map((l) => (
                    <option key={l.id} value={l.id}>
                      Bài {l.id < 10 ? `0${l.id}` : l.id}: {l.koreanTitle}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => {
                    setVocabSelectedLesson(activeLessonId);
                    setCurrentTab('vocab_lab');
                  }}
                  className="px-3 py-2 bg-blue-50 border border-blue-200 text-blue-700 font-bold rounded-xl text-xs transition-all hover:bg-blue-100 cursor-pointer"
                >
                  🗂️ Mở Flashcard
                </button>
                <button
                  onClick={() => setCurrentTab('quiz')}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-all shadow-sm whitespace-nowrap cursor-pointer"
                >
                  🎮 Luyện Quiz
                </button>
              </div>
            </div>

            {/* Từ vựng */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
                  <span>📖</span>
                  <span>Từ Vựng Đã Quét Toàn Bộ 4 Nguồn Giáo Trình & Sách Bài Tập</span>
                </h3>
                <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                  Tổng {currentLesson.vocabulary.reduce((acc, cat) => acc + cat.items.length, 0)} từ
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentLesson.vocabulary.map((vocabGroup, vIdx) => (
                  <div
                    key={vIdx}
                    className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3"
                  >
                    <div className="flex items-center justify-between pb-1.5 border-b border-indigo-100">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-xs font-black text-indigo-900">
                          {vocabGroup.category}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          ({vocabGroup.items.length})
                        </span>
                      </div>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                          vocabGroup.sourceTag === '새단어'
                            ? 'bg-amber-100 text-amber-800'
                            : vocabGroup.sourceTag === '듣기'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {vocabGroup.sourceTag === '새단어'
                          ? 'Bảng từ mới & Bài đọc'
                          : vocabGroup.sourceTag === '듣기'
                            ? 'Nghe & SBT'
                            : 'Cơ bản'}
                      </span>
                    </div>
                    <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
                      {vocabGroup.items.map((item, iIdx) => (
                        <div
                          key={iIdx}
                          className="text-xs bg-white p-2.5 rounded-xl border border-slate-200/70 shadow-2xs space-y-1"
                        >
                          <div className="flex justify-between items-start gap-2">
                            <span className="font-black text-indigo-900 text-xs sm:text-sm">
                              {item.kr}
                            </span>
                            <span className="text-slate-700 font-medium text-right text-xs">
                              {item.vn}
                            </span>
                          </div>
                          {item.note && (
                            <p className="text-[11px] text-slate-500 italic">💡 {item.note}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
                <span>📐</span>
                <span>Ngữ Pháp Cốt Lõi, Điều Kiện Kết Hợp & TIPS Phân Biệt</span>
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {currentLesson.grammar.map((gram, gIdx) => (
                  <div
                    key={gIdx}
                    className="p-4 rounded-2xl bg-indigo-50/40 border border-indigo-100 space-y-2"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-bold text-sm text-indigo-900 bg-white px-3 py-1 rounded-lg border border-indigo-200 shadow-2xs">
                        {gram.structure}
                      </span>
                      <span className="text-xs font-semibold text-slate-600">{gram.meaning}</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                      <strong>Quy tắc sử dụng:</strong> {gram.rule}
                    </p>
                    {gram.distinction && (
                      <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium">
                        {gram.distinction}
                      </div>
                    )}
                    <div className="space-y-1 pt-1">
                      <span className="text-[11px] font-bold text-slate-400 uppercase">
                        Ví dụ chuẩn giáo trình:
                      </span>
                      {gram.examples.map((ex, eIdx) => (
                        <div
                          key={eIdx}
                          className="text-xs bg-white p-2 rounded-lg border border-slate-200/60"
                        >
                          <p className="font-medium text-slate-800">{ex.kr}</p>
                          <p className="text-slate-500 text-[11px] mt-0.5">{ex.vn}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Văn hóa */}
            {currentLesson.culture && (
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-2">
                <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
                  <span>🎎</span>
                  <span>Văn Hóa Hàn Quốc Đối Chiếu: {currentLesson.culture.title}</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                  {currentLesson.culture.content}
                </p>
              </div>
            )}
          </div>
        )}

        {}
        {currentTab === 'vocab_lab' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-700 rounded-3xl p-6 text-white shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="bg-white/20 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                  Tổng Hợp Chuẩn Sách Giáo Trình & SBT
                </span>
                <h2 className="text-xl sm:text-2xl font-black mt-2 mb-1">
                  🗂️ VOCAB LAB: KHO TỪ VỰNG ĐỒ SỘ 15 CHỦ ĐỀ
                </h2>
                <p className="text-xs text-blue-100 max-w-xl leading-relaxed">
                  Bao gồm <strong>{allVocabularies.length} từ vựng & cụm từ</strong> được trích xuất
                  kỹ lưỡng từ 4 nguồn:
                  <em> Từ vựng cơ bản (기본)</em>,{' '}
                  <em>Bảng từ mới tr. 324-334 & bài đọc (새단어)</em>,{' '}
                  <em>Audio Script nghe (듣기)</em> và <em>Sách bài tập</em>.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 text-center w-full md:w-auto">
                <span className="text-[11px] font-bold text-blue-200 block uppercase">
                  Từ Vựng Đang Hiển Thị
                </span>
                <span className="text-2xl font-black text-amber-300 font-mono">
                  {filteredVocabularies.length}{' '}
                  <span className="text-sm font-normal text-white">/ {allVocabularies.length}</span>
                </span>
              </div>
            </div>

            {/* Flashcard Active Recall */}
            {filteredVocabularies.length > 0 && (
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <span className="text-base">⚡</span>
                    <h3 className="font-black text-slate-900 text-sm">
                      FLASHCARD PHẢN XẠ NHANH ({currentFlashcardIndex + 1}/
                      {filteredVocabularies.length})
                    </h3>
                  </div>
                  <span className="text-[11px] font-bold text-slate-400">
                    Chạm vào thẻ để lật mặt xem nghĩa
                  </span>
                </div>

                {(() => {
                  const card =
                    filteredVocabularies[currentFlashcardIndex] || filteredVocabularies[0];
                  return (
                    <div
                      onClick={() => setFlashcardFlipped((prev) => !prev)}
                      className="cursor-pointer min-h-[170px] sm:min-h-[190px] rounded-2xl p-6 bg-gradient-to-br from-indigo-50/70 via-white to-blue-50/70 border-2 border-indigo-200 hover:border-indigo-400 transition-all flex flex-col justify-between items-center text-center shadow-xs select-none"
                    >
                      <div className="flex items-center space-x-2 text-[10px] font-bold">
                        <span className="bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full">
                          Bài {card.lessonId < 10 ? `0${card.lessonId}` : card.lessonId}:{' '}
                          {card.lessonTitle}
                        </span>
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                          {card.category.split('(')[0]}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full ${
                            card.sourceTag === '새단어'
                              ? 'bg-amber-100 text-amber-800'
                              : card.sourceTag === '듣기'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          Nguồn: {card.sourceTag}
                        </span>
                      </div>

                      <div className="my-auto py-2">
                        {!flashcardFlipped ? (
                          <div className="space-y-1 animate-fade-in">
                            <p className="text-2xl sm:text-3xl font-black text-indigo-950 tracking-tight">
                              {card.kr}
                            </p>
                            <p className="text-xs text-indigo-400 font-semibold">
                              ❓ Nhấn để xem nghĩa tiếng Việt & ví dụ
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-1.5 animate-fade-in">
                            <p className="text-lg sm:text-xl font-black text-emerald-800">
                              {card.vn}
                            </p>
                            {card.note && (
                              <p className="text-xs text-slate-600 font-medium italic bg-emerald-50/60 py-1 px-3 rounded-lg border border-emerald-100 inline-block">
                                💡 {card.note}
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      <span className="text-[10px] font-bold text-slate-400">
                        {flashcardFlipped ? '🔄 Nhấn để xem lại tiếng Hàn' : '🔄 Nhấn để lật thẻ'}
                      </span>
                    </div>
                  );
                })()}

                {/* Controls */}
                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => {
                      setFlashcardFlipped(false);
                      setCurrentFlashcardIndex((prev) =>
                        prev > 0 ? prev - 1 : filteredVocabularies.length - 1,
                      );
                    }}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-all cursor-pointer"
                  >
                    ◀ Thẻ Trước
                  </button>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setFlashcardFlipped(false);
                        const randIdx = Math.floor(Math.random() * filteredVocabularies.length);
                        setCurrentFlashcardIndex(randIdx);
                      }}
                      className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold rounded-xl text-xs transition-all cursor-pointer"
                    >
                      🎲 Ngẫu Nhiên
                    </button>
                    <button
                      onClick={() => setFlashcardFlipped((prev) => !prev)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-all cursor-pointer shadow-xs"
                    >
                      Lật Thẻ
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setFlashcardFlipped(false);
                      setCurrentFlashcardIndex((prev) =>
                        prev < filteredVocabularies.length - 1 ? prev + 1 : 0,
                      );
                    }}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-all cursor-pointer"
                  >
                    Thẻ Kế Tiếp ▶
                  </button>
                </div>
              </div>
            )}

            {}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                <div className="md:col-span-6 relative">
                  <input
                    type="text"
                    value={vocabSearchTerm}
                    onChange={(e) => {
                      setVocabSearchTerm(e.target.value);
                      setCurrentFlashcardIndex(0);
                    }}
                    placeholder="🔍 Tìm kiếm từ vựng (tiếng Hàn, tiếng Việt, ví dụ...)"
                    className="w-full pl-9 pr-8 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                  {vocabSearchTerm && (
                    <button
                      onClick={() => setVocabSearchTerm('')}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 text-xs font-bold"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="md:col-span-3">
                  <select
                    value={vocabSelectedLesson}
                    onChange={(e) => {
                      setVocabSelectedLesson(e.target.value);
                      setCurrentFlashcardIndex(0);
                    }}
                    className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">🌟 Tất cả 15 Bài học</option>
                    {COURSE_STRUCTURE.map((l) => (
                      <option key={l.id} value={l.id}>
                        Bài {l.id < 10 ? `0${l.id}` : l.id}: {l.koreanTitle}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-3 flex space-x-1">
                  {[
                    { id: 'all', label: 'Tất cả' },
                    { id: '기본', label: 'Cơ bản' },
                    { id: '새단어', label: 'Từ mới' },
                    { id: '듣기', label: 'Nghe/SBT' },
                  ].map((sf) => (
                    <button
                      key={sf.id}
                      onClick={() => {
                        setVocabSourceFilter(sf.id);
                        setCurrentFlashcardIndex(0);
                      }}
                      className={`flex-1 py-2 rounded-xl text-[11px] font-bold transition-all border cursor-pointer ${
                        vocabSourceFilter === sf.id
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-2xs'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {sf.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredVocabularies.map((vocab, vIdx) => (
                <div
                  key={vIdx}
                  className="bg-white p-3.5 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-xs transition-all space-y-2 flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                        Bài {vocab.lessonId < 10 ? `0${vocab.lessonId}` : vocab.lessonId}
                      </span>
                      <span
                        className={`px-1.5 py-0.2 rounded font-semibold ${
                          vocab.sourceTag === '새단어'
                            ? 'bg-amber-100 text-amber-800'
                            : vocab.sourceTag === '듣기'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {vocab.sourceTag}
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between pt-1">
                      <p className="font-black text-slate-900 text-sm">{vocab.kr}</p>
                      <button
                        onClick={() => {
                          const dummy = document.createElement('textarea');
                          document.body.appendChild(dummy);
                          dummy.value = `${vocab.kr} - ${vocab.vn}`;
                          dummy.select();
                          document.execCommand('copy');
                          document.body.removeChild(dummy);
                          showToast(
                            'Đã sao chép!',
                            `"${vocab.kr}: ${vocab.vn}" đã được lưu vào clipboard.`,
                            'info',
                          );
                        }}
                        title="Sao chép từ vựng"
                        className="text-[10px] text-slate-400 hover:text-indigo-600 font-bold p-1 cursor-pointer"
                      >
                        📋
                      </button>
                    </div>
                    <p className="text-xs text-slate-700 font-semibold">{vocab.vn}</p>
                  </div>

                  {vocab.note && (
                    <div className="pt-1.5 border-t border-slate-100">
                      <p className="text-[11px] text-slate-500 italic">💡 {vocab.note}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {}
        {currentTab === 'reading' &&
          (() => {
            const passagesForLesson =
              READING_PASSAGES_DATABASE[readingSelectedLesson] || READING_PASSAGES_DATABASE[1];
            const activePassage = passagesForLesson[readingPassageIndex] || passagesForLesson[0];

            return (
              <div className="space-y-6 animate-fade-in">
                {/* Studio Header Bar */}
                <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 rounded-3xl p-6 text-white shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <span className="bg-white/20 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                      Luyện Đọc Hiểu Chuyên Sâu (5 Thể Loại Văn Bản)
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black mt-2 mb-1">
                      📖 READING MASTER STUDIO
                    </h2>
                    <p className="text-xs text-emerald-100 max-w-xl leading-relaxed">
                      Trích xuất bài đọc chuẩn giáo trình và sách bài tập. Hỗ trợ đối chiếu song
                      ngữ, tra cứu từ vựng trọng tâm và làm câu hỏi đọc hiểu kèm trích dẫn chứng cứ.
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <select
                      value={readingSelectedLesson}
                      onChange={(e) => {
                        setReadingSelectedLesson(Number(e.target.value));
                        setReadingPassageIndex(0);
                      }}
                      className="px-3.5 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-xs font-bold text-white focus:outline-hidden"
                    >
                      {COURSE_STRUCTURE.map((l) => (
                        <option key={l.id} value={l.id} className="text-slate-800">
                          Bài {l.id < 10 ? `0${l.id}` : l.id}: {l.koreanTitle}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Passage selector pills */}
                <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
                  {passagesForLesson.map((p, idx) => (
                    <button
                      key={p.id}
                      onClick={() => setReadingPassageIndex(idx)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer border ${
                        readingPassageIndex === idx
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      Bài Đọc {idx + 1}: {p.type}
                    </button>
                  ))}
                </div>

                {/* Main Reading Workspace */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Passage Text Column */}
                  <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                      <div>
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full uppercase">
                          {activePassage.type}
                        </span>
                        <h3 className="font-bold text-sm sm:text-base text-slate-900 mt-1">
                          {activePassage.title}
                        </h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          📚 {activePassage.source}
                        </p>
                      </div>

                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => setShowTranslation((prev) => !prev)}
                          className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                            showTranslation
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                              : 'bg-slate-50 border-slate-200 text-slate-600'
                          }`}
                        >
                          {showTranslation ? 'Ẩn Dịch Việt' : 'Xem Dịch Việt'}
                        </button>
                        <button
                          onClick={() =>
                            setReadingFontSize((prev) =>
                              prev === 'text-xs'
                                ? 'text-sm'
                                : prev === 'text-sm'
                                  ? 'text-base'
                                  : 'text-xs',
                            )
                          }
                          className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 text-slate-600 rounded-xl text-[11px] font-bold cursor-pointer hover:bg-slate-100"
                          title="Đổi cỡ chữ"
                        >
                          A±
                        </button>
                      </div>
                    </div>

                    {/* Korean Text Content */}
                    <div
                      className={`p-4 rounded-2xl bg-slate-50/70 border border-slate-200/60 leading-relaxed font-serif text-slate-900 whitespace-pre-line ${readingFontSize}`}
                    >
                      {activePassage.koreanText}
                    </div>

                    {/* Vietnamese Translation Toggle */}
                    {showTranslation && (
                      <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-emerald-950 text-xs leading-relaxed whitespace-pre-line animate-fade-in">
                        <span className="font-bold block mb-1 text-emerald-800 uppercase tracking-wide text-[10px]">
                          🇻🇳 Bản Dịch Tham Khảo:
                        </span>
                        {activePassage.vietnameseTranslation}
                      </div>
                    )}

                    {/* Key Vocabulary Chips */}
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <span className="text-xs font-bold text-slate-700 flex items-center space-x-1">
                        <span>🏷️</span>
                        <span>Từ Vựng Then Chốt Trong Bài Đọc:</span>
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {activePassage.keyVocabulary.map((kv, kIdx) => (
                          <div
                            key={kIdx}
                            className="bg-indigo-50 border border-indigo-100 text-indigo-900 px-2.5 py-1 rounded-lg text-xs flex items-center space-x-1.5"
                          >
                            <span className="font-bold">{kv.kr}</span>
                            <span className="text-slate-500 text-[11px]">→ {kv.vn}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {}
                  <div className="lg:col-span-5 space-y-4">
                    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <h4 className="font-black text-slate-900 text-sm flex items-center space-x-1.5">
                          <span>📝</span>
                          <span>Câu Hỏi Đọc Hiểu</span>
                        </h4>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                          +10 XP
                        </span>
                      </div>

                      <div className="space-y-5">
                        {activePassage.questions.map((q, qIdx) => {
                          const userAnswer = readingUserAnswers[q.id];
                          const isAnswered = userAnswer !== undefined;
                          const isCorrect = isAnswered && userAnswer === q.correctIndex;

                          return (
                            <div
                              key={q.id}
                              className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5"
                            >
                              <p className="text-xs sm:text-sm font-bold text-slate-800 leading-snug">
                                <span className="text-indigo-600 font-mono mr-1">Q{qIdx + 1}.</span>
                                {q.question}
                              </p>

                              <div className="space-y-1.5">
                                {q.options.map((opt, oIdx) => {
                                  let optClass =
                                    'bg-white border-slate-200 hover:border-emerald-300 text-slate-700';
                                  if (isAnswered) {
                                    if (oIdx === q.correctIndex) {
                                      optClass =
                                        'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                                    } else if (oIdx === userAnswer) {
                                      optClass =
                                        'bg-rose-50 border-rose-500 text-rose-900 font-bold';
                                    } else {
                                      optClass =
                                        'bg-white border-slate-200 text-slate-400 opacity-60';
                                    }
                                  }

                                  return (
                                    <button
                                      key={oIdx}
                                      disabled={isAnswered}
                                      onClick={() => {
                                        setReadingUserAnswers((prev) => ({
                                          ...prev,
                                          [q.id]: oIdx,
                                        }));
                                        if (oIdx === q.correctIndex) {
                                          setXp((prev) => prev + 10);
                                          showToast(
                                            'Chính xác!',
                                            'Bạn đã trả lời đúng câu hỏi đọc hiểu và nhận được +10 XP.',
                                            'success',
                                          );
                                        } else {
                                          setWrongAnswers((prev) => {
                                            if (!prev.some((item) => item.id === q.id)) {
                                              return [
                                                ...prev,
                                                {
                                                  id: q.id,
                                                  lessonId: readingSelectedLesson,
                                                  question: `[Đọc hiểu Bài ${readingSelectedLesson}] ${q.question}`,
                                                  options: q.options,
                                                  correctIndex: q.correctIndex,
                                                  userSelected: q.options[oIdx],
                                                  explanation: `Dẫn chứng từ bài đọc: "${q.evidence}"`,
                                                  concept: 'Kỹ năng đọc hiểu văn bản',
                                                  source: activePassage.source,
                                                },
                                              ];
                                            }
                                            return prev;
                                          });
                                          showToast(
                                            'Chưa chính xác!',
                                            'Hãy đối chiếu lại dẫn chứng trong đoạn văn để khắc phục nhé.',
                                            'warning',
                                          );
                                        }
                                      }}
                                      className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${optClass}`}
                                    >
                                      <span className="font-mono text-slate-400 mr-1.5">
                                        {oIdx + 1}.
                                      </span>
                                      {opt}
                                    </button>
                                  );
                                })}
                              </div>

                              {isAnswered && (
                                <div className="pt-2 border-t border-slate-200/60 text-xs space-y-1 animate-fade-in">
                                  <div className="flex items-center space-x-1 text-[11px] font-bold">
                                    <span>{isCorrect ? '✅' : '❌'}</span>
                                    <span
                                      className={isCorrect ? 'text-emerald-700' : 'text-rose-700'}
                                    >
                                      {isCorrect
                                        ? 'Đáp án hoàn toàn chuẩn xác!'
                                        : 'Đáp án chưa đúng!'}
                                    </span>
                                  </div>
                                  <p className="text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200 text-[11px] italic">
                                    🔍 <strong>Dẫn chứng từ bài:</strong> {q.evidence}
                                  </p>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

        {}
        {currentTab === 'quiz' && (
          <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                    {currentLesson.title}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Câu {currentQuizIndex + 1}/{currentLessonQuizzes.length}
                  </span>
                </div>
                <span className="text-xs font-bold font-mono text-amber-600">+10 XP</span>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Dạng câu: {currentLessonQuizzes[currentQuizIndex].type}
                </span>
                <p className="text-sm sm:text-base font-bold text-slate-900 leading-relaxed">
                  {currentLessonQuizzes[currentQuizIndex].question}
                </p>
              </div>

              <div className="space-y-2.5 pt-2">
                {currentLessonQuizzes[currentQuizIndex].options.map((option, idx) => {
                  let btnStyle =
                    'border-slate-200 bg-white hover:border-indigo-400 hover:bg-indigo-50/30 text-slate-800';

                  if (isAnswerSubmitted) {
                    if (idx === currentLessonQuizzes[currentQuizIndex].correctIndex) {
                      btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                    } else if (idx === selectedOption) {
                      btnStyle = 'border-rose-500 bg-rose-50 text-rose-900 font-bold';
                    } else {
                      btnStyle = 'border-slate-200 bg-slate-50 text-slate-400 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isAnswerSubmitted}
                      onClick={() => handleAnswerSelect(idx)}
                      className={`w-full text-left p-3.5 rounded-2xl border text-xs sm:text-sm font-medium transition-all cursor-pointer ${btnStyle}`}
                    >
                      <span className="font-mono text-slate-400 mr-2">{idx + 1}.</span>
                      {option}
                    </button>
                  );
                })}
              </div>

              {}
              {isAnswerSubmitted && (
                <div className="space-y-3 pt-3 border-t border-slate-100 animate-fade-in">
                  <div
                    className={`p-4 rounded-2xl text-xs space-y-2 ${
                      selectedOption === currentLessonQuizzes[currentQuizIndex].correctIndex
                        ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                        : 'bg-rose-50 border border-rose-200 text-rose-900'
                    }`}
                  >
                    <div className="flex items-center space-x-2 font-bold text-sm">
                      <span>
                        {selectedOption === currentLessonQuizzes[currentQuizIndex].correctIndex
                          ? '🎉'
                          : '❌'}
                      </span>
                      <span>
                        {selectedOption === currentLessonQuizzes[currentQuizIndex].correctIndex
                          ? 'Chính xác! (+10 XP)'
                          : 'Chưa chính xác (Đã lưu vào Sổ Tay Câu Sai)'}
                      </span>
                    </div>
                    <p className="leading-relaxed">
                      <strong>Vì sao đúng:</strong>{' '}
                      {currentLessonQuizzes[currentQuizIndex].explanation}
                    </p>
                    {currentLessonQuizzes[currentQuizIndex].whyWrong && (
                      <p className="leading-relaxed opacity-90">
                        <strong>Bóc tách phương án sai:</strong>{' '}
                        {currentLessonQuizzes[currentQuizIndex].whyWrong}
                      </p>
                    )}
                    <div className="pt-2 border-t border-current/20 text-[11px] space-y-1">
                      <p>
                        <strong>💡 Từ khóa nhận diện:</strong>{' '}
                        {currentLessonQuizzes[currentQuizIndex].keyword}
                      </p>
                      <p>
                        <strong>📖 Nguồn sách giáo trình:</strong>{' '}
                        {currentLessonQuizzes[currentQuizIndex].source}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleNextQuiz}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl text-xs sm:text-sm transition-all shadow-sm cursor-pointer"
                  >
                    {currentQuizIndex < currentLessonQuizzes.length - 1
                      ? 'Câu Tiếp Theo ➔'
                      : 'Hoàn Thành Bài Học 🎉'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {}
        {currentTab === 'wrong_notebook' && (
          <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-900 flex items-center space-x-2">
                  <span>📕</span>
                  <span>SỔ TAY CÂU SAI ({wrongAnswers.length})</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Ôn luyện lại các câu trả lời chưa đúng. Trả lời đúng để gỡ khỏi sổ và nhận +5 XP.
                </p>
              </div>
              {wrongAnswers.length > 0 && (
                <button
                  onClick={() => {
                    setWrongAnswers([]);
                    showToast('Đã dọn sạch!', 'Sổ tay câu sai đã được xóa toàn bộ.', 'info');
                  }}
                  className="px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 font-bold rounded-xl border border-rose-200 cursor-pointer"
                >
                  Xóa tất cả
                </button>
              )}
            </div>

            {wrongAnswers.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
                <span className="text-5xl">🎉</span>
                <h3 className="font-bold text-slate-800 text-base">Sổ tay câu sai đang trống!</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Bạn đang làm rất tốt! Hãy tiếp tục luyện tập các bài học hoặc làm đề Mock Exam để
                  củng cố thêm kiến thức.
                </p>
                <button
                  onClick={() => setCurrentTab('quiz')}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs cursor-pointer shadow-xs"
                >
                  Luyện Quiz Tiếp
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {wrongAnswers.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                        Bài {item.lessonId}
                      </span>
                      <span className="text-slate-400">{item.concept}</span>
                    </div>

                    <p className="text-xs sm:text-sm font-bold text-slate-900">{item.question}</p>

                    <div className="text-xs p-3 rounded-xl bg-rose-50/70 border border-rose-100 text-rose-800">
                      <strong>Phương án đã chọn:</strong> {item.userSelected}
                    </div>

                    <div className="space-y-2 pt-2">
                      <span className="text-xs font-bold text-slate-500">
                        Chọn lại đáp án chính xác:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {item.options.map((opt, oIdx) => (
                          <button
                            key={oIdx}
                            onClick={() => handleRetryWrongQuestion(item.id, oIdx)}
                            className="text-left p-2.5 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/30 text-xs font-medium text-slate-700 transition-all cursor-pointer"
                          >
                            <span className="font-mono text-slate-400 mr-1">{oIdx + 1}.</span> {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {}
        {currentTab === 'writing' &&
          (() => {
            const activePrompt = KOREAN_WRITING_PROMPTS[currentWritingIndex];

            return (
              <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-6 text-white shadow-md">
                  <span className="bg-white/20 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                    Korean Written Exam Mode
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black mt-2 mb-1">
                    ✍️ LUYỆN VIẾT TỰ LUẬN TIẾNG HÀN
                  </h2>
                  <p className="text-xs text-purple-100 leading-relaxed max-w-xl">
                    Rèn luyện kỹ năng viết và giải quyết tình huống bằng văn phong học thuật chuẩn
                    kỳ thi đại học Hàn Quốc. Tự động chấm điểm từ khóa cốt lõi.
                  </p>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h3 className="font-bold text-slate-900 text-sm">{activePrompt.title}</h3>
                    <span className="text-xs font-mono text-slate-400">
                      Đề {currentWritingIndex + 1}/{KOREAN_WRITING_PROMPTS.length}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs leading-relaxed font-medium text-slate-800 whitespace-pre-line">
                    {activePrompt.prompt}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 block">
                      Nhập câu trả lời bằng tiếng Hàn của bạn:
                    </label>
                    <textarea
                      rows={4}
                      value={userWritingInput}
                      onChange={(e) => setUserWritingInput(e.target.value)}
                      placeholder="한국어로 작성하십시오... (Ví dụ: 저는 한국학과 2학년 흐엉이라고 합니다...)"
                      className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium leading-relaxed"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setUserWritingInput('');
                          setWritingFeedback(null);
                          setCurrentWritingIndex((prev) =>
                            prev > 0 ? prev - 1 : KOREAN_WRITING_PROMPTS.length - 1,
                          );
                        }}
                        className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
                      >
                        ◀ Đề Trước
                      </button>
                      <button
                        onClick={() => {
                          setUserWritingInput('');
                          setWritingFeedback(null);
                          setCurrentWritingIndex((prev) =>
                            prev < KOREAN_WRITING_PROMPTS.length - 1 ? prev + 1 : 0,
                          );
                        }}
                        className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
                      >
                        Đề Sau ▶
                      </button>
                    </div>

                    <button
                      onClick={handleEvaluateKoreanWriting}
                      className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs cursor-pointer shadow-xs"
                    >
                      Chấm Điểm Tự Động ✨
                    </button>
                  </div>

                  {writingFeedback && (
                    <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 space-y-3 text-xs animate-fade-in">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-indigo-900">Kết quả đánh giá:</span>
                        <span className="font-mono font-black text-sm text-indigo-700 px-2.5 py-0.5 rounded-lg bg-white border border-indigo-200">
                          {writingFeedback.grade}
                        </span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">{writingFeedback.comment}</p>
                      <div className="pt-2 border-t border-indigo-100 space-y-1">
                        <p className="font-bold text-indigo-900">Câu mẫu chuẩn học thuật:</p>
                        <p className="p-2.5 bg-white rounded-xl border border-indigo-100 text-indigo-950 font-serif">
                          {writingFeedback.modelAnswer}
                        </p>
                        <p className="text-slate-500 text-[11px] mt-1 italic">
                          💡 {writingFeedback.explanation}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

        {}
        {currentTab === 'exam' && (
          <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
            {!examStarted && !examResult && (
              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs text-center space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-3xl mx-auto">
                  📝
                </div>
                <h2 className="text-xl font-black text-slate-900">
                  ĐỀ THI THỬ TỔNG HỢP TRUNG CẤP 3
                </h2>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  Đề thi gồm toàn bộ câu hỏi trắc nghiệm phủ khắp các bài học. Không hiển thị đáp án
                  trong lúc làm bài. Bảng phân tích năng lực sẽ xuất hiện ngay sau khi nộp bài.
                </p>
                <button
                  onClick={() => {
                    setExamAnswers({});
                    setExamResult(null);
                    setExamStarted(true);
                  }}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl text-xs sm:text-sm cursor-pointer shadow-md"
                >
                  Bắt Đầu Làm Bài Thi ➔
                </button>
              </div>
            )}

            {examStarted && (
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="font-bold text-slate-900 text-sm">Đang Làm Bài Thi Thử</h3>
                  <span className="text-xs font-mono font-bold text-indigo-600">
                    Đã làm: {Object.keys(examAnswers).length}/{QUIZ_DATABASE.length}
                  </span>
                </div>

                <div className="space-y-6">
                  {QUIZ_DATABASE.map((q, idx) => (
                    <div
                      key={q.id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3"
                    >
                      <p className="text-xs sm:text-sm font-bold text-slate-900">
                        <span className="text-indigo-600 font-mono mr-1">Câu {idx + 1}.</span>{' '}
                        {q.question}
                      </p>
                      <div className="space-y-1.5">
                        {q.options.map((opt, oIdx) => (
                          <button
                            key={oIdx}
                            onClick={() => setExamAnswers((prev) => ({ ...prev, [q.id]: oIdx }))}
                            className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
                              examAnswers[q.id] === oIdx
                                ? 'bg-indigo-600 border-indigo-600 text-white font-bold'
                                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <span className="font-mono mr-1.5">{oIdx + 1}.</span> {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleSubmitExam}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs sm:text-sm cursor-pointer shadow-md"
                >
                  Nộp Bài Thi & Xem Điểm
                </button>
              </div>
            )}

            {examResult && (
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
                <div className="text-center space-y-2">
                  <span className="text-5xl">🏆</span>
                  <h2 className="text-xl font-black text-slate-900">KẾT QUẢ THI THỬ</h2>
                  <div className="flex items-center justify-center space-x-3 text-sm font-bold">
                    <span className="text-indigo-600 font-mono text-xl">
                      {examResult.score}/{examResult.total} Điểm
                    </span>
                    <span className="text-emerald-600">({examResult.accuracy}%)</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                    Phân tích các câu cần khắc phục ({examResult.missed.length}):
                  </h4>
                  {examResult.missed.map((m, mIdx) => (
                    <div
                      key={mIdx}
                      className="p-3.5 rounded-2xl bg-rose-50 border border-rose-100 text-xs space-y-1"
                    >
                      <p className="font-bold text-slate-900">{m.question}</p>
                      <p className="text-rose-700">
                        <strong>Bạn đã chọn:</strong> {m.selected}
                      </p>
                      <p className="text-emerald-800">
                        <strong>Đáp án đúng:</strong> {m.options[m.correctIndex]}
                      </p>
                      <p className="text-slate-500 italic mt-1">{m.explanation}</p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setExamResult(null);
                    setExamStarted(false);
                  }}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl text-xs cursor-pointer shadow-xs"
                >
                  Thi Lại Đề Này
                </button>
              </div>
            )}
          </div>
        )}

        {}
        {currentTab === 'plan' && (
          <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
              <div>
                <h2 className="text-lg font-black text-slate-900 flex items-center space-x-2">
                  <span>⏱️</span>
                  <span>KẾ HOẠCH ÔN THI & TÍNH TOÁN WORKLOAD</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Điều chỉnh thời gian còn lại trước ngày thi và mục tiêu điểm số để ước tính thời
                  lượng học tập mỗi ngày.
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">
                  Thời gian ôn tập:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[7, 14, 21, 30].map((days) => (
                    <button
                      key={days}
                      onClick={() => setStudyPlanDays(days)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        studyPlanDays === days
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {days} Ngày
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">
                  Mục tiêu điểm số của bạn:
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {['Pass', 'B', 'B+', 'A', 'A+'].map((gr) => (
                    <button
                      key={gr}
                      onClick={() => setTargetGrade(gr)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        targetGrade === gr
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {gr}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-100 space-y-2">
                <span className="text-xs font-bold text-indigo-900">
                  📊 Phân Tích Workload Dự Kiến:
                </span>
                <p className="text-sm font-black text-indigo-700">
                  Khoảng {estimatedWorkloadMinutes} phút / ngày
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Với lộ trình {studyPlanDays} ngày và mục tiêu điểm {targetGrade}, bạn nên học kỹ 1
                  bài mỗi ngày, giải quyết hết câu sai và làm ít nhất 1 bài tự luận viết tiếng Hàn.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-400">
        Giáo trình Tiếng Hàn Tổng Hợp Dành Cho Người Việt Nam - Trung Cấp 3 (KB Kookmin Bank & Korea
        Foundation)
      </footer>
    </div>
  );
}
