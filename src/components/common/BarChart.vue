<script setup>
import { onMounted, ref } from 'vue'
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'
import { fetchDashboardStats } from '../../services/dashboardService'

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const props = defineProps({
  title: {
    type: String,
    default: 'Bar Chart'
  },
  description: {
    type: String,
    default: 'Chart placeholder'
  }
})

const chartCanvas = ref(null)
let chartInstance = null

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      enabled: true
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 10
      }
    }
  }
}

const updateChartData = async () => {
  const stats = await fetchDashboardStats()
  const categoryCounts = stats?.categoryCount || {}
  const labels = Object.keys(categoryCounts)
  const values = Object.values(categoryCounts)

  if (!chartCanvas.value) return

  if (chartInstance) {
    chartInstance.data.labels = labels
    chartInstance.data.datasets[0].data = values
    chartInstance.update()
    return
  }

  chartInstance = new Chart(chartCanvas.value, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: '비율',
          data: values,
          backgroundColor: ['#4f46e5', '#f59e0b', '#14b8a6', '#8b5cf6', '#ef4444'],
          borderRadius: 8
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
  <article class="bar-chart-card">
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
.bar-chart-card {
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
