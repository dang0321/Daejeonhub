<script setup>
import Header from './components/common/Header.vue'
import Sidebar from './components/common/Sidebar.vue'
</script>

<template>
  <div id="app">
    <Header />
    <div class="main-layout">
      <Sidebar />
      <main class="content">
        <RouterView />  <!-- ← 페이지 렌더링 위치 -->
      </main>
    </div>
  </div>
</template>

<style scoped>
.main-layout {
  display: flex;
  min-height: calc(100vh - 60px);
}

.content {
  flex: 1;
  padding: 20px;
}
</style>