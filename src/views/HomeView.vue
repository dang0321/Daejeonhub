<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

import symbolEast from '../assets/icons/symbol_east.png'
import symbolMiddle from '../assets/icons/symbol_middle2.png'
import symbolWest from '../assets/icons/symbol_west2.png'
import symbolU from '../assets/icons/symbol_u.png'
import symbolDaedeok from '../assets/icons/symbol_dae2.png'

const regions = [
  { name: '동구', slug: 'donggu', description: '대전 동부의 문화와 생활공간', icon: symbolEast },
  { name: '중구', slug: 'junggu', description: '대전 중심부의 역사와 상권', icon: symbolMiddle },
  { name: '서구', slug: 'seogu', description: '대전 서부의 주거와 산업의 중심', icon: symbolWest },
  { name: '유성구', slug: 'yuseonggu', description: '대전 북서부 · 관광지 밀집', icon: symbolU },
  { name: '대덕구', slug: 'daeduckgu', description: '대전 북부의 과학·산업 도시', icon: symbolDaedeok }
]

const services = [
  {
    icon: '📋',
    title: '게시판',
    description: '지역 정보와 뉴스를 공유하는 커뮤니티',
    routeName: 'Board'
  },
  {
    icon: '🗺️',
    title: '지도',
    description: '공공데이터 기반 위치 정보 서비스',
    routeName: 'Map'
  },
  {
    icon: '🤖',
    title: '챗봇',
    description: '24시간 대전 정보 상담 서비스',
    routeName: 'Chat'
  }
]

const goToRegion = (slug) => {
  router.push({ name: 'Region', params: { regionName: slug } })
}

const goToMap = () => {
  router.push({ name: 'Map' })
}

const goToService = (routeName) => {
  router.push({ name: routeName })
}
</script>

<template>
  <div class="home-view">
    <!-- 상단: 권역 소개 -->
    <section class="hero">
      <div class="hero-content">
        <h1 class="highlight">DaejeonHub</h1>
        <svg viewBox="0 0 500 100" width="100%" height="auto" style="display: block; margin: 0 auto;">
          <defs>
            <!-- M 50,20 (시작 높이를 20으로 올림) / Q 250,110 (곡선 최하점을 110으로 조절) -->
            <path id="smile-path" d="M 50,20 Q 250,110 450,20" fill="transparent" />
          </defs>

          <!-- font-size와 Y 좌표 조절을 위해 dy 속성 추가 -->
          <text font-size="0.95rem" font-weight="bold" fill="#353839">
            <textPath href="#smile-path" startOffset="50%" text-anchor="middle" dy="5">
              대전의 관광지, 문화시설, 맛집 정보를 한 곳에서
            </textPath>
          </text>
        </svg>
        <button class="hero-cta" type="button" @click="goToMap">
          지금 여행지 찾기 ▶
        </button>
      </div>
    </section>

    <div class="hero-divider"></div>

    <!-- 권역 소개 -->
    <section class="regions-section">
      <div class="container">
        <h2 class="section-title">대전 권역 소개</h2>
        <div class="regions-grid">
          <button
            v-for="region in regions"
            :key="region.name"
            type="button"
            class="region-card"
            @click="goToRegion(region.slug)"
          >
            <img v-if="region.icon" :src="region.icon" alt="" class="region-icon" />
            <h3>{{ region.name }}</h3>
            <p>{{ region.description }}</p>
          </button>
        </div>
      </div>
    </section>

    <!-- 중간: 서비스 소개 -->
    <section class="services-section">
      <div class="container">
        <h2 class="section-title">우리의 서비스</h2>
        <div class="services-grid">
          <button
            v-for="service in services"
            :key="service.title"
            type="button"
            class="service-card"
            @click="goToService(service.routeName)"
          >
            <div class="service-icon">{{ service.icon }}</div>
            <h3>{{ service.title }}</h3>
            <p>{{ service.description }}</p>
          </button>
        </div>
      </div>
    </section>

    <!-- 하단: 공공데이터 기반 안내 -->
    <section class="data-section">
      <div class="container">
        <div class="data-content">
          <h2 class="section-title">공공데이터 기반</h2>
          <p>DaejeonHub는 대전광역시 및 정부에서 제공하는 공공데이터를 기반으로 신뢰할 수 있는 정보를 제공합니다.</p>
          <div class="data-features">
            <div class="feature">
              <span class="feature-icon">✓</span>
              <span>정확한 위치 정보</span>
            </div>
            <div class="feature">
              <span class="feature-icon">✓</span>
              <span>실시간 업데이트</span>
            </div>
            <div class="feature">
              <span class="feature-icon">✓</span>
              <span>신뢰할 수 있는 데이터</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <p>&copy; 2026 DaejeonHub. All rights reserved.</p>
    </footer>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.home-view {
  width: 100%;
  background: linear-gradient(180deg, #f9fdf8 0%, #f4fbf0 45%, #eef7e7 100%);
  color: #2f5f3b;
  font-family: var(--sans, 'Moneygraphy-Pixel', system-ui, 'Segoe UI', Roboto, sans-serif);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.hero {
  position: relative;
  padding: 112px 24px 150px;
  text-align: center;
  color: #163720;
  background: #ffffff;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 100%);
  pointer-events: none;
}

.hero::after {
  content: '';
  position: absolute;
  left: -5%;
  right: -5%;
  bottom: -2px;
  height: 90px;
  background: linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.82) 100%);
  border-radius: 50% 50% 0 0 / 100% 100% 0 0;
  transform: translateY(40px);
}

.hero-divider {
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, transparent, #353839 50%, transparent);
  margin-top: -16px;
  opacity: 0.8;
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 760px;
  margin: 0 auto;
  padding: 50px;
  animation: fadeUp 0.8s ease both;
}

.hero-content h1 {
  font-family: var(--heading, 'Moneygraphy-Pixel', system-ui, 'Segoe UI', Roboto, sans-serif);
  font-size: clamp(2.6rem, 4.9vw, 3.9rem);
  margin-bottom: 25px;
  font-weight: 800;
  color: #194324; 
  letter-spacing: -0.02em;
  filter: drop-shadow(3px 3px 4px rgba(0, 0, 0, 0.2));
  /*-webkit-text-stroke: 0.5px #ffffff; */ 
}

.hero-content p {
  font-family: var(--sans, 'Moneygraphy-Pixel', system-ui, 'Segoe UI', Roboto, sans-serif);
  font-size: clamp(1.02rem, 2.2vw, 1.28rem);
  opacity: 0.95;
  font-weight: 400;
  line-height: 1.75;
  max-width: 680px;
  margin: 0 auto;
}

.hero-cta {
  font-family: var(--sans, 'Moneygraphy-Pixel', system-ui, 'Segoe UI', Roboto, sans-serif);
  margin-top: 24px;
  border: none;
  border-radius: 999px;
  padding: 12px 24px;
  font-size: 1.25rem;
  font-weight: 700;
  color: #353839;
  background: #FFCA28;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(255, 202, 40, 0.28);
}

.hero-cta:hover,
.hero-cta:focus-visible {
  outline: none;
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(255, 202, 40, 0.34);
}

.regions-section,
.services-section,
.data-section {
  padding: 96px 20px;
}

.regions-section {
  background: #ffffff;
  margin-top: -18px;
}

.section-title {
  text-align: left;
  font-size: clamp(1.75rem, 3vw, 2.35rem);
  margin-bottom: 42px;
  color: #2f5f3b;
  font-weight: 700;
  position: relative;
  display: inline-block;
  padding-bottom: 10px;
}

.section-title::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 3px;
  background: #2f5f3b;
  border-radius: 999px;
}

.regions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 24px;
}

.region-card {
  background: #ffffff;
  padding: 28px 20px;
  border-radius: 24px;
  text-align: center;
  box-shadow: 0 12px 32px rgba(57, 108, 64, 0.12);
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  cursor: pointer;
  border: 2px solid #2f5f3b;
  width: 100%;
  animation: fadeUp 0.7s ease both;
}

.region-card:hover,
.region-card:focus-visible {
  outline: none;
  transform: translateY(-8px) scale(1.01);
  box-shadow: 0 18px 40px rgba(57, 108, 64, 0.18);
  border-color: rgba(111, 169, 104, 0.35);
}

.region-icon {
  width: 45px;
  height: 45px;
  object-fit: contain;
  margin-bottom: 14px;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.region-card h3 {
  font-size: 1.1rem;
  margin-bottom: 8px;
  color: #2f5f3b;
  font-weight: 700;
}

.region-card p {
  font-size: 0.95rem;
  color: #647d69;
  line-height: 1.6;
}

.services-section {
  background: #ffffff;
  border-radius: 36px;
  margin: 28px 20px 0;
  box-shadow: 0 -8px 24px rgba(57, 108, 64, 0.06);
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
}

.service-card {
  background: linear-gradient(145deg, #ffffff, #f9fef5);
  color: #2f5f3b;
  padding: 34px 24px;
  border-radius: 24px;
  text-align: center;
  transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
  box-shadow: 0 12px 30px rgba(57, 108, 64, 0.12);
  border: 1px solid rgba(111, 169, 104, 0.18);
  font: inherit;
  cursor: pointer;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 220px;
  animation: fadeUp 0.8s ease both;
}

.service-card:hover,
.service-card:focus-visible {
  outline: none;
  transform: translateY(-8px) scale(1.01);
  box-shadow: 0 18px 40px rgba(57, 108, 64, 0.16);
  background: linear-gradient(145deg, #f8fff2, #ebf7e4);
}

.service-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.service-card h3 {
  font-size: 1.2rem;
  margin-bottom: 12px;
  font-weight: 700;
}

.service-card p {
  font-size: 1rem;
  opacity: 0.95;
  line-height: 1.6;
}

.data-section {
  background: #ffffff;
  margin-top: 28px;
}

.data-content {
  text-align: center;
  max-width: 900px;
  margin: 0 auto;
  padding: 38px 30px;
  border-radius: 26px;
  background: rgba(255, 255, 255, 0.8);
}

.data-section > .container > p {
  font-size: 1.05rem;
  color: #516952;
  margin-bottom: 32px;
  line-height: 1.7;
}

.data-features {
  margin-top: 32px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 16px 24px;
}

.feature {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  font-size: 0.95rem;
  color: #36623f;
  background: rgba(236, 248, 230, 0.85);
  border-radius: 999px;
  box-shadow: 0 6px 14px rgba(57, 108, 64, 0.08);
}

.feature-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, #7ecb7d 0%, #cbe88b 100%);
  color: #214d2b;
  border-radius: 50%;
  font-weight: bold;
  flex-shrink: 0;
}

.footer {
  background: linear-gradient(180deg, #3d6c3a 0%, #2d5730 100%);
  color: #f4fff4;
  text-align: center;
  padding: 24px 20px;
  margin-top: 52px;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 900px) {
  .hero {
    padding: 96px 24px 110px;
  }

  .regions-grid {
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  }

  .services-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .hero {
    padding: 84px 20px 96px;
  }

  .hero-content {
    padding: 28px 20px;
  }

  .regions-section,
  .services-section,
  .data-section {
    padding: 72px 20px;
  }

  .services-section {
    margin: 24px 16px 0;
  }

  .regions-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }

  .services-grid {
    grid-template-columns: 1fr;
  }

  .data-content {
    padding: 28px 18px;
  }

  .data-features {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 16px;
  }

  .hero {
    padding: 72px 16px 84px;
  }

  .hero-content h1 {
    font-size: 2rem;
  }

  .hero-content p {
    font-size: 0.95rem;
  }

  .regions-grid {
    grid-template-columns: 1fr;
  }

  .region-card,
  .service-card {
    padding: 22px 16px;
    border-radius: 18px;
  }
}
</style>