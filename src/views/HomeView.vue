<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const regions = [
  { name: '동구', slug: 'donggu', description: '대전 동부의 문화와 생활공간' },
  { name: '중구', slug: 'junggu', description: '대전 중심부의 역사와 상권' },
  { name: '서구', slug: 'seogu', description: '대전 서부의 주거와 산업의 중심' },
  { name: '유성구', slug: 'yuseonggu', description: '대전 북서부 · 관광지 밀집' },
  { name: '대덕구', slug: 'daeduckgu', description: '대전 북부의 과학·산업 도시' }
]

const services = [
  {
    icon: '📋',
    title: '게시판',
    description: '지역 정보와 뉴스를 공유하는 커뮤니티'
  },
  {
    icon: '🗺️',
    title: '지도',
    description: '공공데이터 기반 위치 정보 서비스'
  },
  {
    icon: '💬',
    title: '챗봇',
    description: '24시간 대전 정보 상담 서비스'
  }
]

const goToRegion = (slug) => {
  router.push({ name: 'Region', params: { regionName: slug } })
}
</script>

<template>
  <div class="home-view">
    <!-- 상단: 권역 소개 -->
    <section class="hero">
      <div class="hero-content">
        <h1>LocalHub</h1>
        <p>대전의 모든 정보를 한 곳에서</p>
      </div>
    </section>

    <!-- 권역 소개 -->
    <section class="regions-section">
      <div class="container">
        <h2>대전 권역 소개</h2>
        <div class="regions-grid">
          <button
            v-for="region in regions"
            :key="region.name"
            type="button"
            class="region-card"
            @click="goToRegion(region.slug)"
          >
            <div class="region-icon">🏘️</div>
            <h3>{{ region.name }}</h3>
            <p>{{ region.description }}</p>
          </button>
        </div>
      </div>
    </section>

    <!-- 중간: 서비스 소개 -->
    <section class="services-section">
      <div class="container">
        <h2>우리의 서비스</h2>
        <div class="services-grid">
          <div v-for="service in services" :key="service.title" class="service-card">
            <div class="service-icon">{{ service.icon }}</div>
            <h3>{{ service.title }}</h3>
            <p>{{ service.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 하단: 공공데이터 기반 안내 -->
    <section class="data-section">
      <div class="container">
        <div class="data-content">
          <h2>공공데이터 기반</h2>
          <p>LocalHub는 대전광역시 및 정부에서 제공하는 공공데이터를 기반으로 신뢰할 수 있는 정보를 제공합니다.</p>
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
      <p>&copy; 2024 LocalHub. All rights reserved.</p>
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
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Hero 섹션 */
.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 80px 20px;
  text-align: center;
}

.hero-content h1 {
  font-size: 56px;
  margin-bottom: 10px;
  font-weight: bold;
}

.hero-content p {
  font-size: 24px;
  opacity: 0.9;
  font-weight: 300;
}

/* 권역 소개 섹션 */
.regions-section {
  padding: 80px 20px;
  background: #f8f9fa;
}

.regions-section h2 {
  text-align: center;
  font-size: 36px;
  margin-bottom: 50px;
  color: #333;
}

.regions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 20px;
}

.region-card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  border: 1px solid #e5e7eb;
  width: 100%;
}

.region-card:hover,
.region-card:focus-visible {
  outline: none;
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
}

.region-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
}

.region-icon {
  font-size: 40px;
  margin-bottom: 15px;
}

.region-card h3 {
  font-size: 18px;
  margin-bottom: 8px;
  color: #333;
}

.region-card p {
  font-size: 14px;
  color: #666;
}

/* 서비스 소개 섹션 */
.services-section {
  padding: 80px 20px;
  background: white;
}

.services-section h2 {
  text-align: center;
  font-size: 36px;
  margin-bottom: 50px;
  color: #333;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
}

.service-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 40px;
  border-radius: 12px;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.service-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(102, 126, 234, 0.3);
}

.service-icon {
  font-size: 48px;
  margin-bottom: 20px;
}

.service-card h3 {
  font-size: 22px;
  margin-bottom: 12px;
  font-weight: bold;
}

.service-card p {
  font-size: 16px;
  opacity: 0.9;
  line-height: 1.5;
}

/* 공공데이터 섹션 */
.data-section {
  padding: 80px 20px;
  background: #f0f2f5;
}

.data-content {
  text-align: center;
}

.data-section h2 {
  font-size: 36px;
  margin-bottom: 20px;
  color: #333;
}

.data-section > .container > p {
  font-size: 18px;
  color: #666;
  margin-bottom: 40px;
  line-height: 1.6;
}

.data-features {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 30px;
}

.feature {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  color: #333;
}

.feature-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  font-weight: bold;
  flex-shrink: 0;
}

/* Footer */
.footer {
  background: #333;
  color: white;
  text-align: center;
  padding: 20px;
  margin-top: 40px;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .hero-content h1 {
    font-size: 36px;
  }

  .hero-content p {
    font-size: 18px;
  }

  .hero {
    padding: 50px 20px;
  }

  .regions-section,
  .services-section,
  .data-section {
    padding: 50px 20px;
  }

  .regions-section h2,
  .services-section h2,
  .data-section h2 {
    font-size: 28px;
    margin-bottom: 30px;
  }

  .regions-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 15px;
  }

  .services-grid {
    grid-template-columns: 1fr;
  }

  .data-features {
    flex-direction: column;
    gap: 15px;
  }

  .data-section > .container > p {
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .hero-content h1 {
    font-size: 28px;
  }

  .hero-content p {
    font-size: 16px;
  }

  .regions-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .region-card {
    padding: 20px;
  }

  .region-card h3 {
    font-size: 16px;
  }

  .service-card {
    padding: 30px 20px;
  }

  .feature {
    font-size: 14px;
  }
}
</style>