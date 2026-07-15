const STORAGE_KEY = 'vue3-board-items'

// 허용된 카테고리 정의
const ALLOWED_CATEGORIES = ['관광', '맛집', '자유']

// 대전 커뮤니티 맞춤형 풍성한 임시 데이터 (카테고리별 10개, 총 30개)
const DEFAULT_BOARDS = [
  // ==================== [관광 카테고리 10개] ====================
  {
    id: "init-t1",
    category: "관광",
    title: "대전의 허파, 장태산 자연휴양림 메타세쿼이아 숲길 🌲",
    nickname: "꿈돌이러버",
    content: `대전 서구에 있는 장태산 자연휴양림에 다녀왔습니다!
사계절 내내 예쁘지만 특히 초여름과 가을에 정말 이국적인 풍경을 자랑하는 곳이에요.

스카이웨이를 따라 걷다 보면 메타세쿼이아 나무 꼭대기 눈높이에서 산책하는 아주 독특한 경험을 할 수 있어요.
전망대까지 슬슬 올라가시면 대전의 아름다운 자연경관이 한눈에 들어옵니다. 

주차장도 무료고 입장료도 없어서 주말에 드라이브 코스로 강력 추천드려요!`,
    password: "1234",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 45,
    views: 312
  },
  {
    id: "init-t2",
    category: "관광",
    title: "대전 엑스포 과학공원 한빛탑 음악분수 명당 꿀팁! ⛲",
    nickname: "유성온천수",
    content: `대전 밤하늘을 수놓는 한빛탑 물빛광장 음악분수 시간 맞춰 다녀왔습니다.

요즘 저녁 날씨가 선선해서 그런지 돗자리 펴고 피크닉 즐기시는 분들이 정말 많더라고요.
한빛탑 바로 앞 계단 자리가 분수를 정면에서 보기에 가장 명당입니다!

매 정시마다 분수 쇼가 진행되고 음악과 화려한 조명이 어우러져서 아주 로맨틱해요.
대전의 밤을 제대로 즐기고 싶으시다면 엑스포 과학공원으로 오세요~`,
    password: "1234",
    createdAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 38,
    views: 289
  },
  {
    id: "init-t3",
    category: "관광",
    title: "한밭수목원 동원 vs 서원 비교! 데이트 코스 추천 🌺",
    nickname: "갑천라이더",
    content: `대전의 자랑 한밭수목원 꿀팁 방출합니다.

- 동원: 장미원, 암석원, 호수와 정자가 있어서 아기자기하고 사진 찍기 좋습니다. 열대식물원도 여기 있어요!
- 서원: 야생화원과 울창한 숲길 위주라 조용히 사색하며 걷기 좋습니다. 힐링이 필요하다면 서원을 추천해요.

개인적으로 낮에는 서원에서 피크닉하고, 해질녘엔 동원 호수 한 바퀴 도는 코스가 정석인 것 같습니다. 엑스포 시민광장에서 자전거 빌려 타는 것도 잊지 마세요!`,
    password: "1234",
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 52,
    views: 420
  },
  {
    id: "init-t4",
    category: "관광",
    title: "가을 드라이브 종결지, 대청호 오백리길 4구간 (명상정원) 🍂",
    nickname: "대청호풍경",
    content: `슬픈연가 촬영지로도 유명한 대청호 명상정원에 다녀왔습니다.
물이 잔잔하게 차오른 호수와 물속에 반쯤 잠긴 나무들이 마치 그림 같아요.

산책로가 데크길로 아주 잘 닦여 있어서 남녀노소 걷기 편합니다.
근처에 예쁜 레이크뷰 카페들도 많아서 주말 하루 힐링 드라이브 코스로 이만한 곳이 없네요.
주말 오후에는 주차가 조금 혼잡하니 오전 시간대 방문을 추천합니다!`,
    password: "1234",
    createdAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 29,
    views: 201
  },
  {
    id: "init-t5",
    category: "관광",
    title: "아이들과 가기 좋은 국립중앙과학관 알짜배기 관람 팁 🚀",
    nickname: "대덕연구단지민",
    content: `대덕연구단지 중심에 있는 국립중앙과학관 후기입니다.
규모가 어마어마하게 커서 하루 만에 다 보기 힘들 정도예요.

- 과학기술관: 기초과학 원리를 직접 체험할 수 있어 초등학생 이상에게 강추!
- 자연사관: 거대한 공룡 뼈 모형이 있어 미취학 아동들이 정말 좋아합니다.
- 창의나래관, 천체관: 여기는 사전 예약 필수입니다! 미리 홈페이지에서 예약하고 가세요.

주차 공간 널널하고 쉼터도 잘 되어 있어서 주말 가족 나들이로 가성비 최고의 공간입니다.`,
    password: "1234",
    createdAt: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 31,
    views: 245
  },
  {
    id: "init-t6",
    category: "관광",
    title: "대전 도심 속 사찰, 수통골 광수사 배롱나무 출사 다녀왔습니다 📸",
    nickname: "렌즈속세상",
    content: `학하동 수통골 입구 쪽에 위치한 광수사에 다녀왔습니다.
여름철이 되면 붉게 물드는 배롱나무 꽃이 사찰의 기와지붕과 어우러져 장관을 이룹니다.

조용히 경내를 거닐며 들리는 풍경 소리에 마음이 편안해지더라고요.
출사 마치고 수통골 계곡 따라 가벼운 등산이나 산책을 즐긴 뒤, 오리수육 맛집들 들러서 식사하면 완벽한 하루 코스 완성입니다.`,
    password: "1234",
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 22,
    views: 167
  },
  {
    id: "init-t7",
    category: "관광",
    title: "유성온천공원 족욕체험장 솔직 후기! 피로가 싹 가시네요 ♨️",
    nickname: "따끈따끈",
    content: `유성온천역 근처에 있는 노천 족욕체험장에 다녀왔습니다.
시민 누구나 무료로 이용할 수 있는 곳인데 관리가 정말 깨끗하게 잘 되고 있더라고요.

뜨끈한 온천수에 발을 담그고 도란도란 이야기 나누다 보면 온몸의 피로가 사르르 녹아내립니다.
발을 닦을 수 있는 에어건과 수건 자판기도 준비되어 있어 빈손으로 가도 문제없어요.
추운 날이나 비 오는 날 가시면 노천탕 감성을 제대로 느끼실 수 있습니다!`,
    password: "1234",
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 27,
    views: 198
  },
  {
    id: "init-t8",
    category: "관광",
    title: "대전 미술 투어: 이응노미술관 & 대전시립미술관 코스 추천 🎨",
    nickname: "문화생활러",
    content: `문화예술단지 내에 나란히 붙어 있는 이응노미술관과 시립미술관에 다녀왔습니다.

특히 이응노미술관은 건물 자체의 건축미가 너무 뛰어나서 걷는 것만으로도 힐링이 됩니다. 백색의 콘크리트와 자연 채광이 조화를 이루는 예술적인 공간이에요.
바로 옆 시립미술관에서 대형 기획전까지 묶어서 관람하시면 훌륭한 실내 데이트 코스가 됩니다.

전시 관람 후 둔산대공원 잔디밭을 산책하는 여유도 만끽해 보세요!`,
    password: "1234",
    createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 33,
    views: 212
  },
  {
    id: "init-t9",
    category: "관광",
    title: "야경 맛집 대전 식장산 전망대 초보 운전 가이드 🚗✨",
    nickname: "보문산달빛",
    content: `대전에서 가장 아름다운 도시 야경을 볼 수 있는 식장산 해돋이 전망대입니다!

기와로 멋지게 지어진 2층 누각 전망대에서 바라보는 대전 시내 불빛과 멀리 반짝이는 엑스포 다리가 정말 아름다워요.

다만, 올라가는 도로가 1차선 꼬불길이라 초보 운전자분들은 밤에 긴장되실 수 있습니다.
길 중간중간 대피 공간이 있으니 양보하면서 천천히 서행하시면 충분히 올라갈 수 있어요! 날씨 맑은 날 밤에 꼭 가보세요.`,
    password: "1234",
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 40,
    views: 310
  },
  {
    id: "init-t10",
    category: "관광",
    title: "아이들과 물놀이하기 좋은 계족산 황토길 맨발 걷기 체험 👣",
    nickname: "자연인77",
    content: `장동삼림욕장 내에 위치한 계족산 황토길에 다녀왔습니다.
부드럽고 시원한 붉은 황토를 맨발로 밟으며 올라가는데 처음에는 낯설었지만 갈수록 너무 상쾌하더라고요!

총 14.5km 코스인데 다 돌지 않고 중간 쉼터까지만 가도 충분히 힐링 됩니다.
중간중간 발 씻는 곳이 잘 마련되어 있으니 수건 한 장만 챙겨서 가볍게 다녀오세요.
가족들과 주말에 이색 웰빙 체험으로 적극 추천합니다!`,
    password: "1234",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 35,
    views: 254
  },

  // ==================== [맛집 카테고리 10개] ====================
  {
    id: "init-f1",
    category: "맛집",
    title: "대전인들의 소울푸드, 광천식당 오징어두루치기 영접 후기 🌶️",
    nickname: "칼국수빌런",
    content: `대전하면 역시 두루치기와 칼국수 아니겠습니까?
선화동 백종원의 3대천왕에도 나왔던 '광천식당'에 다녀왔습니다.

오징어두루치기를 주문했는데, 진짜 눈물 쏙 빠지게 맵고 중독성 넘치는 양념 맛이 일품입니다.
여기에 면사리 무조건 추가해서 양념에 비벼 드셔야 하는 것 아시죠?
같이 나오는 멸치 육수 국물과 곁들이면 천국이 따로 없습니다.

매운 것 잘 못 드시는 분들은 양념을 조금 덜 맵게 해달라고 하시는 게 팁이에요!`,
    password: "1234",
    createdAt: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 49,
    views: 388
  },
  {
    id: "init-f2",
    category: "맛집",
    title: "빵돌이들의 성지 성심당 본점, 추천 빵 정리해 드림 🍞",
    nickname: "밀가루요정",
    content: `대전 시민이자 성심당 단골이 추천하는 베스트 빵 리스트 공유합니다.

1. 튀김소보로 & 튀소구마: 오리지널의 품격, 당일 먹으면 바삭함 끝판왕
2. 보문산메아리: 결대로 찢어 먹는 촉촉하고 달달한 몽블랑 페스츄리 (커피랑 찰떡)
3. 명란바게트: 짭조름하면서 고소한 맛이 일품인 겉바속촉 바게트
4. 토요빵: 겉은 소보로, 속은 타피오카 쫀득함이 매력적인 숨은 강자

본점은 주말에 웨이팅이 기니까 대전역점이나 롯데백화점 대전점, DCC점 이용하시는 것도 좋은 팁입니다!`,
    password: "1234",
    createdAt: new Date(Date.now() - 27 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 64,
    views: 520
  },
  {
    id: "init-f3",
    category: "맛집",
    title: "대흥동 초가집: 비 오는 날 막걸리에 두부김치, 감자전 끝판왕 ☔",
    nickname: "애주가꿈돌이",
    content: `비만 오면 생각나는 대흥동 민속주점 '초가집'입니다.
오래된 노포 주막 분위기라 술이 술술 들어가는 감성이에요.

여기 감자전은 감자를 얇게 채 썰어서 부쳐내어 엄청 바삭하고 고소합니다.
뜨끈하고 부드러운 두부김치에 대전의 명물인 원막걸리 한 잔 걸치면 쌓였던 스트레스가 싹 풀려요.
비 오는 날 저녁에는 웨이팅이 무조건 있으니 조금 서둘러 방문하시는 걸 추천드립니다!`,
    password: "1234",
    createdAt: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 42,
    views: 299
  },
  {
    id: "init-f4",
    category: "맛집",
    title: "유성 태평소국밥 본관 소국밥과 육사시미 솔직 리뷰 🥩",
    nickname: "육식공룡",
    content: `대전의 24시 보물, 유성 봉명동 태평소국밥에 다녀왔습니다.

대표 메뉴인 '소국밥'은 국물이 맑으면서도 소고기 육향이 정말 진하게 우러나와 묵직한 맛을 냅니다. 밥이 말아져서 토렴되어 나오는 전통 방식이에요.
그리고 여기선 묻지도 따지지도 말고 '육사시미' 한 접시 같이 시키셔야 합니다.
만원 중반대라는 갓성비 가격에 엄청 찰지고 쫀득한 신선한 사시미를 즐길 수 있어요.

새벽에 해장하러 가거나 든든한 한 끼 식사로 언제나 대만족인 곳입니다.`,
    password: "1234",
    createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 58,
    views: 450
  },
  {
    id: "init-f5",
    category: "맛집",
    title: "대전 실비김치 원조, 선화동소머리해장국 매운맛의 끝 🌶️💀",
    nickname: "캡사이신매니아",
    content: `유튜브 매운맛 챌린지로 너무나 유명한 선화동소머리해장국 리뷰입니다.

이곳의 시그니처인 실비김치는 뚜껑을 여는 순간 알싸하고 매운 향이 확 올라옵니다.
소머리곰탕에 고기 한 점 올리고 실비김치 한 조각 얹어 먹으면 매운데 계속 손이 가는 마법을 경험할 수 있습니다.

단골들의 찐 꿀팁은 편의점에서 참치캔이랑 김을 사 오셔서 대접 비빔밥(참기름+김가루 제공)에 김치를 잘게 썰어 비벼 먹는 거예요. 매운맛 러버라면 필수 성지순례 코스입니다!`,
    password: "1234",
    createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 35,
    views: 278
  },
  {
    id: "init-f6",
    category: "맛집",
    title: "진짜 물총 조개 폭탄! 대흥동 오씨칼국수 동죽칼국수 솔직평 🐚",
    nickname: "면치기달인",
    content: `삼성동 본점도 좋지만 웨이팅 피해서 대흥동 오씨칼국수로 다녀왔습니다.

'물총칼국수'를 주문했는데 동죽 조개가 정말 그릇이 넘치도록 들어있어서 국물이 세상 시원하고 맑습니다. 면발도 수타면이라 쫄깃함이 살아있어요.
그리고 여기 배추김치가 엄청 맵기로 유명한데, 맑고 시원한 칼국수 국물에 다대기처럼 풀어 먹거나 면에 얹어 먹으면 환상의 궁합입니다.

비 오는 날이나 뜨끈하고 개운한 국물이 당길 때 무조건 1순위로 생각나는 곳이에요!`,
    password: "1234",
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 51,
    views: 395
  },
  {
    id: "init-f7",
    category: "맛집",
    title: "신탄진 영화반점: 볶음공기밥이 신의 한 수인 짬뽕 맛집구경 🍜",
    nickname: "중식매니아",
    content: `신탄진역 근처에 조용히 자리 잡은 찐 노포 중식당 영화반점 다녀왔습니다.

짬뽕은 불향 가득하면서 고기와 채소가 듬뿍 들어가 국물이 텁텁하지 않고 아주 깔끔하게 매콤합니다.
이 집의 찐 비결은 면을 다 먹고 주문하는 '볶음공기밥'이에요. 일반 공기밥이 아니라 미리 고슬고슬 볶아둔 볶음밥을 주시는데, 이걸 남은 짬뽕 국물에 말아 먹으면 고소한 기름과 매콤한 국물이 섞여 정말 기막힌 맛을 냅니다.

멀리서도 찾아와서 먹을 가치가 충분한 숨은 로컬 맛집입니다!`,
    password: "1234",
    createdAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 33,
    views: 220
  },
  {
    id: "init-f8",
    category: "맛집",
    title: "은행동 아저씨돈까스: 90년대 감성 경양식 롤러코스터 투어 🍛",
    nickname: "추억속으로",
    content: `학창 시절 추억이 방울방울 솟아나는 대전 은행동의 터줏대감 '아저씨돈까스'에 다녀왔습니다.

요즘 유행하는 두꺼운 일식 카츠가 아닌, 얇게 펴서 튀겨낸 달콤 짭조름한 소스가 가득 뿌려진 옛날식 경양식 돈까스예요.
식전에 나오는 따뜻한 크림 스프에 후추 톡톡 뿌려 먹는 첫 입부터 감동입니다.

가격도 저렴하고 옛날 레스토랑 인테리어 감성이 그대로 남아있어 맛과 추억을 동시에 가성비 있게 느낄 수 있는 소중한 공간입니다.`,
    password: "1234",
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 29,
    views: 185
  },
  {
    id: "init-f9",
    category: "맛집",
    title: "대전 3대 냉면, 사리원면옥 평양냉면 호불호 분석 🥢",
    nickname: "평냉초보",
    content: `대흥동에 위치한 오랜 전통의 사리원면옥 본점에 다녀왔습니다.

서울식 아주 슴슴한 평양냉면에 비해, 사리원면옥의 육수는 동치미 국물 베이스와 고기 육수가 어우러져 감칠맛과 단맛이 꽤 도는 편입니다.
덕분에 평양냉면을 처음 접하는 초보자분들도 거부감 없이 맛있게 드실 수 있는 대중적인 맛이에요.

냉면과 함께 고소하고 두툼한 만두 한 접시 곁들이시면 든든한 한 끼로 아주 훌륭합니다.`,
    password: "1234",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 31,
    views: 204
  },
  {
    id: "init-f10",
    category: "맛집",
    title: "유성 어은동 요시다치: 카이스트 학생들이 줄 서서 먹는 텐동 맛집 🍤",
    nickname: "궁동식객",
    content: `카이스트와 유성구청 인근 텐동 맛집으로 유명한 요시다치 리뷰입니다.

주문 즉시 튀겨내어 튀김옷이 정말 파사삭 부서지는 식감이 환상적입니다.
가지, 단호박, 새우, 팽이버섯 튀김 등 라인업이 알차고 타래 소스가 짜지 않고 은은하게 달콤해서 밥과의 조화가 아주 좋습니다.

튀김이 살짝 느끼해질 때쯤 반숙 온천계란(온센타마고)을 터뜨려 고추와 비벼 먹으면 밥 한 그릇 뚝딱 비우게 됩니다! 대학가라 가성비도 훌륭해요.`,
    password: "1234",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 41,
    views: 249
  },

  // ==================== [자유 카테고리 10개] ====================
  {
    id: "init-free1",
    category: "자유",
    title: "대전은 노잼도시가 아니라 '유잼도시'인 이유 😎",
    nickname: "대전을사랑해",
    content: `사람들이 자꾸 대전을 노잼도시라고 하는데, 살아볼수록 정말 매력 넘치는 '유잼도시'입니다!

지하철 잘 되어 있고, 갑천 따라 자전거 타기 너무 좋고, 수목원이 도심 한복판에 크게 자리 잡고 있잖아요.
게다가 성심당, 칼국수, 두루치기 같은 맛있는 먹거리도 가득하고 문화예술의전당이나 미술관도 훌륭합니다.

무엇보다 여유롭고 평화로운 분위기가 대전의 진짜 매력인 것 같아요.
다들 이번 주말에 대전으로 놀러 오세요!`,
    password: "1234",
    createdAt: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 56,
    views: 410
  },
  {
    id: "init-free2",
    category: "자유",
    title: "대전 타슈 시즌2 자전거 이용 꿀팁 공유합니다 🚲",
    nickname: "지하철이용객",
    content: `새롭게 리뉴얼된 대전 공공자전거 '타슈 시즌2' 진짜 너무 편해지지 않았나요?

앱 설치하고 QR코드만 찍으면 1초 만에 바로 대여가 가능해서 출퇴근길이나 가벼운 이동 시 너무 애용하고 있습니다.
기본 1시간은 무료 이용이 가능하고, 반납하고 다시 빌리면 또 무료라는 사실!

체인 없는 구동 방식이라 바지 밑단에 기름 묻을 일도 없고 자전거도 아주 튼튼합니다.
가벼운 거리는 탄소 배출도 줄이고 운동도 할 겸 타슈 적극 추천해 드려요!`,
    password: "1234",
    createdAt: new Date(Date.now() - 26 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 37,
    views: 265
  },
  {
    id: "init-free3",
    category: "자유",
    title: "올해도 어김없이 찾아온 한화이글스 행복수비 분석 ⚾🔥",
    nickname: "독수리눈물",
    content: `오늘 야구 경기 다들 보셨나요?
이글스파크 갈 때마다 가슴을 졸이게 하는 우리 한화이글스...

그래도 관중석 꽉 채워서 육성 응원할 때의 쾌감과 대전 시민들의 열정만큼은 전국 최고라고 자부합니다!
비록 지더라도 부처의 마음으로 끝까지 응원하는 대전 한화 팬들 모두 파이팅입니다.
올해는 제발 가을야구 냄새라도 맡아봤으면 좋겠네요. 나는 행복합니다~!`,
    password: "1234",
    createdAt: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 48,
    views: 380
  },
  {
    id: "init-free4",
    category: "자유",
    title: "유성온천 문화축제 드디어 이번 주말 시작이네요! 🎊",
    nickname: "축제요정",
    content: `대전의 대표 봄 축제인 유성온천 문화축제가 이번 주말 온천로 일원에서 열립니다!

거리 퍼레이드, 온천수 물총대첩, 유명 가수들의 개막 축하 공연까지 볼거리 즐길 거리가 가득하더라고요.
족욕 체험장은 축제 기간 동안 더욱 활기찰 예정이라 가족, 연인과 나들이 계획 세우기 너무 좋습니다.

임시 주차장 정보와 셔틀버스 시간표 확인하셔서 안전하고 재미있게 축제를 즐겨봐요!`,
    password: "1234",
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 29,
    views: 195
  },
  {
    id: "init-free5",
    category: "자유",
    title: "카이스트 벚꽃길 야간 산책 가보셨나요? 벚꽃 명소 추천 🌸",
    nickname: "봄날의꿈",
    content: `봄이 되면 카이스트 교정이 대전 최고의 야간 벚꽃 명소로 변신합니다.

은은한 오색 조명이 벚꽃 터널을 비추고 어은동 노천강당 주변에는 낭만적인 버스킹 음악 소리도 들려요.
대학생분들 돗자리 깔고 잔디밭에서 치맥 즐기는 젊은 활기를 보고 있으면 덩달아 기분이 좋아집니다.

아직 안 가보신 대전 시민분 계시다면 내년 봄 데이트 코스로 꼭 캘린더에 저장해 두세요!`,
    password: "1234",
    createdAt: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 42,
    views: 289
  },
  {
    id: "init-free6",
    category: "자유",
    title: "성심당 빵 보관 꿀팁 (냉동 vs 냉장 어떻게 하시나요?) ❄️",
    nickname: "성심당단골",
    content: `성심당 가서 한 트레이 가득 쓸어오면 다 못 먹고 남는 경우가 많잖아요. 제 보관 꿀팁 공유합니다.

- 튀김소보로: 절대 냉장하지 마시고, 지퍼백에 밀봉해 무조건 '냉동 보관' 하세요. 드실 때 에어프라이어 180도에 5~8분 돌려주시면 매장에서 갓 나온 것처럼 바삭해집니다.
- 식빵, 크로와상: 소분해서 바로 냉동했다가 자연 해동 후 오븐에 구워 드시면 촉촉함이 그대로 유지됩니다.

생크림 빵 종류를 제외한 모든 밀가루 빵은 냉동이 진리입니다! 다들 아깝게 버리지 말고 맛있게 오래 즐기세요.`,
    password: "1234",
    createdAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 55,
    views: 402
  },
  {
    id: "init-free7",
    category: "자유",
    title: "갑천 수변공원 노을 보며 멍때리기 가장 좋은 구역 추천 🌅",
    nickname: "노을수집가",
    content: `바쁜 일상 속 머리를 식히고 싶을 때 가는 갑천 산책로 명당 추천해 드립니다.

카이스트 앞 갑천변 데크길 구역인데, 해 질 무렵에 가시면 대청호 쪽에서 불어오는 선선한 바람과 함께 붉게 타오르는 하늘 노을 뷰를 만끽할 수 있습니다.
타슈 한 대 빌려서 강바람 맞으며 달리다가 벤치에 앉아 음악 들으며 멍때리면 일주일 간의 피로가 싹 풀려요.

생각이 복잡하신 대전 시민분들 오늘 퇴근길에 잠깐 들러보세요.`,
    password: "1234",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 36,
    views: 215
  },
  {
    id: "init-free8",
    category: "자유",
    title: "오늘 대전 소제동 철도관사촌 골목 출사 감성 넘치네요 🚂📸",
    nickname: "아날로그필름",
    content: `대전역 동광장 뒤편 소제동 철도관사촌 골목 투어를 하고 왔습니다.

옛 1920년대 관사 건물들을 리모델링해서 이색적이고 트렌디한 카페와 갤러리, 식당들이 옹기종기 모여 있는 대전의 핫플레이스인데요.
오래된 골목길 특유의 아날로그 감성과 트렌디함이 공존해서 카메라만 들이대면 인생샷이 나옵니다.

대전역과 아주 가까우니 대전 여행 오시는 분들 첫 코스나 마지막 코스로 강추 드립니다!`,
    password: "1234",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 31,
    views: 180
  },
  {
    id: "init-free9",
    category: "자유",
    title: "대전 유성 5일장 구경 다녀왔습니다! 활기찬 시장 풍경 🥕",
    nickname: "시장투어",
    content: `유성천 변에서 열리는 대전 최대 규모의 전통 5일장인 유성시장에 다녀왔습니다 (매월 4일, 9일 개최).

사람 사는 냄새 물씬 나는 전통시장의 시끌벅적함과 활기찬 에너지가 가득하더라고요.
장터 국밥 한 그릇 말아 먹고, 갓 튀겨낸 도넛과 핫바를 손에 쥐고 돌아다니니 정말 즐겁습니다.
제철 과일과 신선한 채소들도 마트보다 훨씬 저렴하게 득템해 왔네요.

가끔은 대형마트 말고 정이 넘치는 5일장 구경해 보시는 것 어떨까요?`,
    password: "1234",
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 28,
    views: 165
  },
  {
    id: "init-free10",
    category: "자유",
    title: "대전 신세계 백화점 아쿠아리움 솔직 만족도 후기 🐳",
    nickname: "대전시민A",
    content: `도룡동 신세계 엑스포점에 오픈한 아쿠아리움에 조카들과 함께 다녀왔습니다.

그리스 신화를 모티브로 한 세련된 인테리어와 수중 발레 쇼 같은 다채로운 미디어아트 결합 볼거리가 인상적이었어요.
메인 수조의 거대한 물고기들과 귀여운 가오리들이 헤엄치는 모습을 보니 저도 동심으로 돌아간 기분이었습니다.

비 오는 날이나 추운 날 실내 데이트 장소 혹은 아이 동반 나들이 장소로 쾌적하고 훌륭한 선택지인 것 같습니다!`,
    password: "1234",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 43,
    views: 322
  }
]

function loadBoards() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    // 최초 실행 시 대전 임시 데이터 30개를 로컬스토리지에 초기화
    saveBoards(DEFAULT_BOARDS)
    return DEFAULT_BOARDS
  }

  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch (error) {
    console.warn('boardService: localStorage parse failed', error)
    return []
  }
}

function saveBoards(boards) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(boards))
}

function buildId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`
}

function formatBoardItem(item) {
  const isValidCategory = ALLOWED_CATEGORIES.includes(item.category)
  return {
    id: item.id,
    category: isValidCategory ? item.category : '자유',
    nickname: item.nickname ? item.nickname.trim() : '익명',
    title: item.title || '',
    content: item.content || '',
    password: item.password || '',
    createdAt: item.createdAt || new Date().toISOString(),
    likes: Number(item.likes) || 0,
    views: Number(item.views) || 0
  }
}

/**
 * 게시글 목록 조회 (가상 번호 매핑 추가)
 */
export function listBoards(searchTerm = '') {
  const boards = loadBoards().map(formatBoardItem)

  // 생성일 순으로 최초 정렬하여 고유 seq 부여
  const sortedByOldest = boards.slice().sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
  
  const boardsWithSeq = sortedByOldest.map((item, index) => ({
    ...item,
    seq: index + 1
  }))

  const normalized = searchTerm.trim().toLowerCase()
  const filtered = normalized
    ? boardsWithSeq.filter((item) => {
        return (
          item.title.toLowerCase().includes(normalized) ||
          item.content.toLowerCase().includes(normalized) ||
          item.nickname.toLowerCase().includes(normalized)
        )
      })
    : boardsWithSeq

  // 최종 사용자에게는 최신글이 최상단에 보이도록 역순 정렬
  return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

/**
 * 단일 게시글 상세 조회 (가상 번호 추가)
 */
export function getBoard(id) {
  const boards = listBoards() 
  return boards.find((item) => item.id === id) || null
}

export function createBoard({
  category,
  nickname,
  title,
  content,
  password
}) {
  const boards = loadBoards()

  const newBoard = formatBoardItem({
    id: buildId(),
    category,
    nickname: nickname.trim(),
    title: title.trim(),
    content: content.trim(),
    password: password.trim(),
    createdAt: new Date().toISOString(),
    likes: 0,
    views: 0
  })

  boards.push(newBoard)
  saveBoards(boards)

  return newBoard
}

export function updateBoard(
  id,
  {
    category,
    title,
    content
  },
  password
) {
  const boards = loadBoards()

  const index = boards.findIndex((item) => item.id === id)

  if (index === -1) {
    return null
  }

  const board = boards[index]

  if (board.password !== String(password)) {
    return null
  }

  const newCategory = category || board.category || '자유'
  board.category = ALLOWED_CATEGORIES.includes(newCategory) ? newCategory : '자유'
  board.title = title.trim()
  board.content = content.trim()

  saveBoards(boards)

  return board
}

export function deleteBoard(id, password) {
  const boards = loadBoards()

  const index = boards.findIndex((item) => item.id === id)

  if (index === -1) {
    return false
  }

  const board = boards[index]

  if (board.password !== String(password)) {
    return false
  }

  boards.splice(index, 1)

  saveBoards(boards)

  return true
}

export function incrementViews(id) {
  const boards = loadBoards()
  const index = boards.findIndex((item) => item.id === id)

  if (index === -1) return null

  const board = boards[index]
  board.views = (Number(board.views) || 0) + 1

  saveBoards(boards)
  return board
}

export function toggleLike(id, isAdding) {
  const boards = loadBoards()
  const index = boards.findIndex((item) => item.id === id)

  if (index === -1) {
    return null
  }

  const board = boards[index]
  
  if (typeof board.likes !== 'number') {
    board.likes = 0
  }

  if (isAdding) {
    board.likes += 1
  } else {
    board.likes = Math.max(0, board.likes - 1)
  }

  saveBoards(boards)
  return board
}