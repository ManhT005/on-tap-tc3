import { LessonContentSchema } from '../schemas';
import { pack } from './pack';

const raw = {
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
      ['예절 바르다', 'Lễ phép ngoan ngoãn có giáo dục đàng hoàng', '인사를 잘하는 예절 바른 청년'],
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
      ['예의가 없다', 'Vô phép xấc xược mất dạy thiếu giáo dục', '남을 무시하고 예의가 전혀 없다'],
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
      ['분리수거', 'Phân loại rác tái chế rác hữu cơ vô cơ', '캔, 플라스틱, 유리병 분리수거 철저'],
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
      ['낙서 금지', 'Cấm vẽ bậy viết bậy bôi bẩn lên tường', '문화재와 공공시설 낙서 금지 표지판'],
      ['훼손 금지', 'Cấm phá hoại làm hư hại tài sản công', '공공 기물 훼손 금지 경고문'],
      ['금연', 'Cấm hút thuốc lá tuyệt đối ở nơi công cộng', '금연 구역에서 담배를 피우면 벌금형'],
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
      ['허락을 구하다', 'Xin phép trước khi làm việc gì đó', '친구 집 방문 전 미리 허락을 구하다'],
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
      ['안내 데스크', 'Bàn lễ tân chỉ dẫn hướng dẫn khách vào', '1층 안내 데스크에서 방문증 발급'],
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
      ['공연장 입장 예절', 'Phép tắc khi vào nhà hát xem kịch', '공연 시작 후에는 입장 제한 준수'],
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
};

export const lesson15 = LessonContentSchema.parse(raw);
