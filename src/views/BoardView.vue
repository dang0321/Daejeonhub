<template>
  <div class="board-page">
    <header class="board-header">
      <h1>게시판</h1>
      <div class="board-actions">
        <input
          v-model="searchTerm"
          type="search"
          placeholder="제목 또는 내용을 검색하세요"
          class="search-input"
        />
        <button class="primary-button" @click="openCreateModal">글쓰기</button>
      </div>
    </header>

    <section class="board-content">
      <aside class="board-list-wrapper">
        <h2>게시글 목록</h2>
        <div v-if="filteredBoards.length === 0" class="empty-state">
          등록된 게시글이 없습니다.
        </div>
        <ul class="board-list">
          <li
            v-for="board in filteredBoards"
            :key="board.id"
            :class="{ active: selectedBoard && selectedBoard.id === board.id }"
            @click="selectBoard(board.id)"
          >
            <strong>{{ board.title }}</strong>
            <span>{{ formatDate(board.createdAt) }}</span>
          </li>
        </ul>
      </aside>

      <section class="board-detail" v-if="selectedBoard">
        <h2>게시글 상세</h2>
        <div class="detail-card">
          <div class="detail-heading">
            <h3>{{ selectedBoard.title }}</h3>
            <span>{{ formatDate(selectedBoard.createdAt) }}</span>
          </div>
          <p class="detail-content">{{ selectedBoard.content }}</p>
          <div class="detail-actions">
            <button class="secondary-button" @click="openEditModal">수정</button>
            <button class="danger-button" @click="openDeleteModal">삭제</button>
          </div>
        </div>
      </section>

      <section class="board-detail placeholder" v-else>
        <h2>게시글을 선택하세요</h2>
      </section>
    </section>

    <div class="modal-backdrop" v-if="modalOpen" @click.self="closeModal">
      <div class="modal-panel">
        <h3>{{ modalTitle }}</h3>
        <form @submit.prevent="submitForm" class="modal-form">
          <label>
            제목
            <input v-model="form.title" type="text" required maxlength="100" />
          </label>

          <label>
            내용
            <textarea v-model="form.content" rows="6" required maxlength="1000"></textarea>
          </label>

          <label>
            비밀번호
            <input v-model="form.password" type="password" required maxlength="20" />
          </label>

          <div class="modal-actions">
            <button type="button" class="secondary-button" @click="closeModal">취소</button>
            <button type="submit" class="primary-button">저장</button>
          </div>
        </form>
      </div>
    </div>

    <div class="modal-backdrop" v-if="deleteModalOpen" @click.self="closeDeleteModal">
      <div class="modal-panel small">
        <h3>삭제 확인</h3>
        <p>삭제하려면 비밀번호를 입력하세요.</p>
        <form @submit.prevent="confirmDelete" class="modal-form">
          <label>
            비밀번호
            <input v-model="deletePassword" type="password" required maxlength="20" />
          </label>
          <div class="modal-actions">
            <button type="button" class="secondary-button" @click="closeDeleteModal">취소</button>
            <button type="submit" class="danger-button">삭제</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  listBoards,
  createBoard,
  updateBoard,
  deleteBoard
} from '../services/boardService'

const searchTerm = ref('')
const selectedId = ref(null)
const modalOpen = ref(false)
const deleteModalOpen = ref(false)
const modalMode = ref('create')
const form = ref({ title: '', content: '', password: '' })
const deletePassword = ref('')
const boards = ref(listBoards())

const filteredBoards = computed(() => {
  const normalized = searchTerm.value.trim().toLowerCase()
  const items = boards.value

  const filtered = normalized
    ? items.filter((item) => {
        return (
          item.title.toLowerCase().includes(normalized) ||
          item.content.toLowerCase().includes(normalized)
        )
      })
    : items

  return filtered
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
})

const selectedBoard = computed(() => {
  return boards.value.find((item) => item.id === selectedId.value) || null
})

const modalTitle = computed(() =>
  modalMode.value === 'create' ? '게시글 작성' : '게시글 수정'
)

function formatDate(value) {
  return new Date(value).toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function refreshBoards() {
  boards.value = listBoards()
}

function selectBoard(id) {
  selectedId.value = id
}

function openCreateModal() {
  modalMode.value = 'create'
  form.value = { title: '', content: '', password: '' }
  modalOpen.value = true
}

function openEditModal() {
  if (!selectedBoard.value) return

  modalMode.value = 'edit'
  form.value = {
    title: selectedBoard.value.title,
    content: selectedBoard.value.content,
    password: ''
  }
  modalOpen.value = true
}

function closeModal() {
  modalOpen.value = false
  form.value = { title: '', content: '', password: '' }
}

function openDeleteModal() {
  deletePassword.value = ''
  deleteModalOpen.value = true
}

function closeDeleteModal() {
  deleteModalOpen.value = false
  deletePassword.value = ''
}

function submitForm() {
  if (modalMode.value === 'create') {
    createBoard({
      title: form.value.title,
      content: form.value.content,
      password: form.value.password
    })
    closeModal()
    refreshBoards()
    return
  }

  if (!selectedBoard.value) {
    closeModal()
    return
  }

  const updated = updateBoard(
    selectedBoard.value.id,
    {
      title: form.value.title,
      content: form.value.content
    },
    form.value.password
  )

  if (!updated) {
    alert('비밀번호가 일치하지 않거나 게시글을 찾을 수 없습니다.')
    return
  }

  closeModal()
  refreshBoards()
}

function confirmDelete() {
  if (!selectedBoard.value) {
    closeDeleteModal()
    return
  }

  const removed = deleteBoard(selectedBoard.value.id, deletePassword.value)
  if (!removed) {
    alert('비밀번호가 일치하지 않습니다.')
    return
  }

  closeDeleteModal()
  selectedId.value = null
  refreshBoards()
}
</script>

<style scoped>
.board-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px;
}

.board-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  gap: 12px;
}

.board-header h1 {
  margin: 0;
}

.board-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.search-input {
  min-width: 240px;
  padding: 10px 12px;
  border: 1px solid #d0d7de;
  border-radius: 8px;
}

.board-content {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 24px;
}

.board-list-wrapper,
.board-detail {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 18px;
}

.board-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.board-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 12px;
  border-bottom: 1px solid #f2f4f7;
  cursor: pointer;
}

.board-list li:last-child {
  border-bottom: none;
}

.board-list li:hover,
.board-list li.active {
  background: #f3f5ff;
}

.detail-card {
  display: grid;
  gap: 16px;
}

.detail-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.detail-content {
  white-space: pre-wrap;
  line-height: 1.7;
}

.detail-actions,
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 240px;
  color: #6b7280;
}

.primary-button,
.secondary-button,
.danger-button {
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

.primary-button {
  background: #2563eb;
  color: white;
}

.secondary-button {
  background: #e5e7eb;
  color: #111827;
}

.danger-button {
  background: #dc2626;
  color: white;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.35);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 40;
  padding: 18px;
}

.modal-panel {
  width: min(560px, 100%);
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.12);
}

.modal-panel.small {
  width: min(420px, 100%);
}

.modal-form {
  display: grid;
  gap: 14px;
}

.modal-form label {
  display: grid;
  gap: 8px;
  font-size: 14px;
  color: #111827;
}

.modal-form input,
.modal-form textarea {
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 14px;
}

.empty-state {
  color: #6b7280;
  padding: 24px 12px;
}
</style>
