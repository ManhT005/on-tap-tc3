import { LessonContentSchema } from '../schemas';
import { pack } from './pack';

const raw = {
  title: 'Bài 14: 영화와 드라마 (Điện ảnh & Truyền hình)',
  koreanTitle: '영화와 드라마',
  objectives: 'Đánh giá tác phẩm điện ảnh, chia sẻ cảm nhận cá nhân và tìm hiểu văn hóa Hallyu.',
  vocabulary: [
    pack('기본', '기본 어휘 (Sản xuất, Rạp chiếu & Đội ngũ diễn viên)', [
      ['주연', 'Vai nam nữ diễn viên chính trong phim', '영화의 흥행을 이끄는 주연'],
      ['주연 배우', 'Diễn viên đảm nhận vai nhân vật chính', '주연 배우의 뛰어난 내면 연기'],
      ['조연', 'Vai phụ làm nền đặc sắc cho phim', '주연 못지않게 빛나는 감초 조연'],
      ['조연 배우', 'Diễn viên đóng các vai phụ trong phim', '명품 조연 배우들의 열연'],
      ['감독 (영화감독)', 'Đạo diễn điện ảnh người chỉ huy bấm máy', '칸 영화제 수상 봉준호 감독'],
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
      ['VIP 시사회', 'Buổi công chiếu dành cho khách quý sao', '동료 배우들이 대거 참석한 시사회'],
      ['매진되다', 'Bán hết sạch vé không còn chỗ trống', '주말 프라임 타임 좌석이 전석 매진되다'],
      ['촬영하다', 'Quay phim ghi hình các phân cảnh', '아름다운 제주도 로케이션 촬영'],
      ['촬영지', 'Địa điểm trường quay đóng phim thực tế', '드라마 촬영지로 유명해진 관광지'],
      ['출연하다', 'Xuất hiện diễn xuất trong tác phẩm', '인기 아이돌 가수가 영화에 특별 출연하다'],
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
      ['심야 영화', 'Suất chiếu muộn lúc nửa đêm thanh vắng', '금요일 밤 친구들과 심야 영화 보기'],
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
      ['액션 영화', 'Phim hành động võ thuật rượt đuổi nghẹt thở', '화려한 무술과 폭파 액션 영화'],
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
      ['해리포터', 'Harry Potter thế giới phù thủy kỳ ảo', '세계적인 베스트셀러 원작 판타지 영화'],
      ['등급', 'Đẳng cấp, cấp bậc phân hạng', '영상물 등급 위원회의 엄격한 심의'],
      ['작품', 'Tác phẩm nghệ thuật điện ảnh', '완성도가 매우 높은 훌륭한 예술 작품'],
      ['배경', 'Bối cảnh lịch sử thời đại xã hội', '1980년대를 시대적 배경으로 한 영화'],
      ['제한하다', 'Hạn chế giới hạn đối tượng xem', '미성년자 관람을 엄격히 제한하다'],
      ['탤런트', 'Diễn viên truyền hình kịch nghệ', '인기 탤런트들이 대거 출연하는 주말극'],
      ['괴물', 'Phim điện ảnh Quái vật sông Hàn', '봉준호 감독의 2006년 천만 관객 영화'],
      ['인기를 끌다', 'Gặt hái danh tiếng vang dội rầm rộ', '방영 첫 회부터 폭발적인 인기를 끌다'],
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
};

export const lesson14 = LessonContentSchema.parse(raw);
