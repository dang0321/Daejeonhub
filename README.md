# 🏙️ DaejeonHub

> 대전 지역정보 공유 커뮤니티 — 공공데이터 기반 관광정보 + 익명 커뮤니티 + AI 챗봇

DaejeonHub는 대전 지역의 관광지·맛집·문화시설·숙박·쇼핑 등 공공데이터와 사용자 커뮤니티를 한곳에 모은 지역정보 공유 플랫폼입니다. 별도의 백엔드 서버 없이 브라우저에서 동작하는 **정적 SPA(Single Page Application)** 로 구현되었습니다.

<!-- 배포 URL -->
🔗 **배포 사이트**: https://teamdaejeonhub.netlify.app/

---

## 📌 주요 기능

### 필수 기능
- **익명 커뮤니티 게시판 (CRUD)** — 회원가입 없이 익명으로 글 작성·수정·삭제. 수정용 비밀번호로 권한 확인, localStorage 저장
- **AI 챗봇** — OpenAI API 기반 지역정보 질의응답. 제공 관광 데이터 + 커뮤니티 게시글을 근거로 응답하며, 대화 이력 유지·모바일 대응·플로팅 UI 제공

### 선택 기능
- **🗺️ 지도 시각화** — Kakao Maps 기반 관광 데이터 마커 표시, 카테고리 필터
- **🚗 경로 안내** — 복수 장소 선택 후 이동 경로·예상 소요시간 시각화 (왕복 지원)
- **📊 데이터 시각화 대시보드** — Chart.js 기반 관광 데이터·커뮤니티 통계
- **💬 게시판 확장** — 검색, 좋아요, 조회수, 댓글, 페이지네이션

---

## 🛠️ 기술 스택

| 구분 | 기술 |
|------|------|
| 프레임워크 | Vue.js 3.5 (Composition API) |
| 빌드 도구 | Vite 8.1 |
| 라우팅 | Vue Router 5.1 |
| HTTP 통신 | axios 1.18 |
| 데이터 시각화 | Chart.js 4.5 |
| 지도 | Kakao Maps API |
| AI | OpenAI API (gpt-5-mini) |
| 데이터 저장 | 브라우저 localStorage |
| 배포 | Netlify |

---

## 🏗️ 프로젝트 구조

```
src/
├── assets/           # 폰트, 아이콘, 이미지
├── components/
│   └── common/       # Header, Footer, Sidebar, 차트 컴포넌트
├── router/           # Vue Router 설정
├── services/         # 데이터·API 로직
│   ├── boardService.js      # 게시판 CRUD (localStorage)
│   ├── chatServices.js      # OpenAI 챗봇
│   ├── mapService.js        # 지도·관광 데이터
│   └── dashboardService.js  # 대시보드 통계
├── views/            # 페이지 컴포넌트
│   ├── HomeView.vue         # 홈
│   ├── RegionView.vue       # 지역 소개
│   ├── BoardView.vue        # 게시판
│   ├── MapView.vue          # 지도
│   ├── ChatView.vue         # 챗봇
│   └── DashboardView.vue    # 대시보드
├── App.vue
└── main.js

public/
└── data/             # 제공 공공데이터 (JSON)
```

---

## 🚀 시작하기

### 1. 저장소 클론
```bash
git clone https://lab.ssafy.com/shee5212/daejeonhub.git 
cd daejeonhub
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 환경변수 설정
프로젝트 루트에 `.env` 파일을 생성하고 API 키를 입력합니다.

```bash
VITE_KAKAO_MAP_API_KEY=your_kakao_map_key
VITE_OPENAI_API_KEY=your_openai_key
```

> ⚠️ `.env` 파일은 `.gitignore`에 포함되어 있어 저장소에 커밋되지 않습니다.
> Vite의 `VITE_` 접두사 값은 빌드 결과물에 포함되어 브라우저에 노출될 수 있으므로, **사용량 제한이 설정된 키**를 사용하세요.

### 4. 개발 서버 실행
```bash
npm run dev
```

### 5. 빌드
```bash
npm run build
```

---

## 🌐 배포 (Netlify)

1. Netlify에 저장소를 연결합니다.
2. 빌드 설정: Build command `npm run build`, Publish directory `dist`
3. **환경변수 등록** (Site configuration → Environment variables):
   - `VITE_KAKAO_MAP_API_KEY`
   - `VITE_OPENAI_API_KEY`
4. 환경변수 등록 후 재배포(Trigger deploy)하면 반영됩니다.

---

## 📊 데이터 출처 및 라이선스

### 관광 데이터
- **출처**: 한국관광공사 국문 관광정보 서비스 (TourAPI 4.0)
- **URL**: https://www.data.go.kr/data/15101578/openapi.do
- **라이선스**: 공공누리 제3유형 (출처표시 + 변경금지)

### 구청 상징(심볼) 이미지
- 대전 5개 구(동구·중구·서구·유성구·대덕구) 각 구청 홈페이지 상징물
- 공공누리 자유이용, 원본 그대로 사용, 수집일 2026-07-15

### 서체
- **머니그라피 (Moneygraphy)** — ⓒ (주)비바리퍼블리카(토스), 무료·웹임베딩 허용

### 외부 API
- Kakao Maps API (지도·경로)
- OpenAI API (챗봇)

> 본 서비스는 한국관광공사 Tour API(TourAPI 4.0)의 데이터를 활용하였습니다.
> 출처: 한국관광공사 (https://www.data.go.kr/data/15101578/openapi.do) / 라이선스: 공공누리 제3유형

---

## 👥 팀

`[ 김대영, 이시온, 김승희 ]`

---

## 📄 참고

- 본 프로젝트는 SSAFY 교육 과정의 팀 프로젝트로 제작되었습니다.
- 게시글·댓글 등 사용자 데이터는 localStorage에 저장되어 작성한 브라우저(기기)에만 유지되며, 다른 사용자와 공유되지 않습니다. (백엔드가 없는 교육 목적의 의도된 설계)
- 게시글 수정용 비밀번호는 암호화 없이 브라우저에 저장·비교됩니다. (교육 목적의 의도된 설계)
