import { LegacyReadingDatabaseSchema } from './schemas';

const raw = {
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
  // BÀI 04: 쇼핑 (Mua sắm & Dịch vụ)
  4: [
    {
      id: 'r4_1',
      passageNumber: 1,
      type: 'Phàn nàn & Đổi trả',
      title: '백화점 고객 서비스 센터 (Trung tâm dịch vụ khách hàng trung tâm thương mại)',
      source: 'Authored practice based on Lesson 4 vocabulary & grammar',
      koreanText: `고객: 안녕하세요. 지난주에 여기서 바지를 샀는데 집에 와서 보니까 한쪽 소매가 찢어져 있었어요.\n직원: 불편을 드려서 정말 죄송합니다. 영수증은 가지고 계세요?\n고객: 네, 여기 있어요. 상표도 아직 안 뗐어요.\n직원: 감사합니다. 확인해 보겠습니다. 교환이나 환불 중에 어떤 걸 원하세요?\n고객: 같은 스타일로 교환하고 싶은데, 허리가 좀 끼는 것 같아서 한 치수 큰 걸로 바꿔 주세요.\n직원: 네, 알겠습니다. 영수증과 상표가 있으니까 교환이 가능합니다. 잠시만 기다려 주세요.`,
      vietnameseTranslation: `Khách: Xin chào. Tuần trước tôi mua cái quần ở đây, nhưng khi về nhà nhìn lại thấy một ống tay bị rách rồi. Nhân viên: Thật sự xin lỗi vì sự bất tiện này. Bạn có mang theo hóa đơn không? Khách: Có, đây ạ. Nhãn mác vẫn chưa tháo ra. Nhân viên: Cảm ơn bạn. Tôi sẽ xác nhận. Bạn muốn đổi hay hoàn tiền? Khách: Tôi muốn đổi sang kiểu dáng tương tự, nhưng vì vòng eo hơi chật nên hãy đổi sang size lớn hơn một bậc. Nhân viên: Được ạ. Vì có hóa đơn và nhãn mác nên có thể đổi. Vui lòng chờ một chút.`,
      keyVocabulary: [
        { kr: '소매가 찢어지다', vn: 'Ống tay áo bị rách' },
        { kr: '영수증', vn: 'Hóa đơn mua hàng' },
        { kr: '상표를 안 떼다', vn: 'Chưa tháo nhãn mác' },
        { kr: '교환하다', vn: 'Đổi sang hàng khác' },
        { kr: '허리가 끼다', vn: 'Vòng eo bị chật' },
      ],
      questions: [
        {
          id: 'rq_4_1_1',
          question: 'Tại sao khách hàng đến trung tâm dịch vụ?',
          options: [
            'Vì quần mua tuần trước bị rách ống tay',
            'Vì muốn hoàn tiền do không thích màu sắc',
            'Vì hàng chưa được giao đến nhà',
            'Vì bị tính tiền sai giá',
          ],
          correctIndex: 0,
          evidence: '집에 와서 보니까 한쪽 소매가 찢어져 있었어요.',
        },
        {
          id: 'rq_4_1_2',
          question: 'Điều kiện nào đã đáp ứng để khách được đổi hàng?',
          options: [
            'Mua trên 1 triệu won',
            'Có hóa đơn và nhãn mác còn nguyên',
            'Là thành viên VIP của cửa hàng',
            'Mua trong ngày có chương trình khuyến mãi',
          ],
          correctIndex: 1,
          evidence: '영수증과 상표가 있으니까 교환이 가능합니다.',
        },
      ],
    },
    {
      id: 'r4_2',
      passageNumber: 2,
      type: 'Quảng cáo & Khuyến mãi',
      title: '창립 기념 특별 세일 안내 (Thông báo đợt giảm giá đặc biệt kỷ niệm thành lập)',
      source: 'Authored practice based on Lesson 4 vocabulary',
      koreanText: `○○백화점 창립 35주년 기념 특별 세일\n기간: 이번 주 토요일~다음 주 일요일 (10일간)\n대상 품목: 숙녀복, 신사복, 아동복, 등산복 전 품목\n할인율: 20~50% 대폭 할인 (일부 명품 제외)\n결제 방법: 일시불 또는 3개월 무이자 할부 가능\n특전: 5만 원 이상 구매 시 무료 배송 서비스 제공, 포인트 2배 적립\n교환·환불: 구매일로부터 7일 이내, 영수증 및 상표 지참 시 가능\n문의: ○○백화점 고객센터 1588-XXXX`,
      vietnameseTranslation: `Đợt giảm giá đặc biệt kỷ niệm 35 năm thành lập trung tâm thương mại ○○. Thời gian: từ thứ Bảy tuần này đến Chủ Nhật tuần sau (10 ngày). Đối tượng: toàn bộ hàng thời trang nữ, nam, trẻ em, đồ leo núi. Tỷ lệ giảm: 20-50% (ngoại trừ một số hàng hiệu). Thanh toán: trả một lần hoặc trả góp 3 tháng không lãi suất. Ưu đãi: mua từ 50.000 won miễn phí giao hàng, tích điểm gấp đôi. Đổi trả: trong vòng 7 ngày từ ngày mua, cần có hóa đơn và nhãn mác.`,
      keyVocabulary: [
        { kr: '창립 기념 세일', vn: 'Giảm giá kỷ niệm thành lập' },
        { kr: '무이자 할부', vn: 'Trả góp không lãi suất' },
        { kr: '포인트 적립', vn: 'Tích lũy điểm thưởng' },
        { kr: '구매일로부터', vn: 'Tính từ ngày mua' },
      ],
      questions: [
        {
          id: 'rq_4_2_1',
          question: 'Chương trình giảm giá này kéo dài bao nhiêu ngày?',
          options: ['5 ngày', '7 ngày', '10 ngày', '2 tuần'],
          correctIndex: 2,
          evidence: '이번 주 토요일~다음 주 일요일 (10일간)',
        },
        {
          id: 'rq_4_2_2',
          question: 'Điều kiện để được miễn phí giao hàng là gì?',
          options: [
            'Mua bất kỳ sản phẩm nào',
            'Mua từ 50.000 won trở lên',
            'Phải thanh toán bằng tiền mặt',
            'Là thành viên từ 3 năm trở lên',
          ],
          correctIndex: 1,
          evidence: '5만 원 이상 구매 시 무료 배송 서비스 제공',
        },
      ],
    },
  ],
  // BÀI 05: 요리 (Ẩm thực & Nấu ăn)
  5: [
    {
      id: 'r5_1',
      passageNumber: 1,
      type: 'Công thức nấu ăn',
      title: '비빔밥 만드는 방법 (Cách làm cơm trộn Bibimbap)',
      source: 'Authored practice based on Lesson 5 vocabulary & grammar',
      koreanText: `비빔밥은 한국의 대표적인 영양 음식으로 만드는 방법이 간단합니다.\n먼저 밥을 짓고 나서 여러 가지 나물을 준비합니다. 시금치, 콩나물, 당근 등을 각각 볶거나 무쳐서 준비합니다.\n당근은 채썰고 나서 팬에 기름을 두르고 살짝 볶아 주세요.\n다음으로 소고기를 간장과 참기름으로 재워 두었다가 볶고 나서 따뜻한 밥 위에 모든 재료를 색깔별로 예쁘게 올려 줍니다.\n마지막으로 달걀 프라이를 만들고 나서 비빔밥 위에 얹고 고추장을 넣어 맛있게 비비면 완성입니다.\n고추장 양념이 매콤하고 달콤하며 참기름의 고소한 풍미가 어우러져 식욕을 자극합니다.`,
      vietnameseTranslation: `Bibimbap là món ăn bổ dưỡng tiêu biểu của Hàn Quốc và cách làm khá đơn giản. Trước tiên, nấu cơm xong rồi chuẩn bị các loại rau củ khác nhau. Rau chân vịt, giá đỗ, cà rốt... mỗi loại được xào hoặc trộn riêng. Cắt cà rốt thành sợi rồi láng dầu vào chảo và xào sơ qua. Tiếp theo, ướp thịt bò với nước tương và dầu mè, để ngấm rồi xào xong mới bày tất cả nguyên liệu theo màu sắc lên trên cơm nóng. Cuối cùng, rán trứng xong rồi đặt lên trên và cho tương ớt vào trộn đều là xong. Hương vị cay ngọt của tương ớt kết hợp mùi bùi béo của dầu mè kích thích vị giác tuyệt vời.`,
      keyVocabulary: [
        { kr: '나물을 무치다', vn: 'Trộn gỏi rau' },
        { kr: '채썰다', vn: 'Thái sợi' },
        { kr: '기름을 두르다', vn: 'Láng dầu vào chảo' },
        { kr: '재워 두다', vn: 'Ướp để ngấm gia vị' },
        { kr: '고추장 양념', vn: 'Sốt tương ớt' },
      ],
      questions: [
        {
          id: 'rq_5_1_1',
          question: 'Theo bài đọc, thứ tự nào đúng khi làm Bibimbap?',
          options: [
            'Cho tương ớt → nấu cơm → chuẩn bị rau → rán trứng',
            'Nấu cơm → chuẩn bị rau → xào thịt → rán trứng → bày và trộn',
            'Rán trứng trước → chuẩn bị rau → nấu cơm → trộn',
            'Xào thịt trước → nấu cơm → thêm rau → trộn ngay',
          ],
          correctIndex: 1,
          evidence:
            '먼저 밥을 짓고 나서 나물을 준비... 볶고 나서 밥 위에... 달걀 프라이를 만들고 나서 얹고',
        },
        {
          id: 'rq_5_1_2',
          question: 'Hương vị của Bibimbap được miêu tả như thế nào?',
          options: [
            'Ngọt ngào và thơm dầu oliu',
            'Cay ngọt của tương ớt kết hợp bùi béo của dầu mè',
            'Thanh đạm và không gia vị',
            'Mặn và chua như kim chi',
          ],
          correctIndex: 1,
          evidence: '고추장 양념이 매콤하고 달콤하며 참기름의 고소한 풍미가 어우러져',
        },
      ],
    },
    {
      id: 'r5_2',
      passageNumber: 2,
      type: 'Bài viết chia sẻ',
      title: '한국 음식 배우기 (Học nấu ăn Hàn Quốc)',
      source: 'Authored practice based on Lesson 5 vocabulary & grammar',
      koreanText: `저는 요리를 배운 지 6개월밖에 안 되었지만 요즘 한국 음식 만들기에 푹 빠졌습니다.\n지난 주말에는 처음으로 혼자 김치찌개를 만들어 보았습니다. 먼저 돼지고기와 묵은 김치를 볶다가 물을 붓고 끓였습니다.\n국물 맛을 보니 좀 싱거워서 국간장으로 간을 맞추었습니다. 마지막으로 두부를 넣고 나서 약한 불에서 5분 더 끓이니 맛있게 완성되었습니다.\n처음에는 간을 맞추는 것이 가장 어려웠는데, 여러 번 해 보다가 이제는 자연스럽게 할 수 있게 되었습니다.\n앞으로는 갈비찜이나 잡채도 만들어 볼 생각입니다.`,
      vietnameseTranslation: `Tôi mới học nấu ăn được 6 tháng thôi nhưng dạo này đang mê say học nấu món Hàn. Cuối tuần vừa rồi tôi đã lần đầu tiên tự nấu canh kim chi một mình. Trước tiên, đang xào thịt lợn với kim chi cũ thì đổ nước vào đun sôi. Nếm canh thấy hơi nhạt nên tôi nêm thêm nước tương canh cho vừa. Cuối cùng, cho đậu phụ vào rồi đun thêm 5 phút lửa nhỏ thì xong. Ban đầu, việc nêm nếm gia vị là khó nhất, nhưng sau khi làm đi làm lại thì giờ đã làm quen tay rồi. Sắp tới tôi dự định thử làm sườn hầm và miến xào.`,
      keyVocabulary: [
        { kr: '묵은 김치', vn: 'Kim chi đã ngâm lâu' },
        { kr: '끓이다', vn: 'Đun sôi sùng sục' },
        { kr: '국물이 싱겁다', vn: 'Canh bị nhạt' },
        { kr: '간을 맞추다', vn: 'Nêm gia vị cho vừa' },
        { kr: '볶다가', vn: 'Đang xào thì (bị gián đoạn)' },
      ],
      questions: [
        {
          id: 'rq_5_2_1',
          question: 'Người viết đã xử lý vấn đề canh bị nhạt bằng cách nào?',
          options: [
            'Thêm ớt bột để tăng vị',
            'Nêm thêm nước tương canh',
            'Cho thêm đậu phụ vào',
            'Đun thêm lâu hơn',
          ],
          correctIndex: 1,
          evidence: '국물 맛을 보니 좀 싱거워서 국간장으로 간을 맞추었습니다.',
        },
        {
          id: 'rq_5_2_2',
          question: 'Người viết gặp khó khăn gì nhất khi mới học nấu ăn?',
          options: [
            'Cách thái sợi rau củ',
            'Cách nêm nếm gia vị cho vừa',
            'Cách đun sôi canh đúng cách',
            'Cách chọn nguyên liệu tươi',
          ],
          correctIndex: 1,
          evidence: '처음에는 간을 맞추는 것이 가장 어려웠는데',
        },
      ],
    },
  ],
  // BÀI 06: 은행 (Giao dịch ngân hàng)
  6: [
    {
      id: 'r6_1',
      passageNumber: 1,
      type: 'Hội thoại ngân hàng',
      title: '은행 창구에서 (Tại quầy giao dịch ngân hàng)',
      source: 'Authored practice based on Lesson 6 vocabulary & grammar',
      koreanText: `직원: 어서 오세요. 무엇을 도와드릴까요?\n고객: 안녕하세요. 통장을 새로 만들려면 어떻게 해야 해요?\n직원: 신분증을 복사하는 동안 먼저 신청서를 작성해 주시면 됩니다. 신분증은 지참하셨어요?\n고객: 네, 여권 가지고 왔어요.\n직원: 감사합니다. 비밀번호는 4자리로 설정하시면 되는데, 쉽게 잊어버리기 쉬우니까 꼭 메모해 두세요.\n고객: 인터넷 뱅킹도 신청하고 싶은데요.\n직원: 물론이죠. 통장 개설과 동시에 신청하실 수 있습니다. 공인인증서도 함께 발급해 드릴게요.\n고객: 감사합니다. 그리고 매달 공과금을 자동으로 내려면 어떻게 해야 해요?\n직원: 자동이체 서비스를 신청하시면 됩니다. 신청서 하나 더 작성해 주시겠어요?`,
      vietnameseTranslation: `Nhân viên: Xin chào, tôi có thể giúp gì cho bạn? Khách: Xin chào. Nếu muốn mở tài khoản mới thì phải làm thế nào? Nhân viên: Trong khi tôi photo thẻ căn cước, bạn vui lòng điền trước đơn đăng ký. Bạn có mang theo CMND không? Khách: Có, tôi mang hộ chiếu. Nhân viên: Cảm ơn. Mật khẩu đặt 4 chữ số, vì dễ quên nên nhớ ghi lại nhé. Khách: Tôi cũng muốn đăng ký Internet Banking. Nhân viên: Được chứ, có thể đăng ký cùng lúc mở tài khoản, tôi sẽ cấp luôn chứng thư số. Khách: Cảm ơn. Ngoài ra, nếu muốn thanh toán tiền dịch vụ công hàng tháng tự động thì làm thế nào? Nhân viên: Bạn đăng ký dịch vụ chuyển khoản tự động nhé. Bạn điền thêm một đơn nữa được không?`,
      keyVocabulary: [
        { kr: '통장을 만들려면', vn: 'Nếu muốn mở tài khoản thì' },
        { kr: '신분증을 복사하는 동안', vn: 'Trong khi photo thẻ căn cước' },
        { kr: '잊어버리기 쉽다', vn: 'Dễ bị quên' },
        { kr: '자동이체', vn: 'Chuyển khoản tự động' },
        { kr: '공인인증서', vn: 'Chứng thư số' },
      ],
      questions: [
        {
          id: 'rq_6_1_1',
          question: 'Khách hàng cần làm gì trong khi nhân viên photo thẻ căn cước?',
          options: [
            'Đợi tại quầy mà không làm gì',
            'Điền vào đơn đăng ký',
            'Thiết lập mật khẩu',
            'Tải ứng dụng ngân hàng',
          ],
          correctIndex: 1,
          evidence: '신분증을 복사하는 동안 먼저 신청서를 작성해 주시면 됩니다.',
        },
        {
          id: 'rq_6_1_2',
          question: 'Nhân viên đã khuyên khách hàng về mật khẩu như thế nào?',
          options: [
            'Dùng ngày sinh nhật cho dễ nhớ',
            'Đặt 6 chữ số để an toàn hơn',
            'Vì dễ quên nên nhớ ghi lại',
            'Không cần thiết lập mật khẩu',
          ],
          correctIndex: 2,
          evidence: '쉽게 잊어버리기 쉬우니까 꼭 메모해 두세요.',
        },
      ],
    },
    {
      id: 'r6_2',
      passageNumber: 2,
      type: 'Bài viết giới thiệu',
      title: '스마트한 재테크 습관 (Thói quen quản lý tài chính thông minh)',
      source: 'Authored practice based on Lesson 6 vocabulary',
      koreanText: `매달 첫 번째 주에 저는 가계부를 정리합니다. 한 달 동안 수입과 지출을 꼼꼼하게 기록해 두면 불필요한 소비를 줄이기 쉽습니다.\n저의 재테크 방법은 간단합니다. 월급이 들어오면 바로 적금 통장으로 이체를 해 두는 거예요. 그렇게 하지 않으면 어느새 써버리기 쉽거든요.\n저는 매달 월급의 30%를 정기 적금에 넣고, 20%는 비상금으로 별도의 통장에 넣어 둡니다.\n또한 공과금과 인터넷 요금은 자동이체로 설정해 두어서 날짜를 잊어버리기 쉬운 걱정을 덜었습니다.\n이렇게 꾸준히 절약하다 보면 1년 후에 얼마나 모을 수 있을지 기대가 됩니다.`,
      vietnameseTranslation: `Mỗi tuần đầu tiên của tháng tôi đều tổng kết sổ chi tiêu gia đình. Nếu ghi chép kỹ lưỡng thu nhập và chi tiêu trong một tháng thì dễ cắt giảm những chi tiêu không cần thiết. Phương pháp quản lý tài chính của tôi rất đơn giản: khi lương về là chuyển ngay sang sổ tiết kiệm. Không làm vậy thì rất dễ tiêu hết không hay. Mỗi tháng tôi gửi 30% lương vào tiết kiệm định kỳ và 20% vào tài khoản quỹ dự phòng riêng. Ngoài ra tôi đặt tiền dịch vụ công và phí internet chuyển khoản tự động để không lo quên ngày thanh toán. Cứ kiên trì tiết kiệm như vậy, tôi rất kỳ vọng sau 1 năm sẽ để dành được bao nhiêu.`,
      keyVocabulary: [
        { kr: '가계부를 정리하다', vn: 'Tổng kết sổ chi tiêu gia đình' },
        { kr: '수입과 지출', vn: 'Thu nhập và chi tiêu' },
        { kr: '비상금', vn: 'Quỹ dự phòng khẩn cấp' },
        { kr: '자동이체로 설정하다', vn: 'Thiết lập chuyển khoản tự động' },
        { kr: '잊어버리기 쉽다', vn: 'Dễ bị quên' },
      ],
      questions: [
        {
          id: 'rq_6_2_1',
          question: 'Người viết dùng bao nhiêu phần trăm lương để gửi tiết kiệm định kỳ?',
          options: ['20%', '30%', '50%', '70%'],
          correctIndex: 1,
          evidence: '매달 월급의 30%를 정기 적금에 넣고',
        },
        {
          id: 'rq_6_2_2',
          question: 'Lý do nào khiến người viết đặt tiền dịch vụ chuyển khoản tự động?',
          options: [
            'Vì muốn tiết kiệm phí giao dịch',
            'Vì ngân hàng yêu cầu bắt buộc',
            'Để không lo quên ngày thanh toán',
            'Vì không có điện thoại thông minh',
          ],
          correctIndex: 2,
          evidence: '날짜를 잊어버리기 쉬운 걱정을 덜었습니다.',
        },
      ],
    },
  ],
  // BÀI 07: 성격 (Tính cách & Phẩm chất)
  7: [
    {
      id: 'r7_1',
      passageNumber: 1,
      type: 'Thư đề cử & Giới thiệu',
      title: '동아리 새 회장 추천서 (Thư đề cử chủ tịch mới cho câu lạc bộ)',
      source: 'Authored practice based on Lesson 7 vocabulary & grammar',
      koreanText: `한국어 토론 동아리 회원 여러분 안녕하십니까?\n다음 학기를 이끌어 갈 새로운 동아리 회장으로 2학년 김민수 학우를 적극 추천합니다.\n민수 학우는 매사에 적극적이고 성격이 밝고 활발한 편입니다. 특히 사람들과 금방 친해져서 발이 아주 넓고, 누구에게나 친형처럼 다정하게 대합니다.\n또한 동아리 활동을 하면서 힘든 고민을 털어놓는 친구들의 이야기를 잘 들어주고, 입이 무거워서 다른 사람의 비밀을 절대 퍼뜨리지 않습니다.\n책임감도 강하고 추진력도 있어서 우리 동아리를 훌륭하게 이끌어 갈 적임자라고 생각합니다. 여러분의 많은 지지 바랍니다.`,
      vietnameseTranslation: `Xin chào các thành viên câu lạc bộ thảo luận tiếng Hàn. Tôi xin nhiệt tình đề cử bạn Kim Min-su sinh viên năm 2 làm chủ tịch mới của câu lạc bộ dẫn dắt trong kỳ tới. Min-su là người luôn tích cực trong mọi việc, tính tình tươi sáng và thuộc diện rất hoạt bát. Đặc biệt cậu ấy làm quen với mọi người rất nhanh nên quan hệ cực kỳ rộng rãi, đối xử với ai cũng trìu mến ấm áp như anh trai ruột. Ngoài ra khi sinh hoạt câu lạc bộ, cậu ấy luôn lắng nghe tâm sự khó khăn của bạn bè và rất kín miệng, tuyệt đối không bao giờ làm lộ bí mật của người khác. Tinh thần trách nhiệm cao và khả năng xúc tiến tốt khiến cậu ấy là ứng viên sáng giá. Mong mọi người ủng hộ!`,
      keyVocabulary: [
        { kr: '활발한 편이다', vn: 'Thuộc diện hoạt bát vui tươi' },
        { kr: '발이 넓다', vn: 'Quen biết rộng rãi khắp nơi' },
        { kr: '친형처럼', vn: 'Như anh trai ruột' },
        { kr: '입이 무겁다', vn: 'Kín miệng giữ bí mật tốt' },
        { kr: '추진력', vn: 'Năng lực thúc đẩy, xúc tiến công việc' },
      ],
      questions: [
        {
          id: 'rq_7_1_1',
          question: 'Min-su được người viết thư nhận xét là người có tính cách như thế nào?',
          options: [
            'Trầm tính, ít nói và hay ngại người lạ',
            'Hoạt bát, quan hệ rộng rãi và đối xử ấm áp với mọi người',
            'Nóng vội và thích làm việc một mình',
            'Kén chọn và khó gần với người mới',
          ],
          correctIndex: 1,
          evidence:
            '성격이 밝고 활발한 편입니다. 특히 발이 아주 넓고, 누구에게나 친형처럼 다정하게 대합니다.',
        },
        {
          id: 'rq_7_1_2',
          question: 'Vì sao các bạn trong câu lạc bộ yên tâm tâm sự chuyện riêng với Min-su?',
          options: [
            'Vì Min-su là hội trưởng khóa trước',
            'Vì Min-su rất kín miệng, không bao giờ để lộ bí mật của người khác',
            'Vì Min-su có học lực giỏi nhất khoa',
            'Vì Min-su biết xem bói chỉ tay',
          ],
          correctIndex: 1,
          evidence: '입이 무거워서 다른 사람의 비밀을 절대 퍼뜨리지 않습니다.',
        },
      ],
    },
    {
      id: 'r7_2',
      passageNumber: 2,
      type: 'Văn hóa đối chiếu',
      title: "한국인의 '빨리빨리' 문화와 성격 (Văn hóa 'Palli Palli' và tính cách người Hàn)",
      source: 'Authored practice based on Lesson 7 culture note',
      koreanText: `외국인들이 한국에 와서 가장 먼저 배우는 말 중 하나가 바로 '빨리빨리'입니다.\n한국 사람들은 성격이 급한 편이어서 식당에서 음식이 늦게 나오거나 인터넷 속도가 느리면 답답해합니다. 엘리베이터를 탈 때도 닫힘 버튼을 여러 번 누르는 모습을 흔히 볼 수 있습니다.\n이러한 급한 성격과 '빨리빨리' 문화는 짧은 시간 안에 눈부신 경제 성장을 이루어 내는 데 큰 원동력이 되었습니다.\n하지만 한편으로는 현대인들에게 스트레스와 조급함을 주는 단점도 있습니다. 그럼에도 불구하고 한국인들은 정이 많아서 어려운 이웃을 보면 발을 벗고 나서서 도와주는 따뜻한 면모도 함께 지니고 있습니다.`,
      vietnameseTranslation: `Một trong những câu nói đầu tiên mà người nước ngoài học được khi đến Hàn Quốc chính là 'Palli Palli' (nhanh lên nhanh lên). Người Hàn Quốc thuộc diện tính tình nóng vội nên nếu ở quán ăn đồ ra chậm hoặc tốc độ mạng chậm thì cảm thấy rất bứt rứt. Khi đi thang máy, người ta cũng thường bấm nút đóng cửa liên tục. Tính cách khẩn trương này chính là động lực to lớn giúp Hàn Quốc đạt được sự tăng trưởng kinh tế thần kỳ trong thời gian ngắn. Tuy nhiên nó cũng mang lại mặt trái là căng thẳng và áp lực vội vã. Dù vậy, người Hàn lại rất giàu tình cảm (정이 많다), luôn xắn tay áo nhiệt tình lăn xả giúp đỡ khi thấy người hoạn nạn.`,
      keyVocabulary: [
        { kr: '성격이 급한 편이다', vn: 'Thuộc diện tính tình nóng vội hấp tấp' },
        { kr: '답답하다', vn: 'Bứt rứt khó chịu ngột ngạt' },
        { kr: '원동력', vn: 'Động lực cốt lõi thúc đẩy' },
        { kr: '정이 많다', vn: 'Giàu tình cảm sâu nặng ấm áp' },
        { kr: '발을 벗고 나서다', vn: 'Xắn tay áo nhiệt tình lăn xả giúp' },
      ],
      questions: [
        {
          id: 'rq_7_2_1',
          question: 'Văn hóa "빨리빨리" đã đóng vai trò tích cực gì đối với đất nước Hàn Quốc?',
          options: [
            'Giúp bảo tồn nguyên vẹn các di tích cổ xưa',
            'Là động lực to lớn thúc đẩy tăng trưởng kinh tế vượt bậc trong thời gian ngắn',
            'Giảm bớt áp lực thi cử cho học sinh sinh viên',
            'Khiến mọi người không cần sử dụng internet nữa',
          ],
          correctIndex: 1,
          evidence:
            "이러한 급한 성격과 '빨리빨리' 문화는 짧은 시간 안에 눈부신 경제 성장을 이루어 내는 데 큰 원동력이 되었습니다.",
        },
        {
          id: 'rq_7_2_2',
          question:
            'Phẩm chất ấm áp nào của người Hàn được tác giả nhắc đến để cân bằng với tính cách vội vã?',
          options: [
            'Tính cách rất thích nói chuyện hài hước',
            'Lòng giàu tình cảm (정이 많다) và sẵn sàng lăn xả giúp người gặp khó khăn',
            'Thói quen luôn đến sớm 30 phút trong mọi cuộc hẹn',
            'Khả năng ghi nhớ tốt mọi số điện thoại',
          ],
          correctIndex: 1,
          evidence:
            '한국인들은 정이 많아서 어려운 이웃을 보면 발을 벗고 나서서 도와주는 따뜻한 면모도 지니고 있습니다.',
        },
      ],
    },
  ],
  // BÀI 08: 실수 (Sai sót & Khắc phục)
  8: [
    {
      id: 'r8_1',
      passageNumber: 1,
      type: 'Email xin lỗi & giải thích',
      title: '약속 지각 사과 및 사유 안내 (Email xin lỗi và giải thích việc đến muộn)',
      source: 'Authored practice based on Lesson 8 vocabulary & grammar',
      koreanText: `수진 씨에게.\n오늘 중요한 스터디 모임에 30분이나 늦어서 정말 죄송합니다.\n오늘 아침에 집에서 제시간에 출발했는데, 지하철 2호선 열차에 갑자기 고장이 나는 바람에 중간에 한참 동안 멈춰 서 있었습니다.\n휴대전화 배터리마저 다 닳는 바람에 미리 연락을 드리지 못했습니다. 제가 미리 충전해 두지 않은 것도 큰 부주의였습니다.\n저 때문에 스터디 진행에 큰 차질이 생기게 되어 진심으로 고개 숙여 사과드립니다.\n다음 모임부터는 이런 돌발 상황에 대비하여 30분 일찍 출발하도록 하겠습니다. 너그럽게 양해해 주시면 감사하겠습니다.`,
      vietnameseTranslation: `Gửi Su-jin. Hôm nay mình trễ buổi học nhóm quan trọng những 30 phút, thực sự rất xin lỗi cậu. Sáng nay mình đã xuất phát đúng giờ, nhưng do đoàn tàu điện ngầm tuyến số 2 bất ngờ bị hỏng nên tàu đã phải dừng lại giữa chừng suốt một lúc lâu. Lại thêm điện thoại của mình bị hết sạch pin ngoài ý muốn nên đã không thể gọi điện báo trước được. Việc mình không sạc pin chu đáo từ trước cũng là một sơ suất lớn. Vì mình mà tiến độ học nhóm bị ảnh hưởng, mình xin chân thành cúi đầu xin lỗi mọi người. Từ buổi sau mình sẽ chuẩn bị xuất phát sớm 30 phút để ứng phó với các tình huống bất ngờ. Rất mong cậu lượng thứ thông cảm.`,
      keyVocabulary: [
        { kr: '고장이 나는 바람에', vn: 'Do bị hỏng hóc bất ngờ (dẫn đến sự cố)' },
        { kr: '배터리가 다 닳다', vn: 'Pin cạn kiệt hết sạch' },
        { kr: '차질이 생기다', vn: 'Bị gián đoạn, xảy ra trục trặc kế hoạch' },
        { kr: '사과드립니다', vn: 'Xin gửi lời xin lỗi chân thành' },
        { kr: '출발하도록 하겠습니다', vn: 'Sẽ cố gắng xuất phát (cam kết sửa sai)' },
      ],
      questions: [
        {
          id: 'rq_8_1_1',
          question: 'Nguyên nhân trực tiếp khiến người viết bị mắc kẹt trên đường đi là gì?',
          options: [
            'Do ngủ quên không nghe chuông báo thức',
            'Do tàu điện ngầm tuyến 2 bất ngờ bị sự cố hỏng hóc',
            'Do bị nhầm lẫn lịch học nhóm',
            'Do thời tiết mưa bão không đi được xe buýt',
          ],
          correctIndex: 1,
          evidence:
            '지하철 2호선 열차에 갑자기 고장이 나는 바람에 중간에 한참 동안 멈춰 서 있었습니다.',
        },
        {
          id: 'rq_8_1_2',
          question: 'Người viết cam kết sẽ làm gì để không tái phạm sai sót trong những lần sau?',
          options: [
            'Sẽ đổi sang nhóm học khác',
            'Sẽ xuất phát sớm hơn 30 phút để đề phòng tình huống bất ngờ',
            'Sẽ mua thêm 2 chiếc điện thoại mới',
            'Sẽ đi taxi thay vì đi tàu điện ngầm',
          ],
          correctIndex: 1,
          evidence: '다음 모임부터는 이런 돌발 상황에 대비하여 30분 일찍 출발하도록 하겠습니다.',
        },
      ],
    },
    {
      id: 'r8_2',
      passageNumber: 2,
      type: 'Kỹ năng sống & Lời khuyên',
      title: '직장에서 실수를 줄이는 세 가지 습관 (Ba thói quen giảm bớt sai sót nơi công sở)',
      source: 'Authored practice based on Lesson 8 vocabulary & grammar',
      koreanText: `누구나 사회생활을 하면서 실수를 저지를 수 있습니다. 그러나 실수를 어떻게 대처하느냐에 따라 신뢰받는 사람이 될 수도 있고 무능한 사람으로 낙인찍힐 수도 있습니다.\n첫째, 건망증을 줄이려면 상사나 동료의 지시를 들을 때 즉시 수첩에 메모하는 습관을 들여야 합니다. 사람은 누구나 중요한 내용을 깜빡하기 쉽기 때문입니다.\n둘째, 중요한 서류를 작성하는 중에는 휴대전화나 메신저 알림을 끄고 일에만 집중해야 착각이나 오탈자를 막을 수 있습니다.\n셋째, 실수를 저질렀을 때는 변명하거나 핑계를 대지 말고 솔직하게 잘못을 인정하고 정중히 사과해야 합니다. 그리고 같은 실수를 반복하지 않도록 해결책을 찾아 명심해야 합니다.`,
      vietnameseTranslation: `Bất kỳ ai trong đời sống xã hội cũng có thể mắc phải sai sót. Tuy nhiên tùy thuộc vào cách ứng phó với sai lầm mà bạn có thể trở thành người đáng tin cậy hay bị coi là người thiếu năng lực. Thứ nhất, để giảm chứng đãng trí, khi nghe chỉ thị từ cấp trên hay đồng nghiệp hãy rèn thói quen ghi chép ngay vào sổ tay, bởi con người rất dễ quên khuấy đi những điều quan trọng. Thứ hai, khi đang trong quá trình soạn thảo tài liệu quan trọng, hãy tắt chuông thông báo điện thoại để tập trung tránh ngộ nhận và lỗi chính tả. Thứ ba, khi lỡ phạm sai lầm, đừng bao che hay viện cớ mà hãy thẳng thắn nhận lỗi và tạ lỗi lịch thiệp, đồng thời khắc cốt ghi tâm giải pháp để không lặp lại lỗi đó.`,
      keyVocabulary: [
        { kr: '실수를 저지르다', vn: 'Phạm phải sai lầm sơ suất' },
        { kr: '깜빡하기 쉽다', vn: 'Dễ bị quên khuấy đi trong chốc lát' },
        { kr: '작성하는 중에', vn: 'Trong quá trình đang soạn thảo' },
        { kr: '핑계를 대다', vn: 'Viện cớ đùn đẩy trách nhiệm' },
        { kr: '잘못을 인정하다', vn: 'Thẳng thắn nhận lỗi về mình' },
      ],
      questions: [
        {
          id: 'rq_8_2_1',
          question:
            'Theo bài viết, thói quen nào giúp giảm thiểu chứng hay quên (건망증) khi làm việc?',
          options: [
            'Học thuộc lòng mọi chỉ thị trong đầu',
            'Ghi chép ngay lập tức vào sổ tay khi nhận lời dặn dò',
            'Chỉ nhận việc đơn giản, từ chối việc khó',
            'Nhờ đồng nghiệp làm thay các phần quan trọng',
          ],
          correctIndex: 1,
          evidence:
            '건망증을 줄이려면 상사나 동료의 지시를 들을 때 즉시 수첩에 메모하는 습관을 들여야 합니다.',
        },
        {
          id: 'rq_8_2_2',
          question: 'Khi lỡ mắc sai sót, thái độ đúng đắn nhất được khuyên là gì?',
          options: [
            'Im lặng đợi mọi người quên đi',
            'Tìm một lý do khách quan để biện bạch đổ lỗi',
            'Thẳng thắn thừa nhận lỗi, xin lỗi chân thành và tìm cách không tái phạm',
            'Lập tức xin nghỉ việc sang công ty khác',
          ],
          correctIndex: 2,
          evidence: '변명하거나 핑계를 대지 말고 솔직하게 잘못을 인정하고 정중히 사과해야 합니다.',
        },
      ],
    },
  ],
  // BÀI 09: 이사 (Chuyển nhà & Cư trú)
  9: [
    {
      id: 'r9_1',
      passageNumber: 1,
      type: 'Thông tin môi giới BĐS',
      title: '대학가 풀옵션 원룸 임대 안내 (Thông tin cho thuê phòng trọ full nội thất gần trường)',
      source: 'Authored practice based on Lesson 9 vocabulary & grammar',
      koreanText: `[보람부동산 추천 매물]\n대학교 정문에서 도보 5분 거리에 위치한 풀옵션 원룸을 소개합니다.\n이 방은 남향집이어서 낮 동안 햇볕이 아주 잘 들고 통풍이 잘되어 쾌적합니다. 에어컨, 세탁기, 냉장고, 가스레인지가 완비되어 있어 몸만 들어오시면 됩니다.\n보증금은 500만 원이고 월세는 45만 원입니다. 관리비 5만 원에는 인터넷과 수도 요금이 포함되어 있습니다.\n학교 기숙사에 비해서 개인 사생활이 보장되고 훨씬 조용하며 자유롭습니다. 한국 부동산 계약서를 쓸 줄 모르는 외국인 유학생도 친절하게 공인중개사가 도와드립니다. 관심 있으신 분은 언제든지 연락 주세요!`,
      vietnameseTranslation: `[Tin nhà tốt từ Bất động sản Boram]\nXin giới thiệu phòng trọ studio full nội thất cách cổng chính trường đại học 5 phút đi bộ. Căn phòng này là nhà hướng Nam nên ban ngày đón ánh nắng chan hòa ấm áp, thông gió thoáng mát dễ chịu. Nội thất đã trang bị đầy đủ điều hòa, máy giặt, tủ lạnh, bếp ga nên chỉ việc xách vali vào ở. Tiền đặt cọc là 5.000.000 won và tiền thuê hàng tháng là 450.000 won. Tiền phí quản lý 50.000 won đã bao gồm internet và tiền nước. So với ký túc xá trường học, căn phòng này bảo đảm sự riêng tư, yên tĩnh và tự do hơn nhiều. Du học sinh nước ngoài chưa biết cách làm hợp đồng thuê nhà tiếng Hàn sẽ được chuyên viên môi giới hỗ trợ tận tình. Xin liên hệ bất kỳ lúc nào!`,
      keyVocabulary: [
        { kr: '남향집', vn: 'Nhà quay hướng Nam chan hòa ánh nắng' },
        { kr: '햇볕이 잘 들다', vn: 'Ánh nắng rọi vào ấm áp sáng sủa' },
        { kr: '보증금과 월세', vn: 'Tiền cọc và tiền thuê hàng tháng' },
        { kr: '기숙사에 비해서', vn: 'So với ký túc xá trường học' },
        { kr: '계약서를 쓸 줄 모르다', vn: 'Không biết cách viết hợp đồng' },
      ],
      questions: [
        {
          id: 'rq_9_1_1',
          question: 'Ưu điểm về vị trí và ánh sáng của căn phòng này là gì?',
          options: [
            'Cách trường 30 phút đi xe buýt, hướng Bắc râm mát',
            'Cách cổng trường 5 phút đi bộ, nhà hướng Nam đón nắng ấm chan hòa',
            'Ở trên tầng thượng không có cửa sổ',
            'Nằm ở tầng hầm nên tránh được nắng nóng mùa hè',
          ],
          correctIndex: 1,
          evidence:
            '대학교 정문에서 도보 5분 거리에 위치... 남향집이어서 낮 동안 햇볕이 아주 잘 들고',
        },
        {
          id: 'rq_9_1_2',
          question: 'So với việc ở ký túc xá trường học, căn phòng này có điểm mạnh gì?',
          options: [
            'Giá tiền rẻ hơn gấp ba lần',
            'Bảo đảm sự riêng tư, yên tĩnh và sinh hoạt tự do hơn',
            'Được ăn miễn phí ba bữa mỗi ngày',
            'Có xe đưa đón sinh viên tận nơi',
          ],
          correctIndex: 1,
          evidence: '학교 기숙사에 비해서 개인 사생활이 보장되고 훨씬 조용하며 자유롭습니다.',
        },
      ],
    },
    {
      id: 'r9_2',
      passageNumber: 2,
      type: 'Văn hóa đời sống',
      title: '한국의 집들이 문화와 특별한 선물 (Văn hóa tiệc tân gia và những món quà đặc biệt)',
      source: 'Authored practice based on Lesson 9 culture note',
      koreanText: `한국에서는 새로운 집으로 이사를 하고 나면 친한 요구나 친구들을 초대하여 '집들이'를 합니다. 집주인은 정성스럽게 음식을 장만하여 손님을 대접하고 새집을 구경시켜 줍니다.\n이때 집들이에 초대받은 손님들은 빈손으로 가지 않고 특별한 의미가 담긴 선물을 준비합니다.\n가장 대표적인 집들이 선물은 '세제'와 '두루마리 휴지'입니다. 세제에서 거품이 풍성하게 일어나는 것처럼 재산이 불어나고 부자가 되기를 바라는 마음을 담고 있습니다.\n그리고 두루마리 휴지는 술술 잘 풀리는 것처럼 앞으로 모든 일이 순조롭게 잘 풀리기를 기원하는 뜻입니다. 이처럼 한국의 집들이 선물에는 상대방의 행복과 번영을 바라는 따뜻한 정이 깃들어 있습니다.`,
      vietnameseTranslation: `Ở Hàn Quốc, sau khi chuyển đến nhà mới, người ta thường mời bạn bè người thân đến tổ chức tiệc mừng nhà mới gọi là 'Jipdeuri' (tiệc tân gia). Chủ nhà chuẩn bị đồ ăn chu đáo thiết đãi khách và dẫn đi tham quan các phòng. Khách được mời đến tiệc tân gia không bao giờ đi tay không mà mang theo những món quà gửi gắm ý nghĩa đặc biệt. Hai món quà tiêu biểu nhất là 'bột giặt' và 'giấy vệ sinh cuộn'. Bột giặt mang ý nghĩa chúc cho tài sản của gia chủ sinh sôi nảy nở nhanh chóng như những bọt xà phòng trắng xóa. Còn cuộn giấy vệ sinh dễ rút ra biểu thị lời chúc cho mọi công việc trong tương lai đều được hanh thông suôn sẻ không vướng mắc. Những món quà ấy chứa chan tình cảm ấm áp chúc phúc cho gia đình mới.`,
      keyVocabulary: [
        { kr: '집들이', vn: 'Tiệc mừng nhà mới tân gia' },
        { kr: '손님을 대접하다', vn: 'Chiêu đãi tiếp đón khách chu đáo' },
        { kr: '세제', vn: 'Bột giặt, chất tẩy rửa tạo bọt' },
        { kr: '두루마리 휴지', vn: 'Cuộn giấy vệ sinh tròn' },
        { kr: '술술 풀리다', vn: 'Trôi chảy, hanh thông suôn sẻ' },
      ],
      questions: [
        {
          id: 'rq_9_2_1',
          question: 'Vì sao người Hàn Quốc thường tặng bột giặt (세제) trong tiệc tân gia?',
          options: [
            'Vì gia chủ chưa kịp mua đồ dùng giặt giũ',
            'Tượng trưng cho lời chúc tài lộc và của cải sinh sôi nảy nở như bọt xà phòng',
            'Vì bột giặt là đồ đắt tiền nhất trong siêu thị',
            'Để gia chủ dọn sạch nhà cửa ngay sau bữa tiệc',
          ],
          correctIndex: 1,
          evidence:
            '세제에서 거품이 풍성하게 일어나는 것처럼 재산이 불어나고 부자가 되기를 바라는 마음을 담고 있습니다.',
        },
        {
          id: 'rq_9_2_2',
          question: 'Món quà cuộn giấy vệ sinh (두루마리 휴지) mang thông điệp gì tốt đẹp?',
          options: [
            'Chúc cho gia đình sống lâu trăm tuổi',
            'Chúc cho mọi công việc hanh thông, giải quyết êm xuôi suôn sẻ',
            'Chúc cho con cái học giỏi thi đỗ',
            'Chúc cho nhà cửa lúc nào cũng mát mẻ',
          ],
          correctIndex: 1,
          evidence:
            '두루마리 휴지는 술술 잘 풀리는 것처럼 앞으로 모든 일이 순조롭게 잘 풀리기를 기원하는 뜻입니다.',
        },
      ],
    },
  ],
  // BÀI 10: 여행 (Du lịch & Trải nghiệm)
  10: [
    {
      id: 'r10_1',
      passageNumber: 1,
      type: 'Lịch trình du lịch văn hóa',
      title: '천년 고도 경주 2박 3일 역사 기행 (Chuyến đi văn hóa lịch sử Gyeongju 3 ngày 2 đêm)',
      source: 'Authored practice based on Lesson 10 vocabulary & grammar',
      koreanText: `이번 가을 방학을 맞아 신라 천년의 수도였던 경주로 2박 3일 여행 일정을 짰습니다.\n첫째 날에는 서울역에서 KTX 고속열차 표를 예매하여 신경주역으로 출발할 생각입니다. 도착 후 유네스코 세계 문화유산인 불국사와 석굴암을 답사하며 신라 시대의 뛰어난 불교 예술을 관람할 예정입니다.\n둘째 날에는 시내에 있는 첨성대와 대릉원을 둘러보고, 해 질 무렵에는 동궁과 월지(안압지)의 아름다운 야경을 감상할까 합니다.\n친구가 숙소 위치가 편리하냐고 물어봤는데, 버스 터미널 바로 근처에 깔끔한 게스트하우스를 미리 예약해 두어서 이동하기에 아주 좋습니다. 마지막 날에는 유명한 황남빵을 사 들고 귀국할 준비를 할 것입니다.`,
      vietnameseTranslation: `Nhân kỳ nghỉ mùa thu lần này, tôi đã lên lịch trình 3 ngày 2 đêm đi Gyeongju - cố đô ngàn năm của vương triều Shilla. Ngày đầu tiên, tôi dự định đặt vé tàu cao tốc KTX từ ga Seoul đến ga Singyeongju. Sau khi đến nơi, tôi sẽ tham quan Chùa Bulguksa và Hang Phật Seokguram - di sản văn hóa thế giới UNESCO để chiêm ngưỡng nghệ thuật Phật giáo đỉnh cao thời Shilla. Ngày thứ hai, tôi sẽ dạo quanh đài thiên văn Cheomseongdae và lăng mộ Daereungwon, đến lúc hoàng hôn đang tính sẽ thưởng ngoạn cảnh đêm lung linh tại Donggung & Wolji (hồ Anapji). Bạn tôi đã hỏi thăm chỗ nghỉ có tiện lợi không, và tôi đã đặt trước một guesthouse sạch sẽ ngay gần bến xe buýt nên việc di chuyển rất thuận tiện. Ngày cuối cùng tôi sẽ mua bánh Hwangnam nổi tiếng rồi chuẩn bị về nước.`,
      keyVocabulary: [
        { kr: '일정을 짜다', vn: 'Lập lịch trình chi tiết chuyến đi' },
        { kr: '예매하다', vn: 'Đặt mua trước vé tàu xe' },
        { kr: '세계 문화유산', vn: 'Di sản văn hóa thế giới UNESCO' },
        { kr: '감상할까 하다', vn: 'Đang tính sẽ thưởng ngoạn (cân nhắc ý định)' },
        { kr: '편리하냐고 물어보다', vn: 'Hỏi xem có tiện lợi hay không (câu hỏi gián tiếp)' },
      ],
      questions: [
        {
          id: 'rq_10_1_1',
          question: 'Phương tiện di chuyển được người viết chọn từ Seoul đến Gyeongju là gì?',
          options: [
            'Máy bay nội địa bay thẳng',
            'Tàu cao tốc KTX đặt vé trước tại ga Seoul',
            'Xe buýt chạy đêm',
            'Tự lái xe ô tô gia đình',
          ],
          correctIndex: 1,
          evidence: '서울역에서 KTX 고속열차 표를 예매하여 신경주역으로 출발할 생각입니다.',
        },
        {
          id: 'rq_10_1_2',
          question:
            'Địa danh nào tại Gyeongju được miêu tả là di sản thế giới UNESCO trong lịch trình?',
          options: [
            'Bến xe buýt trung tâm Gyeongju',
            'Chùa Bulguksa và Động Seokguram',
            'Cửa hàng bánh Hwangnam',
            'Nhà ga xe lửa Singyeongju',
          ],
          correctIndex: 1,
          evidence: '유네스코 세계 문화유산인 불국사와 석굴암을 답사하며',
        },
      ],
    },
    {
      id: 'r10_2',
      passageNumber: 2,
      type: 'Kinh nghiệm du lịch tự túc',
      title: '제주도 알뜰 자유여행 준비 요령 (Mẹo chuẩn bị du lịch tự do tiết kiệm tại đảo Jeju)',
      source: 'Authored practice based on Lesson 10 vocabulary & grammar',
      koreanText: `제주도는 한국에서 가장 아름다운 휴양지로 사계절 내내 많은 관광객들이 찾습니다. 하지만 7~8월 여름 성수기에는 항공권과 숙박 요금이 매우 비쌉니다.\n그래서 저는 이번 10월 가을 비수기에 친구와 함께 제주도로 자유여행을 떠날까 합니다.\n성수기에 비해서 항공료도 반값으로 저렴하고 관광지도 덜 붐비기 때문입니다. 두 달 전에 저비용 항공사 왕복 항공권을 미리 예매해 두어서 여행 비용을 크게 절약할 수 있었습니다.\n친구가 제주도에서 렌터카를 운전할 줄 아냐고 물어보길래 국제운전면허증이 있다고 대답했습니다. 해안 도로를 따라 드라이브하며 한라산과 에메랄드빛 바다를 만끽할 생각을 하니 벌써부터 가슴이 설렙니다.`,
      vietnameseTranslation: `Đảo Jeju là khu nghỉ dưỡng đẹp nhất tại Hàn Quốc, bốn mùa đều đón đông đảo khách du lịch. Tuy nhiên vào mùa cao điểm tháng 7-8 mùa hè, giá vé máy bay và phòng khách sạn rất đắt đỏ. Vì vậy tôi đang tính sẽ cùng bạn đi du lịch tự do đảo Jeju vào mùa thấp điểm tháng 10 mùa thu này. So với mùa cao điểm, giá vé máy bay rẻ chỉ bằng một nửa và các điểm tham quan cũng ít chen chúc hơn. Đặt trước vé máy bay khứ hồi giá rẻ từ hai tháng trước đã giúp tôi tiết kiệm được rất nhiều chi phí. Bạn tôi hỏi tôi có biết lái xe thuê tự lái ở đảo Jeju không, tôi đã trả lời là có bằng lái quốc tế rồi. Nghĩ đến cảnh vi vu dọc theo những cung đường biển ngắm núi Hallasan và đại dương xanh ngọc bích, lòng tôi đã rộn ràng từ bây giờ.`,
      keyVocabulary: [
        { kr: '성수기와 비수기', vn: 'Mùa cao điểm đắt đỏ và mùa vắng khách giá rẻ' },
        { kr: '떠날까 하다', vn: 'Đang tính sẽ lên đường đi (dự định)' },
        { kr: '왕복 항공권', vn: 'Vé máy bay khứ hồi' },
        { kr: '운전할 줄 아냐고 물어보다', vn: 'Hỏi xem có biết lái xe hay không' },
        { kr: '자유여행', vn: 'Du lịch tự túc khám phá' },
      ],
      questions: [
        {
          id: 'rq_10_2_1',
          question:
            'Vì sao người viết lại chọn đi du lịch Jeju vào mùa thấp điểm tháng 10 thay vì mùa hè?',
          options: [
            'Vì mùa hè đảo Jeju đóng cửa không đón khách',
            'Vì giá vé máy bay rẻ hơn và các điểm tham quan bớt đông đúc chen chúc',
            'Vì tháng 10 mới có các chuyến bay thẳng',
            'Vì người viết không thích biển',
          ],
          correctIndex: 1,
          evidence: '성수기에 비해서 항공료도 반값으로 저렴하고 관광지도 덜 붐비기 때문입니다.',
        },
        {
          id: 'rq_10_2_2',
          question: 'Người bạn đã hỏi người viết điều gì liên quan đến chuyến đi Jeju?',
          options: [
            'Hỏi xem đã đổi bao nhiêu tiền ngoại tệ',
            'Hỏi xem có biết lái xe thuê tự lái ở đảo Jeju hay không',
            'Hỏi xem có mang theo hộ chiếu không',
            'Hỏi xem mùa thu có hoa cải dầu nở không',
          ],
          correctIndex: 1,
          evidence:
            '친구가 제주도에서 렌터카를 운전할 줄 아냐고 물어보길래 국제운전면허증이 있다고 대답했습니다.',
        },
      ],
    },
  ],
  // BÀI 11: 고민 (Nỗi lo & Tư vấn tâm lý)
  11: [
    {
      id: 'r11_1',
      passageNumber: 1,
      type: 'Tư vấn tâm lý học đường',
      title: '대학 생활 상담 센터 상담 일지 (Nhật ký tư vấn tại Trung tâm tâm lý trường đại học)',
      source: 'Authored practice based on Lesson 11 vocabulary & grammar',
      koreanText: `[상담 사연]: 대학교 3학년 김민우 학생은 최근 졸업 후 진로 문제와 취업 준비로 인해 심한 스트레스와 불안감을 겪고 상담실을 찾았습니다.\n민우 학생은 다른 동기들에 비해 자신이 가진 스펙이나 자격 요건이 부족하다고 생각하여 자신감을 잃고 밤마다 잠을 설치고 있었습니다.\n[상담사의 조언]: 민우 학생, 누구나 사회 진출을 앞두고 현실의 벽 앞에서 초조하고 두려운 마음이 드는 것은 당연합니다.\n하지만 사소한 걱정에 얽매여 마음의 짐을 키우기보다는, 오늘 할 수 있는 작은 일부터 하나씩 실천해 나가는 것이 중요합니다. 외국어 공부든 자격증 준비든 꾸준히 하다 보면 저절로 실력이 늘고 자신감도 되찾게 될 것입니다.\n혼자 고민하지 말고 언제든 상담 센터의 문을 두드리세요.`,
      vietnameseTranslation: `[Câu chuyện tư vấn]: Sinh viên năm 3 Kim Min-woo dạo gần đây do áp lực định hướng tương lai sau khi tốt nghiệp và chuẩn bị xin việc nên rơi vào trạng thái căng thẳng và bất an cực độ, đã tìm đến phòng tư vấn. Min-woo cảm thấy hồ sơ năng lực và các chứng chỉ của mình thua kém bạn bè đồng trang lứa nên đã đánh mất sự tự tin, đêm nào cũng trằn trọc mất ngủ. [Lời khuyên của chuyên viên]: Min-woo à, bất cứ ai trước ngưỡng cửa bước vào đời đều cảm thấy bồn chồn và sợ hãi trước bức tường thực tế khắc nghiệt, đó là điều hoàn toàn tự nhiên. Tuy nhiên thay vì để tâm vào những nỗi lo vụn vặt làm gánh nặng tâm lý thêm nặng nề, điều quan trọng là hãy bắt tay làm từng việc nhỏ trong khả năng của ngày hôm nay. Dù là học ngoại ngữ hay ôn thi chứng chỉ, nếu cứ kiên trì làm từng chút một thì năng lực tự khắc sẽ nâng cao và sự tự tin sẽ tự quay trở lại thôi. Đừng ôm nỗi lo một mình, hãy gõ cửa trung tâm tư vấn bất kỳ lúc nào.`,
      keyVocabulary: [
        { kr: '진로 문제와 취업', vn: 'Vấn đề định hướng nghề nghiệp và xin việc' },
        { kr: '자신감을 잃다', vn: 'Đánh mất sự tự tin' },
        { kr: '초조하다', vn: 'Bồn chồn đứng ngồi không yên' },
        { kr: '꾸준히 하다 보면', vn: 'Cứ kiên trì làm liên tục thì' },
        { kr: '저절로', vn: 'Tự nó, một cách tự nhiên' },
      ],
      questions: [
        {
          id: 'rq_11_1_1',
          question:
            'Lý do chính khiến sinh viên Min-woo rơi vào trạng thái căng thẳng mất ngủ là gì?',
          options: [
            'Do bất hòa xích mích với người yêu',
            'Do lo lắng về tương lai sau tốt nghiệp và cảm thấy bản thân thiếu tự tin so với bạn bè',
            'Do không tìm được nhà trọ gần trường',
            'Do bị mất đồ đạc cá nhân',
          ],
          correctIndex: 1,
          evidence:
            '졸업 후 진로 문제와 취업 준비로 인해 심한 스트레스와 불안감을 겪고... 자신감을 잃고',
        },
        {
          id: 'rq_11_1_2',
          question: 'Chuyên viên tư vấn đã đưa ra lời khuyên thiết thực nào cho Min-woo?',
          options: [
            'Hãy bỏ học ngay lập tức để đi làm kiếm tiền',
            'Bắt đầu từ những việc nhỏ cụ thể mỗi ngày, kiên trì làm thì năng lực và sự tự tin sẽ tự cải thiện',
            'Không cần chuẩn bị gì cả vì mọi việc sẽ tự diễn ra',
            'Chuyển sang một trường đại học khác',
          ],
          correctIndex: 1,
          evidence:
            '작은 일부터 하나씩 실천해 나가는 것이 중요합니다. 꾸준히 하다 보면 저절로 실력이 늘고 자신감도 되찾게 될 것입니다.',
        },
      ],
    },
    {
      id: 'r11_2',
      passageNumber: 2,
      type: 'Thư tâm sự bạn bè',
      title: '친구에게 보내는 응원 편지 (Bức thư động viên bạn thân - Lối nói thân mật 반말)',
      source: 'Authored practice based on Lesson 11 grammar (반말)',
      koreanText: `지훈아, 안녕? 나 민수야.\n요즘 시험 준비하느라 많이 힘들지? 어제 도서관에서 네 얼굴을 보니까 안색이 너무 안 좋아서 걱정되더라.\n너 평소에 워낙 성실하니까 이번 시험도 분명히 잘 볼 거야. 너무 긴장하지 말고 편안한 마음으로 임해라.\n공부하다 보면 가끔 지치고 포기하고 싶을 때도 있잖아. 그럴 때는 잠시 산책도 하고 좋아하는 음악도 들어.\n이번 주 금요일에 시험 끝나고 우리 맛있는 떡볶이 먹으러 가자! 내가 쏠게. 힘내라, 친구야!`,
      vietnameseTranslation: `Ji-hoon à, chào cậu! Mình là Min-su đây. Dạo này ôn thi vất vả lắm đúng không? Hôm qua thấy cậu ở thư viện sắc mặt kém quá nên mình lo lắm. Bình thường cậu vốn rất chăm chỉ nên kỳ thi lần này nhất định sẽ làm tốt thôi. Đừng căng thẳng quá, hãy làm bài với tâm lý thật thoải mái nhé. Cứ học liên tục thì thỉnh thoảng ai cũng mệt mỏi và muốn buông xuôi mà. Những lúc như thế hãy đi dạo một chút và nghe bài nhạc mình thích. Thứ Sáu tuần này thi xong bọn mình cùng đi ăn tokbokki ngon nhé! Mình bao. Cố lên nhé bạn tôi!`,
      keyVocabulary: [
        { kr: '임해라', vn: 'Hãy đối mặt / bước vào (mệnh lệnh ban말)' },
        { kr: '공부하다 보면', vn: 'Nếu cứ học liên tục thì' },
        { kr: '지치다', vn: 'Kiệt sức mệt mỏi' },
        { kr: '내가 쏠게', vn: 'Tớ sẽ khao / tớ bao bữa này' },
        { kr: '먹으러 가자', vn: 'Cùng đi ăn đi (rủ rê ban말)' },
      ],
      questions: [
        {
          id: 'rq_11_2_1',
          question: 'Phong cách ngôn ngữ được sử dụng trong bức thư này là gì?',
          options: [
            'Lối nói kính ngữ trang trọng trang nghiêm (격식체)',
            'Lối nói thân mật không kính ngữ (반말) giữa hai người bạn thân cùng tuổi',
            'Ngôn ngữ hành chính thông báo công vụ',
            'Lối nói thơ ca cổ điển',
          ],
          correctIndex: 1,
          evidence:
            '편안한 마음으로 임해라... 맛있는 떡볶이 먹으러 가자! 내가 쏠게. 힘내라 (đuôi 반말: -아/어라, -자).',
        },
        {
          id: 'rq_11_2_2',
          question: 'Người viết đã rủ bạn làm gì sau khi kỳ thi kết thúc vào thứ Sáu?',
          options: [
            'Cùng đi xem phim kinh dị',
            'Cùng đi ăn món tokbokki ngon và người viết sẽ khao',
            'Đến thư viện học tiếp môn mới',
            'Đi du lịch nước ngoài dài ngày',
          ],
          correctIndex: 1,
          evidence: '이번 주 금요일에 시험 끝나고 우리 맛있는 떡볶이 먹으러 가자! 내가 쏠게.',
        },
      ],
    },
  ],
  // BÀI 12: 인터넷 (Internet & Công nghệ)
  12: [
    {
      id: 'r12_1',
      passageNumber: 1,
      type: 'Thông báo quy chế mạng',
      title:
        '기숙사 인터넷 사용 수칙 및 보안 공지 (Thông báo quy chế sử dụng internet và an ninh mạng ký túc xá)',
      source: 'Authored practice based on Lesson 12 vocabulary & grammar',
      koreanText: `[기숙사 사생 공지사항]\n기숙사 내 안정적인 네트워크 환경과 정보 보안을 위해 사생 여러분께 아래와 같이 협조를 요청함.\n1. 공용 컴퓨터실 이용 후 반드시 개인 계정 로그아웃할 것.\n2. 출처가 불분명한 스팸 메일이나 첨부파일은 바이러스 감염 위험이 있으므로 절대 열람하지 말 것.\n3. 과제물 인쇄 시 프린터 출력실을 이용하되, 용지 낭비를 줄이기 위해 모아찍기를 권장함.\n4. 기숙사비 납부 확인서는 홈페이지에서 직접 출력 가능함.\n5. 네트워크 정기 점검으로 인해 이번 주 일요일 새벽 2시부터 6시까지 인터넷 서비스가 일시 중단됨.\n사생 여러분의 많은 양해와 협조를 바람.`,
      vietnameseTranslation: `[Thông báo gửi sinh viên ký túc xá]\nNhằm bảo đảm môi trường mạng ổn định và an toàn thông tin trong ký túc xá, trân trọng yêu cầu sinh viên phối hợp như sau: 1. Sau khi dùng phòng máy tính chung bắt buộc phải đăng xuất tài khoản cá nhân. 2. Tuyệt đối không mở các thư rác hoặc tập tin đính kèm không rõ nguồn gốc do có nguy cơ lây nhiễm virus. 3. Khi in bài tập xin dùng phòng in ấn, khuyến khích in gộp trang để tiết kiệm giấy. 4. Giấy xác nhận nộp phí KTX có thể tự in trực tiếp trên trang chủ. 5. Do bảo trì định kỳ nên dịch vụ internet sẽ tạm ngừng từ 2h đến 6h sáng Chủ Nhật tuần này. Rất mong sinh viên thông cảm và phối hợp.`,
      keyVocabulary: [
        { kr: '협조를 요청함', vn: 'Yêu cầu phối hợp (đuôi danh hóa -함)' },
        { kr: '스팸 메일', vn: 'Thư rác quảng cáo, độc hại' },
        { kr: '출력하다', vn: 'In ấn ra giấy' },
        { kr: '일시 중단됨', vn: 'Bị tạm dừng tạm thời (đuôi danh hóa -됨)' },
      ],
      questions: [
        {
          id: 'rq_12_1_1',
          question:
            'Vì sao thông báo yêu cầu sinh viên tuyệt đối không mở các thư rác (스팸 메일)?',
          options: [
            'Vì sẽ làm tốn dung lượng hộp thư',
            'Vì có nguy cơ lây nhiễm virus độc hại cho hệ thống',
            'Vì ban quản lý không cho phép nhận thư từ bên ngoài',
            'Vì thư rác viết bằng tiếng nước ngoài',
          ],
          correctIndex: 1,
          evidence:
            '출처가 불분명한 스팸 메일이나 첨부파일은 바이러스 감염 위험이 있으므로 절대 열람하지 말 것.',
        },
        {
          id: 'rq_12_1_2',
          question: 'Dịch vụ internet ký túc xá sẽ tạm ngừng hoạt động vào thời gian nào?',
          options: [
            'Suốt cả ngày thứ Hai',
            'Từ 2h đến 6h sáng Chủ Nhật tuần này để bảo trì mạng định kỳ',
            'Vào giờ học buổi sáng mỗi ngày',
            'Không hề bị gián đoạn thời gian nào',
          ],
          correctIndex: 1,
          evidence: '이번 주 일요일 새벽 2시부터 6시까지 인터넷 서비스가 일시 중단됨.',
        },
      ],
    },
    {
      id: 'r12_2',
      passageNumber: 2,
      type: 'Tin nhắn liên lạc học tập',
      title: '과제 제출 안내 단체 메시지 (Tin nhắn nhóm hướng dẫn nộp bài tập lớn)',
      source: 'Authored practice based on Lesson 12 grammar',
      koreanText: `한국학과 3학년 학우 여러분, 과 대표 이영호입니다.\n교수님께서 이번 학기 팀 프로젝트 과제 제출에 대해 말씀하셨습니다.\n교수님께서 발표용 파워포인트(PPT) 파일을 이번 주 금요일 오후 5시까지 학과 홈페이지 게시판에 반드시 제출하라고 하셨어요. 마감 시간을 넘기면 감점된다고 하셨으니 늦지 않도록 주의해 주세요.\n그리고 자료를 정리하다가 질문이 있으면 조교님께 메일로 문의해 달라고 하셨습니다.\n우리 조원들은 내일 수업 끝나고 도서관 앞 카페에서 만나서 최종 마무리 회의를 하자고 했어요. 내일 4시에 잊지 말고 모여 주세요!`,
      vietnameseTranslation: `Gửi các bạn sinh viên năm 3 khoa Hàn Quốc học, mình là lớp trưởng Lee Young-ho. Giáo sư đã có lời dặn về việc nộp bài tập dự án nhóm kỳ này. Thầy bảo chúng ta phải nộp file thuyết trình PowerPoint (PPT) lên bảng tin website khoa trước 17h chiều thứ Sáu tuần này. Thầy bảo nếu quá hạn sẽ bị trừ điểm nên mọi người chú ý không nộp muộn nhé. Ngoài ra thầy dặn nếu có thắc mắc trong lúc tổng hợp tài liệu thì hãy gửi email hỏi trợ giảng. Nhóm của chúng mình cũng đã thống nhất rủ nhau sau giờ học ngày mai hẹn ở quán cà phê trước thư viện để họp tổng kết chốt lại. Ngày mai 4h chiều nhớ đến đông đủ nhé!`,
      keyVocabulary: [
        { kr: '제출하라고 하시다', vn: 'Bảo hãy nộp (tường thuật mệnh lệnh)' },
        {
          kr: '문의해 달라고 하시다',
          vn: 'Bảo hãy hỏi trợ giảng (tường thuật yêu cầu hướng về người khác)',
        },
        { kr: '회의를 하자고 하다', vn: 'Rủ cùng họp (tường thuật rủ rê)' },
        { kr: '마무리하다', vn: 'Hoàn tất, kết thúc trọn vẹn' },
      ],
      questions: [
        {
          id: 'rq_12_2_1',
          question: 'Giáo sư đã đưa ra yêu cầu thời hạn nộp bài tập PPT như thế nào?',
          options: [
            'Nộp trực tiếp tại văn phòng khoa vào sáng thứ Hai',
            'Nộp lên bảng tin website trước 17h chiều thứ Sáu tuần này',
            'In ra giấy nộp vào cuối kỳ thi',
            'Không giới hạn thời gian nộp bài',
          ],
          correctIndex: 1,
          evidence:
            '파워포인트(PPT) 파일을 이번 주 금요일 오후 5시까지 학과 홈페이지 게시판에 반드시 제출하라고 하셨어요.',
        },
        {
          id: 'rq_12_2_2',
          question: 'Lớp trưởng đã truyền đạt lời rủ rê của nhóm làm gì vào chiều mai?',
          options: [
            'Rủ nhau đi đá bóng ở sân vận động',
            'Rủ nhau gặp nhau lúc 4h chiều tại quán cà phê trước thư viện để họp hoàn tất bài tập',
            'Rủ nhau đến nhà thầy giáo ăn tối',
            'Rủ nhau nghỉ học buổi chiều',
          ],
          correctIndex: 1,
          evidence:
            '도서관 앞 카페에서 만나서 최종 마무리 회의를 하자고 했어요. 내일 4시에 모여 주세요!',
        },
      ],
    },
  ],
  // BÀI 13: 희망 (Ước mơ & Hy vọng)
  13: [
    {
      id: 'r13_1',
      passageNumber: 1,
      type: 'Tự sự truyền cảm hứng',
      title:
        '동시통역사의 꿈을 향해 걸어온 길 (Con đường bước tới ước mơ trở thành thông dịch viên)',
      source: 'Authored practice based on Lesson 13 vocabulary & grammar',
      koreanText: `저는 고등학교 시절부터 한국과 베트남을 잇는 가교가 되고 싶다는 희망을 품고 한국어를 공부해 왔습니다.\n처음에는 한국어 발음과 문법이 너무 생소해서 어려움을 겪었지만, 매일 아침 뉴스를 듣고 소리 내어 따라 읽는 훈련을 4년 동안 꾸준히 해 왔습니다.\n때로는 한계에 부딪혀 포기하고 싶을 때도 있었지만, 국제 회담장에서 양국 정상을 위해 통역하는 저의 미래 모습을 상상하며 힘을 냈습니다.\n앞으로 통번역 대학원에 진학하여 전문 실력을 한 단계 더 발전시켜 갈 것입니다. 제 노력이 결실을 맺어 뛰어난 전문 동시통역사가 되었으면 좋겠습니다. 그리고 다음 학기에는 꼭 장학금을 타야겠어요.`,
      vietnameseTranslation: `Từ thời học sinh cấp 3, tôi đã nuôi dưỡng ước mơ trở thành chiếc cầu nối gắn kết Việt Nam và Hàn Quốc và đã miệt mài học tiếng Hàn từ đó đến nay. Hồi đầu ngữ pháp và phát âm tiếng Hàn quá đỗi mới lạ khiến tôi gặp muôn vàn khó khăn, nhưng suốt 4 năm qua tôi đã kiên trì luyện nghe thời sự buổi sáng và đọc đuổi thành tiếng mỗi ngày. Đôi khi chạm tới giới hạn muốn bỏ cuộc, nhưng tôi lại có thêm nghị lực khi tưởng tượng về hình ảnh tương lai của chính mình đang ngồi dịch cabin cho lãnh đạo hai nước tại các hội nghị quốc tế. Thời gian tới tôi sẽ thi vào cao học biên phiên dịch để tiếp tục phát triển năng lực chuyên môn lên tầm cao mới. Ước gì những nỗ lực của tôi sẽ đơm hoa kết trái để trở thành một chuyên viên thông dịch viên cabin xuất sắc. Và kỳ tới nhất định tôi sẽ phải giành được học bổng.`,
      keyVocabulary: [
        { kr: '공부해 오다', vn: 'Đã và đang học suốt từ quá khứ đến nay' },
        { kr: '발전시켜 가다', vn: 'Tiếp tục phát triển hướng tới tương lai' },
        { kr: '동시통역사', vn: 'Chuyên viên thông dịch cabin song song' },
        { kr: '되었으면 좋겠다', vn: 'Ước gì / giá mà trở thành' },
        { kr: '타야겠다', vn: 'Nhất định sẽ phải giành được (ý chí)' },
      ],
      questions: [
        {
          id: 'rq_13_1_1',
          question: 'Phương pháp học tập mà tác giả đã kiên trì duy trì suốt 4 năm qua là gì?',
          options: [
            'Chỉ học ngữ pháp qua sách vở không bao giờ nói',
            'Nghe thời sự buổi sáng và luyện đọc to thành tiếng đều đặn mỗi ngày',
            'Thuê gia sư riêng dạy kèm cả ngày',
            'Chỉ xem phim hoạt hình không phụ đề',
          ],
          correctIndex: 1,
          evidence: '매일 아침 뉴스를 듣고 소리 내어 따라 읽는 훈련을 4년 동안 꾸준히 해 왔습니다.',
        },
        {
          id: 'rq_13_1_2',
          question: 'Ước mơ lớn nhất và kế hoạch tương lai của tác giả là gì?',
          options: [
            'Trở thành ca sĩ thần tượng nổi tiếng',
            'Thi vào cao học biên phiên dịch và trở thành chuyên viên thông dịch cabin quốc tế xuất sắc',
            'Mở một nhà hàng ẩm thực truyền thống',
            'Đi du lịch vòng quanh thế giới một mình',
          ],
          correctIndex: 1,
          evidence: '통번역 대학원에 진학하여... 뛰어난 전문 동시통역사가 되었으면 좋겠습니다.',
        },
      ],
    },
    {
      id: 'r13_2',
      passageNumber: 2,
      type: 'Nhân vật & Tấm gương',
      title:
        '시련을 딛고 희망을 전한 강영우 박사 이야기 (Tiến sĩ Kang Young-woo - Vượt qua bóng tối thắp sáng hy vọng)',
      source: 'Authored practice based on Lesson 13 culture note',
      koreanText: `중학교 시절 축구공에 눈을 맞아 시력을 완전히 잃은 소년이 있었습니다. 앞이 보이지 않는 절망 속에서도 그는 학업을 포기하지 않았습니다.\n그는 손가락 끝 감각으로 점자책을 읽으며 밤낮없이 노력해 왔습니다. 연세대학교를 졸업한 후 미국으로 유학을 떠나 시각장애인 최초로 교육학 박사 학위를 취득하였습니다.\n그 후 그는 미국 백악관 국가장애위원회 정책차관보로 임명되어 장애인들의 인권과 복지 향상을 위해 평생을 헌신했습니다.\n그의 삶은 불가능을 가능으로 바꾼 기적이었으며, 전 세계 수많은 청소년들에게 "장애는 걸림돌이 아니라 디딤돌이 될 수 있다"는 큰 희망과 교훈을 전해 주었습니다. 우리 사회에도 소외된 이웃을 배려하는 따뜻한 문화가 더욱 확산되었으면 좋겠습니다.`,
      vietnameseTranslation: `Hồi học cấp 2, có một cậu bé bị bóng đập trúng mắt và mất hoàn toàn thị lực. Trong nỗi tuyệt vọng của bóng tối mù lòa, cậu vẫn kiên quyết không từ bỏ con đường học tập. Cậu đã miệt mài đọc sách chữ nổi Braille bằng xúc giác đầu ngón tay ngày đêm suốt bao năm qua. Sau khi tốt nghiệp Đại học Yonsei, ông sang Mỹ du học và trở thành người khiếm thị đầu tiên đạt học vị Tiến sĩ Giáo dục học. Sau đó, ông được bổ nhiệm làm Phó trợ lý chính sách Ủy ban Người khuyết tật Quốc gia tại Nhà Trắng Hoa Kỳ, cống hiến trọn đời cho quyền lợi và phúc lợi của người khuyết tật. Cuộc đời ông là kỳ tích biến điều không thể thành có thể, truyền đi niềm hy vọng và bài học lớn lao cho giới trẻ: "Khuyết tật không phải là hòn đá ngáng đường, mà có thể là bệ phóng vươn lên". Ước gì xã hội chúng ta sẽ ngày càng lan tỏa văn hóa nhân ái quan tâm đến những người yếu thế.`,
      keyVocabulary: [
        { kr: '시력을 잃다', vn: 'Đánh mất thị lực, bị mù' },
        { kr: '점자책', vn: 'Sách chữ nổi Braille cho người khiếm thị' },
        { kr: '노력해 오다', vn: 'Đã và đang nỗ lực kiên trì từ quá khứ' },
        { kr: '백악관', vn: 'Nhà Trắng (cơ quan quyền lực Hoa Kỳ)' },
        { kr: '확산되었으면 좋겠다', vn: 'Ước gì được lan tỏa sâu rộng' },
      ],
      questions: [
        {
          id: 'rq_13_2_1',
          question: 'Tiến sĩ Kang Young-woo đã vượt qua nghịch cảnh mất thị lực bằng cách nào?',
          options: [
            'Chờ đợi sự tài trợ hoàn toàn từ người khác',
            'Kiên trì tự học ngày đêm bằng sách chữ nổi và vươn lên nhận bằng tiến sĩ tại Mỹ',
            'Từ bỏ việc học chuyển sang kinh doanh tự thân',
            'Không cần đọc sách mà chỉ nghe đài phát thanh',
          ],
          correctIndex: 1,
          evidence:
            '점자책을 읽으며 밤낮없이 노력해 왔습니다... 시각장애인 최초로 교육학 박사 학위를 취득하였습니다.',
        },
        {
          id: 'rq_13_2_2',
          question:
            'Thông điệp sâu sắc nhất mà cuộc đời Tiến sĩ Kang Young-woo gửi tới mọi người là gì?',
          options: [
            'Chỉ người giàu mới có thể thành công',
            'Nghịch cảnh và khuyết tật không phải là vật cản mà có thể trở thành động lực vươn lên nếu có ý chí',
            'Nên tránh tham gia các hoạt động thể thao nguy hiểm',
            'Phải đi du học Mỹ thì mới có sự nghiệp',
          ],
          correctIndex: 1,
          evidence:
            '"장애는 걸림돌이 아니라 디딤돌이 될 수 있다"는 큰 희망과 교훈을 전해 주었습니다.',
        },
      ],
    },
  ],
  // BÀI 14: 영화와 드라마 (Phim ảnh & Truyền hình)
  14: [
    {
      id: 'r14_1',
      passageNumber: 1,
      type: 'Đánh giá phim ảnh & Cảm tưởng',
      title:
        '천만 관객 영화 "명량" 관람 후기 (Cảm nhận bộ phim điện ảnh mười triệu vé "Đại thủy chiến Roaring Currents")',
      source: 'Authored practice based on Lesson 14 vocabulary & grammar',
      koreanText: `지난 주말에 친구와 함께 한국 역사 영화 '명량'을 보고 왔습니다.\n이 영화는 조선 시대 이순신 장군이 불과 12척의 배로 133척에 달하는 왜군 함대를 물리친 위대한 명량대첩을 다룬 사극 영화입니다.\n직접 극장에서 관람해 보니 해상 전투 장면의 컴퓨터 그래픽과 특수효과가 정말 실감나던데요. 거친 물살과 화포 공격 장면을 볼 때는 손에 땀을 쥐게 할 만큼 긴장감이 넘쳤습니다.\n주연 배우의 카리스마 넘치는 연기력도 매우 인상적이었습니다. 제가 한국 역사 영화를 즐겨 보는 이유는 역사의 감동과 교훈을 생생하게 느낄 수 있거든요.\n역사물을 좋아하시는 분이라면 이 영화를 꼭 한번 보시기를 추천합니다.`,
      vietnameseTranslation: `Cuối tuần vừa rồi tôi đã cùng bạn đi xem bộ phim điện ảnh lịch sử Hàn Quốc 'Roaring Currents' (Đại thủy chiến Myeongnyang). Bộ phim này là tác phẩm điện ảnh cổ trang dã sử tái hiện trận đại thủy chiến oanh liệt thời Chosun, khi danh tướng Yi Sun-sin chỉ với vỏn vẹn 12 chiến thuyền đã đánh tan hạm đội 133 tàu giặc ngoại xâm. Trực tiếp xem ở rạp chiếu tôi thấy các cảnh giao chiến trên biển bằng đồ họa kỹ xảo máy tính thực sự sống động vô cùng luôn đấy. Nhìn những cảnh sóng nước cuồn cuộn và đại bác nã đạn, cảm giác gay cấn đến mức toát cả mồ hôi tay. Diễn xuất đầy khí chất cuốn hút của nam diễn viên chính cũng để lại ấn tượng vô cùng sâu sắc. Lý do tôi say mê xem phim lịch sử Hàn Quốc là vì qua đó tôi có thể cảm nhận sống động những xúc động và bài học quý giá từ lịch sử mà. Ai mê phim dã sử thì tôi rất khuyên nên xem tác phẩm này.`,
      keyVocabulary: [
        { kr: '사극 영화', vn: 'Phim điện ảnh cổ trang dã sử' },
        { kr: '실감나던데요', vn: 'Tôi thấy sống động thực sự cơ mà (hồi tưởng -던데요)' },
        { kr: '연기력', vn: 'Năng lực diễn xuất đỉnh cao' },
        { kr: '인상적이다', vn: 'Ấn tượng sâu sắc khó quên' },
        { kr: '느낄 수 있거든요', vn: 'Bởi vì có thể cảm nhận được mà (-거든요)' },
      ],
      questions: [
        {
          id: 'rq_14_1_1',
          question:
            'Người viết hồi tưởng cảm nhận thế nào về các cảnh giao chiến trên biển trong phim?',
          options: [
            'Kỹ xảo còn vụng về và nhàm chán',
            'Đồ họa kỹ xảo vô cùng sống động, chân thực và gay cấn toát mồ hôi tay',
            'Quá dài dòng và khiến người xem buồn ngủ',
            'Âm thanh quá nhỏ không nghe rõ tiếng đại bác',
          ],
          correctIndex: 1,
          evidence:
            '해상 전투 장면의 컴퓨터 그래픽과 특수효과가 정말 실감나던데요. 손에 땀을 쥐게 할 만큼 긴장감이 넘쳤습니다.',
        },
        {
          id: 'rq_14_1_2',
          question:
            'Lý do chính khiến người viết yêu thích và say mê theo dõi phim lịch sử Hàn Quốc là gì?',
          options: [
            'Vì vé xem phim cổ trang rẻ hơn phim hành động',
            'Vì giúp người xem cảm nhận sống động những xúc động và bài học lịch sử hào hùng',
            'Vì thích ngắm trang phục thời hiện đại',
            'Vì phim cổ trang không có cảnh chiến đấu',
          ],
          correctIndex: 1,
          evidence:
            '제가 한국 역사 영화를 즐겨 보는 이유는 역사의 감동과 교훈을 생생하게 느낄 수 있거든요.',
        },
      ],
    },
    {
      id: 'r14_2',
      passageNumber: 2,
      type: 'Văn hóa đại chúng',
      title: '한류 드라마의 세계화와 문화 관광 (Sức lan tỏa toàn cầu của phim truyền hình Hallyu)',
      source: 'Authored practice based on Lesson 14 culture note',
      koreanText: `2000년대 초반 방영된 '겨울연가'와 '대장금'은 아시아 전역에 폭발적인 한류(K-Wave) 열풍을 일으켰습니다.\n드라마의 인기는 단순한 방송 시청에 그치지 않고 한국 문화 전반에 대한 관심으로 이어졌습니다. 드라마 촬영지였던 남이섬은 매년 수백만 명의 외국인 관광객이 찾는 대표적인 명소가 되었습니다.\n또한 '대장금'을 통해 한국의 전통 궁중 음식과 한복의 아름다움이 전 세계에 널리 알려졌습니다.\n최근에는 온라인 동영상 서비스(OTT)를 통해 전 세계 시청자들이 한국 드라마를 동시에 즐겨 보고 있습니다. 탄탄한 스토리와 배우들의 뛰어난 연기력, 그리고 매력적인 OST가 어우러져 세계인의 마음을 사로잡고 있습니다.`,
      vietnameseTranslation: `Vào đầu những năm 2000, các bộ phim truyền hình như 'Bản tình ca mùa đông' và 'Nàng Dae Jang Geum' đã tạo nên làn sóng Hallyu bùng nổ khắp châu Á. Sức hút của các tác phẩm này không dừng lại ở việc xem truyền hình đơn thuần mà đã kéo theo sự quan tâm sâu sắc tới toàn bộ văn hóa Hàn Quốc. Đảo Nami - phim trường của bộ phim đã trở thành điểm đến tiêu biểu đón hàng triệu lượt khách quốc tế mỗi năm. Ngoài ra qua 'Nàng Dae Jang Geum', nét đẹp của ẩm thực hoàng cung và tà áo Hanbok truyền thống đã được bạn bè năm châu biết đến rộng rãi. Gần đây qua các nền tảng trực tuyến OTT, khán giả toàn cầu có thể cùng thưởng thức phim Hàn song song. Cốt truyện chặt chẽ, diễn xuất xuất sắc của diễn viên và những bản nhạc phim OST mê đắm đã cùng nhau chinh phục trái tim khán giả toàn thế giới.`,
      keyVocabulary: [
        { kr: '한류 열풍', vn: 'Làn sóng văn hóa Hàn Quốc bùng nổ' },
        { kr: '촬영지', vn: 'Trường quay, địa điểm quay phim' },
        { kr: '궁중 음식', vn: 'Ẩm thực cung đình thời xưa' },
        { kr: '연기력', vn: 'Năng lực diễn xuất tài hoa' },
        { kr: '사로잡다', vn: 'Mê hoặc, chinh phục lòng người' },
      ],
      questions: [
        {
          id: 'rq_14_2_1',
          question:
            'Thành công của các bộ phim truyền hình kinh điển như "Bản tình ca mùa đông" đã mang lại hiệu ứng gì?',
          options: [
            'Khiến khán giả không còn thích xem phim nữa',
            'Thúc đẩy du lịch bùng nổ và biến các địa điểm quay phim như đảo Nami thành thắng cảnh nổi tiếng',
            'Làm giảm lượng khách du lịch đến Hàn Quốc',
            'Chỉ có người cao tuổi mới biết đến văn hóa Hàn Quốc',
          ],
          correctIndex: 1,
          evidence:
            '드라마 촬영지였던 남이섬은 매년 수백만 명의 외국인 관광객이 찾는 대표적인 명소가 되었습니다.',
        },
        {
          id: 'rq_14_2_2',
          question:
            'Những yếu tố nào giúp các bộ phim truyền hình Hàn Quốc ngày nay chinh phục khán giả toàn cầu?',
          options: [
            'Chi phí sản xuất phim hoàn toàn miễn phí',
            'Cốt truyện hấp dẫn chặt chẽ, diễn xuất xuất sắc của diễn viên và những bản nhạc phim OST lôi cuốn',
            'Phim không cần dịch phụ đề',
            'Thời lượng mỗi tập phim cực kỳ ngắn dưới 5 phút',
          ],
          correctIndex: 1,
          evidence:
            '탄탄한 스토리와 배우들의 뛰어난 연기력, 그리고 매력적인 OST가 어우러져 세계인의 마음을 사로잡고 있습니다.',
        },
      ],
    },
  ],
  // BÀI 15: 예절과 규칙 (Lễ nghi & Quy tắc ứng xử)
  15: [
    {
      id: 'r15_1',
      passageNumber: 1,
      type: 'Cẩm nang văn hóa đời sống',
      title:
        '한국 생활에서 꼭 지켜야 할 기본 공공 예절 (Những quy tắc lịch thiệp công cộng cơ bản tại Hàn Quốc)',
      source: 'Authored practice based on Lesson 15 vocabulary & grammar',
      koreanText: `외국인이 한국에서 생활할 때 원만한 인간관계를 유지하고 불필요한 마찰을 피하기 위해서는 한국의 기본 예절과 공공 규칙을 준수하지 않으면 안 됩니다.\n첫째, 대중교통을 이용할 때는 휴대폰을 진동 모드로 바꾸고 통화는 작게 해야 합니다. 특히 지하철의 경로석은 어르신이나 임산부를 위한 좌석이므로 자리가 비어 있더라도 비워 두는 것이 바람직합니다.\n둘째, 쓰레기를 배출할 때는 반드시 규격 종량제 봉투에 담아 지정된 날짜와 장소에 버리지 않으면 안 됩니다. 재활용품은 정해진 기준대로 분리배출해야 과태료를 물지 않습니다.\n셋째, 실내나 어른 앞에서는 모자를 벗는 것이 예의이며, 타인의 방을 방문할 때는 미리 전화로 허락을 구해야 합니다.\n이러한 공공 예절을 지키는 것은 타인을 배려하는 성숙한 사회 구성원의 기본 덕목입니다.`,
      vietnameseTranslation: `Khi người nước ngoài sinh sống tại Hàn Quốc, để duy trì các mối quan hệ êm đẹp và tránh những va chạm không đáng có thì bắt buộc phải tuân thủ nghiêm túc các quy tắc công cộng và phép lịch thiệp căn bản. Thứ nhất, khi đi phương tiện công cộng, phải chuyển điện thoại sang chế độ rung và nói chuyện khẽ khàng. Đặc biệt ghế ưu tiên (경로석) trên tàu điện ngầm là vị trí dành cho người cao tuổi và phụ nữ mang thai, nên dù ghế trống cũng nên để dành. Thứ hai, khi vứt rác, bắt buộc phải bỏ vào túi rác tiêu chuẩn (종량제 봉투) và bỏ đúng ngày giờ, vị trí quy định. Rác tái chế phải phân loại đúng theo quy chuẩn thì mới không bị phạt tiền. Thứ ba, khi vào trong phòng hoặc đứng trước mặt bề trên thì cởi mũ là phép lịch sự, và khi đến thăm nhà người khác cần gọi điện xin phép trước. Tuân thủ những quy tắc này là phẩm chất cơ bản của một công dân văn minh biết nghĩ cho cộng đồng.`,
      keyVocabulary: [
        { kr: '준수하지 않으면 안 되다', vn: 'Bắt buộc phải tuân thủ nghiêm ngặt' },
        { kr: '진동 모드', vn: 'Chế độ rung điện thoại' },
        { kr: '경로석', vn: 'Ghế ưu tiên người già, người khuyết tật' },
        { kr: '종량제 봉투', vn: 'Túi rác tiêu chuẩn có đóng phí môi trường' },
        { kr: '기준대로', vn: 'Theo đúng như quy chuẩn' },
      ],
      questions: [
        {
          id: 'rq_15_1_1',
          question:
            'Quy định bắt buộc khi vứt rác sinh hoạt tại Hàn Quốc để không bị phạt tiền là gì?',
          options: [
            'Cho tất cả các loại rác vào một túi nilon bất kỳ rồi vứt ra vỉa hè',
            'Bắt buộc dùng túi rác tiêu chuẩn (종량제 봉투) và phân loại rác tái chế đúng theo quy định',
            'Chỉ được vứt rác vào ban ngày',
            'Đốt rác ngay trong sân nhà',
          ],
          correctIndex: 1,
          evidence:
            '반드시 규격 종량제 봉투에 담아 버리지 않으면 안 됩니다. 재활용품은 정해진 기준대로 분리배출해야 과태료를 물지 않습니다.',
        },
        {
          id: 'rq_15_1_2',
          question:
            'Phép lịch sự nào sau đây được nhắc đến khi ở trong phòng kín hoặc đứng trước mặt người lớn tuổi?',
          options: [
            'Phải nói thật to để mọi người cùng nghe',
            'Cởi mũ nón ra để bày tỏ sự tôn trọng lịch thiệp',
            'Luôn luôn mang giày dép trong nhà',
            'Tự ý mở tủ đồ của người khác',
          ],
          correctIndex: 1,
          evidence: '실내나 어른 앞에서는 모자를 벗는 것이 예의이며',
        },
      ],
    },
    {
      id: 'r15_2',
      passageNumber: 2,
      type: 'Nghi thức bàn ăn & Giao tiếp',
      title:
        '한국의 전통 식사 예절과 악수 매너 (Văn hóa bàn ăn truyền thống và quy tắc bắt tay ở Hàn Quốc)',
      source: 'Authored practice based on Lesson 15 vocabulary & culture note',
      koreanText: `한국의 식사 문화는 윗사람에 대한 공경과 예의를 매우 중요하게 여깁니다.\n식사 자리에 어른과 함께 앉았을 때는 어른이 먼저 수저를 드신 후에 식사를 시작해야 합니다. 숟가락과 젓가락을 한 손에 동시에 쥐지 않으며, 음식을 씹을 때는 소리를 내지 않는 것이 기본입니다.\n특히 베트남과 달리 한국에서는 밥그릇이나 국그릇을 손에 들고 먹으면 거지의 행동이라 여겨 결례가 되므로, 반드시 그릇을 식탁에 내려놓고 숟가락으로 밥을 떠먹어야 합니다.\n또한 처음 만나 인사를 나눌 때 손을 내미는 악수는 윗사람이나 나이가 많은 사람이 아랫사람에게 먼저 청하는 것이 원칙입니다. 이때 상대방의 손을 살며시 쥐며 고개를 가볍게 숙여 인사하는 것이 올바른 매너입니다. 마침 저도 한국 회사에 입사하려던 참이었는데 이러한 비즈니스 매너가 큰 도움이 되었습니다.`,
      vietnameseTranslation: `Văn hóa ẩm thực Hàn Quốc rất coi trọng sự tôn kính và phép lịch thiệp với bậc trưởng bối. Khi ngồi cùng bàn ăn với người lớn, phải đợi người lớn cầm thìa đũa trước rồi mới bắt đầu dùng bữa. Không cầm cả thìa và đũa cùng một lúc trên một tay, khi nhai thức ăn không phát ra tiếng chóp chép. Đặc biệt khác với Việt Nam, ở Hàn Quốc việc bưng bát cơm hay bát canh lên tay bị xem như hành vi của kẻ ăn xin và là sự thất lễ lớn, vì vậy nhất định phải để bát trên bàn và dùng thìa xúc cơm. Ngoài ra khi gặp gỡ lần đầu, việc bắt tay theo nguyên tắc là người lớn tuổi hoặc cấp trên sẽ chủ động đưa tay ra trước. Khi đó, nắm nhẹ tay đối phương và hơi cúi đầu chào là phong thái chuẩn mực. Đúng lúc tôi cũng đang định vào làm việc tại công ty Hàn Quốc nên những quy tắc ứng xử thương mại này đã giúp ích cho tôi rất nhiều.`,
      keyVocabulary: [
        { kr: '수저를 들다', vn: 'Cầm thìa đũa bắt đầu ăn' },
        { kr: '그릇을 들고 먹지 않다', vn: 'Không bưng bát lên tay ăn (tối kỵ tại Hàn)' },
        { kr: '악수를 청하다', vn: 'Chủ động đưa tay ra ngỏ ý bắt tay' },
        { kr: '살며시 쥐다', vn: 'Nắm nhẹ nhàng ấm áp vừa tay' },
        { kr: '입사하려던 참이다', vn: 'Vừa đúng lúc đang định vào làm việc ở công ty' },
      ],
      questions: [
        {
          id: 'rq_15_2_1',
          question:
            'Điểm khác biệt quan trọng trong văn hóa bàn ăn giữa Hàn Quốc và Việt Nam được nêu trong bài là gì?',
          options: [
            'Ở Hàn Quốc không được dùng thìa',
            'Ở Hàn Quốc không được bưng bát cơm lên tay ăn, phải đặt bát trên bàn và dùng thìa xúc',
            'Ở Hàn Quốc phải ăn hết thức ăn trong 5 phút',
            'Ở Hàn Quốc người nhỏ tuổi phải ăn trước',
          ],
          correctIndex: 1,
          evidence:
            '한국에서는 밥그릇이나 국그릇을 손에 들고 먹으면 결례가 되므로, 반드시 그릇을 식탁에 내려놓고 숟가락으로 밥을 떠먹어야 합니다.',
        },
        {
          id: 'rq_15_2_2',
          question: 'Theo nghi thức bắt tay chuẩn mực ở Hàn Quốc, quy tắc đúng là gì?',
          options: [
            'Người nhỏ tuổi phải nắm thật chặt tay người lớn kéo lại',
            'Người lớn tuổi hoặc cấp trên chủ động đưa tay ra trước, người đối diện nắm nhẹ và hơi cúi đầu chào',
            'Hai người cùng cúi gập người 90 độ và không chạm tay vào nhau',
            'Chỉ phụ nữ mới được bắt tay',
          ],
          correctIndex: 1,
          evidence:
            '악수는 윗사람이나 나이가 많은 사람이 아랫사람에게 먼저 청하는 것이 원칙입니다. 상대방의 손을 살며시 쥐며 고개를 가볍게 숙여 인사하는 것이 올바른 매너입니다.',
        },
      ],
    },
  ],
};

export const READING_BANK = LegacyReadingDatabaseSchema.parse(raw);
