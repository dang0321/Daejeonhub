<script setup>
import { onMounted, ref } from 'vue'
import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js'
import { fetchDashboardStats } from '../../services/dashboardService'

Chart.register(DoughnutController, ArcElement, Tooltip, Legend)

const props = defineProps({
  title: {
    type: String,
    default: 'Pie Chart'
  },
  description: {
    type: String,
    default: 'Chart placeholder'
  }
})

const chartCanvas = ref(null)
let chartInstance = null

const chartData = {
  labels: ['관광지', '맛집', '숙박', '문화시설', '쇼핑'],
  datasets: [
    {
      data: [0, 0, 0, 0, 0],
      backgroundColor: ['#4f46e5', '#f59e0b', '#14b8a6', '#8b5cf6', '#ef4444'],
      borderWidth: 0
    }
  ]
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom'
    },
    tooltip: {
      enabled: true
    }
  }
}

const updateChartData = async () => {
  const stats = await fetchDashboardStats()
  const ratios = stats?.tourismTypeRatio || []

  if (!chartCanvas.value) return

  const labels = ratios.map((item) => item.label)
  const values = ratios.map((item) => item.ratio)

  if (chartInstance) {
    chartInstance.data.labels = labels
    chartInstance.data.datasets[0].data = values
    chartInstance.update()
    return
  }

  chartInstance = new Chart(chartCanvas.value, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: ['#4f46e5', '#f59e0b', '#14b8a6', '#8b5cf6', '#ef4444'],
          borderWidth: 0
        }
      ]
    },
    options: chartOptions
  })
}

onMounted(() => {
  updateChartData()
})
</script>

<template>
  <article class="pie-chart-card">
    <div class="card-header">
      <h3>{{ props.title }}</h3>
      <p>{{ props.description }}</p>
    </div>

    <div class="chart-wrap">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </article>
</template>

<style scoped>
.pie-chart-card {
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
}

.card-header {
  margin-bottom: 16px;
}

.card-header h3 {
  font-size: 1.05rem;
  color: #111827;
  margin-bottom: 4px;
}

.card-header p {
  font-size: 0.92rem;
  color: #64748b;
}

.chart-wrap {
  min-height: 260px;
}

canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>
