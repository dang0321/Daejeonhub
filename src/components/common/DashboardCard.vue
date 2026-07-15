<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  icon: {
    type: String,
    default: '📊'
  }
})
</script>

<template>
  <article class="dashboard-card">
    <div class="icon-wrap" aria-hidden="true">{{ props.icon }}</div>
    <div class="card-content">
      <p class="card-title">{{ props.title }}</p>
      <h3>{{ props.value }}</h3>
    </div>
  </article>
</template>

<style scoped>
.dashboard-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 20px;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  cursor: default;
}

.dashboard-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 32px rgba(15, 23, 42, 0.14);
}

.icon-wrap {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  font-size: 1.3rem;
  background: linear-gradient(135deg, var(--sub) 0%, #8b5cf6 100%);
  color: white;
  flex-shrink: 0;
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.card-title {
  font-size: 0.9rem;
  color: #64748b;
}

h3 {
  font-size: 1.25rem;
  color: #0f172a;
  margin: 0;
}
</style>
