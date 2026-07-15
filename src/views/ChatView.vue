<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { createChatCompletion } from '../services/chatServices'

const messages = ref([
  {
    role: 'assistant',
    content: '안녕하세요! 대전·충청권 여행이나 관광 정보에 대해 무엇이든 물어보세요.'
  }
])

const inputMessage = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const chatContainer = ref(null)

const canSend = computed(() => inputMessage.value.trim() && !isLoading.value)

const scrollToBottom = () => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

watch(
  messages,
  () => {
    nextTick(scrollToBottom)
  },
  { deep: true }
)

onMounted(() => {
  nextTick(scrollToBottom)
})

const sendMessage = async () => {
  const content = inputMessage.value.trim()
  if (!content || isLoading.value) return

  inputMessage.value = ''
  errorMessage.value = ''

  messages.value.push({ role: 'user', content })
  isLoading.value = true

  try {
    const reply = await createChatCompletion(messages.value)
    messages.value.push({
      role: 'assistant',
      content: reply || '응답을 생성하지 못했습니다.'
    })
  } catch (error) {
    messages.value.push({
      role: 'assistant',
      content: error.message || '응답 생성 중 오류가 발생했습니다.'
    })
    errorMessage.value = error.message || '응답 생성 중 오류가 발생했습니다.'
  } finally {
    isLoading.value = false
    nextTick(scrollToBottom)
  }
}

const handleKeydown = (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    sendMessage()
  }
}

const clearChat = () => {
  messages.value = [
    {
      role: 'assistant',
      content: '안녕하세요! 대전·충청권 여행이나 관광 정보에 대해 무엇이든 물어보세요.'
    }
  ]
  errorMessage.value = ''
  nextTick(scrollToBottom)
}
</script>

<template>
  <section class="chat-page">
    <div class="chat-header">
      <div>
        <h2>AI 여행 챗봇</h2>
        <p>대전·충청권 여행 정보와 관광 추천을 실시간으로 확인해보세요.</p>
      </div>
      <button class="clear-button" type="button" @click="clearChat">
        대화 초기화
      </button>
    </div>

    <div class="chat-card">
      <div ref="chatContainer" class="message-list">
        <div
          v-for="(message, index) in messages"
          :key="`${message.role}-${index}`"
          class="message-row"
          :class="message.role"
        >
          <div class="message-bubble">
            <strong>{{ message.role === 'user' ? '나' : 'AI' }}</strong>
            <p>{{ message.content }}</p>
          </div>
        </div>
      </div>

      <div class="chat-footer">
        <div v-if="errorMessage" class="error-box">{{ errorMessage }}</div>
        <div class="input-row">
          <textarea
            v-model="inputMessage"
            rows="2"
            placeholder="메시지를 입력하세요..."
            @keydown="handleKeydown"
          />
          <button type="button" class="send-button" :disabled="!canSend" @click="sendMessage">
            {{ isLoading ? '전송 중...' : '전송' }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.chat-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.chat-header h2 {
  margin: 0;
  font-size: 24px;
  color: var(--sub);
}

.chat-header p {
  margin: 4px 0 0;
  color: #587058;
}

.clear-button,
.send-button {
  border: none;
  border-radius: 8px;
  padding: 10px 14px;
  cursor: pointer;
  font-weight: 600;
}

.clear-button {
  background: var(--main);
  color: var(--sub);
}

.chat-card {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 220px);
  min-height: 480px;
  border: 1px solid var(--border);
  border-radius: 16px;
  overflow: hidden;
  background: white;
  box-shadow: var(--shadow);
}

.message-list {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #f7faf6;
}

.message-row {
  display: flex;
}

.message-row.user {
  justify-content: flex-end;
}

.message-bubble {
  max-width: 75%;
  padding: 12px 14px;
  border-radius: 12px;
  background: #eaf6e9;
  color: #274425;
}

.message-row.user .message-bubble {
  background: var(--sub);
  color: white;
}

.message-bubble strong {
  display: block;
  margin-bottom: 4px;
  font-size: 13px;
  opacity: 0.9;
}

.message-bubble p {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
}

.chat-footer {
  padding: 12px;
  border-top: 1px solid var(--border);
  background: white;
}

.error-box {
  margin-bottom: 8px;
  padding: 8px 10px;
  border-radius: 8px;
  background: rgba(255, 202, 40, 0.18);
  color: #7a5f00;
  font-size: 14px;
}

.input-row {
  display: flex;
  gap: 8px;
}

textarea {
  flex: 1;
  resize: none;
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 10px 12px;
  font: inherit;
}

.send-button {
  background: var(--sub);
  color: white;
  min-width: 80px;
}

.send-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .chat-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .chat-card {
    height: calc(100vh - 260px);
    min-height: 420px;
  }

  .message-bubble {
    max-width: 90%;
  }

  .input-row {
    flex-direction: column;
  }

  .send-button {
    width: 100%;
  }
}
</style>