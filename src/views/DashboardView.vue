<script setup>
import { ref, onMounted } from 'vue'
import DashboardCard from '../components/common/DashboardCard.vue'
import PieChart from '../components/common/PieChart.vue'
import BarChart from '../components/common/BarChart.vue'
import { fetchDashboardStats } from '../services/dashboardService'

const stats = ref([
  { title: '게시글 수', value: '0', icon: '📝' },
  { title: '좋아요 수', value: '0', icon: '❤️' },
  { title: '관광 데이터 수', value: '0', icon: '🏛️' },
  { title: '카테고리 수', value: '0', icon: '📂' },
  { title: '대표 카테고리', value: '-', icon: '⭐' }
])

onMounted(async () => {
  try {
    const dashboardData = await fetchDashboardStats()
    const topCategoryEntry = (dashboardData?.categoryRatio || []).reduce((max, item) => {
      if (!max || item.ratio > max.ratio) return item
      return max
    }, null)
    const topCategory = topCategoryEntry?.label || '-'

    stats.value = [
      { title: '게시글 수', value: String(dashboardData?.boardCount ?? 0), icon: '📝' },
      { title: '좋아요 수', value: String(dashboardData?.totalLikes ?? 0), icon: '❤️' },
      { title: '관광 데이터 수', value: String(dashboardData?.totalTourismCount ?? 0), icon: '🏛️' },
      { title: '카테고리 수', value: String(dashboardData?.categoryTypeCount ?? 0), icon: '📂' },
      { title: '대표 카테고리', value: topCategory, icon: '⭐' }
    ]
  } catch (error) {
    console.error('대시보드 통계 로드 실패:', error)
  }
})

</script>

<template>
  <section class="dashboard-page">
    <div class="page-header">
      <div>
        <p class="eyebrow">Tourism Analytics</p>
        <h1>대전·충청권 관광 데이터 대시보드</h1>
      </div>
      <button class="refresh-btn">실시간 업데이트</button>
    </div>

    <div class="stats-grid">
      <DashboardCard
        v-for="stat in stats"
        :key="stat.title"
        :title="stat.title"
        :value="stat.value"
        :icon="stat.icon"
      />
    </div>

    <div class="chart-grid">
      <PieChart
        title="카테고리 분포"
        description="관광 데이터 유형별 비율"
      />

      <BarChart
        title="카테고리 비교"
        description="카테고리별 비율 비교"
      />
    </div>
  </section>
</template>

<style scoped>
.dashboard-page {
  padding: 24px;
  background: linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%);
  min-height: 100%;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 16px;
}

.eyebrow {
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--sub);
  margin-bottom: 6px;
}

h1 {
  font-size: 1.7rem;
  color: #111827;
}

.refresh-btn {
  border: none;
  border-radius: 999px;
  padding: 10px 16px;
  background: var(--sub);
  color: white;
  cursor: pointer;
  font-weight: 600;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card,
.chart-card {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 18px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
}

.stat-card {
  padding: 18px;
}

.stat-title {
  font-size: 0.9rem;
  color: #64748b;
  margin-bottom: 8px;
}

.stat-card h3 {
  font-size: 1.45rem;
  margin-bottom: 8px;
  color: #0f172a;
}

.stat-card span {
  font-size: 0.9rem;
  font-weight: 600;
}

.chart-grid {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 20px;
}

.chart-card {
  padding: 20px;
}

.card-header {
  margin-bottom: 18px;
}

.card-header h2 {
  font-size: 1.1rem;
  color: #111827;
  margin-bottom: 4px;
}

.card-header p {
  font-size: 0.9rem;
  color: #64748b;
}

.donut-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
}

.donut-chart {
  width: 220px;
  height: 220px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  position: relative;
  flex-shrink: 0;
}

.donut-chart::after {
  content: '';
  position: absolute;
  inset: 30px;
  border-radius: 50%;
  background: white;
}

.donut-center {
  position: relative;
  z-index: 1;
  text-align: center;
}

.donut-center strong {
  display: block;
  font-size: 1.25rem;
  color: #0f172a;
}

.donut-center span {
  font-size: 0.85rem;
  color: #64748b;
}

.legend-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 150px;
}

.legend-list li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  font-size: 0.95rem;
  color: #334155;
}

.legend-color {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 8px;
}

.bar-chart {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  height: 220px;
  padding-top: 10px;
}

.bar-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.bar-track {
  width: 100%;
  max-width: 38px;
  height: 160px;
  background: #f1f5f9;
  border-radius: 999px;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
}

.bar-fill {
  width: 100%;
  background: linear-gradient(180deg, var(--sub) 0%, #60a5fa 100%);
  border-radius: 999px;
  transition: height 0.3s ease;
}

.bar-item span {
  font-size: 0.85rem;
  color: #64748b;
}

.chart-placeholder {
  min-height: 220px;
  border: 2px dashed #cbd5e1;
  border-radius: 16px;
  background: linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%);
  display: grid;
  place-items: center;
  color: #64748b;
  font-weight: 700;
  letter-spacing: 0.04em;
  font-size: 1rem;
}

.donut-placeholder {
  min-height: 240px;
}

.bar-placeholder {
  min-height: 240px;
}

@media (max-width: 1100px) {
  .stats-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .chart-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .dashboard-page {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }

  .donut-chart {
    width: 180px;
    height: 180px;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .donut-wrap {
    justify-content: center;
  }
}
</style>
