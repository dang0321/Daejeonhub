<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const regionDetails = {
  donggu: {
    name: '동구',
    title: '대전의 동쪽 활력',
    description: '동구는 역사와 문화가 공존하는 지역으로, 다양한 생활편의시설과 지역 명소를 만나볼 수 있습니다.',
    highlights: ['전통문화와 현대 생활의 조화', '가까운 교통 접근성', '다양한 식당과 카페']
  },
  junggu: {
    name: '중구',
    title: '대전의 중심축',
    description: '중구는 대전의 중심부로, 행정·상업·교통의 중심지 역할을 하고 있습니다.',
    highlights: ['대전의 핵심 상권', '관공서와 문화시설 접근 용이', '다양한 행사와 축제']
  },
  seogu: {
    name: '서구',
    title: '서구의 성장 가능성',
    description: '서구는 주거와 산업이 함께 성장하는 지역으로, 실용적인 생활 환경을 갖추고 있습니다.',
    highlights: ['주거 친화적인 분위기', '산업·교육 인프라', '편리한 생활시설']
  },
  yuseonggu: {
    name: '유성구',
    title: '자연과 관광의 조합',
    description: '유성구는 유성온천과 자연경관으로 유명하며, 관광과 휴식이 어우러진 지역입니다.',
    highlights: ['유성온천 명소', '자연 경관과 휴식 공간', '관광객 친화형 인프라']
  },
  daeduckgu: {
    name: '대덕구',
    title: '과학과 미래의 도시',
    description: '대덕구는 과학기술과 산업이 발전한 지역으로, 미래지향적인 분위기를 느낄 수 있습니다.',
    highlights: ['연구·산업 클러스터', '첨단 기술과 교육 시설', '도시 개발의 미래성']
  }
}

const currentRegion = computed(() => regionDetails[route.params.regionName] || regionDetails.donggu)

const goBack = () => {
  router.push({ name: 'Home' })
}
</script>

<template>
  <div class="region-view">
    <div class="container">
      <button class="back-btn" type="button" @click="goBack">← 홈으로 돌아가기</button>

      <section class="region-card">
        <p class="badge">대전 권역 소개</p>
        <h1>{{ currentRegion.name }}</h1>
        <h2>{{ currentRegion.title }}</h2>
        <p class="description">{{ currentRegion.description }}</p>

        <ul>
          <li v-for="item in currentRegion.highlights" :key="item">{{ item }}</li>
        </ul>
      </section>
    </div>
  </div>
</template>

<style scoped>
.region-view {
  min-height: 70vh;
  background: linear-gradient(135deg, var(--main) 0%, #f7fcf7 100%);
  padding: 60px 20px;
}

.container {
  max-width: 800px;
  margin: 0 auto;
}

.back-btn {
  border: none;
  background: var(--sub);
  color: white;
  padding: 10px 16px;
  border-radius: 999px;
  cursor: pointer;
  margin-bottom: 24px;
}

.region-card {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: var(--shadow);
  border: 1px solid var(--border);
}

.badge {
  display: inline-block;
  background: var(--main);
  color: var(--sub);
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 13px;
  margin-bottom: 12px;
}

h1 {
  font-size: 32px;
  margin-bottom: 8px;
  color: var(--sub);
}

h2 {
  font-size: 22px;
  color: var(--sub);
  margin-bottom: 16px;
}

.description {
  font-size: 16px;
  line-height: 1.7;
  color: #516952;
  margin-bottom: 16px;
}

ul {
  padding-left: 20px;
  color: #425a43;
}

li {
  margin-bottom: 8px;
}
</style>
