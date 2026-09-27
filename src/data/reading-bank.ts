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
};

export const READING_BANK = LegacyReadingDatabaseSchema.parse(raw);
