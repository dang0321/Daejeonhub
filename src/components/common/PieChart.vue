<script setup>
defineProps({
  title: {
    type: String,
    default: 'Pie Chart'
  },
  description: {
    type: String,
    default: 'Chart placeholder'
  }
})
</script>

<template>
  <article class="pie-chart-card">
    <div class="card-header">
      <h3>{{ title }}</h3>
      <p>{{ description }}</p>
    </div>

    <div class="chart-placeholder">
      <span>Placeholder</span>
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
}
</style>
