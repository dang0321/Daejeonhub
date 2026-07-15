<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Header from './components/common/Header.vue'
import Footer from './components/common/Footer.vue'

const route = useRoute()
// 챗봇 페이지에선 플로팅 버튼 숨김
const showChatButton = computed(() => route.path !== '/chat')
</script>

<template>
  <div id="app" class="app-layout">
    <Header />
    <main class="main-content">
      <RouterView />
    </main>
    <Footer />

    <RouterLink v-if="showChatButton" to="/chat" class="chat-fab" aria-label="AI 챗봇 열기">
      <span class="chat-fab-icon">🤖</span>
      <span class="chat-fab-label">Chat</span>
    </RouterLink>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  width: 100%;
  overflow-y: auto;
}

.chat-fab {
  position: fixed;
  right: 40px;
  bottom: 40px;
  z-index: 1000;
  width: 84px;
  height: 84px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  padding: 0;
  line-height: 1;
  background: var(--sub, #2d5a27);
  color: #fff;
  border-radius: 50%;
  text-decoration: none;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
  transition: transform 0.15s, box-shadow 0.15s;
}
.chat-fab:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}
.chat-fab-icon { font-size: 30px; line-height: 1; }
.chat-fab-label {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.02em;
  line-height: 1;
}

@media (max-width: 768px) {
  .chat-fab {
    right: 24px;
    bottom: 24px;
    width: 72px;
    height: 72px;
  }
  .chat-fab-icon { font-size: 26px; }
  .chat-fab-label { font-size: 12px; }
}
</style>